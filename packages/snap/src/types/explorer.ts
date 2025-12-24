export type NativeBasicTransactionType =
  | 'send'
  | 'receive'
  | 'contract'
  | 'gas-refund'
  | string;

export type NativeBasicTransaction = {
  id: string;
  blockHash?: string;
  blockHeight?: number;
  timestamp: number;
  confirmations?: number;
  amount: string;
  inputValue?: string;
  outputValue?: string;
  refundValue?: string;
  fees?: string;
  type?: NativeBasicTransactionType;
  balance?: string;
};

export type NativeBasicTransactionsResponse = {
  totalCount: number;
  transactions: NativeBasicTransaction[];
};

export type NativeBalanceTransaction = {
  id: string;
  blockHash?: string;
  blockHeight?: number;
  timestamp: number;
  amount: string;
  balance?: string;
};

export type NativeBalanceHistoryResponse = {
  totalCount: number;
  transactions: NativeBalanceTransaction[];
};

export type Token = {
  address: string;
  addressHex?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  amount: string;
  balance?: string;
};

export type QRC20BalanceTransaction = {
  id: string;
  blockHash?: string;
  blockHeight?: number;
  timestamp: number;
  confirmations?: number;
  tokens: Token[];
};

export type QRC20BalanceHistoryResponse = {
  totalCount: number;
  transactions: QRC20BalanceTransaction[];
};
