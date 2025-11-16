import { Component, DialogType, OnHomePageHandler, panel } from "@metamask/snaps-sdk";
import { QtumWallet } from "qtum-ethers-wrapper";

import { getWallet } from "@/config";
import {getNetworks, renderDashboard, renderHome} from "@/helpers";
import { getQtumAddress } from "@/helpers/format";

export * from './basic';
export * from './dashboard';
export * from './home';
export * from './tx';
export * from './wallet-creation';

export const getSnapDialog = async (type: DialogType, content: Component[]) => {
  return snap.request({
    method: 'snap_dialog',
    params: {
      type,
      content: panel(content),
    },
  });
};

export const onHomePage: OnHomePageHandler = async () => {
  let wallet: QtumWallet;
  let hexAddress: string | undefined;
  let qtumAddress: string | undefined;

  try {
    wallet = await getWallet();
    hexAddress = wallet.address;
    qtumAddress = await getQtumAddress();
  } catch (_) { }

  let { list, current } = await getNetworks();
  list = [
    current, ...list.filter((network) => String(network.chainId) !== String(current.chainId)),
  ];

  const id = await snap.request({
    method: 'snap_createInterface',
    params: {
      ui: hexAddress ? renderDashboard({ list, current }, { qtumAddress, hexAddress }) : renderHome(),
    },
  });
  return { id };
};
