import { sleep } from '@qtumproject/qtum-wallet-connector';
import { QtumProvider, QtumWallet } from 'qtum-ethers-wrapper';
import { Json } from "@metamask/snaps-sdk";

import { StorageKeys } from '@/enums';
import { networks } from '@/helpers';
import { snapStorage } from '@/rpc';


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

export const clearWallet = async (): Promise<void> => {

  const maybeRemove = (snapStorage as any).removeItem as
    | ((key: string) => Promise<void>)
    | undefined;

  if (typeof maybeRemove === 'function') {
    await maybeRemove(StorageKeys.identity);
  } else {
    // @ts-ignore
    await snapStorage.setItem(StorageKeys.identity, null);
    try {
      const state = (await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      })) as Record<string, Json> | null;

      if (state && StorageKeys.identity in state) {
        delete state[StorageKeys.identity];
        await snap.request({
          method: 'snap_manageState',
          params: { operation: 'update', newState: state },
        });
      }
    } catch { }
  }
};
