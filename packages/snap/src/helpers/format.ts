import { toBase58Check } from '@qtumproject/qtum-wallet-connector';
import type { BigNumberish } from 'ethers';
import { ethers } from 'ethers';

import { getProvider, getWallet } from '@/config';
import { DEFAULT_NETWORKS_RPC_URLS } from '@/consts';

// eslint-disable-next-line
export function formatUnits(
  value: BigNumberish,
  decimals: string | BigNumberish = 8,
  maxDecimalDigits?: number,
) {
  return ethers.FixedNumber.from(ethers.utils.formatUnits(value, decimals))
    .round(maxDecimalDigits ?? ethers.BigNumber.from(decimals).toNumber())
    .toString();
}

// eslint-disable-next-line
export async function getQtumAddress(walletEthAddress?: string) {
  let addr = walletEthAddress;
  let chainId = Number(DEFAULT_NETWORKS_RPC_URLS[0].chainId);

  if (!addr) {
    const wallet = await getWallet();
    addr = wallet.address;

    const provider = await getProvider();

    const network = await provider.getNetwork();

    chainId = network.chainId;
  }

  const version = {
    8889: 120,
    81: 58,
  }[chainId];

  if (!version) {
    throw new Error('Unsupported chainId');
  }

  return toBase58Check(addr, version);
}
