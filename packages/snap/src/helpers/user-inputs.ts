import { OnUserInputHandler, UserInputEventType } from '@metamask/snaps-sdk';
import type { ComponentOrElement, InterfaceContext } from '@metamask/snaps-sdk';
import { fromBase58Check } from '@qtumproject/qtum-wallet-connector';
import { QtumWallet } from 'qtum-ethers-wrapper';
import { ethers } from 'ethers';
import QRCode from 'qrcode';

import { clearWallet, getWallet } from '@/config';
import { QRC20_PAGE_SIZE } from '@/consts';
import {
  renderHome,
  renderDashboard,
  renderDriveInternalMnemonic,
  renderDriveExternalMnemonic,
  renderImportPrivateKey,
  errorSnapDialog,
  renderReceive,
  renderSend,
  renderSendTransaction,
  renderAddQRC20,
  renderExportPrivateKey,
  renderLogout,
} from '@/helpers/ui';
import { getQtumAddress } from '@/helpers/format';
import { getNetwork, setAndGetNetworks } from '@/storage/networks';
import { sendNative, sendQRC20 } from "@/helpers/send";
import {
  createWallet,
  deriveFromExternalMnemonic,
  deriveFromInternalMnemonic,
  importPrivateKey
} from '@/helpers/wallet';
import { SendEnum } from '@/enums';
import { NetworksType, SendResponseType, ContextType } from '@/types';
import { addToken, deleteToken, getToken, getTokens } from '@/storage';
import { getTokensWithBalance, getTokenWithBalance, searchQRC20 } from '@/helpers/qrc20';

export const onUserInput: OnUserInputHandler = async (inputs) => {

  let context = inputs.context as ContextType;
  const state: Record<string, any> = await snap.request({ method: 'snap_getInterfaceState', params: { id: inputs.id } });

  async function updateInterface (ui: ComponentOrElement, context?: InterfaceContext) {
    await snap.request({ method: 'snap_updateInterface', params: { id: inputs.id, ui, context } });
  }

  if (
    inputs.event.type === UserInputEventType.InputChangeEvent &&
    inputs.event.name === 'networks' && context.dashboard
  ) {
    context.dashboard.native = null;
    context.dashboard.tokens = null;
    const network = await getNetwork(inputs.event.value as string);
    const tokens = await getTokens(network.chainId);
    await updateInterface(renderDashboard(context.networks, context.dashboard, tokens, network.chainId), context);
    const networks = await setAndGetNetworks(network, context.networks);
    const wallet = await getWallet();
    context.networks = networks;
    context.dashboard.address = {
      qtum: await getQtumAddress(wallet.address, network.chainId),
      hexadecimal: wallet.address
    };
    context.dashboard.native = {
      ...networks.current.nativeCurrency,
      balance: String(await wallet.getBalance()),
      chainId: networks.current.chainId
    };
    await updateInterface(renderDashboard(context.networks, context.dashboard, tokens), context);
    context.dashboard.tokens = await getTokensWithBalance(tokens, wallet);
    context.dashboard.tokensPage = 1;
    await updateInterface(renderDashboard(context.networks, context.dashboard), context);
    return;
  }

  if (inputs.event.name === 'drive-internal-mnemonic') {
    await updateInterface(renderDriveInternalMnemonic(), context);
    return;
  }

  if (inputs.event.name === 'drive-external-mnemonic') {
    await updateInterface(renderDriveExternalMnemonic(), context);
    return;
  }

  if (inputs.event.name === 'import-private-key') {
    await updateInterface(renderImportPrivateKey(), context);
    return;
  }

  if (inputs.event.name === 'export-private-key') {
    const wallet = await getWallet();
    const privateKey = wallet.privateKey.startsWith('0x') ? wallet.privateKey.substring(2) : wallet.privateKey;
    await updateInterface(renderExportPrivateKey(privateKey), context);
    return;
  }

  if (context.dashboard?.tokens && (
    inputs.event.name === 'send-native' ||
    inputs.event.name?.startsWith('send-qrc20')
  )) {
    const wallet = await getWallet();
    if (inputs.event.name === 'send-native') {
      context.send = { type: SendEnum.Native, native: null, token: null, transaction: null };
      await updateInterface(renderSend(context.send, context.dashboard.tokens, true), context);
      const balance = String(await wallet.getBalance());
      context.send.native = {
        ...context.networks.current.nativeCurrency, balance, chainId: context.networks.current.chainId
      };
      await updateInterface(renderSend(context.send, context.dashboard.tokens, false), context);
    } else {
      const contractAddress = inputs.event.name.replace('send-qrc20-', '');
      context.send = { type: SendEnum.Token, native: null, token: null, transaction: null };
      await updateInterface(renderSend(context.send, context.dashboard.tokens, true, contractAddress), context);
      const token = await getToken(contractAddress, context.networks.current.chainId);
      context.send.token = await getTokenWithBalance(token, wallet);
      await updateInterface(renderSend(context.send, context.dashboard.tokens, false, contractAddress), context);
    }
    return;
  }

  if (
    inputs.event.type === UserInputEventType.InputChangeEvent &&
    inputs.event.name === 'isQRC20' &&
    context.dashboard?.tokens &&
    context.send
  ) {
    context.send.type = Boolean(inputs.event.value) ? SendEnum.Token : SendEnum.Native;
    let contractAddress = context.dashboard.tokens?.[0].contractAddress;
    await updateInterface(renderSend(context.send, context.dashboard.tokens, true, contractAddress), context);
    const wallet = await getWallet();
    if (context.send.type === SendEnum.Token) {
      context.send.native = null;
      const token = await getToken(contractAddress, context.networks.current.chainId);
      context.send.token = await getTokenWithBalance(token, wallet);
    } else {
      const balance = String(await wallet.getBalance());
      context.send.native = {
        ...context.networks.current.nativeCurrency, balance: balance, chainId: context.networks.current.chainId
      };
      context.send.token = null;
    }
    await updateInterface(renderSend(context.send, context.dashboard.tokens, false), context);
    return;
  }

  if (
    inputs.event.type === UserInputEventType.InputChangeEvent &&
    inputs.event.name === 'contract-address' &&
    context.dashboard?.tokens &&
    context.send
  ) {
    const contractAddress = inputs.event.value as string;
    await updateInterface(renderSend(context.send, context.dashboard.tokens, true, contractAddress), context);
    const wallet = await getWallet();
    context.send.native = null;
    const token = await getToken(contractAddress, context.networks.current.chainId);
    context.send.token = await getTokenWithBalance(token, wallet);
    await updateInterface(renderSend(context.send, context.dashboard.tokens, false), context);
    return;
  }

  if (inputs.event.name === 'send-action' && context.dashboard?.tokens && context.send) {

    const contractAddress = state?.['send-form']?.['contract-address'];
    let recipient = state?.['send-form']?.['recipient'];
    const amount = state?.['send-form']?.['amount'];

    if (!recipient) {
      await updateInterface(renderSend(
        context.send, context.dashboard.tokens, false, contractAddress, { recipient: 'Recipient is required' }
      ), context);
      return;
    } else if (!amount) {
      await updateInterface(renderSend(
        context.send, context.dashboard.tokens, false, contractAddress, { amount: 'Amount is required' }
      ), context);
      return;
    }

    context.send.transaction = { recipient, amount };

    if (context.send.type === SendEnum.Token) {
      context.send.token = await getToken(contractAddress, context.networks.current.chainId);
      await updateInterface(renderSendTransaction(
        context.send.token.name, context.send.token.symbol, context.send.transaction.recipient, context.send.transaction.amount
      ), context);
    } else {
      await updateInterface(renderSendTransaction(
        context.networks.current.nativeCurrency.name,
        context.networks.current.nativeCurrency.symbol,
        context.send.transaction.recipient,
        context.send.transaction.amount
      ), context);
      return;
    }
  }

  if (inputs.event.name === 'send-confirm' && context.send && context.send.transaction) {
    const wallet = await getWallet();
    if (context.send.type === SendEnum.Token && context.send.token) {
      await updateInterface(renderSendTransaction(
        context.send.token.name, context.send.token.symbol, context.send.transaction.recipient, context.send.transaction.amount, undefined, false, true
      ), context);
      const response = await sendQRC20(
        context.send.token.contractAddress,
        (
          ethers.utils.isAddress(context.send.transaction.recipient) ?
            context.send.transaction.recipient :
            fromBase58Check(context.send.transaction.recipient)
        ),
        context.send.transaction.amount,
        context.send.token.decimals,
        wallet,
        context.networks.current
      );
      await updateInterface(renderSendTransaction(
        context.send.token.name, context.send.token.symbol, context.send.transaction.recipient, context.send.transaction.amount, response, true
      ), context);
    } else if (context.send.type === SendEnum.Native && context.send.native) {
      await updateInterface(renderSendTransaction(
        context.networks.current.nativeCurrency.name,
        context.networks.current.nativeCurrency.symbol,
        context.send.transaction.recipient,
        context.send.transaction.amount,
        undefined,
        false,
        true
      ), context);
      const response: SendResponseType = await sendNative(
        (
          ethers.utils.isAddress(context.send.transaction.recipient) ?
            context.send.transaction.recipient :
            fromBase58Check(context.send.transaction.recipient)
        ),
        context.send.transaction.amount,
        context.send.native.decimals,
        wallet,
        context.networks.current
      );
      await updateInterface(renderSendTransaction(
        context.networks.current.nativeCurrency.name,
        context.networks.current.nativeCurrency.symbol,
        context.send.transaction.recipient,
        context.send.transaction.amount,
        response,
        true
      ), context);
      return;
    }
  }

  if (inputs.event.name === 'send-cancel' && context.dashboard?.tokens && context.send && context.send.transaction) {
    await updateInterface(renderSend(context.send, context.dashboard.tokens, true, (
      context.send.token ? context.send.token.contractAddress : undefined
    )), context);
    const wallet = await getWallet();
    if (context.send.type === SendEnum.Token && context.send.token) {
      context.send.token = await getTokenWithBalance(context.send.token, wallet);
    } else if (context.send.type === SendEnum.Native && context.send.native) {
      context.send.native.balance = String(await wallet.getBalance());
    }
    await updateInterface(renderSend(context.send, context.dashboard.tokens, false), context);
    return;
  }

  if (inputs.event.name === 'receive-page' && context.dashboard?.address) {
    context.receive = {
      type: 'qtum',
      address: {
        qtum: context.dashboard.address.qtum,
        hexadecimal: context.dashboard.address.hexadecimal
      },
      qrCodes: {
        qtum: await QRCode.toString(
          context.dashboard.address.qtum,
          { type: 'svg', margin: 1, width: 150 }
        ),
        hexadecimal: await QRCode.toString(
          context.dashboard.address.hexadecimal,
          { type: 'svg', margin: 1, width: 150 }
        )
      }
    };
    await updateInterface(renderReceive(context.receive), context);
    return;
  }

  if (
    inputs.event.type === UserInputEventType.InputChangeEvent &&
    inputs.event.name === 'receive-type' && context.receive
  ) {
    context.receive.type = inputs.event.value as 'qtum' | 'hexadecimal';
    await updateInterface(renderReceive(context.receive), context);
    return;
  }

  if (inputs.event.name === 'qrc20') {
    context.addQRC20 = { token: null };
    await updateInterface(renderAddQRC20(), context);
    return;
  }

  if (inputs.event.name === 'search-qrc20' && context.addQRC20) {
    await updateInterface(renderAddQRC20(undefined, undefined, true), context);
    const contractAddress = state?.['qrc20-form']?.['qrc20-contract-address'];
    if (!contractAddress) {
      await updateInterface(renderAddQRC20(undefined, 'Contract address is required'), context);
      return;
    }
    try {
      context.addQRC20.token = await searchQRC20(contractAddress, await getWallet());
      await updateInterface(renderAddQRC20(context.addQRC20.token), context);
      return;
    } catch (error) {
      await updateInterface(renderAddQRC20(undefined, error.message), context);
      return;
    }
  }

  if (inputs.event.name === 'add-qrc20' && context.dashboard && context.addQRC20) {
    context.dashboard.tokens = null;
    // @ts-ignore
    await addToken(context.networks.current.chainId, context.addQRC20.token);
    const tokens = await getTokens(context.networks.current.chainId);
    await updateInterface(renderDashboard(context.networks, context.dashboard, tokens), context);
    context.dashboard.tokens = await getTokensWithBalance(tokens, await getWallet());
    context.dashboard.tokensPage = 1;
    await updateInterface(renderDashboard(context.networks, context.dashboard), context);
    return;
  }

  if (inputs.event.name === 'qrc20-previous' && context.dashboard) {
    context.dashboard.tokensPage = Math.min(context.dashboard.tokensPage ?? 1 - 1, 1);
    await updateInterface(renderDashboard(context.networks, context.dashboard), context);
    return;
  }

  if (inputs.event.name === 'qrc20-next' && context.dashboard) {
    const totalPages = Math.max(1, Math.ceil((context.dashboard.tokens ?? []).length / QRC20_PAGE_SIZE));
    context.dashboard.tokensPage = Math.min((context.dashboard.tokensPage ?? 0) + 1, totalPages);
    await updateInterface(renderDashboard(context.networks, context.dashboard), context);
    return;
  }

  if (inputs.event.name?.startsWith('delete-qrc20') && context.dashboard) {
    const contractAddress = inputs.event.name.replace('delete-qrc20-', '');
    const tokens = await deleteToken(contractAddress, context.networks.current.chainId);
    context.dashboard.tokens = await getTokensWithBalance(tokens, await getWallet());
    context.dashboard.tokensPage = 1;
    await updateInterface(renderDashboard(context.networks, context.dashboard), context);
  }

  if (inputs.event.name === 'refresh' && context.dashboard) {
    const tokens = await getTokens(context.networks.current.chainId);
    context.dashboard.native = null;
    context.dashboard.tokens = null;
    await updateInterface(renderDashboard(context.networks, context.dashboard, tokens), context);
    const wallet = await getWallet();
    context.dashboard.native = {
      ...context.networks.current.nativeCurrency,
      balance: String(await wallet.getBalance()),
      chainId: context.networks.current.chainId
    };
    await updateInterface(renderDashboard(context.networks, context.dashboard, tokens), context);
    context.dashboard.tokens = await getTokensWithBalance(tokens, wallet);
    context.dashboard.tokensPage = 1;
    await updateInterface(renderDashboard(context.networks, context.dashboard), context);
    return;
  }

  if (inputs.event.name === 'back-to-dashboard' && context.dashboard) {
    await updateInterface(renderDashboard(context.networks, context.dashboard), context);
    return;
  }

  async function login(networks: NetworksType, wallet: QtumWallet) {
    context.dashboard = { address: null, native: null, tokens: null };
    const tokens = await getTokens(networks.current.chainId);
    await updateInterface(renderDashboard(context.networks, context.dashboard, tokens), context);
    context.dashboard.address = {
      qtum: await getQtumAddress(wallet.address, networks.current.chainId),
      hexadecimal: wallet.address
    };
    context.dashboard.native = {
      ...context.networks.current.nativeCurrency,
      balance: String(await wallet.getBalance()),
      chainId: networks.current.chainId
    };
    await updateInterface(renderDashboard(context.networks, context.dashboard, tokens), context);
    context.dashboard.tokens = await getTokensWithBalance(tokens, wallet);
    context.dashboard.tokensPage = 1;
    await updateInterface(renderDashboard(context.networks, context.dashboard), context);
  }

  if (inputs.event.name === 'create-wallet') {
    try {
      const { networks, wallet } = await createWallet();
      await login(networks, wallet);
    } catch (_) {
      await errorSnapDialog({ message: 'Something went wrong' });
    }
    return;
  }

  if (inputs.event.name === 'submit-drive-internal-mnemonic') {

    const derivationPath = state?.['drive-internal-mnemonic-form']?.['derivation-path'];

    if (!derivationPath) {
      await updateInterface(renderDriveInternalMnemonic('Derivation path is required'));
      return;
    }

    try {
      const { networks, wallet } = await deriveFromInternalMnemonic({ derivationPath });
      await login(networks, wallet);
      return;
    } catch (_) {
      await errorSnapDialog({ message: 'Something went wrong' });
    }
    return;
  }

  if (inputs.event.name === 'submit-drive-external-mnemonic') {

    const mnemonic = state?.['drive-external-mnemonic-form']?.['mnemonic'];
    const passphrase = state?.['drive-external-mnemonic-form']?.['passphrase'];
    const derivationPath = state?.['drive-external-mnemonic-form']?.['derivation-path'];

    if (!mnemonic) {
      await updateInterface(renderDriveExternalMnemonic('Mnemonic is required', undefined));
      return;
    } else if (!derivationPath) {
      await updateInterface(renderDriveExternalMnemonic(undefined, 'Derivation path is required'));
      return;
    }

    try {
      const { networks, wallet } = await deriveFromExternalMnemonic({
        mnemonic, passphrase, derivationPath
      })
      await login(networks, wallet);
    } catch (_) {
      await errorSnapDialog({ message: 'Something went wrong' });
    }
    return;
  }

  if (inputs.event.name === 'submit-import-private-key') {

    const isHex64 = (s: string) => /^(0x)?[0-9a-fA-F]{64}$/.test(s.trim());
    const strip0x = (s: string) => (s.startsWith('0x') ? s.slice(2) : s);

    const privateKey = strip0x(state?.['import-private-key-form']?.['private-key']);

    if (!privateKey) {
      await updateInterface(renderImportPrivateKey('Private key is required'));
    } else if (!isHex64(privateKey)) {
      await updateInterface(renderImportPrivateKey('Invalid private key'));
      return;
    }

    try {
      const { networks, wallet } = await importPrivateKey(privateKey);
      await login(networks, wallet);
    } catch (_) {
      await errorSnapDialog({ message: 'Something went wrong' });
    }
    return;
  }

  if (inputs.event.name === 'cancel-wallet') {
    await updateInterface(renderHome());
    return;
  }

  if (inputs.event.name === 'logout') {
    await updateInterface(renderLogout(), context);
    return;
  }

  if (inputs.event.name === 'logout-confirm') {
    await clearWallet();
    await updateInterface(renderHome());
    return;
  }
};
