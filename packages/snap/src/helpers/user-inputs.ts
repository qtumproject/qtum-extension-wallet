import { OnUserInputHandler } from "@metamask/snaps-sdk";

import { createWallet, renderImportPrivateKey } from "@/helpers";
import { clearWallet } from "@/config";
import { renderHome } from "@/helpers/ui/home";
import { importPrivateKey } from "@/helpers/wallet";


export const onUserInput: OnUserInputHandler = async ({ id, event }) => {

  const state: any = await snap.request({
    method: 'snap_getInterfaceState',
    params: { id },
  });

  if (event?.name === 'import-private-key') {
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderImportPrivateKey() },
    });
    return;
  }

  if (event?.name === 'create-wallet') {
    const { qtumAddress, hexAddress } = await createWallet();
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderHome({ hasWallet: true, qtumAddress, hexAddress }) },
    });
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
        params: { id, ui: renderHome({ hasWallet: true, qtumAddress, hexAddress }) },
      });
    } catch (e: any) {
      await snap.request({
        method: 'snap_updateInterface',
        params: { id, ui: renderImportPrivateKey('Something is wrong') },
      });
    }
    return;
  }

  if (event?.name === 'cancel-import') {
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderHome({ hasWallet: false }) },
    });
    return;
  }

  if (event?.name === 'logout') {
    await clearWallet();
    await snap.request({
      method: 'snap_updateInterface',
      params: { id, ui: renderHome({ hasWallet: false }) },
    });
    return;
  }
};
