import type { NativeType, TokenType, HistoriesType, KeyType } from '@/types';
import type { AddressType } from '@/types/address';

export type DashboardType = {
  address: AddressType | null;
  native: NativeType | null;
  tokens: TokenType[] | null;
  tokensPage?: number;
  histories?: HistoriesType | null;
  keyType: KeyType;
};
