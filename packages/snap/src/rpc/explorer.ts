import { ethers } from 'ethers';

import { getProvider, getWallet } from '@/config';
import { getTokens } from '@/storage';
import { formatDateTime, getQtumAddress, formatUnits } from '@/helpers/format';
import type { HistoryItem } from '@/types';
import type {
  NativeBasicTransactionsResponse,
  QRC20BalanceHistoryResponse,
} from '@/types/explorer';

const MAINNET_BASE = 'https://qtum.info/api/';
const TESTNET_BASE = 'https://testnet.qtum.info/api/';

export function getExplorerBaseUrl(chainId: number | string): string {
  const id = Number(chainId);
  if (id === 81) return MAINNET_BASE;
  if (id === 8889) return TESTNET_BASE;
  return MAINNET_BASE;
}

export function getExplorerTxLinkBase(chainId: number | string): string {
  const id = Number(chainId);
  if (id === 81) return 'https://qtum.info/tx/';
  if (id === 8889) return 'https://testnet.qtum.info/tx/';
  return 'https://qtum.info/tx/';
}

export async function fetchNativeBalanceHistory(limit: number, offset: number): Promise<{
  list: HistoryItem[];
  count: number;
}> {
  try {
    const wallet = await getWallet();
    const provider = await getProvider();
    const { chainId } = await provider.getNetwork();
    const base = getExplorerBaseUrl(chainId);
    const addr = await getQtumAddress(wallet.address, Number(chainId));
    const url = `${base}address/${addr}/basic-txs?limit=${encodeURIComponent(String(limit))}&offset=${encodeURIComponent(String(offset))}`;
    const res = await fetch(url);
    const json = (await res.json()) as any as NativeBasicTransactionsResponse;
    const symbol = 'QTUM';
    const list: HistoryItem[] = (json?.transactions || []).map((native: any) => {
      const typeRaw = String(native.type || '').toLowerCase();
      const isOut = String(native.amount || '').startsWith('-');
      const direction: HistoryItem['direction'] =
        typeRaw === 'receive'
        ? 'in'
        : typeRaw === 'send'
        ? 'out'
        : typeRaw === 'contract'
        ? 'contract'
        : typeRaw === 'gas-refund'
        ? 'self'
        : isOut
        ? 'out'
        : 'in';

      const humanType = (() => {
        switch (typeRaw) {
          case 'receive':
            return 'Receive';
          case 'send':
            return 'Send';
          case 'gas-refund':
            return 'Gas Refund';
          case 'contract':
            return 'Contract';
          default:
            return 'QTUM';
        }
      })();

      const signed = String(native.amount ?? '0');
      const abs = signed.startsWith('-') ? signed.slice(1) : signed;
      const amount = `${formatUnits(abs || '0', 8, 8)}`;
      const confs = Number(native?.confirmations ?? 0);
      const timestamp = native?.timestamp ? formatDateTime(new Date(Number(native.timestamp) * 1000)) : '-';
      const status = confs > 0 ? 'confirmed' : 'pending';
      return {
        transactionID: native.id,
        timestamp,
        direction,
        status,
        amount,
        symbol,
        confirmations: Number.isFinite(confs) ? confs : 0,
        type: humanType,
        isToken: false,
      } as HistoryItem;
    });
    return { list, count: Number((json as any)?.totalCount || 0) };
  } catch (_) {
    return { list: [], count: 0 };
  }
}

export async function fetchQRC20BalanceHistory(limit: number, offset: number): Promise<{
  list: HistoryItem[];
  count: number;
}> {
  try {
    const wallet = await getWallet();
    const provider = await getProvider();
    const { chainId } = await provider.getNetwork();
    const base = getExplorerBaseUrl(chainId);
    const addr = await getQtumAddress(wallet.address, Number(chainId));
    // Load locally stored tokens to determine whether we can show "Add token" in UI
    const localTokens = await getTokens(Number(chainId));
    const localTokenSet = new Set<string>((localTokens || []).map((t: any) => String(t.contractAddress || '').toLowerCase()));
    // Some explorers may not support limit/offset for qrc20 endpoint; include them if available.
    const url = `${base}address/${addr}/qrc20-balance-history?limit=${encodeURIComponent(String(limit))}&offset=${encodeURIComponent(String(offset))}`;
    const res = await fetch(url);
    const json = (await res.json()) as QRC20BalanceHistoryResponse;
    const list: HistoryItem[] = [];
    for (const tx of json?.transactions || []) {
      for (const token of tx.tokens || []) {
        const signed = String(token.amount || '0');
        const isOut = signed.startsWith('-');
        const abs = isOut ? signed.slice(1) : signed;
        const decimals = Number(token.decimals || 0);
        const amount = decimals > 0 ? ethers.utils.formatUnits(abs || '0', decimals) : abs || '0';
        const hasBlockMeta = Boolean(tx.blockHash && (tx.blockHeight || tx.blockHeight === 0) && tx.timestamp);
        const confs = Number(tx?.confirmations ?? 0);
        const timestamp = tx.timestamp ? formatDateTime(new Date(Number(tx.timestamp) * 1000)) : '-';
        const rawAddr = (token.addressHex || token.address || '').toString();
        const normalized = rawAddr ? rawAddr.startsWith('0x') ? rawAddr.toLowerCase() : `0x${rawAddr.toLowerCase()}` : '';
        const canAddToken = normalized ? !localTokenSet.has(normalized.toLowerCase()) : false;
        list.push({
          transactionID: tx.id,
          timestamp,
          direction: isOut ? 'out' : 'in',
          status: confs > 0 ? 'confirmed' : 'pending',
          amount,
          symbol: token.symbol || 'TOKEN',
          confirmations: Number.isFinite(confs) ? confs : 0,
          type: 'Token Transfer',
          isToken: true,
          tokenContractAddress: normalized,
          tokenName: token.name || undefined,
          tokenDecimals: Number.isFinite(decimals) ? decimals : undefined,
          canAddToken,
        } as HistoryItem);
      }
    }
    return { list, count: Number(json?.totalCount || 0) };
  } catch (_) {
    return { list: [], count: 0 };
  }
}
