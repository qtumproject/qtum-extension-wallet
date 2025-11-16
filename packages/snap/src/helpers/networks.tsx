import { Box, Divider, Text, Image } from '@metamask/snaps-sdk/jsx';
import type { Chain } from '@qtumproject/qtum-wallet-connector';
import { DialogType} from '@metamask/snaps-sdk';

import { DEFAULT_NETWORKS_RPC_URLS } from '@/consts';
import { StorageKeys } from '@/enums';
import { qtumIcon, snapDialog } from '@/helpers';
import { snapStorage } from '@/rpc';
import type { StorageMap } from '@/types/storage-types';

export const getNetworks = async (): Promise<
  StorageMap[StorageKeys.Networks]
> => {
  const storedNetworks =
    (await snapStorage.getItem(StorageKeys.Networks)) ?? {};

  const storedList = Array.isArray(storedNetworks.list)
    ? storedNetworks.list
    : [];

  const list: StorageMap[StorageKeys.Networks]['list'] = [
    ...DEFAULT_NETWORKS_RPC_URLS.filter((el) => {
      return !storedList
        .map(({ chainId }) => chainId)
        .includes(el.chainId);
    }),
    ...storedList,
  ];

  const current =
    storedNetworks?.current ?? DEFAULT_NETWORKS_RPC_URLS[0];

  return { list, current };
};

export const setCurrentNetwork = async (chainId: string, showDialog: boolean = true) => {
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

  if (showDialog) {
    const dialogResult = await snapDialog(DialogType.Confirmation, (
      <Box>
        <Text> </Text>
        <Box direction="horizontal" alignment="space-between">
          <Text> </Text>
          <Image src={qtumIcon} alt="Qtum"/>
          <Text> </Text>
        </Box>
        <Text alignment="center" fontWeight="bold">Switch Network</Text>
        <Divider />
        <Box>
          <Text alignment="center">{storedNetworks.current.chainName}</Text>
          <Text alignment="center" fontWeight="bold">{' ↓ '}</Text>
          <Text alignment="center">{nextNetwork.chainName}</Text>
        </Box>
      </Box>
    ));
    if (!dialogResult) {
      return;
    }
  }

  await snapStorage.setItem(StorageKeys.Networks, {
    ...storedNetworks,
    current: nextNetwork,
  });

  if (showDialog) {
    await snapDialog(DialogType.Alert, (
      <Box>
        <Text> </Text>
        <Box direction="horizontal" alignment="space-between">
          <Text> </Text>
          <Image src={qtumIcon} alt="Qtum"/>
          <Text> </Text>
        </Box>
        <Text alignment="center" fontWeight="bold">Switch Network</Text>
        <Divider />
        <Box>
          <Text alignment="center">Switched to {nextNetwork.chainName}</Text>
        </Box>
      </Box>
    ));
  }
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
