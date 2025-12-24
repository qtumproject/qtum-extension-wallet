import { Chain } from 'qtum-snap-connector';
import { ethers } from 'ethers';

import { formatDateTime, formatUnits } from '@/helpers/format';
import { getNativeBasicTransaction, getQRC20BalanceHistory } from '@/rpc';
import type {
  Histories,
  HistoryItem,
  HistoryStatus,
  NativeBasicTransactionsResponse,
  QRC20BalanceHistoryResponse,
} from '@/types';
import { normalizeTransactionType } from '@/helpers/utils';
import { WAITING_CONFIRMATIONS } from '@/consts';

export async function getNativeHistory(
  address: string, network: Chain, limit: number, offset: number
): Promise<Histories> {
  try {
    const items: HistoryItem[] = [];
    const data: NativeBasicTransactionsResponse = await getNativeBasicTransaction(
      address, network, limit, offset
    );
    for (const transaction of data?.transactions) {
      const transactionLink = `${network.blockExplorerUrls[0]}tx/${transaction.id}`;
      const signed = String(transaction.amount ?? '0');
      const abs = signed.startsWith('-') ? signed.slice(1) : signed;
      const amount = `${formatUnits(abs || '0', 8, 8)}`;
      const confirmations = Number(transaction?.confirmations ?? 0);
      const timestamp = transaction?.timestamp
        ? formatDateTime(new Date(Number(transaction.timestamp) * 1000)) : '-';
      const status: HistoryStatus =
        confirmations > WAITING_CONFIRMATIONS ? 'confirmed' : 'pending';
      items.push({
        transactionID: transaction.id,
        transactionLink,
        timestamp,
        status,
        amount,
        symbol: 'QTUM',
        direction: transaction.type,
        confirmations: Number.isFinite(confirmations) ? confirmations : 0,
        type: normalizeTransactionType(transaction.type),
        isToken: false,
      } as HistoryItem);
    }
    return { items, totalCount: Number(data.totalCount), isValid: true };
  } catch (_) {
    return { items: [], totalCount: 0, isValid: false };
  }
}

export async function getQRC20History(
  address: string, network: Chain, limit: number, offset: number
): Promise<Histories> {
  try {
    const items: HistoryItem[] = [];
    const data: QRC20BalanceHistoryResponse = await getQRC20BalanceHistory(
      address, network, limit, offset
    );
    for (const transaction of data?.transactions) {
      const transactionLink = `${network.blockExplorerUrls[0]}tx/${transaction.id}`;
      for (const token of transaction.tokens) {
        const signed = String(token.amount ?? '0');
        const isSend = signed.startsWith('-');
        const abs = isSend ? signed.slice(1) : signed;
        const decimals = Number(token.decimals || 0);
        const amount = decimals > 0 ? ethers.utils.formatUnits(abs || '0', decimals) : abs || '0';
        const confirmations = Number(transaction?.confirmations ?? 0);
        const timestamp = transaction.timestamp
          ? formatDateTime(new Date(Number(transaction.timestamp) * 1000)) : '-';
        const status: HistoryStatus =
          confirmations > WAITING_CONFIRMATIONS ? 'confirmed' : 'pending';
        items.push({
          transactionID: transaction.id,
          transactionLink,
          timestamp,
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
        } as HistoryItem);
      }
    }
    return { items, totalCount: Number(data.totalCount), isValid: true };
  } catch (_) {
    return { items: [], totalCount: 0, isValid: false };
  }
}
