import { OnUserInputHandler, UserInputEventType } from '@metamask/snaps-sdk';
import QRCode from 'qrcode';

import { clearWallet, getWallet } from '@/config';
import {
  renderHome,
  renderDashboard,
  renderDriveInternalMnemonic,
  renderDriveExternalMnemonic,
  renderImportPrivateKey,
  errorSnapDialog,
  renderSwitchingNetwork, renderReceive, getCurrentWallet, getCurrentNetworks
} from '@/helpers/ui';
import { getQtumAddress } from '@/helpers/format';
import { getNetworks, setCurrentNetwork } from '@/helpers/networks';
import {
  createWallet,
  deriveFromExternalMnemonic,
  deriveFromInternalMnemonic,
  importPrivateKey
} from '@/helpers/wallet';
import { snapStorage } from '@/rpc';
import { StorageKeys } from '@/enums';

export const onUserInput: OnUserInputHandler = async ({ id, event, context }) => {

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
    const wallet = await getWallet();
    const hexAddress = wallet.address;
    const qtumAddress = await getQtumAddress();
    const balance = String(await wallet.getBalance());
    let { list, current } = await getNetworks();
    list = [
      current, ...list.filter((network) => String(network.chainId) !== String(current.chainId)),
    ];
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderDashboard({ list, current }, { qtumAddress, hexAddress, balance }) },
    });
    return;
  }

  if (event.name === 'create-wallet') {
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderDashboard({ list, current }, await createWallet()) },
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

  if (event.name === 'receive') {
    const { qtumAddress, hexAddress } = (await snapStorage.getItem(StorageKeys.Addresses)) ?? { qtumAddress: '', hexAddress: '' };
    const qtumAddressSVG = await QRCode.toString(qtumAddress, { type: 'svg', margin: 1, width: 150 });
    const hexAddressSVG = await QRCode.toString(hexAddress, { type: 'svg', margin: 1, width: 150 });
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id, ui: renderReceive({
          qtumAddress,
          qtumAddressSVG,
          hexAddress,
          hexAddressSVG,
          selected: 'qtum',
        }), context: {
          qtumAddress,
          qtumAddressSVG,
          hexAddress,
          hexAddressSVG,
          selected: 'qtum',
        },
      },
    });
    return;
  }

  if (event.type === UserInputEventType.InputChangeEvent && event.name === 'receive-type') {

    const selected = event.value as 'qtum' | 'hex';
    const data = context as {
      qtumAddress: string;
      qtumAddressSVG: string;
      hexAddress: string;
      hexAddressSVG: string;
      selected: 'qtum' | 'hex';
    };
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderReceive({ ...data, selected }), context: { ...data, selected } },
    });
    return;
  }

  if (event.name === 'back-to-dashboard') {
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderDashboard(await getCurrentNetworks(), await getCurrentWallet()) },
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
      await snap.request({
        method: 'snap_updateInterface',
        params: { id, ui: renderDashboard({ list, current }, await deriveFromInternalMnemonic({derivationPath})) },
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
      await snap.request({
        method: 'snap_updateInterface',
        params: { id, ui: renderDashboard(
          { list, current }, await deriveFromExternalMnemonic({
            mnemonic, passphrase, derivationPath
          }))
        },
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
      await snap.request({
        method: 'snap_updateInterface',
        params: { id, ui: renderDashboard({ list, current }, await importPrivateKey(privateKey)) },
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
