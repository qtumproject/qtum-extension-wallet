import { BN } from '@distributedlab/tools';
import { fromBase58Check, Erc20__factory, Chain } from '@qtumproject/qtum-wallet-connector';
import type { Provider } from '@ethersproject/providers'
import { QtumWallet } from "qtum-ethers-wrapper";
import { ethers, Signer } from 'ethers'
import { TransactionResponse } from "@ethersproject/abstract-provider";

type AbstractFactoryClass = {
  connect: (address: string, signerOrProvider: Signer | Provider) => unknown;
  createInterface: () => unknown;
}

type AbstractFactoryClassReturnType<F extends AbstractFactoryClass> = {
  contractInstance: ReturnType<F['connect']>;
  contractInterface: ReturnType<F['createInterface']>;
}

export type SendResponse = {
  isValid: boolean;
  result?: TransactionResponse;
  hash?: string;
  transactionLink?: string;
  errorMessage?: string;
}

const createContract = <F extends AbstractFactoryClass>(
  address: string, signerOrProvider: Signer | Provider, factoryClass: F,
): AbstractFactoryClassReturnType<F> => {

  const contractInstance = factoryClass.connect(address, signerOrProvider) as ReturnType<F['connect']>;
  const contractInterface = factoryClass.createInterface() as ReturnType<F['createInterface']>;

  return { contractInstance, contractInterface };
}

export const createErc20 = (address: string, signerOrProvider: Signer | Provider) => {
  return createContract(address, signerOrProvider, Erc20__factory);
}

export const sendNative = async (
  recipient: string, amount: any, decimals: number, wallet: QtumWallet, network: Chain
): Promise<SendResponse> => {

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
    };
  } catch (_) {
    return {
      isValid: false,
      errorMessage: 'Something want wrong'
    };
  }
}

export const getQRC20 = async (token: string, wallet: QtumWallet) => {
  try {
    const { contractInstance } = createErc20(token, wallet);
    const [name, symbol, decimals] = await Promise.all([
      contractInstance.name(),
      contractInstance.symbol(),
      contractInstance.decimals(),
    ]);
    return { name, symbol, decimals };
  } catch (_) {
    return undefined;
  }
}

export const getQRC20WithBalance = async (token: string, address: string, wallet: QtumWallet) => {
  try {
    const { contractInstance } = createErc20(token, wallet);
    const [balance, symbol, name, decimals] = await Promise.all([
      contractInstance.balanceOf(address),
      contractInstance.symbol(),
      contractInstance.name(),
      contractInstance.decimals(),
    ])
    return { balance, name, symbol, decimals };
  } catch (_) {
    return undefined;
  }
}

export const sendQRC20 = async (
  token: string, recipient: string, amount: any, decimals: number, wallet: QtumWallet, network: Chain
) => {

  try {
    const { contractInterface } = createErc20(token, wallet)
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
    };
  } catch (_) {
    return {
      isValid: false,
      message: 'Something want wrong',
    };
  }
}
