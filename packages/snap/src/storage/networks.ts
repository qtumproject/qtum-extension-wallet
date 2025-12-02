import { Chain, sleep } from '@qtumproject/qtum-wallet-connector';
import { DialogType} from '@metamask/snaps-sdk';

import { DEFAULT_NETWORKS_RPC_URLS } from '@/consts';
import { StorageEnum } from '@/enums';
import { renderSwitchingNetworkDialog } from '@/helpers';
import { snapStorage } from '@/rpc';
import type { NetworksType } from '@/types';

export const getNetworks = async (): Promise<NetworksType> => {
  const storedNetworks = (await snapStorage.getItem(StorageEnum.Networks)) ?? {};
  const storedList = Array.isArray(storedNetworks.list) ? storedNetworks.list : [];
  const list: Chain[] = [
    ...DEFAULT_NETWORKS_RPC_URLS.filter((network: Chain) => {
      return !storedList.map(({ chainId }: Chain) => chainId).includes(network.chainId);
    }),
    ...storedList,
  ];
  const current: Chain = storedNetworks?.current ?? DEFAULT_NETWORKS_RPC_URLS[0];
  return { list, current };
};

export const getNetwork = async (chainId: string, networks?: NetworksType): Promise<Chain> => {

  const { list } = networks ? networks : await getNetworks();
  const network = list.find(
    (network) => String(network.chainId) === String(chainId),
  );
  if (!network) {
    throw new TypeError('Network not found');
  }
  return network;
};

export const setAndGetNetworks = async (network: Chain, networks?: NetworksType): Promise<NetworksType> => {

  let { list, current } = networks ? networks : await getNetworks();

  if (current !== network) {
    await snapStorage.setItem(StorageEnum.Networks, {
      ...{ list }, current: network
    });
    await sleep(500);
  }
  return { list, current: network };
};

export const setCurrentNetwork = async (chainId: string) => {
  const storedNetworks = await getNetworks();

  const nextNetwork = storedNetworks.list?.find(
    (el) => String(el.chainId) === String(chainId),
  );

  if (!nextNetwork) {
    throw new TypeError('Network not found');
  }

  if (storedNetworks.current.chainId === chainId) {
    throw new TypeError('Chain already selected');
  }

  const dialogResult = await renderSwitchingNetworkDialog(
    storedNetworks.current.chainName,
    nextNetwork.chainName,
    DialogType.Confirmation
  );
  if (!dialogResult) {
    return;
  }

  await snapStorage.setItem(StorageEnum.Networks, {
    ...storedNetworks,
    current: nextNetwork,
  });

  await renderSwitchingNetworkDialog(
    storedNetworks.current.chainName,
    nextNetwork.chainName,
    DialogType.Alert
  );
};

export const addNetwork = async (newChain: Chain) => {
  const storedNetworks = await getNetworks();

  const newNetworks = {
    current: newChain,
    list: [...storedNetworks.list, newChain],
  };

  await snapStorage.setItem(StorageEnum.Networks, newNetworks);
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

  await snapStorage.setItem(StorageEnum.Networks, {
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
