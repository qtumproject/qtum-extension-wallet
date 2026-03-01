import {
  fromBase58Check,
  isAddressMatchNetwork,
  toBase58Check,
} from '../helpers/address';

describe('address', () => {
  const ethAddress = '0x79262044221047d387242953a2b7a615df96584b';

  describe('Testnet', () => {
    const testnetAddress = 'qUbxbHZv11qvTstm1RiYwrUSbSg5Zqurdj';
    const testnetVersion = 120;
    const testnetChainId = 8889;

    it('should convert an ETH address to a QTUM testnet address', () => {
      const qtumAddress = toBase58Check(ethAddress, testnetVersion);
      expect(qtumAddress).toBe(testnetAddress);
    });

    it('should convert a QTUM testnet address to an ETH address', () => {
      const address = fromBase58Check(testnetAddress);
      expect(address).toBe(ethAddress);
    });

    it('should return true for a matching testnet network', () => {
      const isMatch = isAddressMatchNetwork(testnetAddress, testnetChainId);
      expect(isMatch).toBe(true);
    });

    it('should return false for a non-matching network', () => {
      const isMatch = isAddressMatchNetwork(testnetAddress, 81); // Mainnet chainId
      expect(isMatch).toBe(false);
    });
  });

  describe('Mainnet', () => {
    const mainnetAddress = 'QXeZYZ63yq7bm1FPVR4nt5bfaAhbXFuHJn';
    const mainnetVersion = 58;
    const mainnetChainId = 81;

    it('should convert an ETH address to a QTUM mainnet address', () => {
      const qtumAddress = toBase58Check(ethAddress, mainnetVersion);
      expect(qtumAddress).toBe(mainnetAddress);
    });

    it('should convert a QTUM mainnet address to an ETH address', () => {
      const address = fromBase58Check(mainnetAddress);
      expect(address).toBe(ethAddress);
    });

    it('should return true for a matching mainnet network', () => {
      const isMatch = isAddressMatchNetwork(mainnetAddress, mainnetChainId);
      expect(isMatch).toBe(true);
    });

    it('should return false for a non-matching network', () => {
      const isMatch = isAddressMatchNetwork(mainnetAddress, 8889); // Testnet chainId
      expect(isMatch).toBe(false);
    });
  });
});
