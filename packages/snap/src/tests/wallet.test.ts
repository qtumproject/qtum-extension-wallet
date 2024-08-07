import { QtumProvider, QtumWallet } from 'qtum-ethers-wrapper';
import { DEFAULT_NETWORKS_RPC_URLS } from "../consts";

const PK = '0x...';

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

  it('should show UTQO balance', async () => {
    const utxoBalance = await wallet.getUtxos();

    console.log('balance: ', JSON.stringify(utxoBalance));

    expect(utxoBalance.toString()).not.toBeNull();
  });
});
