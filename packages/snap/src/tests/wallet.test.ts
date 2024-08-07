import { QtumProvider, QtumWallet } from 'qtum-ethers-wrapper';
import { DEFAULT_NETWORKS_RPC_URLS } from "../consts";

// Hash of Zero Address -- DO NOT USE IN PRODUCTION
const PK = '0x4f64fe1ce613546d34d666d8258c13c6296820fd13114d784203feb91276e838';

const provider = new QtumProvider(
  DEFAULT_NETWORKS_RPC_URLS[0].rpcUrls[0],
);

const mainnetProvider = new QtumProvider(
  DEFAULT_NETWORKS_RPC_URLS[1].rpcUrls[0],
)

describe('qtum wallet', () => {
  const wallet = new QtumWallet(
    QtumWallet.fromPrivateKey(PK).privateKey,
    provider,
  );

  it('should get testnet network', async () => {
    const network = await provider.getNetwork();

    console.log('network', network)

    expect(network.chainId).not.toBeNull();
  })

  it('should get mainnet network', async () => {
    const network = await mainnetProvider.getNetwork();

    console.log('network', network)

    expect(network.chainId).not.toBeNull();
  })

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
