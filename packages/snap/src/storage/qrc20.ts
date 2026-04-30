import { sleep } from '@qtumproject/qtum-wallet-connector';

import { StorageEnum } from '@/enums';
import { normalizeHexadecimalAddress } from '@/helpers';
import { snapStorage } from '@/rpc';
import type {
  HistoriesType,
  HistoryItemType,
  QRC20Type,
  TokenType,
} from '@/types';

export const addToken = async (
  chainId: string,
  token: TokenType,
): Promise<TokenType[]> => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const tokens = await getTokens(chainId);
  const withoutDuplication = tokens.filter(
    (qrc20: TokenType): boolean =>
      qrc20.contractAddress !== token.contractAddress,
  );
  const updatedTokens = [...withoutDuplication, token];
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await saveTokens(updatedTokens, chainId);
  return updatedTokens;
};

export const getTokens = async (chainId: string): Promise<TokenType[]> => {
  const qrc20 = (await snapStorage.getItem(
    StorageEnum.QRC20,
  )) as QRC20Type | null;
  return qrc20 ? (qrc20[chainId] ?? []) : [];
};

export const getToken = async (
  contractAddress: string,
  chainId: string,
): Promise<TokenType> => {
  const tokens = await getTokens(chainId);
  const token = tokens.find(
    (qrc20) => qrc20.contractAddress === contractAddress,
  );
  if (!token) {
    throw new Error('Token not found');
  }
  return token;
};

export const hasToken = async (
  contractAddress: string,
  chainId: string,
): Promise<boolean> => {
  const tokens = await getTokens(chainId);
  const token = tokens.find(
    (qrc20) =>
      normalizeHexadecimalAddress(qrc20.contractAddress) ===
      normalizeHexadecimalAddress(contractAddress),
  );
  return Boolean(token);
};

export const saveTokens = async (
  tokens: TokenType[],
  chainId: string,
): Promise<void> => {
  const qrc20 =
    ((await snapStorage.getItem(StorageEnum.QRC20)) as QRC20Type | null) ?? {};
  qrc20[chainId] = tokens;
  await snapStorage.setItem(StorageEnum.QRC20, qrc20);
  await sleep(500);
};

export const deleteToken = async (
  contractAddress: string,
  chainId: string,
): Promise<TokenType[]> => {
  const tokens = await getTokens(chainId);
  const updated = tokens.filter(
    (token) => token.contractAddress !== contractAddress,
  );
  await saveTokens(updated, chainId);
  return updated;
};

export const addShowAddTokenFlag = async (
  histories: HistoriesType,
  chainId: string,
): Promise<HistoriesType> => {
  const items: HistoryItemType[] = await Promise.all(
    histories.items.map(async (item) => ({
      ...item,
      showAddToken: Boolean(
        item.isToken &&
          item.tokenContractAddress &&
          !(await hasToken(item.tokenContractAddress, chainId)),
      ),
    })),
  );

  return {
    ...histories,
    items,
  };
};
