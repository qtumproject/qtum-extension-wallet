import { Chain } from '@qtumproject/qtum-wallet-connector';

import { QRC20Tokens } from '@/helpers';

export type DashboardContext = {
  networks: { list: Chain[], current: Chain },
  wallet: { qtumAddress: string, hexAddress: string, balance: string },
  tokens: QRC20Tokens[],
  page: number
}
