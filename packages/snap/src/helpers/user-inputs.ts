import { OnUserInputHandler, UserInputEventType } from '@metamask/snaps-sdk';
import { sleep } from "@qtumproject/qtum-wallet-connector";

import { clearWallet, getWallet } from '@/config';
import {
  renderHome,
  renderDashboard,
  renderDriveInternalMnemonic,
  renderDriveExternalMnemonic,
  renderImportPrivateKey,
  errorSnapDialog,
  renderSwitchingNetwork
} from '@/helpers/ui';
import { getQtumAddress } from "@/helpers/format";
import { getNetworks, setCurrentNetwork } from "@/helpers/networks";
import {
  createWallet,
  deriveFromExternalMnemonic,
  deriveFromInternalMnemonic,
  importPrivateKey
} from '@/helpers/wallet';

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {

  const state: any = await snap.request({
    method: 'snap_getInterfaceState',
    params: { id },
  });

  let { list, current } = await getNetworks();
  list = [
    current, ...list.filter((network) => String(network.chainId) !== String(current.chainId)),
  ];

  if (event.type === UserInputEventType.InputChangeEvent && event.name === 'networks') {
    const chainId = event.value as string;
    const networks = await getNetworks();
    const selectedNetwork = networks.list.find(
      (network) => String(network.chainId) === chainId,
    );
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id, ui: renderSwitchingNetwork(selectedNetwork?.chainName ?? 'Unknown'),
      },
    });
    await setCurrentNetwork(chainId, false);
    await sleep(1000);
    const wallet = await getWallet();
    const hexAddress = wallet.address;
    const qtumAddress = await getQtumAddress();
    let { list, current } = await getNetworks();
    list = [
      current, ...list.filter((network) => String(network.chainId) !== String(current.chainId)),
    ];
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderDashboard({ list, current }, { qtumAddress, hexAddress }) },
    });
    return;
  }

  if (event.name === 'create-wallet') {
    const { qtumAddress, hexAddress } = await createWallet();
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderDashboard({ list, current }, { qtumAddress, hexAddress }) },
    });
    return;
  }

  if (event.name === 'drive-internal-mnemonic') {
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderDriveInternalMnemonic() },
    });
    return;
  }

  if (event.name === 'drive-external-mnemonic') {
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderDriveExternalMnemonic() },
    });
    return;
  }

  if (event.name === 'import-private-key') {
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderImportPrivateKey() },
    });
    return;
  }

  if (event.name === 'submit-drive-internal-mnemonic') {

    const derivationPath = state?.['drive-internal-mnemonic-form']?.['derivation-path'];

    if (!derivationPath) {
      await snap.request({
        method: 'snap_updateInterface',
        params: { id, ui: renderDriveInternalMnemonic('Derivation path is required') },
      });
      return;
    }

    try {
      const { qtumAddress, hexAddress } = await deriveFromInternalMnemonic({
        derivationPath,
      });
      await snap.request({
        method: 'snap_updateInterface',
        params: { id, ui: renderDashboard({ list, current }, { qtumAddress, hexAddress }) },
      });
    } catch (_) {
      await errorSnapDialog({ message: 'Something went wrong' });
    }
    return;
  }

  if (event.name === 'submit-drive-external-mnemonic') {

    const mnemonic = state?.['drive-external-mnemonic-form']?.['mnemonic'];
    const passphrase = state?.['drive-external-mnemonic-form']?.['passphrase'];
    const derivationPath = state?.['drive-external-mnemonic-form']?.['derivation-path'];

    if (!mnemonic) {
      await snap.request({
        method: 'snap_updateInterface',
        params: { id, ui: renderDriveExternalMnemonic('Mnemonic is required', undefined) },
      });
      return;
    } else if (!derivationPath) {
      await snap.request({
        method: 'snap_updateInterface',
        params: { id, ui: renderDriveExternalMnemonic(undefined, 'Derivation path is required') },
      });
      return;
    }

    try {
      const { qtumAddress, hexAddress } = await deriveFromExternalMnemonic({
        mnemonic, passphrase, derivationPath
      });
      await snap.request({
        method: 'snap_updateInterface',
        params: { id, ui: renderDashboard({ list, current }, { qtumAddress, hexAddress }) },
      });
    } catch (_) {
      await errorSnapDialog({ message: 'Something went wrong' });
    }
    return;
  }

  if (event.name === 'submit-import-private-key') {

    const isHex64 = (s: string) => /^(0x)?[0-9a-fA-F]{64}$/.test(s.trim());
    const strip0x = (s: string) => (s.startsWith('0x') ? s.slice(2) : s);

    const privateKey = strip0x(state?.['import-private-key-form']?.['private-key']);

    if (!privateKey) {
      await snap.request({
        method: 'snap_updateInterface',
        params: { id, ui: renderImportPrivateKey('Private key is required') },
      });
      return;
    } else if (!isHex64(privateKey)) {
      await snap.request({
        method: 'snap_updateInterface',
        params: { id, ui: renderImportPrivateKey('Invalid private key') },
      });
      return;
    }

    try {
      const { qtumAddress, hexAddress } = await importPrivateKey(privateKey);
      await snap.request({
        method: 'snap_updateInterface',
        params: { id, ui: renderDashboard({ list, current }, { qtumAddress, hexAddress }) },
      });
    } catch (_) {
      await errorSnapDialog({ message: 'Something went wrong' });
    }
    return;
  }

  if (event.name === 'cancel-wallet') {
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderHome() },
    });
    return;
  }

  if (event.name === 'logout') {
    await clearWallet();
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderHome() },
    });
    return;
  }
};
