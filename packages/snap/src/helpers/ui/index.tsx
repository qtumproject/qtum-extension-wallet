import {Component, DialogType, ManageStateResult, OnHomePageHandler, panel} from "@metamask/snaps-sdk";
import { QtumWallet } from "qtum-ethers-wrapper";
import { Box, Image, SnapsChildren, GenericSnapElement } from '@metamask/snaps-sdk/jsx';

import { getWallet } from "@/config";
import {getNetworks, makeSpacerSVG, NATIVE_TOKEN, renderDashboard, renderHome} from "@/helpers";
import { getQtumAddress } from "@/helpers/format";
import {JSXElement, Text} from "@metamask/snaps-sdk/jsx";
import {getTokensWithBalance} from "@/helpers/qrc20";
import {getTokens} from "@/storage";
import { PaddedBoxType, ContextType, DashboardType, NetworksType } from "@/types";

export * from './basic';
export * from './dashboard';
export * from './home';
export * from './network';
export * from './qrc20';
export * from './receive';
export * from './send';
export * from './tx';
export * from './wallet-creation';

export const Gap = (space: number = 1): JSXElement => <Text>{' '.repeat(space)}</Text>;

export const PaddedBox = (params: PaddedBoxType) => (
  <Box direction={params.direction} alignment="space-between" crossAlignment="center">
    <Image src={makeSpacerSVG(params.direction === 'horizontal' ? params.size : 1, params.direction === 'vertical' ? params.size : 1)}/>
    {params.children}
    <Image src={makeSpacerSVG(params.direction === 'horizontal' ? params.size : 1, params.direction === 'vertical' ? params.size : 1)}/>
  </Box>
);

export const getSnapDialog = async (type: DialogType, content: Component[]) => {
  return snap.request({
    method: 'snap_dialog',
    params: {
      type,
      content: panel(content),
    },
  });
};

export const getCurrentWallet = async (withBalance: boolean = true) => {
  const wallet = await getWallet();
  const hexAddress = wallet.address;
  const qtumAddress = await getQtumAddress();
  const balance = String(await wallet.getBalance());
  return { qtumAddress, hexAddress, balance, wallet };
};

export const getCurrentNetworks = async () => {
  let { list, current } = await getNetworks();
  list = [
    current, ...list.filter((network) => String(network.chainId) !== String(current.chainId)),
  ];
  return { list, current } as NetworksType;
};

export const onHomePage: OnHomePageHandler = async () => {

  const networks = await getCurrentNetworks();

  try {
    let tokens = await getTokens(networks.current.chainId);
    const wallet = await getWallet();
    const hexadecimalAddress = wallet.address;
    const qtumAddress = await getQtumAddress(
      hexadecimalAddress, networks.current.chainId
    ) ;
    const balance = String(await wallet.getBalance());
    tokens = await getTokensWithBalance(tokens, wallet);
    const dashboard: DashboardType = {
      address: { qtum: qtumAddress, hexadecimal: hexadecimalAddress },
      native: { ...NATIVE_TOKEN, balance, chainId: networks.current.chainId },
      tokens,
      tokensPage: 1
    };
    const context: ContextType = {
      networks, dashboard, send: null, receive: null, addQRC20: null
    };
    const id = await snap.request({
      method: 'snap_createInterface',
      params: { ui: renderDashboard(networks, dashboard, tokens), context },
    });
    return { id };
  } catch (_) {
    const context: ContextType = {
      networks, dashboard: null, send: null, receive: null, addQRC20: null
    };
    const id = await snap.request({
      method: 'snap_createInterface',
      params: { ui: renderHome(), context },
    });
    return { id };
  }
};
