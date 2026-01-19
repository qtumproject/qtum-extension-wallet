export type HistoryDirectionType = 'receive' | 'send' | 'gas-refund' | 'contract' | string;

export type HistoryStatusType = 'pending' | 'confirmed' | 'failed';

export type HistoryItemType = {
  transactionID: string;
  transactionLink: string;
  timestamp: number;
  amount: string;
  symbol: string;
  direction: HistoryDirectionType;
  status: HistoryStatusType;
  confirmations: number;
  type: string;
  isToken: boolean;
  tokenContractAddress?: string;
  tokenName?: string;
  tokenDecimals?: number;
};

export type HistoriesType = {
  items: HistoryItemType[];
  totalCount: number;
  isValid: boolean;
};

export type HistoryType = {
  filter: 'qtum' | 'qrc20';
  items: HistoryItemType[];
  totalCount: number;
  isValid: boolean;
  offset: number;
  pageSize: number;
  hasMore: boolean;
  page: number;
};
