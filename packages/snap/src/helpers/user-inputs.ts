import { OnUserInputHandler } from '@metamask/snaps-sdk';

import { clearWallet } from '@/config';
import {
  renderHome,
  renderDashboard,
  renderDriveInternalMnemonic,
  renderDriveExternalMnemonic,
  renderImportPrivateKey,
  errorSnapDialog
} from '@/helpers/ui';
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

  if (event?.name === 'create-wallet') {
    const { qtumAddress, hexAddress } = await createWallet();
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderDashboard({ qtumAddress, hexAddress }) },
    });
    return;
  }

  if (event?.name === 'drive-internal-mnemonic') {
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderDriveInternalMnemonic() },
    });
    return;
  }

  if (event?.name === 'drive-external-mnemonic') {
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderDriveExternalMnemonic() },
    });
    return;
  }

  if (event?.name === 'import-private-key') {
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderImportPrivateKey() },
    });
    return;
  }

  if (event?.name === 'submit-drive-internal-mnemonic') {

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
        params: { id, ui: renderDashboard({ qtumAddress, hexAddress }) },
      });
    } catch (_) {
      await errorSnapDialog({ message: 'Something is wrong' });
    }
    return;
  }

  if (event?.name === 'submit-drive-external-mnemonic') {

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
        params: { id, ui: renderDashboard({ qtumAddress, hexAddress }) },
      });
    } catch (_) {
      await errorSnapDialog({ message: 'Something is wrong' });
    }
    return;
  }

  if (event?.name === 'submit-import-private-key') {

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
        params: { id, ui: renderDashboard({ qtumAddress, hexAddress }) },
      });
    } catch (_) {
      await errorSnapDialog({ message: 'Something is wrong' });
    }
    return;
  }

  if (event?.name === 'cancel-wallet') {
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderHome() },
    });
    return;
  }

  if (event?.name === 'logout') {
    await clearWallet();
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderHome() },
    });
    return;
  }
};
