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
