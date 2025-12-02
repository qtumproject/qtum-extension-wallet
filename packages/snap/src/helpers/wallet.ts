import { QtumWallet } from 'qtum-ethers-wrapper';
import { sleep } from '@qtumproject/qtum-wallet-connector';
import {
  mnemonicToSeed, createBip39KeyFromSeed, BIP32Node, secp256k1, SLIP10Node
} from '@metamask/key-tree';

import { getProvider } from '@/config';
import { StorageEnum } from '@/enums';
import { genPkHexFromEntropy } from '@/helpers/entropy';
import { relativePathToDeriveSegments } from '@/helpers/utils';
import { getNetworks } from '@/storage/networks';
import { snapStorage } from '@/rpc';

export const createWallet = async () => {
  return await importPrivateKey(await genPkHexFromEntropy());
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

export const importPrivateKey = async (privateKey: string) => {

  let networks = await getNetworks();
  const wallet: QtumWallet = new QtumWallet(privateKey, await getProvider());
  await snapStorage.setItem(StorageEnum.Identity, {
    privateKey: wallet.privateKey,
  });
  await sleep(500);
  return { networks, wallet };
};
