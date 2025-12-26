import { AddressType } from '@/types/address';
import { NativeType, TokenType, HistoriesType } from '@/types';

export type DashboardType = {
  address: AddressType | null;
  native: NativeType | null;
  tokens: TokenType[] | null;
  tokensPage?: number;
  histories?: HistoriesType | null;
};
