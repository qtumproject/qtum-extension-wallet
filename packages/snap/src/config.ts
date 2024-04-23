import { QtumProvider, QtumWallet } from 'qtum-ethers-wrapper';

import { StorageKeys } from '@/enums';
import { snapStorage } from '@/rpc';

export const getProvider = () => {
  return new QtumProvider(
    'https://testnet.qnode.qtum.info/v1/7ot2Ig0j1O7ecwMBz4Y4rYsOM1sQh4Nnl7rMr',
  );
};

export const getWallet = async () => {
  const identityStorage = await snapStorage.getItem(StorageKeys.identity);

  if (!identityStorage?.privateKey) {
    throw new Error('Wallet not created');
  }

  return new QtumWallet(identityStorage.privateKey, getProvider());
};

export const config = {};
