import type { OnHomePageHandler } from '@metamask/snaps-sdk';

import { getWallet } from '@/config';
import { getQtumAddress } from '@/helpers/format';
import { getTop5History } from '@/helpers/history';
import { getTokensWithBalance } from '@/helpers/qrc20';
import { renderDashboard, renderHome } from '@/helpers/ui';
import { getNetworks, getTokens } from '@/storage';
import type { ContextType } from '@/types';

export const onHomePage: OnHomePageHandler = async () => {
  const networks = await getNetworks();
  const context: ContextType = {
    networks,
    home: {
      keyType: 'private-key',
    },
    dashboard: null,
    addQRC20: null,
    send: null,
    receive: null,
    history: null,
  };

  try {
    const wallet = await getWallet();
    const tokens = await getTokens(networks.current.chainId);
    const hexadecimalAddress = wallet.address;
    const qtumAddress = await getQtumAddress(
      hexadecimalAddress,
      networks.current.chainId,
    );
    context.dashboard = {
      address: { qtum: qtumAddress, hexadecimal: hexadecimalAddress },
      native: {
        ...networks.current.nativeCurrency,
        balance: String(await wallet.getBalance()),
        chainId: networks.current.chainId,
      },
      tokens: await getTokensWithBalance(tokens, wallet),
      tokensPage: 1,
      histories: await getTop5History(qtumAddress, networks.current),
      keyType: 'private-key',
    };
    const id = await snap.request({
      method: 'snap_createInterface',
      params: {
        ui: renderDashboard(networks, context.dashboard, tokens),
        context,
      },
    });
    return { id };
  } catch {
    const id = await snap.request({
      method: 'snap_createInterface',
      params: { ui: renderHome(), context },
    });
    return { id };
  }
};
