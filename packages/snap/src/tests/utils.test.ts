import {
  decryptBIP38,
  encryptBIP38,
  getChainIdFromWIF,
  isValidEncryptedWIF,
  isValidPrivateKey,
  isValidQtumOrHexadecimalAddress,
  isValidWIF,
  makeSpacerSVG,
  normalizeHexadecimalAddress,
  privateKeyToWIF,
  relativePathToDeriveSegments,
  toBaseUnits,
  toTitleCase,
  wifToPrivateKey,
} from '../helpers/utils';

describe('utils', () => {
  it('should convert to title case', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('should create a spacer SVG', () => {
    expect(makeSpacerSVG(10, 20)).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 10 20"><rect width="10" height="20" fill="transparent"/></svg>'
    );
  });

  it('should convert a relative path to derive segments', () => {
    expect(relativePathToDeriveSegments("m/44'/88'/0'/0/0")).toEqual([
      "bip32:44'",
      "bip32:88'",
      "bip32:0'",
      'bip32:0',
      'bip32:0',
    ]);
  });

  it('should validate a qtum or hexadecimal address', () => {
    expect(
      isValidQtumOrHexadecimalAddress(
        '0x7e7e11223344556677889900aabbccddeeff0011',
      ),
    ).toBe(true);
    expect(
      isValidQtumOrHexadecimalAddress('qWoj2omccdtDBfDbaxzA6SKHFFnpfa2Bwt'),
    ).toBe(true);
    expect(isValidQtumOrHexadecimalAddress('invalid-address')).toBe(false);
  });

  it('should validate a private key', () => {
    expect(
      isValidPrivateKey(
        '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff'
      )
    ).toBe(true);
    expect(isValidPrivateKey('invalid-private-key')).toBe(false);
  });

  it('should normalize a hexadecimal address', () => {
    expect(
      normalizeHexadecimalAddress(
        '0x7e7E11223344556677889900aabbccddeeff0011'
      )
    ).toBe('7e7e11223344556677889900aabbccddeeff0011');
  });

  it('should convert to base units', () => {
    expect(toBaseUnits('1.23', 8).toString()).toBe('123000000');
  });

  it('should convert a private key to WIF', async () => {
    const privateKey =
      '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff';
    const wif = await privateKeyToWIF(privateKey, 81);
    expect(wif).toBe('Kwo1uFrRcDPbe6xtpFh4mPGpYGwXkYHmUdXQMEJDhtM6M8WH3bfT');
  });

  it('should validate a WIF', () => {
    expect(
      isValidWIF('Kwo1uFrRcDPbe6xtpFh4mPGpYGwXkYHmUdXQMEJDhtM6M8WH3bfT', 81)
    ).toBe(true);
    expect(isValidWIF('invalid-wif')).toBe(false);
  });

  it('should convert a WIF to a private key', async () => {
    const wif = 'Kwo1uFrRcDPbe6xtpFh4mPGpYGwXkYHmUdXQMEJDhtM6M8WH3bfT';
    const privateKey = await wifToPrivateKey(wif, 81);
    expect(privateKey).toBe(
      '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff'
    );
  });

  it('should get the chain ID from a WIF', async () => {
    const wif = 'Kwo1uFrRcDPbe6xtpFh4mPGpYGwXkYHmUdXQMEJDhtM6M8WH3bfT';
    const chainId = await getChainIdFromWIF(wif);
    expect(chainId).toBe(81);
  });

  it('should validate an encrypted WIF', () => {
    expect(
      isValidEncryptedWIF(
        '6PYUGi3eK2i44Y42rf1aL6a4f5j3b2a1c1d1e1f1g1h1i1j1k1l1m1n1o1p1q1r'
      )
    ).toBe(false);
    expect(isValidEncryptedWIF('invalid-encrypted-wif')).toBe(false);
  });

  it('should encrypt and decrypt a BIP38 WIF', async () => {
    const wif = 'Kwo1uFrRcDPbe6xtpFh4mPGpYGwXkYHmUdXQMEJDhtM6M8WH3bfT';
    const encryptedWIF = await encryptBIP38(wif, 'password');
    const decryptedWIF = await decryptBIP38(encryptedWIF, 'password', 81);
    expect(decryptedWIF).toBe(wif);
  });
});
