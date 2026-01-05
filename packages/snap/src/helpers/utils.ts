import { ethers } from 'ethers';
import { fromBase58Check } from '@qtumproject/qtum-wallet-connector';
import { Buffer } from 'buffer';

const WIF = require('wif');
const BIP38 = require('bip38');

export function toLowerCase(data: string | boolean | number, searchValue?: RegExp, replaceValue?: string): string {
  return searchValue && replaceValue ? data.toString().toLowerCase().replace(searchValue, replaceValue) : data.toString().toLowerCase();
}

export function toUpperCase(data: string | boolean | number, searchValue?: RegExp, replaceValue?: string): string {
  return searchValue && replaceValue ? data.toString().toUpperCase().replace(searchValue, replaceValue) : data.toString().toUpperCase();
}

export function toTitleCase(data: string, searchValue?: RegExp, replaceValue?: string): string {
  const titleCase: string = data.replace(/\b\w+/g, (text: string): string => toUpperCase(text.charAt(0)) + toLowerCase(text.substr(1)));
  return searchValue && replaceValue ? titleCase.replace(searchValue, replaceValue) : titleCase;
}

export const makeSpacerSVG = (width: number = 1, height: number = 1): string => (
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="transparent"/></svg>`
);

export function relativePathToDeriveSegments(relative: string): string[] {
  return relative.replace(/^m\//, '').split('/').map((seg) => seg.trim()).filter(Boolean).map((seg) => `bip32:${seg}`);
}

export function isValidQtumOrHexadecimalAddress(address: string): boolean {
  if (!address) {
    return false;
  } else if (ethers.utils.isAddress(address) || /^[0-9a-fA-F]{40}$/.test(address)) {
    return true;
  }
  try {
    fromBase58Check(address);
    return true;
  } catch {
    return false;
  }
}

export function isValidPrivateKey(privateKey: string): boolean {
  if (!privateKey) return false;
  const noPrefix =
    privateKey.startsWith('0x') || privateKey.startsWith('0X')
      ? privateKey.slice(2) : privateKey;
  if (!/^[0-9a-fA-F]{64}$/.test(noPrefix)) return false;
  return !/^0+$/.test(noPrefix);
}

export function normalizeHexadecimalAddress(address: string): string {
  const trimmed = (address ?? '').trim();
  const noPrefix = trimmed.startsWith('0x') || trimmed.startsWith('0X')
    ? trimmed.slice(2)
    : trimmed;

  if (!/^[0-9a-fA-F]{40}$/.test(noPrefix)) {
    throw new Error('Invalid hexadecimal address');
  }
  return noPrefix.toLowerCase();
}

export function toBaseUnits(value: string, decimals?: number): ethers.BigNumber {
  if (!value) {
    return ethers.BigNumber.from(0);
  } else if (value.startsWith('0x')) {
    return ethers.BigNumber.from(value);
  } else {
    return ethers.utils.parseUnits(value, decimals);
  }
}

export async function privateKeyToWIF(
  privateKey: string,
  chainId: number | string,
  compressed: boolean = true
): Promise<string> {
  chainId = Number(chainId);
  if (!isValidPrivateKey(privateKey)) {
    throw new Error('Invalid private key');
  } else if (![81, 8889].includes(chainId)) {
    throw new Error('Unsupported chainId for WIF');
  }
  privateKey = privateKey.startsWith('0x') || privateKey.startsWith('0X')
      ? privateKey.slice(2) : privateKey;
  const version: Record<number, number> = { 81: 0x80, 8889: 0xef };
  return await WIF.encode(
    version[chainId],
    Buffer.from(privateKey, 'hex'),
    compressed,
  );
}

export function isValidWIF(wif: string, chainId?: number | string): boolean {
  if (!wif) return false;

  let decodedWIF: any;
  try {
    decodedWIF = WIF.decode(wif);
  } catch (_) {
    return false;
  }

  if (chainId !== undefined && chainId !== null) {
    const version: Record<number, number> = { 81: 0x80, 8889: 0xef };
    const expected = version[Number(chainId)];
    if (!expected || decodedWIF.version !== expected) {
      return false;
    }
  }
  return decodedWIF.privateKey.length === 32;
}

export async function wifToPrivateKey(wif: string, chainId?: number | string): Promise<string> {
  if (!isValidWIF(wif)) {
    throw new Error('Invalid WIF');
  }
  const decodedWIF = await WIF.decode(wif);
  if (chainId) {
    const version: Record<number, number> = { 81: 0x80, 8889: 0xef };
    if (decodedWIF.version !== version[Number(chainId)]) {
      throw new Error('WIF network version mismatch');
    }
  }
  return decodedWIF.privateKey.toString('hex');
}

export async function getChainIdFromWIF(wif: string): Promise<number> {
  if (!isValidWIF(wif)) {
    throw new Error('Invalid WIF');
  }
  const decodedWIF = await WIF.decode(wif);
  const version: Record<number, number> = { 0x80: 81, 0xef: 8889 };
  const chainId = version[decodedWIF.version];
  if (!chainId) {
    throw new Error('Unsupported WIF network version');
  }
  return chainId;
}

export function isValidEncryptedWIF(wif: string): boolean {
  return /^6P[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(wif);
}

export async function encryptBIP38(wif: string, passphrase: string): Promise<string> {
  if (!wif) {
    throw new Error('Invalid WIF');
  }
  let decodedWIF;
  try {
    decodedWIF = await WIF.decode(wif);
  } catch (error) {
    throw new Error('Invalid WIF');
  }
  return await BIP38.encrypt(
    decodedWIF.privateKey,
    decodedWIF.compressed,
    passphrase,
  );
}

export async function decryptBIP38(
  encryptedWIF: string,
  passphrase: string,
  chainId: number | string,
): Promise<string> {
  passphrase = passphrase ?? '';
  chainId = Number(chainId);
  if (!isValidEncryptedWIF(encryptedWIF)) {
    throw new Error('Invalid encrypted WIF');
  }
  try {
    const decryptedWIF = await BIP38.decrypt(encryptedWIF, passphrase);
    return await privateKeyToWIF(
      decryptedWIF.privateKey.toString('hex'), chainId, decryptedWIF.compressed,
    );
  } catch (_) {
    throw new Error('Wrong passphrase');
  }
}
