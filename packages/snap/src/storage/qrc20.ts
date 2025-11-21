import { StorageKeys } from '@/enums';
import type { Qrc20Token, Qrc20State } from '@/types/storage-types';
import {getCurrentChainId, QRC20Tokens} from '@/helpers';
import { snapStorage } from '@/rpc';
import {getQRC20WithBalance} from "@/helpers/send";
import {getWallet} from "@/config";

export const getQrc20TokensForCurrentNetwork = async (): Promise<Qrc20Token[]> => {
  const chainId = await getCurrentChainId();
  const state = (await snapStorage.getItem(StorageKeys.qrc20Tokens)) as Qrc20State | null;
  if (!state) return [];
  return state[chainId] ?? [];
};

export const getQRC20Tokens = async (): Promise<QRC20Tokens[]> => {
  const wallet = await getWallet();
  const tokens = await getQrc20TokensForCurrentNetwork();
  let qrc20Tokens: QRC20Tokens[] = [];
  for (const token of tokens) {
    const qrc20 = await getQRC20WithBalance(
      token.contractAddress, wallet.address, wallet
    );
    qrc20Tokens.push({
      contractAddress: token.contractAddress,
      name: qrc20?.name ?? 'comon',
      symbol: qrc20?.symbol ?? 'yo',
      decimals: qrc20?.decimals ?? 0,
      balance: qrc20?.balance.toString() ?? '',
      chainId: await wallet.getChainId()
    });
  }
  return qrc20Tokens;
};

const saveQrc20TokensForCurrentNetwork = async (tokens: Qrc20Token[]): Promise<void> => {
  const chainId = await getCurrentChainId();
  const state = ((await snapStorage.getItem(StorageKeys.qrc20Tokens)) as Qrc20State | null) ?? {};
  state[chainId] = tokens;
  await snapStorage.setItem(StorageKeys.qrc20Tokens, state);
};

export const addQrc20Token = async (token: Qrc20Token): Promise<Qrc20Token[]> => {
  const tokens = await getQrc20TokensForCurrentNetwork();
  const withoutDup = tokens.filter((t) => t.contractAddress !== token.contractAddress);
  const updated = [...withoutDup, token];
  await saveQrc20TokensForCurrentNetwork(updated);
  return updated;
};

export const deleteQrc20TokenById = async (contractAddress: string): Promise<Qrc20Token[]> => {
  const tokens = await getQrc20TokensForCurrentNetwork();
  const updated = tokens.filter((t) => t.contractAddress !== contractAddress);
  await saveQrc20TokensForCurrentNetwork(updated);
  return updated;
};
