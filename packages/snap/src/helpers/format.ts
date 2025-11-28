import { BN, BnConfigLike, BnFormatConfig, BnLike, time, TimeDate } from '@distributedlab/tools';
import { toBase58Check } from '@qtumproject/qtum-wallet-connector';
import type { BigNumberish } from 'ethers';
import { ethers } from 'ethers';

import { getProvider, getWallet } from '@/config';
import { DEFAULT_NETWORKS_RPC_URLS } from '@/consts';

export function formatUnits(
  value: BigNumberish,
  decimals: string | BigNumberish = 8,
  maxDecimalDigits?: number,
) {
  return ethers.FixedNumber.from(ethers.utils.formatUnits(value, decimals))
    .round(maxDecimalDigits ?? ethers.BigNumber.from(decimals).toNumber())
    .toString();
}

export async function getQtumAddress(hexadecimalAddress?: string, chainId?: number | string) {
  let address = hexadecimalAddress;
  chainId = Number(chainId ?? DEFAULT_NETWORKS_RPC_URLS[0].chainId);

  if (!address) {
    const wallet = await getWallet();
    address = wallet.address;
    const provider = await getProvider();
    const network = await provider.getNetwork();
    chainId = network.chainId;
  }

  const version = { 8889: 120, 81: 58 }[chainId];
  if (!version) {
    throw new Error('Unsupported chainId');
  }
  return toBase58Check(address, version);
}

export function formatDateDMYT(date: TimeDate) {
  return time(date).format('DD MMM YYYY HH:mm');
}

const DID_PART_LENGTH = 8;
const DID_SHORT_PART_LENGTH = 12;

export function formatAddr(did: string, partLength = DID_PART_LENGTH) {
  return did.length > partLength * 2
    ? did.slice(0, partLength) + '...' + did.slice(-partLength)
    : did;
}

export function formatDidShort(value: string) {
  return formatAddr(value.split(':').pop() ?? value, DID_SHORT_PART_LENGTH);
}

export function formatDateMY(date: TimeDate) {
  return time(date).format('MM / YYYY');
}

export function formatDateDMY(date: TimeDate) {
  return time(date).format('DD MMM, YYYY');
}

export function formatDateTime(date: TimeDate) {
  return time(date).format('DD MMM, YYYY, h:mm A');
}

export function formatDateDM(date: string) {
  return time(date).format('D MMM');
}

const defaultBnFormatConfig: BnFormatConfig = {
  decimals: 2,
  groupSeparator: ',',
  decimalSeparator: '.',
}

function removeTrailingZeros(amount: string) {
  const [integer, fraction] = amount.split('.');

  if (!fraction) return integer;

  let result = integer;

  for (let i = fraction.length - 1; i >= 0; i--) {
    if (fraction[i] !== '0') {
      result += `.${fraction.slice(0, i + 1)}`;
      break;
    }
  }

  return result;
}

function convertNumberWithPrefix(value: string) {
  const M_PREFIX_AMOUNT = 1_000_000;
  const B_PREFIX_AMOUNT = 1_000_000_000;
  const T_PREFIX_AMOUNT = 1_000_000_000_000;

  const getPrefix = (value: number): 'M' | 'B' | 'T' | '' => {
    if (value >= T_PREFIX_AMOUNT) return 'T';
    if (value >= B_PREFIX_AMOUNT) return 'B';
    if (value >= M_PREFIX_AMOUNT) return 'M';

    return '';
  }

  const prefix = getPrefix(+value);

  const divider = {
    M: M_PREFIX_AMOUNT,
    B: B_PREFIX_AMOUNT,
    T: T_PREFIX_AMOUNT,
    '': 1,
  }[prefix]

  const finalAmount = BN.fromRaw(Number(value) / divider, 3).format({
    decimals: 3,
    groupSeparator: '',
    decimalSeparator: '.',
  })

  return `${removeTrailingZeros(finalAmount)}${prefix}`;
}

export function formatNumber(value: number, formatConfig?: BnFormatConfig) {
  try {
    const formatCfg = formatConfig || {
      ...defaultBnFormatConfig,
    }

    return removeTrailingZeros(BN.fromRaw(value).format(formatCfg));
  } catch (error) {
    return '0';
  }
}

export function formatAmount(
  amount: BnLike,
  decimalsOrConfig?: BnConfigLike,
  formatConfig?: BnFormatConfig,
) {
  try {
    const decimals =
      typeof decimalsOrConfig === 'number' ? decimalsOrConfig : decimalsOrConfig?.decimals;

    const formatCfg = formatConfig || {
      ...defaultBnFormatConfig,
      ...(decimals && { decimals }),
    }

    const formattedAmount = BN.fromBigInt(amount, decimalsOrConfig).format(formatCfg);

    return removeTrailingZeros(formattedAmount);
  } catch (error) {
    return '0';
  }
}

export function formatBalance(
  amount: BnLike,
  decimalsOrConfig?: BnConfigLike,
  formatConfig?: BnFormatConfig,
) {
  try {
    const decimals =
      typeof decimalsOrConfig === 'number' ? decimalsOrConfig : decimalsOrConfig?.decimals;

    const formatCfg = formatConfig || {
      ...defaultBnFormatConfig,
      ...(decimals && { decimals }),
    }

    const formattedAmount = formatAmount(amount, decimalsOrConfig, formatCfg);

    return convertNumberWithPrefix(formattedAmount);
  } catch (error) {
    return '0';
  }
}

