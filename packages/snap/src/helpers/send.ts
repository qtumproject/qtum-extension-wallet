import { BN } from '@distributedlab/tools';
import { ethers } from 'ethers';
import type { QtumWallet } from 'qtum-ethers-wrapper';
import type { Chain } from '@qtumproject/qtum-wallet-connector';
import { fromBase58Check } from '@qtumproject/qtum-wallet-connector';

import { formatUnits } from '@/helpers/format';
import { createQRC20 } from '@/helpers/qrc20';
import { toBaseUnits } from '@/helpers/utils';
import type { SendResponseType, GasEstimationType } from '@/types';

export const sendNative = async (
  recipient: string,
  amount: string | number,
  decimals: number,
  wallet: QtumWallet,
  network: Chain,
) => {
  try {
    if (!ethers.utils.isAddress(recipient)) {
      recipient = fromBase58Check(recipient);
    }
    const amountBN = BN.fromRaw(amount, Number(decimals));
    const result = await wallet.sendTransaction({
      to: recipient,
      value: ethers.BigNumber.from(amountBN.value).toHexString(),
    });
    const hash = result.hash.startsWith('0x')
      ? result.hash.slice(2)
      : result.hash;
    return {
      isValid: true,
      result,
      hash,
      transactionLink: `${network.blockExplorerUrls?.[0]}tx/${hash}`,
    } as SendResponseType;
  } catch {
    return {
      isValid: false,
      errorMessage: 'Unable to process transaction',
    };
  }
};

export const sendQRC20 = async (
  token: string,
  recipient: string,
  amount: string | number,
  decimals: number,
  wallet: QtumWallet,
  network: Chain,
) => {
  try {
    const { contractInterface } = createQRC20(token, wallet);
    const amountBN = BN.fromRaw(amount, Number(decimals));
    const txBody = contractInterface.encodeFunctionData('transfer', [
      recipient,
      amountBN.value,
    ]);
    const result = await wallet.sendTransaction({
      to: token,
      data: txBody,
    });
    const hash = result.hash.startsWith('0x')
      ? result.hash.slice(2)
      : result.hash;
    return {
      isValid: true,
      result,
      hash,
      transactionLink: `${network.blockExplorerUrls?.[0]}tx/${hash}`,
    } as SendResponseType;
  } catch {
    return {
      isValid: false,
      message: 'Unable to process transaction',
    };
  }
};

export const estimateNative = async (
  recipient: string,
  amount: string | number,
  decimals: number,
  wallet: QtumWallet,
): Promise<GasEstimationType | undefined> => {
  try {
    if (!ethers.utils.isAddress(recipient)) {
      recipient = fromBase58Check(recipient);
    }

    const amountBN = BN.fromRaw(amount, Number(decimals));
    const gasLimit = await wallet.estimateGas({
      to: recipient,
      value: ethers.BigNumber.from(amountBN.value),
    });
    const gasPrice = await wallet.getGasPrice();
    const fee = gasLimit.mul(gasPrice);

    return {
      gasLimit: gasLimit.toHexString(),
      gasPrice: gasPrice.toHexString(),
      fee: fee.toHexString(),
    };
  } catch {
    return undefined;
  }
};

export const estimateQRC20 = async (
  token: string,
  recipient: string,
  amount: string | number,
  decimals: number,
  wallet: QtumWallet,
): Promise<GasEstimationType | undefined> => {
  try {
    if (!ethers.utils.isAddress(recipient)) {
      recipient = fromBase58Check(recipient);
    }

    const { contractInterface } = createQRC20(token, wallet);
    const amountBN = BN.fromRaw(amount, Number(decimals));
    const data = contractInterface.encodeFunctionData('transfer', [
      recipient,
      amountBN.value,
    ]);

    const gasLimit = await wallet.estimateGas({
      to: token,
      data,
    });
    const gasPrice = await wallet.getGasPrice();
    const fee = gasLimit.mul(gasPrice);

    return {
      gasLimit: gasLimit.toHexString(),
      gasPrice: gasPrice.toHexString(),
      fee: fee.toHexString(),
    };
  } catch {
    return undefined;
  }
};

export function totalAmount(
  symbol: string,
  amount: string,
  isToken: boolean,
  gas?: GasEstimationType,
): string {
  try {
    if (!gas) {
      return '-';
    } else if (!isToken) {
      const amt = toBaseUnits(amount, 18);
      const fee = toBaseUnits(gas.fee);
      const total = amt.add(fee).toHexString();
      return `${formatUnits(total, 18)} QTUM`;
    }
    return `${amount} ${symbol} + ${formatUnits(gas.fee, 18)} QTUM`;
  } catch {
    return '-';
  }
}
