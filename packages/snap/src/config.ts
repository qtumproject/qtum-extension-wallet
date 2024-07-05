import { sleep } from '@qtumproject/qtum-wallet-connector';
import { QtumProvider, QtumWallet } from 'qtum-ethers-wrapper';

import { StorageKeys } from '@/enums';
import { networks } from '@/helpers';
import { snapStorage } from '@/rpc';

export const config = {};

export const getProvider = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = await networks.get();

  // small "hack" to wait for snap storage update
  await sleep(1000);

  const { current } = await networks.get();

  return new QtumProvider(current.rpcUrls[0]);
};

export const getWallet = async () => {
  const identityStorage = await snapStorage.getItem(StorageKeys.identity);

  if (!identityStorage?.privateKey) {
    throw new Error('Wallet not created');
  }

  return new QtumWallet(identityStorage.privateKey, await getProvider());
};
