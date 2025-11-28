import type { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { DashboardType } from '@/types/dashboard';

export type AbstractFactoryClassType = {
  connect: (address: string, signerOrProvider: Signer | Provider) => unknown;
  createInterface: () => unknown;
}

export type AbstractFactoryClassReturnType<F extends AbstractFactoryClassType> = {
  contractInstance: ReturnType<F['connect']>;
  contractInterface: ReturnType<F['createInterface']>;
}

export type QRC20StorageType = {
  contractAddress: string;
  chainId: string;
};

export type AddQRC20TokenType = {
  contractAddress: string;
  dashboardData: DashboardType;
}

export type SearchQRC20TokenType = {
  name: string;
  symbol: string;
  decimals: number;
}

export type NativeTokenType = {
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  chainId: string;
}

export type QRC20TokenType = NativeTokenType & {
  contractAddress: string;
};
