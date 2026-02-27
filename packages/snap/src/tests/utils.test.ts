import { ethers } from 'ethers';

import {
  toLowerCase,
  toUpperCase,
  toTitleCase,
  relativePathToDeriveSegments,
  isValidQtumOrHexadecimalAddress,
  isValidPrivateKey,
  normalizeHexadecimalAddress,
  toBaseUnits,
  privateKeyToWIF,
  wifToPrivateKey,
  isValidWIF,
  getChainIdFromWIF,
  encryptBIP38,
  decryptBIP38,
  isValidEncryptedWIF,
} from '../helpers/utils';

describe('helpers/utils', () => {
  describe('string case helpers', () => {
    it('toLowerCase/toUpperCase/toTitleCase', () => {
      expect(toLowerCase('HeLLo')).toBe('hello');
      expect(toUpperCase('HeLLo')).toBe('HELLO');
      expect(toTitleCase('hello world')).toBe('Hello World');

      // With replace
      expect(toLowerCase('FOO-BAR', /-/gu, ' ')).toBe('foo bar');
      expect(toUpperCase('foo-bar', /-/gu, ' ')).toBe('FOO BAR');
      expect(toTitleCase('foo-bar baz', /-/gu, ' ')).toBe('Foo Bar Baz');
    });
  });

  describe('BIP32 path utils', () => {
    it('relativePathToDeriveSegments', () => {
      expect(relativePathToDeriveSegments('m/44/1/0')).toStrictEqual([
        'bip32:44',
        'bip32:1',
        'bip32:0',
      ]);
    });
  });

  describe('address and keys validation', () => {
    it('isValidQtumOrHexadecimalAddress', () => {
      // Ethereum address accepted by ethers (with 0x prefix)
      expect(
        isValidQtumOrHexadecimalAddress(
          '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        ),
      ).toBe(true);

      // 40-hex characters without 0x
      expect(
        isValidQtumOrHexadecimalAddress(
          '0123456789abcdef0123456789abcdef01234567',
        ),
      ).toBe(true);

      // Invalid address
      expect(isValidQtumOrHexadecimalAddress('not-an-address')).toBe(false);
    });

    it('isValidPrivateKey', () => {
      expect(isValidPrivateKey(`0x${'1'.repeat(64)}`)).toBe(true);
      expect(isValidPrivateKey('1'.repeat(64))).toBe(true);
      expect(isValidPrivateKey(`0x${'0'.repeat(64)}`)).toBe(false); // zeros
      expect(isValidPrivateKey('0x1234')).toBe(false); // too short
      expect(isValidPrivateKey(`0x${'g'.repeat(64)}`)).toBe(false); // non-hex
    });

    it('normalizeHexadecimalAddress', () => {
      const input = '0x0123456789ABCDEF0123456789ABCDEF01234567';
      const expected = '0123456789abcdef0123456789abcdef01234567';
      expect(normalizeHexadecimalAddress(input)).toBe(expected);

      expect(() => normalizeHexadecimalAddress('0x1234')).toThrow(
        'Invalid hexadecimal address',
      );
    });
  });

  describe('toBaseUnits', () => {
    it('parses decimals and hex correctly', () => {
      expect(toBaseUnits('1.23', 8).toString()).toBe(
        ethers.utils.parseUnits('1.23', 8).toString(),
      );
      expect(toBaseUnits('0x10').toNumber()).toBe(16);
      expect(toBaseUnits('').toNumber()).toBe(0);
    });
  });

  describe('WIF and BIP38', () => {
    const pk = `0x${'1'.repeat(64)}`;

    it('privateKeyToWIF / wifToPrivateKey roundtrip for mainnet (81)', async () => {
      const wif = await privateKeyToWIF(pk, 81, true);
      expect(isValidWIF(wif, 81)).toBe(true);
      const back = await wifToPrivateKey(wif, 81);
      expect(back).toBe(pk.slice(2));
      const chainId = await getChainIdFromWIF(wif);
      expect(chainId).toBe(81);
    });

    it('privateKeyToWIF / wifToPrivateKey roundtrip for testnet (8889)', async () => {
      const wif = await privateKeyToWIF(pk, 8889, true);
      expect(isValidWIF(wif, 8889)).toBe(true);
      const back = await wifToPrivateKey(wif, 8889);
      expect(back).toBe(pk.slice(2));
      const chainId = await getChainIdFromWIF(wif);
      expect(chainId).toBe(8889);
    });

    it('encryptBIP38/decryptBIP38 happy path and wrong passphrase', async () => {
      const wif = await privateKeyToWIF(pk, 81, true);
      const enc = await encryptBIP38(wif, 'secret');
      expect(isValidEncryptedWIF(enc)).toBe(true);
      const decryptedWif = await decryptBIP38(enc, 'secret', 81);
      expect(await wifToPrivateKey(decryptedWif, 81)).toBe(pk.slice(2));

      await expect(decryptBIP38(enc, 'wrong', 81)).rejects.toThrow(
        'Wrong passphrase',
      );
    });

    it('rejects unsupported chainId for WIF', async () => {
      await expect(privateKeyToWIF(pk, 1)).rejects.toThrow(
        'Unsupported chainId for WIF',
      );
    });
  });
});
