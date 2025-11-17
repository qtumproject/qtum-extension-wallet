import { QtumWallet } from 'qtum-ethers-wrapper';
import {
  mnemonicToSeed, createBip39KeyFromSeed, BIP32Node, secp256k1
} from '@metamask/key-tree';
import { SLIP10Node } from '@metamask/key-tree';

import { getProvider } from "@/config";
import { StorageKeys } from '@/enums';
import { genPkHexFromEntropy } from '@/helpers/entropy';
import { relativePathToDeriveSegments } from '@/helpers/utils';
import { getQtumAddress } from '@/helpers/format';
import { getNetworks } from "@/helpers/networks";
import { snapStorage } from '@/rpc';

export const importPrivateKey = async (privateKey: string) => {

  let { list, current } = await getNetworks();
  const wallet: QtumWallet = new QtumWallet(privateKey, await getProvider());
  await snapStorage.setItem(StorageKeys.identity, {
    privateKey: wallet.privateKey,
  });
  const qtumAddress = await getQtumAddress(wallet.address, current);
  await snapStorage.setItem(StorageKeys.Addresses, {
    qtumAddress: qtumAddress,
    hexAddress: wallet.address,
  });
  const balance = String(await wallet.getBalance());
  return {
    qtumAddress: qtumAddress,
    hexAddress: wallet.address,
    balance: balance
  };
};

    // "snap_getBip32Entropy": [
    //   {
    //     "path": ["m", "44'", "88'"],
    //     "curve": "secp256k1"
    //   }
    // ],

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

export const createWallet = async () => {
  return await importPrivateKey(await genPkHexFromEntropy());
};
