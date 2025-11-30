import { AddQRC20Type, DashboardType, NetworksType, ReceiveType, SendType } from '@/types';

export type ContextType = {
  networks: NetworksType;
  dashboard: DashboardType | null;
  addQRC20: AddQRC20Type | null;
  send: SendType | null;
  receive: ReceiveType | null;
};
