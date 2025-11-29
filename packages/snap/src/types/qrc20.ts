import type { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

export type AbstractFactoryClassType = {
  connect: (address: string, signerOrProvider: Signer | Provider) => unknown;
  createInterface: () => unknown;
}

export type AbstractFactoryClassReturnType<F extends AbstractFactoryClassType> = {
  contractInstance: ReturnType<F['connect']>;
  contractInterface: ReturnType<F['createInterface']>;
}

export type NativeType = {
  name: string;
  symbol: string;
  decimals: number;
  balance: string | null;
  chainId: string;
}

export type TokenType = NativeType & {
  contractAddress: string;
};

export type QRC20Type = Record<string, TokenType[]>;
