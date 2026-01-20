import type {
  AddQRC20Type,
  DashboardType,
  HistoryType,
  HomeType,
  NetworksType,
  ReceiveType,
  SendType,
} from '@/types';

export type ContextType = {
  networks: NetworksType;
  home: HomeType | null;
  dashboard: DashboardType | null;
  addQRC20: AddQRC20Type | null;
  send: SendType | null;
  receive: ReceiveType | null;
  history: HistoryType | null;
};
