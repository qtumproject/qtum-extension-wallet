import { RPCMethods } from 'qtum-snap-connector';

const mockProvider = {
  getBalance: jest.fn().mockResolvedValue({ toHexString: () => '0x5f5e100' }),
  getTransactionCount: jest.fn().mockResolvedValue(5),
  getBlockNumber: jest.fn().mockResolvedValue(100),
  getNetwork: jest.fn().mockResolvedValue({ chainId: 81 }),
  estimateGas: jest.fn().mockResolvedValue({ toHexString: () => '0x5208' }),
  send: jest.fn().mockResolvedValue({}),
  getCode: jest.fn().mockResolvedValue('0x'),
  getLogs: jest.fn().mockResolvedValue([]),
  getStorageAt: jest.fn().mockResolvedValue('0x00'),
  getTransaction: jest.fn().mockResolvedValue({
    hash: '0xhash',
    wait: jest.fn(),
  }),
  getTransactionReceipt: jest.fn().mockResolvedValue({
    hash: '0xhash',
    blockNumber: 1,
  }),
};

const mockWallet = {
  address: '0x123',
  privateKey: '0xabc',
  getBalance: jest.fn().mockResolvedValue({ toHexString: () => '0x5f5e100' }),
  signMessage: jest.fn().mockResolvedValue(Buffer.from('signed')),
  _signTypedData: jest.fn().mockResolvedValue('0xsignedTyped'),
  sendTransaction: jest.fn().mockResolvedValue({ hash: '0xtxhash' }),
  call: jest.fn().mockResolvedValue('0xcallres'),
};

const QtumWalletMock = jest.fn().mockImplementation(() => mockWallet);
(QtumWalletMock as any).createRandom = jest.fn().mockReturnValue(mockWallet);
(QtumWalletMock as any).fromPrivateKey = jest.fn().mockReturnValue(mockWallet);
(QtumWalletMock as any).fromMnemonic = jest.fn().mockReturnValue(mockWallet);

jest.mock('qtum-ethers-wrapper', () => ({
  QtumProvider: jest.fn().mockImplementation(() => mockProvider),
  QtumWallet: QtumWalletMock,
}));

jest.mock('../rpc', () => ({
  snapStorage: {
    getItem: jest.fn().mockResolvedValue({ privateKey: '0xabc' }),
    setItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../storage', () => ({
  networks: {
    get: jest.fn().mockResolvedValue({
      current: { rpcUrls: ['http://localhost'], chainId: '81' },
      list: [{ chainId: '0x51', rpcUrls: ['http://localhost'] }],
    }),
    add: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
    setCurrent: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../helpers', () => ({
  snapDialog: jest.fn().mockResolvedValue(true),
  buildTxUi: jest.fn().mockResolvedValue(true),
  createWallet: jest.fn().mockResolvedValue({ wallet: { address: '0x123', privateKey: '0xabc' } }),
  showWalletCreatedSnapDialog: jest.fn().mockResolvedValue(true),
  readAddressAsContract: jest.fn().mockResolvedValue({ contractCode: '0x' }),
  isValidQtumOrHexadecimalAddress: jest.fn().mockReturnValue(true),
}));

jest.mock('../helpers/format', () => ({
  getQtumAddress: jest.fn().mockResolvedValue('Q123'),
}));

jest.mock('qtum-snap-connector', () => {
  const originalModule = jest.requireActual('qtum-snap-connector');
  return {
    ...originalModule,
    fromBase58Check: jest.fn().mockReturnValue('0x123'),
  };
});

describe('onRpcRequest', () => {
  async function loadOnRpcRequest() {
    (global as any).window = (global as any).window ?? {};
    (global as any).crypto = (global as any).crypto ?? {};
    const mod = await import('..');
    return mod.onRpcRequest as ({ request }: any) => Promise<unknown>;
  }

  describe('Wallet methods', () => {
    it('handles WalletCreateRandom', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: { id: '1', jsonrpc: '2.0', method: RPCMethods.WalletCreateRandom },
        origin: 'tests',
      });
      expect(res).toBe('0x123');
    });

    it('handles WalletFromPrivateKey', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.WalletFromPrivateKey,
          params: ['0xabc'],
        },
        origin: 'tests',
      });
      expect(res).toBe('0x123');
    });

    it('handles WalletFromMnemonic', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.WalletFromMnemonic,
          params: ['test test test test test test test test test test test junk'],
        },
        origin: 'tests',
      });
      expect(res).toBe('0x123');
    });

    it('handles WalletExportPrivateKey', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: { id: '1', jsonrpc: '2.0', method: RPCMethods.WalletExportPrivateKey },
        origin: 'tests',
      });
      expect(res).toBe(true);
    });

    it('handles WalletGetAddress', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: { id: '1', jsonrpc: '2.0', method: RPCMethods.WalletGetAddress },
        origin: 'tests',
      });
      expect(res).toBe('Q123');
    });
  });

  describe('Chain/Network methods', () => {
    it('handles WalletGetAllSupportedChains', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: { id: '1', jsonrpc: '2.0', method: RPCMethods.WalletGetAllSupportedChains },
        origin: 'tests',
      });
      expect(res).toEqual([{ chainId: '0x51', rpcUrls: ['http://localhost'] }]);
    });

    it('handles WalletRemoveChain', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: { id: '1', jsonrpc: '2.0', method: RPCMethods.WalletRemoveChain, params: ['0x51'] },
        origin: 'tests',
      });
      expect(res).toBe(true);
    });

    it('handles WalletAddEthereumChain', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.WalletAddEthereumChain,
          params: [
            {
              chainId: '0x51',
              chainName: 'Qtum',
              rpcUrls: ['http://localhost'],
              nativeCurrency: { name: 'QTUM', symbol: 'QTUM', decimals: 18 },
              blockExplorerUrls: ['https://qtum.info'],
            },
          ],
        },
        origin: 'tests',
      });
      expect(res).toBe(null);
    });

    it('handles WalletSwitchEthereumChain', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.WalletSwitchEthereumChain,
          params: [{ chainId: '0x51' }],
        },
        origin: 'tests',
      });
      expect(res).toBe(null);
    });
  });

  describe('Account methods', () => {
    it('handles EthRequestAccounts', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: { id: '1', jsonrpc: '2.0', method: RPCMethods.EthRequestAccounts },
        origin: 'tests',
      });
      expect(res).toEqual(['0x123']);
    });

    it('handles EthAccounts', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: { id: '1', jsonrpc: '2.0', method: RPCMethods.EthAccounts },
        origin: 'tests',
      });
      expect(res).toEqual(['0x123']);
    });
  });

  describe('Signing methods', () => {
    it('handles EthSignTypedDataV4', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.EthSignTypedDataV4,
          params: ['0x123', { types: {}, domain: {}, message: {} }],
        },
        origin: 'tests',
      });
      expect(res).toBe('0xsignedTyped');
    });

    it('handles PersonalSign', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.PersonalSign,
          params: ['0x68656c6c6f', '0x123'],
        },
        origin: 'tests',
      });
      expect(res).toBe('0x7369676e6564'); // hex of 'signed'
    });
  });

  describe('Transaction methods', () => {
    it('handles EthSendTransaction', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.EthSendTransaction,
          params: [{ to: '0x123', value: '0x0' }],
        },
        origin: 'tests',
      });
      expect(res).toBe('0xtxhash');
    });

    it('handles EthCall', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.EthCall,
          params: [{ to: '0x123', data: '0x' }],
        },
        origin: 'tests',
      });
      expect(res).toBe('0xcallres');
    });

    it('handles EthEstimateGas', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.EthEstimateGas,
          params: [{ to: '0x123', data: '0x' }],
        },
        origin: 'tests',
      });
      expect(res).toBe('0x5208');
    });

    it('handles EthFeeHistory', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.EthFeeHistory,
          params: [1, 'latest', [10, 20]],
        },
        origin: 'tests',
      });
      expect(res).toEqual({});
    });
  });

  describe('Blockchain state methods', () => {
    it('handles EthBlockNumber', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: { id: '1', jsonrpc: '2.0', method: RPCMethods.EthBlockNumber },
        origin: 'tests',
      });
      expect(res).toBe(100);
    });

    it('handles EthChainId', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: { id: '1', jsonrpc: '2.0', method: RPCMethods.EthChainId },
        origin: 'tests',
      });
      expect(res).toBe(81);
    });

    it('handles EthGetBalance', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.EthGetBalance,
          params: ['0x123'],
        },
        origin: 'tests',
      });
      expect(res).toBe('0x5f5e100');
    });

    it('handles EthGetCode', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: { id: '1', jsonrpc: '2.0', method: RPCMethods.EthGetCode, params: ['0x123'] },
        origin: 'tests',
      });
      expect(res).toBe('0x');
    });

    it('handles EthGetLogs', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: { id: '1', jsonrpc: '2.0', method: RPCMethods.EthGetLogs, params: [{}] },
        origin: 'tests',
      });
      expect(res).toEqual([]);
    });

    it('handles EthGetTransactionByHash', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.EthGetTransactionByHash,
          params: ['0xhash'],
        },
        origin: 'tests',
      });
      expect(res).toEqual({ hash: '0xhash' });
    });

    it('handles EthGetTransactionCount', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      await expect(
        onRpcRequest({
          request: {
            id: '1',
            jsonrpc: '2.0',
            method: RPCMethods.EthGetTransactionCount,
            params: ['0x123', 'latest'],
          },
          origin: 'tests',
        }),
      ).rejects.toThrow('Method not implemented');
    });

    it('handles EthGetTransactionReceipt', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      const res = await onRpcRequest({
        request: {
          id: '1',
          jsonrpc: '2.0',
          method: RPCMethods.EthGetTransactionReceipt,
          params: ['0xhash'],
        },
        origin: 'tests',
      });
      expect(res).toEqual({ hash: '0xhash', blockNumber: 1 });
    });
  });

  describe('Error paths', () => {
    it('throws for unsupported method', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      await expect(
        onRpcRequest({
          request: { id: '1', jsonrpc: '2.0', method: 'unknown_method' },
          origin: 'tests',
        }),
      ).rejects.toThrow('Method not supported');
    });

    it('throws for unimplemented methods', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      await expect(
        onRpcRequest({
          request: { id: '1', jsonrpc: '2.0', method: RPCMethods.EthSubscribe },
          origin: 'tests',
        }),
      ).rejects.toThrow('Method not implemented');
    });

    it('throws for unimplemented EthGetStorageAt', async () => {
      const onRpcRequest = await loadOnRpcRequest();
      await expect(
        onRpcRequest({
          request: {
            id: '1',
            jsonrpc: '2.0',
            method: RPCMethods.EthGetStorageAt,
            params: ['0x123', '0x0', 'latest'],
          },
          origin: 'tests',
        }),
      ).rejects.toThrow('Method not implemented');
    });
  });
});
