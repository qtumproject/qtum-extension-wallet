export type HistoryDirection = 'receive' | 'send' | 'gas-refund' | 'contract' | string;

export type HistoryStatus = 'pending' | 'confirmed' | 'failed';

export type HistoryItem = {
  transactionID: string;
  transactionLink: string;
  timestamp: string;
  amount: string;
  symbol: string;
  direction: HistoryDirection;
  status: HistoryStatus;
  confirmations: number;
  type?: string;
  isToken: boolean;
  tokenContractAddress?: string;
  tokenName?: string;
  tokenDecimals?: number;
};

export type Histories = {
  items: HistoryItem[];
  totalCount: number;
  isValid: boolean;
};

export type HistoryType = {
  filter: 'qtum' | 'qrc20';
  items: HistoryItem[];
  totalCount: number;
  isValid: boolean;
  offset: number;
  pageSize: number;
  hasMore: boolean;
  page: number;
};
