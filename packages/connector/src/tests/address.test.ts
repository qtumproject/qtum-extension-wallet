import {
  toBase58Check,
  fromBase58Check,
  isAddressMatchNetwork,
} from '../helpers';

describe('address helper', () => {
  const ethAddress = '0x7921223223322332233223322332233223322332';

  it('toBase58Check and fromBase58Check should be consistent', () => {
    const mainnetVersion = 58;
    const testnetVersion = 120;

    const mainnetQtum = toBase58Check(ethAddress, mainnetVersion);
    const testnetQtum = toBase58Check(ethAddress, testnetVersion);

    expect(mainnetQtum).not.toBe(testnetQtum);
    expect(fromBase58Check(mainnetQtum)).toBe(ethAddress.toLowerCase());
    expect(fromBase58Check(testnetQtum)).toBe(ethAddress.toLowerCase());
  });

  it('isAddressMatchNetwork should correctly identify network', () => {
    const mainnetQtum = toBase58Check(ethAddress, 58);
    const testnetQtum = toBase58Check(ethAddress, 120);

    expect(isAddressMatchNetwork(mainnetQtum, 81)).toBe(true);
    expect(isAddressMatchNetwork(mainnetQtum, 8889)).toBe(false);

    expect(isAddressMatchNetwork(testnetQtum, 8889)).toBe(true);
    expect(isAddressMatchNetwork(testnetQtum, 81)).toBe(false);
  });
});
