import type { StorageKeys } from '@/enums';

export type StorageMap = {
  [StorageKeys.identity]: {
    privateKey: string;
  };
  [StorageKeys.credentials]: {
    // TODO: remove
    username: string;
    password: string;
  };
};
