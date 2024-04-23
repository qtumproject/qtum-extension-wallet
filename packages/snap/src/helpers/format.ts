import type { BigNumberish } from 'ethers';
import { ethers } from 'ethers';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import qtum from 'qtumjs-lib';

import { getWallet } from '@/config';

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

  if (!addr) {
    const wallet = await getWallet();
    addr = wallet.address;
  }

  const hash = Buffer.from(addr.slice(2), 'hex');
  return qtum.address.toBase58Check(hash, 120);
}
