import type { Chain } from '@qtumproject/qtum-wallet-connector';

import type { StorageKeys } from '@/enums';

export type StorageMap = {
  [StorageKeys.identity]: {
    privateKey: string;
  };
  [StorageKeys.Networks]: {
    current: Chain;
    list: Chain[];
  };
};

// types/qrc20.ts
export type Qrc20Token = {
  contractAddress: string;
  chainId: string;
};

// state shape: { [chainId]: Qrc20Token[] }
export type Qrc20State = Record<string, Qrc20Token[]>;
