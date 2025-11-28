import { StorageKeys } from '@/enums';
import { getCurrentChainId } from '@/helpers';
import { snapStorage } from '@/rpc';
import type { QRC20StorageType } from '@/types';

export const getQRC20TokensForCurrentNetwork = async (): Promise<QRC20StorageType[]> => {
  const chainId = await getCurrentChainId();
  const state = (await snapStorage.getItem(StorageKeys.qrc20Tokens)) as Record<string, QRC20StorageType[]> | null;
  return state ? (state[chainId] ?? []) : [];
};

const saveQRC20TokensForCurrentNetwork = async (tokens: QRC20StorageType[]): Promise<void> => {
  const chainId = await getCurrentChainId();
  const state = ((await snapStorage.getItem(StorageKeys.qrc20Tokens)) as Record<string, QRC20StorageType[]> | null) ?? { };
  state[chainId] = tokens;
  await snapStorage.setItem(StorageKeys.qrc20Tokens, state);
};

export const addQRC20Token = async (token: QRC20StorageType): Promise<QRC20StorageType[]> => {
  const tokens = await getQRC20TokensForCurrentNetwork();
  const withoutDup = tokens.filter((t) => t.contractAddress !== token.contractAddress);
  const updated = [...tokens, token];
  await saveQRC20TokensForCurrentNetwork(updated);
  return updated;
};

export const getQRC20Token = async (contractAddress: string,): Promise<QRC20StorageType> => {
  const tokens = await getQRC20TokensForCurrentNetwork();
  const token = tokens.find(
    (token) => token.contractAddress.toLowerCase() === contractAddress.toLowerCase()
  );
  if (!token) {
    throw new Error('Token not found');
  }
  return token;
};

export const deleteQRC20Token = async (contractAddress: string): Promise<QRC20StorageType[]> => {
  const tokens = await getQRC20TokensForCurrentNetwork();
  const updated = tokens.filter(
    (token) => token.contractAddress.toLowerCase() !== contractAddress.toLowerCase()
  );
  await saveQRC20TokensForCurrentNetwork(updated);
  return updated;
};
