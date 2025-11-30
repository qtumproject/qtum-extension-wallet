import { StorageEnum } from '@/enums';
import type { NetworksType } from '@/types/network';
import type { QRC20Type } from '@/types/qrc20';

export type IdentityType = {
  privateKey: string;
}

export type StorageType = {
  [StorageEnum.Identity]: IdentityType;
  [StorageEnum.Networks]: NetworksType;
  [StorageEnum.QRC20]: QRC20Type;
};
