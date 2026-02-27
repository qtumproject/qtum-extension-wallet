import { QtumProvider, QtumWallet } from 'qtum-ethers-wrapper';

import { DEFAULT_NETWORKS_RPC_URLS } from '../consts';

jest.mock('qtum-ethers-wrapper', () => {
  const originalModule = jest.requireActual('qtum-ethers-wrapper');

  return {
    ...originalModule,
    QtumProvider: jest.fn().mockImplementation(() => ({
      _isProvider: true,
      getNetwork: jest.fn().mockResolvedValue({ chainId: 81, name: 'qtum' }),
      getBalance: jest.fn().mockResolvedValue({
        toString: () => '100000000',
      }),
      on: jest.fn(),
      removeListener: jest.fn(),
    })),
  };
});

// Hash of Zero Address -- DO NOT USE IN PRODUCTION
const PK = '0x4f64fe1ce613546d34d666d8258c13c6296820fd13114d784203feb91276e838';

const mainnetProvider = new QtumProvider(
  DEFAULT_NETWORKS_RPC_URLS[0].rpcUrls[0],
);

const testnetProvider = new QtumProvider(
  DEFAULT_NETWORKS_RPC_URLS[1].rpcUrls[0],
);

describe('qtum wallet', () => {
  const wallet = new QtumWallet(
    QtumWallet.fromPrivateKey(PK).privateKey,
    mainnetProvider,
  );

  it('should get mainnet network', async () => {
    const network = await mainnetProvider.getNetwork();

    console.log('network', network);

    expect(network.chainId).not.toBeNull();
  });

  it('should get testnet network', async () => {
    const network = await testnetProvider.getNetwork();

    console.log('network', network);

    expect(network.chainId).not.toBeNull();
  });

  it('should show wallet private key', () => {
    console.log('wallet.privateKey: ', wallet.privateKey);
    expect(wallet.privateKey).toBe(PK);
  });

  it('should show wallet address', () => {
    console.log('wallet.address: ', wallet.address);
    expect(wallet.address).not.toBeNull();
  });

  it('should show wallet balance', async () => {
    const balance = await wallet.getBalance();

    console.log('balance: ', balance.toString());

    expect(balance.toString()).not.toBeNull();
  });
});
