import type { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { TokenType } from '@/types/coin';

export type AbstractFactoryClassType = {
  connect: (address: string, signerOrProvider: Signer | Provider) => unknown;
  createInterface: () => unknown;
}

export type AbstractFactoryClassReturnType<F extends AbstractFactoryClassType> = {
  contractInstance: ReturnType<F['connect']>;
  contractInterface: ReturnType<F['createInterface']>;
}

export type QRC20Type = Record<string, TokenType[]>;

export type AddQRC20Type = {
  token: TokenType | null,
};
