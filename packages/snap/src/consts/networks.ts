import type { Chain } from '@qtumproject/qtum-wallet-connector';

export const DEFAULT_NETWORKS_RPC_URLS: Chain[] = [
  {
    chainId: '81',
    chainName: 'Mainnet',
    rpcUrls: [
      'https://mainnet.qnode.qtum.info/v1/aPaVeuBrYtFZ6oyKQZlNqSUSjrHjCy5v26IYX',
    ],
    iconUrls: [''],
    nativeCurrency: {
      name: 'Qtum',
      symbol: 'QTUM',
      decimals: 8,
    },
    blockExplorerUrls: ['https://qtum.info/'],
  },
  {
    chainId: '8889',
    chainName: 'Testnet',
    rpcUrls: [
      'https://testnet.qnode.qtum.info/v1/aPaVeuBrYtFZ6oyKQZlNqSUSjrHjCy5v26IYX',
    ],
    iconUrls: [''],
    nativeCurrency: {
      name: 'TQtum',
      symbol: 'TQTUM',
      decimals: 8,
    },
    blockExplorerUrls: ['https://testnet.qtum.info/'],
  },
];
