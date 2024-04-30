import type { Chain } from '@qtumproject/wallet-snap-connector';

export const DEFAULT_NETWORKS_RPC_URLS: Chain[] = [
  {
    chainId: '8889',
    chainName: 'Qtum Testnet',
    rpcUrls: [
      'https://testnet.qnode.qtum.info/v1/7ot2Ig0j1O7ecwMBz4Y4rYsOM1sQh4Nnl7rMr',
    ],
    iconUrls: [''],
    nativeCurrency: {
      name: 'TQtum',
      symbol: 'TQtum',
      decimals: 8,
    },
    blockExplorerUrls: ['http://testnet.qtum.info/'],
  },
  {
    chainId: '81',
    chainName: 'Qtum Mainnet',
    rpcUrls: [
      'https://mainnet.qnode.qtum.info/v1/7ot2Ig0j1O7ecwMBz4Y4rYsOM1sQh4Nnl7rMr',
    ],
    iconUrls: [''],
    nativeCurrency: {
      name: 'Qtum',
      symbol: 'Qtum',
      decimals: 8,
    },
    blockExplorerUrls: ['https://qtum.info/'],
  },
];
