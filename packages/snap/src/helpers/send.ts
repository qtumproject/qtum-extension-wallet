import { fromBase58Check, Chain } from '@qtumproject/qtum-wallet-connector';
import { QtumWallet } from "qtum-ethers-wrapper";
import { BN } from '@distributedlab/tools';
import { ethers } from 'ethers';

import { createQRC20 } from "@/helpers/qrc20";
import { SendResponseType } from "@/types";

export const sendNative = async (
  recipient: string, amount: any, decimals: number, wallet: QtumWallet, network: Chain
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
    const hash = result.hash.startsWith('0x') ? result.hash.slice(2) : result.hash;
    return {
      isValid: true,
      result,
      hash,
      transactionLink: `${network.blockExplorerUrls?.[0]}tx/${hash}`
    } as SendResponseType;
  } catch (_) {
    return {
      isValid: false,
      errorMessage: 'Unable to process transaction'
    };
  }
}

export const sendQRC20 = async (
  token: string, recipient: string, amount: any, decimals: number, wallet: QtumWallet, network: Chain
) => {

  try {
    const { contractInterface } = createQRC20(token, wallet)
    const amountBN = BN.fromRaw(amount, Number(decimals))
    const txBody = contractInterface.encodeFunctionData('transfer', [
      recipient,
      amountBN.value,
    ]);
    const result = await wallet.sendTransaction({
      to: token,
      data: txBody
    })
    const hash = result.hash.startsWith('0x') ? result.hash.slice(2) : result.hash;
    return {
      isValid: true,
      result,
      hash,
      transactionLink: `${network.blockExplorerUrls?.[0]}tx/${hash}`
    } as SendResponseType;
  } catch (_) {
    return {
      isValid: false,
      message: 'Unable to process transaction',
    };
  }
}
