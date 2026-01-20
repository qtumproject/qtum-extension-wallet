import type { Chain } from '@qtumproject/qtum-wallet-connector';

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
  return (await (
    await fetch(
      `${
        network.blockExplorerUrls[0]
      }api/address/${address}/basic-txs?limit=${encodeURIComponent(
        String(limit),
      )}&offset=${encodeURIComponent(String(offset))}`,
    )
  ).json()) as NativeBasicTransactionsResponse;
}

export async function getNativeBalanceHistory(
  address: string,
  network: Chain,
  limit: number,
  offset: number,
): Promise<NativeBalanceHistoryResponse> {
  return (await (
    await fetch(
      `${
        network.blockExplorerUrls[0]
      }api/address/${address}/balance-history?limit=${encodeURIComponent(
        String(limit),
      )}&offset=${encodeURIComponent(String(offset))}`,
    )
  ).json()) as NativeBalanceHistoryResponse;
}

export async function getQRC20BalanceHistory(
  address: string,
  network: Chain,
  limit: number,
  offset: number,
): Promise<QRC20BalanceHistoryResponse> {
  return (await (
    await fetch(
      `${
        network.blockExplorerUrls[0]
      }api/address/${address}/qrc20-balance-history?limit=${encodeURIComponent(
        String(limit),
      )}&offset=${encodeURIComponent(String(offset))}`,
    )
  ).json()) as QRC20BalanceHistoryResponse;
}

export async function getContract(
  contractAddress: string,
  network: Chain,
): Promise<ContractResponse> {
  return (await (
    await fetch(
      `${network.blockExplorerUrls[0]}api/contract/${contractAddress}`,
    )
  ).json()) as ContractResponse;
}
