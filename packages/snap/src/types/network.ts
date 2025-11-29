import { Chain } from '@qtumproject/qtum-wallet-connector';

export type NetworksType = {
  list: Chain[],
  current: Chain
}
