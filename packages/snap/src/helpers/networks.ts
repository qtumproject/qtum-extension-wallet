import type { Chain } from '@qtumproject/wallet-snap-connector';

import { DEFAULT_NETWORKS_RPC_URLS } from '@/consts';
import { StorageKeys } from '@/enums';
import { snapStorage } from '@/rpc';
import type { StorageMap } from '@/types/storage-types';

export const getNetworks = async (): Promise<
  StorageMap[StorageKeys.Networks]
> => {
  const storedNetworks =
    (await snapStorage.getItem(StorageKeys.Networks)) ?? {};

  const res: StorageMap[StorageKeys.Networks] = {
    list: [
      ...(DEFAULT_NETWORKS_RPC_URLS.filter((el) => {
        return !storedNetworks.list
          ?.map(({ chainId }) => chainId)
          ?.includes(el.chainId);
      }) ?? []),
      ...(storedNetworks?.list ?? []),
    ],
    current: storedNetworks?.current ?? DEFAULT_NETWORKS_RPC_URLS[0],
  };

  return res;
};

export const setCurrentNetwork = async (chainId: string) => {
  const storedNetworks = await getNetworks();

  console.log('storedNetworks', storedNetworks);
  console.log('chainId', chainId);

  const nextNetwork = storedNetworks.list?.find((el) => el.chainId === chainId);

  if (!nextNetwork) {
    throw new TypeError('Network not found');
  }

  if (storedNetworks.current.chainId === chainId) {
    throw new TypeError('Chain already selected');
  }

  await snapStorage.setItem(StorageKeys.Networks, {
    ...storedNetworks,
    current: nextNetwork,
  });
};

export const addNetwork = async (newChain: Chain) => {
  const storedNetworks = await getNetworks();

  const newNetworks = {
    current: newChain,
    list: [...storedNetworks.list, newChain],
  };

  await snapStorage.setItem(StorageKeys.Networks, newNetworks);
};

export const removeNetwork = async (chainId: string) => {
  const storedNetworks = await getNetworks();

  const newNetworksList = storedNetworks.list.filter(
    (el) => el.chainId !== chainId,
  );

  const newCurrentChainId =
    storedNetworks.current.chainId === chainId
      ? newNetworksList[0]
      : storedNetworks.current;

  await snapStorage.setItem(StorageKeys.Networks, {
    current: newCurrentChainId,
    list: newNetworksList,
  });
};

export const networks = {
  get: getNetworks,
  setCurrent: setCurrentNetwork,
  add: addNetwork,
  remove: removeNetwork,
};
