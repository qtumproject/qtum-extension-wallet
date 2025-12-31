import { ethers } from 'ethers';

import { GasEstimationType } from '@/types';
import { formatBalance, formatUnits } from '@/helpers/format';

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

export function isValidQRC20ContractAddress(address: string): boolean {
  if (!address) return false;
  const trimmed = address.trim();
  const noPrefix = trimmed.startsWith('0x') || trimmed.startsWith('0X')
    ? trimmed.slice(2)
    : trimmed;
  return /^[0-9a-fA-F]{40}$/.test(noPrefix);
}

export function isValidPrivateKey(privateKey: string): boolean {
  if (!privateKey) return false;
  const trimmed = privateKey.trim();
  const noPrefix =
    trimmed.startsWith('0x') || trimmed.startsWith('0X')
      ? trimmed.slice(2)
      : trimmed;
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
