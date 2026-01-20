import type { Chain } from '@qtumproject/qtum-wallet-connector';
import { ethers } from 'ethers';

import { HISTORY_PAGE_SIZE, WAITING_CONFIRMATIONS } from '@/consts';
import { formatUnits } from '@/helpers/format';
import { toTitleCase } from '@/helpers/utils';
import { getNativeBasicTransaction, getQRC20BalanceHistory } from '@/rpc';
import type {
  HistoriesType,
  HistoryItemType,
  HistoryStatusType,
  NativeBasicTransactionsResponse,
  QRC20BalanceHistoryResponse,
} from '@/types';

export async function getNativeHistory(
  address: string,
  network: Chain,
  limit: number,
  offset: number,
): Promise<HistoriesType> {
  try {
    const items: HistoryItemType[] = [];
    const data: NativeBasicTransactionsResponse =
      await getNativeBasicTransaction(address, network, limit, offset);
    for (const transaction of data.transactions) {
      const transactionLink = `${network.blockExplorerUrls[0]}tx/${transaction.id}`;
      const signed = String(transaction.amount ?? '0');
      const abs = signed.startsWith('-') ? signed.slice(1) : signed;
      const amount = `${formatUnits(abs || '0', 8, 8)}`;
      const confirmations = Number(transaction?.confirmations ?? 0);
      const timestamp = Number(transaction?.timestamp);
      const status: HistoryStatusType =
        confirmations > WAITING_CONFIRMATIONS ? 'confirmed' : 'pending';
      items.push({
        transactionID: transaction.id,
        transactionLink,
        timestamp: Number.isFinite(timestamp) ? timestamp : 0,
        status,
        amount,
        symbol: 'QTUM',
        direction: transaction.type,
        confirmations: Number.isFinite(confirmations) ? confirmations : 0,
        type: transaction.type
          ? toTitleCase(transaction.type, /-/gu, ' ')
          : '-',
        isToken: false,
      } as HistoryItemType);
    }
    return { items, totalCount: Number(data.totalCount), isValid: true };
  } catch {
    return { items: [], totalCount: 0, isValid: false };
  }
}

export async function getQRC20History(
  address: string,
  network: Chain,
  limit: number,
  offset: number,
): Promise<HistoriesType> {
  try {
    const items: HistoryItemType[] = [];
    const data: QRC20BalanceHistoryResponse = await getQRC20BalanceHistory(
      address,
      network,
      limit,
      offset,
    );
    for (const transaction of data.transactions) {
      const transactionLink = `${network.blockExplorerUrls[0]}tx/${transaction.id}`;
      for (const token of transaction.tokens) {
        const signed = String(token.amount ?? '0');
        const isSend = signed.startsWith('-');
        const abs = isSend ? signed.slice(1) : signed;
        const decimals = Number(token.decimals || 0);
        const amount =
          decimals > 0
            ? ethers.utils.formatUnits(abs || '0', decimals)
            : abs || '0';
        const confirmations = Number(transaction?.confirmations ?? 0);
        const timestamp = Number(transaction?.timestamp);
        const status: HistoryStatusType =
          confirmations > WAITING_CONFIRMATIONS ? 'confirmed' : 'pending';
        items.push({
          transactionID: transaction.id,
          transactionLink,
          timestamp: Number.isFinite(timestamp) ? timestamp : 0,
          direction: isSend ? 'send' : 'receive',
          status,
          amount,
          symbol: token.symbol,
          confirmations: Number.isFinite(confirmations) ? confirmations : 0,
          type: 'Token Transfer',
          isToken: true,
          tokenContractAddress: token.address,
          tokenName: token.name,
          tokenDecimals: Number.isFinite(decimals) ? decimals : undefined,
        } as HistoryItemType);
      }
    }
    return { items, totalCount: Number(data.totalCount), isValid: true };
  } catch {
    return { items: [], totalCount: 0, isValid: false };
  }
}

export async function getTop5History(
  address: string,
  network: Chain,
): Promise<HistoriesType> {
  try {
    const [native, qrc20] = await Promise.all([
      getNativeHistory(address, network, HISTORY_PAGE_SIZE, 0),
      getQRC20History(address, network, HISTORY_PAGE_SIZE, 0),
    ]);
    const items: HistoryItemType[] = [...native.items, ...qrc20.items]
      .sort(
        (one: HistoryItemType, two: HistoryItemType): number =>
          two.timestamp - one.timestamp,
      )
      .slice(0, HISTORY_PAGE_SIZE);
    return { items, totalCount: Number(items.length), isValid: true };
  } catch {
    return { items: [], totalCount: 0, isValid: false };
  }
}
