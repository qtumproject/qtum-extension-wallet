import { Component, DialogType, OnHomePageHandler, panel } from "@metamask/snaps-sdk";
import { QtumWallet } from "qtum-ethers-wrapper";

import { getWallet } from "@/config";
import {getNetworks, NATIVE_TOKEN, renderDashboard, renderHome} from "@/helpers";
import { getQtumAddress } from "@/helpers/format";
import {JSXElement, Text} from "@metamask/snaps-sdk/jsx";
import {DashboardType} from "@/types";
import {getTokensWithBalance} from "@/helpers/qrc20";
import {getTokens} from "@/storage";

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
  return { list, current };
};

export const onHomePage: OnHomePageHandler = async () => {

  try {
    const networks = await getCurrentNetworks();
    let tokens = await getTokens(networks.current.chainId);
    const wallet = await getWallet();
    const hexadecimalAddress = wallet.address;
    const qtumAddress = await getQtumAddress(
      hexadecimalAddress, networks.current.chainId
    ) ;
    const balance = String(await wallet.getBalance());
    tokens = await getTokensWithBalance(tokens, wallet);
    const data: DashboardType = {
      networks: networks,
      address: {
        qtum: qtumAddress,
        hexadecimal: hexadecimalAddress
      },
      native: {
        ...NATIVE_TOKEN,
        balance,
        chainId: networks.current.chainId
      },
      tokens,
      tokensPage: 1
    };
    const id = await snap.request({
      method: 'snap_createInterface',
      params: { ui: renderDashboard(data, tokens), context: data },
    });
    return { id };
  } catch (_) {
    const id = await snap.request({
      method: 'snap_createInterface',
      params: {
        ui: renderHome(),
      },
    });
    return { id };
  }
};
