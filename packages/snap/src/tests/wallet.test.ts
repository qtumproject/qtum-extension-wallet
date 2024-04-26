import { QtumProvider, QtumWallet } from 'qtum-ethers-wrapper';

// const PK = '0xfa4de13a4588ff7e548bc15931bcb8696555578126f01fc20a23e72e21a2912f';
const PK = '0xdfd3335956bd1211806c647e475bf62743c9a81f6a437a5eeedbbbfe795f9718';

const provider = new QtumProvider(
  'https://testnet.qnode.qtum.info/v1/7ot2Ig0j1O7ecwMBz4Y4rYsOM1sQh4Nnl7rMr',
);

describe('qtum wallet', () => {
  const wallet = new QtumWallet(
    QtumWallet.fromPrivateKey(PK).privateKey,
    provider,
  );

  it('should show wallet private key', () => {
    console.log('wallet.privateKey: ', wallet.privateKey);
    expect(wallet.privateKey).toBe(PK);
  });

  it('should show wallet address', () => {
    console.log('wallet.address: ', wallet.address);
    expect(wallet.address).not.toBeNull();
  });

  // TODO: fix getting balance
  // it('should show wallet balance', async () => {
  //   const balance = await wallet.getBalance();
  //
  //   console.log('balance: ', balance.toString());
  //
  //   expect(balance.toString()).not.toBeNull();
  // });
  //
  // it('should show UTQO balance', async () => {
  //   const utxoBalance = await wallet.getUtxos();
  //
  //   console.log('balance: ', JSON.stringify(utxoBalance));
  //
  //   expect(utxoBalance.toString()).not.toBeNull();
  // });
});
