import { QtumWallet } from 'qtum-ethers-wrapper';

import { StorageKeys } from '@/enums';
import { genPkHexFromEntropy } from '@/helpers';
import { getQtumAddress } from '@/helpers/format';
import { snapStorage } from '@/rpc';


export const importPrivateKey = async (privateKey: string): Promise<{ qtumAddress: string; hexAddress: string }> => {

  const wallet: QtumWallet = QtumWallet.fromPrivateKey(privateKey);
  const qtumAddress: string = await getQtumAddress(wallet.address);
  await snapStorage.setItem(StorageKeys.identity, {
    privateKey: wallet.privateKey,
  });
  return {
    qtumAddress: qtumAddress,
    hexAddress: wallet.address,
  };
};


export const createWallet = async (): Promise<{ qtumAddress: string; hexAddress: string }> => {
  return importPrivateKey(await genPkHexFromEntropy());
};
