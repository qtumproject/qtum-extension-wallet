import { QtumWallet } from 'qtum-ethers-wrapper';
import {
  mnemonicToSeed, createBip39KeyFromSeed, BIP32Node, secp256k1
} from '@metamask/key-tree';
import { SLIP10Node } from '@metamask/key-tree';

import { StorageKeys } from '@/enums';
import { genPkHexFromEntropy } from '@/helpers/entropy';
import { relativePathToDeriveSegments } from '@/helpers/utils';
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

export async function deriveFromInternalMnemonic(options: { derivationPath: string; }) {
  const { derivationPath } = options;

  const rootNodeJson = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ["m", "44'", "88'"],
      curve: 'secp256k1',
    },
  });
  const rootNode = await SLIP10Node.fromJSON(rootNodeJson as any);
  const segments = relativePathToDeriveSegments(derivationPath) as BIP32Node[];
  const derivedNode = await rootNode.derive(segments);

  if (!derivedNode.privateKey) {
    throw new Error('Something is wrong.')
  }
  return await importPrivateKey(derivedNode.privateKey);
}

export async function deriveFromExternalMnemonic(options: {
  mnemonic: string; passphrase?: string; derivationPath: string;
}) {
  const { mnemonic, passphrase, derivationPath } = options;

  const seed = await mnemonicToSeed(mnemonic, passphrase ?? '');
  const masterNode = await createBip39KeyFromSeed(seed, secp256k1);
  const segments = relativePathToDeriveSegments(derivationPath) as BIP32Node[];
  const derivedNode = await masterNode.derive(segments);

  if (!derivedNode.privateKey) {
    throw new Error('Something is wrong.')
  }
  return await importPrivateKey(derivedNode.privateKey);
}

export const createWallet = async (): Promise<{ qtumAddress: string; hexAddress: string }> => {
  return await importPrivateKey(await genPkHexFromEntropy());
};
