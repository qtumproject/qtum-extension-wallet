import type { Chain } from 'qtum-snap-connector';

export type NetworksType = {
  list: Chain[];
  current: Chain;
};
