import type {
  BnConfigLike,
  BnFormatConfig,
  BnLike,
  TimeDate,
} from '@distributedlab/tools';
import { BN, time } from '@distributedlab/tools';
import type { BigNumberish } from 'ethers';
import { ethers } from 'ethers';
import { toBase58Check } from '@qtumproject/qtum-wallet-connector';

import { getProvider, getWallet } from '@/config';
import {
  DEFAULT_NETWORKS_RPC_URLS,
  DID_PART_LENGTH,
  DID_SHORT_PART_LENGTH,
} from '@/consts';

export function formatUnits(
  value: BigNumberish,
  decimals: string | BigNumberish = 8,
  maxDecimalDigits?: number,
) {
  return ethers.FixedNumber.from(ethers.utils.formatUnits(value, decimals))
    .round(maxDecimalDigits ?? ethers.BigNumber.from(decimals).toNumber())
    .toString();
}

export async function getQtumAddress(
  hexadecimalAddress?: string,
  chainId?: number | string,
) {
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

export function formatAddr(did: string, partLength = DID_PART_LENGTH) {
  return did.length > partLength * 2
    ? `${did.slice(0, partLength)}...${did.slice(-partLength)}`
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
};

function removeTrailingZeros(amount: string) {
  const [integer, fraction] = amount.split('.');

  if (!fraction) {
    return integer;
  }

  let result = integer;

  for (let i = fraction.length - 1; i >= 0; i--) {
    if (fraction[i] !== '0') {
      result += `.${fraction.slice(0, i + 1)}`;
      break;
    }
  }

  return result;
}

function truncateAndFormat(bn: BN, decimals: number): string {
  const multiplier = Math.pow(10, decimals);
  const multiplied = bn.mul(BN.fromRaw(multiplier));
  const flooredAsString = multiplied.toString().split('.')[0];
  const floored = BN.fromRaw(flooredAsString);
  const truncated = floored.div(BN.fromRaw(multiplier));

  return removeTrailingZeros(
    truncated.format({ decimals, groupSeparator: '' }),
  );
}

export function formatNumber(value: number, formatConfig?: BnFormatConfig) {
  try {
    const formatCfg = formatConfig || {
      ...defaultBnFormatConfig,
    };

    return removeTrailingZeros(BN.fromRaw(value).format(formatCfg));
  } catch {
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
      typeof decimalsOrConfig === 'number'
        ? decimalsOrConfig
        : decimalsOrConfig?.decimals;

    const formatCfg = formatConfig || {
      ...defaultBnFormatConfig,
      ...(decimals && { decimals }),
    };

    const bn =
      amount instanceof BN
        ? amount
        : (typeof amount === 'string' &&
              !amount.includes('.') &&
              decimalsOrConfig !== undefined) ||
            typeof amount === 'bigint'
          ? BN.fromBigInt(amount, decimalsOrConfig)
          : BN.fromRaw(amount, decimalsOrConfig);

    return removeTrailingZeros(bn.format(formatCfg));
  } catch {
    return '0';
  }
}

export function formatBalance(amount: BnLike, decimalsOrConfig?: BnConfigLike) {
  try {
    const bn =
      amount instanceof BN
        ? amount
        : (typeof amount === 'string' &&
              !amount.includes('.') &&
              decimalsOrConfig !== undefined) ||
            typeof amount === 'bigint'
          ? BN.fromBigInt(amount, decimalsOrConfig)
          : BN.fromRaw(amount, decimalsOrConfig);

    if (bn.isZero) {
      return '0';
    }

    const num = Number(bn.toString());

    const K = 1000;
    const M = 1000000;
    const B = 1000000000;
    const T = 1000000000000;

    if (num < 1) {
      if (bn.lt(BN.fromRaw('0.001'))) {
        return '0';
      }
      return truncateAndFormat(bn, 3);
    }

    if (num < K) {
      return truncateAndFormat(bn, 3);
    }

    if (num < M) {
      const intLen = bn.toString().split('.')[0].length;
      if (intLen === 4) {
        return truncateAndFormat(bn, 2);
      }
      if (intLen === 5) {
        return truncateAndFormat(bn, 1);
      }
      return truncateAndFormat(bn, 0);
    }

    let prefix = '';
    let divisor: number;

    if (num >= T) {
      prefix = 'T';
      divisor = T;
    } else if (num >= B) {
      prefix = 'B';
      divisor = B;
    } else {
      prefix = 'M';
      divisor = M;
    }

    const divided = bn.div(BN.fromRaw(divisor));
    const formatted = truncateAndFormat(divided, 3);

    return `${formatted}${prefix}`;
  } catch {
    return '0';
  }
}
