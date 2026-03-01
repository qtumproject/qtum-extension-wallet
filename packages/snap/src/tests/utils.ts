export class SnapMock {
  private requests: { method: string; params: any }[] = [];
  private state: Record<string, any> = {};

  public getRequests() {
    return this.requests;
  }

  public reset() {
    this.requests = [];
    this.state = {};
  }

  public request({ method, params }: { method: string; params: any }) {
    this.requests.push({ method, params });
    if (method === 'snap_getEntropy') {
      return '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff';
    }
    if (method === 'snap_getBip32Entropy') {
      return {
        privateKey:
          '0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
        publicKey:
          '0x0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81794',
        chainCode:
          '0x873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508',
        depth: 0,
        parentFingerprint: 0,
        index: 0,
        curve: 'secp256k1',
      };
    }
    if (method === 'snap_manageState') {
      if (params.operation === 'get') {
        return this.state;
      }
      if (params.operation === 'update') {
        this.state = { ...this.state, ...params.newState };
        return null;
      }
      if (params.operation === 'clear') {
        this.state = {};
        return null;
      }
    }
    return null;
  }
}

export const MAINNET_CHAIN = {
  chainId: '0x22b8',
  chainName: 'Qtum Mainnet',
  rpcUrls: ['https://qtum.info/'],
  blockExplorerUrls: ['https://qtum.info'],
  iconUrls: [],
  nativeCurrency: {
    name: 'QTUM',
    symbol: 'QTUM',
    decimals: 18,
  },
};

export const TESTNET_CHAIN = {
  chainId: '0x22b9',
  chainName: 'Qtum Testnet',
  rpcUrls: ['https://testnet.qtum.info/'],
  blockExplorerUrls: ['https://testnet.qtum.info'],
  iconUrls: [],
  nativeCurrency: {
    name: 'QTUM',
    symbol: 'QTUM',
    decimals: 18,
  },
};
