import { QtumProvider, QtumWallet } from 'qtum-ethers-wrapper';
import { Json } from "@metamask/snaps-sdk";

import { StorageEnum } from '@/enums';
import { snapStorage } from '@/rpc';
import { networks } from '@/storage';

export const getProvider = async () => {
  const { current } = await networks.get();
  return new QtumProvider(current.rpcUrls[0]);
};

export const getWallet = async () => {
  const identityStorage = await snapStorage.getItem(StorageEnum.Identity);

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
    await maybeRemove(StorageEnum.Identity);
  } else {
    // @ts-ignore
    await snapStorage.setItem(StorageEnum.Identity, null);
    try {
      const state = (await snap.request({
        method: 'snap_manageState',
        params: { operation: 'get' },
      })) as Record<string, Json> | null;

      if (state && StorageEnum.Identity in state) {
        delete state[StorageEnum.Identity];
        await snap.request({
          method: 'snap_manageState',
          params: { operation: 'update', newState: state },
        });
      }
    } catch { }
  }
};
