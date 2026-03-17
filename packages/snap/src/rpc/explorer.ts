import type { Chain } from 'qtum-snap-connector';

import type {
  NativeBasicTransactionsResponse,
  NativeBalanceHistoryResponse,
  QRC20BalanceHistoryResponse,
  ContractResponse,
} from '@/types/explorer';

export async function getNativeBasicTransaction(
  address: string,
  network: Chain,
  limit: number,
  offset: number,
): Promise<NativeBasicTransactionsResponse> {
  const response = await fetch(
    `${
      network.blockExplorerUrls[0]
    }api/address/${address}/basic-txs?limit=${encodeURIComponent(
      String(limit),
    )}&offset=${encodeURIComponent(String(offset))}`,
  );
  if (!response.ok) {
    throw new Error(`Explorer API error: ${response.status}`);
  }
  return (await response.json()) as NativeBasicTransactionsResponse;
}

export async function getNativeBalanceHistory(
  address: string,
  network: Chain,
  limit: number,
  offset: number,
): Promise<NativeBalanceHistoryResponse> {
  const response = await fetch(
    `${
      network.blockExplorerUrls[0]
    }api/address/${address}/balance-history?limit=${encodeURIComponent(
      String(limit),
    )}&offset=${encodeURIComponent(String(offset))}`,
  );
  if (!response.ok) {
    throw new Error(`Explorer API error: ${response.status}`);
  }
  return (await response.json()) as NativeBalanceHistoryResponse;
}

export async function getQRC20BalanceHistory(
  address: string,
  network: Chain,
  limit: number,
  offset: number,
): Promise<QRC20BalanceHistoryResponse> {
  const response = await fetch(
    `${
      network.blockExplorerUrls[0]
    }api/address/${address}/qrc20-balance-history?limit=${encodeURIComponent(
      String(limit),
    )}&offset=${encodeURIComponent(String(offset))}`,
  );
  if (!response.ok) {
    throw new Error(`Explorer API error: ${response.status}`);
  }
  return (await response.json()) as QRC20BalanceHistoryResponse;
}

export async function getContract(
  contractAddress: string,
  network: Chain,
): Promise<ContractResponse> {
  const response = await fetch(
    `${network.blockExplorerUrls[0]}api/contract/${contractAddress}`,
  );
  if (!response.ok) {
    throw new Error(`Explorer API error: ${response.status}`);
  }
  return (await response.json()) as ContractResponse;
}
