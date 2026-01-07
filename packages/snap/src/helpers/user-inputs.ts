import { OnUserInputHandler, UserInputEventType } from '@metamask/snaps-sdk';
import type { ComponentOrElement, InterfaceContext } from '@metamask/snaps-sdk';
import { fromBase58Check } from '@qtumproject/qtum-wallet-connector';
import { QtumWallet } from 'qtum-ethers-wrapper';
import { ethers } from 'ethers';
import QRCode from 'qrcode';

import { clearWallet, getWallet } from '@/config';
import { HISTORY_PAGE_SIZE, QRC20_PAGE_SIZE } from '@/consts';
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
  renderRemoveWallet,
  renderHistory,
} from '@/helpers/ui';
import { getQtumAddress } from '@/helpers/format';
import { getNetwork, setAndGetNetworks } from '@/storage/networks';
import { sendNative, sendQRC20, estimateNative, estimateQRC20 } from '@/helpers/send';
import {
  createWallet,
  deriveFromExternalMnemonic,
  deriveFromInternalMnemonic,
  importPrivateKey
} from '@/helpers/wallet';
import { SendEnum } from '@/enums';
import {
  NetworksType,
  SendResponseType,
  ContextType,
  HistoriesType,
  HistoryType,
  KeyType,
} from '@/types';
import {
  addToken,
  deleteToken,
  getToken,
  getTokens,
  hasToken,
} from '@/storage';
import {
  getTokensWithBalance,
  getTokenWithBalance,
  isValidQRC20ByExplorer,
  searchQRC20,
} from '@/helpers/qrc20';
import {
  getNativeHistory,
  getQRC20History,
  getTop5History,
} from '@/helpers/history';
import {
  isValidPrivateKey,
  isValidQtumOrHexadecimalAddress,
  normalizeHexadecimalAddress,
  toBaseUnits,
  privateKeyToWIF,
  wifToPrivateKey,
  getChainIdFromWIF,
  isValidEncryptedWIF,
  encryptBIP38,
  decryptBIP38,
  isValidWIF,
} from '@/helpers/utils';

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
    context.dashboard.histories = null;
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
    context.dashboard.histories = await getTop5History(context.dashboard.address.qtum, networks.current);
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

  if (inputs.event.name === 'import-private-key' && context.home) {
    context.home.keyType = 'private-key';
    await updateInterface(renderImportPrivateKey('private-key'), context);
    return;
  }

  if (
    inputs.event.type === UserInputEventType.InputChangeEvent &&
    inputs.event.name === 'import-type' && context.home
  ) {
    context.home.keyType = inputs.event.value as KeyType;
    await updateInterface(renderImportPrivateKey(context.home.keyType), context);
    return;
  }

  if (inputs.event.name === 'export-private-key' && context.dashboard) {
    const wallet = await getWallet();
    const privateKey = wallet.privateKey.startsWith('0x')
      ? wallet.privateKey.substring(2)
      : wallet.privateKey;
    const wifKey = await privateKeyToWIF(
      privateKey,
      context.networks.current.chainId,
      true,
    );
    context.dashboard.keyType = 'private-key';
    await updateInterface(
      renderExportPrivateKey(context.dashboard.keyType, privateKey, wifKey),
      context,
    );
    return;
  }

  if (
    inputs.event.type === UserInputEventType.InputChangeEvent &&
    inputs.event.name === 'export-type' && context.dashboard
  ) {
    const wallet = await getWallet();
    const privateKey = wallet.privateKey.startsWith('0x')
      ? wallet.privateKey.substring(2)
      : wallet.privateKey;
    const wifKey = await privateKeyToWIF(
      privateKey,
      context.networks.current.chainId,
      true,
    );
    context.dashboard.keyType = inputs.event.value as KeyType;
    await updateInterface(
      renderExportPrivateKey(context.dashboard.keyType, privateKey, wifKey),
      context,
    );
    return;
  }

  if (inputs.event.name === 'encrypt-bip38' && context.dashboard) {
    const wallet = await getWallet();
    const privateKey = wallet.privateKey.startsWith('0x')
      ? wallet.privateKey.substring(2)
      : wallet.privateKey;
    const wif = await privateKeyToWIF(
      privateKey,
      context.networks.current.chainId,
      true,
    );
    const bip38Passphrase =
      (state?.['export-key-form']?.['export-bip38-passphrase'] as string) || '';
    await updateInterface(
      renderExportPrivateKey(
        context.dashboard.keyType,
        privateKey,
        wif,
        undefined,
        undefined,
        true,
      ),
      context,
    );
    const encryptedWIF = await encryptBIP38(wif, bip38Passphrase);
    await updateInterface(
      renderExportPrivateKey(
        context.dashboard.keyType,
        privateKey,
        wif,
        encryptedWIF,
      ),
      context,
    );
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

  if (
    inputs.event.name === 'send-action' &&
    context.dashboard?.tokens &&
    context.dashboard.address &&
    context.send
  ) {
    const contractAddress = state?.['send-form']?.['contract-address'];
    let sender = context.dashboard.address.qtum;
    let recipient = (state?.['send-form']?.['recipient'] as string)?.trim();
    const amount = state?.['send-form']?.['amount'];

    if (!recipient) {
      await updateInterface(
        renderSend(
          context.send,
          context.dashboard.tokens,
          false,
          contractAddress,
          { recipient: 'Recipient is required' },
        ),
        context,
      );
      return;
    } else if (!isValidQtumOrHexadecimalAddress(recipient)) {
      await updateInterface(
        renderSend(
          context.send,
          context.dashboard.tokens,
          false,
          contractAddress,
          {
            recipient: 'Invalid recipient address. Enter a Qtum address or 0x hexadecimal address.',
          },
        ),
        context,
      );
      return;
    } else if (!amount) {
      await updateInterface(
        renderSend(
          context.send,
          context.dashboard.tokens,
          false,
          contractAddress,
          { amount: 'Amount is required' },
        ),
        context,
      );
      return;
    } else if (
      (context.send.native?.balance &&
        toBaseUnits(amount, 18).gte(context.send.native.balance)) ||
      (context.send.token?.balance &&
        toBaseUnits(amount, context.send.token.decimals).gte(
          context.send.token.balance,
        ))
    ) {
      await updateInterface(
        renderSend(
          context.send,
          context.dashboard.tokens,
          false,
          contractAddress,
          {
            amount: `Insufficient balance`,
          },
        ),
        context,
      );
      return;
    }

    context.send.transaction = { sender, recipient, amount };

    if (context.send.type === SendEnum.Token) {
      context.send.token = await getToken(
        contractAddress,
        context.networks.current.chainId,
      );
      await updateInterface(
        renderSendTransaction(
          context.send.token.name,
          context.send.token.symbol,
          context.send.transaction.sender,
          context.send.transaction.recipient,
          context.send.transaction.amount,
          true,
          undefined,
          false,
          true,
          undefined,
          true,
        ),
        context,
      );

      const wallet = await getWallet();
      context.send.transaction.gas = await estimateQRC20(
        context.send.token.contractAddress,
        context.send.transaction.recipient,
        context.send.transaction.amount,
        context.send.token.decimals,
        wallet,
      );

      await updateInterface(
        renderSendTransaction(
          context.send.token.name,
          context.send.token.symbol,
          context.send.transaction.sender,
          context.send.transaction.recipient,
          context.send.transaction.amount,
          true,
          undefined,
          false,
          false,
          context.send.transaction.gas,
          false,
        ),
        context,
      );
    } else {
      await updateInterface(
        renderSendTransaction(
          context.networks.current.nativeCurrency.name,
          context.networks.current.nativeCurrency.symbol,
          context.send.transaction.sender,
          context.send.transaction.recipient,
          context.send.transaction.amount,
          false,
          undefined,
          false,
          true,
          undefined,
          true,
        ),
        context,
      );

      const wallet = await getWallet();
      const decimals = context.send.native?.decimals ?? 8;
      context.send.transaction.gas = await estimateNative(
        context.send.transaction.recipient,
        context.send.transaction.amount,
        decimals,
        wallet,
      );

      await updateInterface(
        renderSendTransaction(
          context.networks.current.nativeCurrency.name,
          context.networks.current.nativeCurrency.symbol,
          context.send.transaction.sender,
          context.send.transaction.recipient,
          context.send.transaction.amount,
          false,
          undefined,
          false,
          false,
          context.send.transaction.gas,
          false,
        ),
        context,
      );
      return;
    }
  }

  if (inputs.event.name === 'send-confirm' && context.send && context.send.transaction) {
    const wallet = await getWallet();
    if (context.send.type === SendEnum.Token && context.send.token) {
      await updateInterface(
        renderSendTransaction(
          context.send.token.name,
          context.send.token.symbol,
          context.send.transaction.sender,
          context.send.transaction.recipient,
          context.send.transaction.amount,
          true,
          undefined,
          false,
          true,
          context.send.transaction.gas,
          false,
        ),
        context,
      );
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
      await updateInterface(
        renderSendTransaction(
          context.send.token.name,
          context.send.token.symbol,
          context.send.transaction.sender,
          context.send.transaction.recipient,
          context.send.transaction.amount,
          true,
          response,
          true,
          false,
          context.send.transaction.gas,
          false,
        ),
        context,
      );
    } else if (context.send.type === SendEnum.Native && context.send.native) {
      await updateInterface(
        renderSendTransaction(
          context.networks.current.nativeCurrency.name,
          context.networks.current.nativeCurrency.symbol,
          context.send.transaction.sender,
          context.send.transaction.recipient,
          context.send.transaction.amount,
          false,
          undefined,
          false,
          true,
          context.send.transaction.gas,
          false,
        ),
        context,
      );
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
      await updateInterface(
        renderSendTransaction(
          context.networks.current.nativeCurrency.name,
          context.networks.current.nativeCurrency.symbol,
          context.send.transaction.sender,
          context.send.transaction.recipient,
          context.send.transaction.amount,
          false,
          response,
          true,
          false,
          context.send.transaction.gas,
          false,
        ),
        context,
      );
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
    const contractAddress = state?.['qrc20-form']?.['qrc20-contract-address'];
    if (!contractAddress) {
      await updateInterface(renderAddQRC20({ errorContractAddress: 'Contract address is required', }), context);
      return;
    } else if (!isValidQtumOrHexadecimalAddress(contractAddress)) {
      await updateInterface(renderAddQRC20({ errorContractAddress: 'Invalid token address' }), context);
      return;
    } else if (await hasToken(contractAddress, context.networks.current.chainId)) {
      await updateInterface(renderAddQRC20({ errorContractAddress: 'This token is already added' }), context);
      return;
    }
    await updateInterface(renderAddQRC20({ isSearching: true }), context);
    try {
      context.addQRC20.token = await searchQRC20(contractAddress, await getWallet());
      if (!(await isValidQRC20ByExplorer(
        normalizeHexadecimalAddress(contractAddress), context.networks.current
      ))) {
        await updateInterface(renderAddQRC20({ failedMessage: 'This token is not listed on the explorer' }), context);
        return;
      }
      await updateInterface(renderAddQRC20({ token: context.addQRC20.token }), context);
      return;
    } catch (error) {
      await updateInterface(renderAddQRC20({ failedMessage: error.message }), context);
      return;
    }
  }

  if (inputs.event.name === 'add-qrc20' && context.dashboard && context.addQRC20?.token) {
    context.dashboard.tokens = null;
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

  if (
    inputs.event.name === 'dashboard-refresh' &&
    context.dashboard &&
    context.dashboard.address
  ) {
    const tokens = await getTokens(context.networks.current.chainId);
    context.dashboard.native = null;
    context.dashboard.tokens = null;
    context.dashboard.histories = null;
    await updateInterface(
      renderDashboard(context.networks, context.dashboard, tokens),
      context,
    );
    const wallet = await getWallet();
    context.dashboard.native = {
      ...context.networks.current.nativeCurrency,
      balance: String(await wallet.getBalance()),
      chainId: context.networks.current.chainId,
    };
    await updateInterface(
      renderDashboard(context.networks, context.dashboard, tokens),
      context,
    );
    context.dashboard.tokens = await getTokensWithBalance(tokens, wallet);
    context.dashboard.tokensPage = 1;
    context.dashboard.histories = await getTop5History(
      context.dashboard.address.qtum,
      context.networks.current,
    );
    await updateInterface(
      renderDashboard(context.networks, context.dashboard),
      context,
    );
    return;
  }

  if (inputs.event.name === 'open-history' && context.networks?.current && context.dashboard?.address) {
    let history: HistoryType = {
      items: [],
      offset: 0,
      pageSize: HISTORY_PAGE_SIZE,
      hasMore: true,
      page: 1,
      totalCount: 0,
      filter: 'qtum',
      isValid: false,
    };
    await updateInterface(renderHistory(history, true), context);
    const histories: HistoriesType = await getNativeHistory(
      context.dashboard.address.qtum,
      context.networks.current,
      history.pageSize,
      history.offset
    );
    history.items = histories.items;
    history.hasMore = histories.totalCount > history.offset + history.pageSize;
    history.totalCount = histories.totalCount;
    history.isValid = histories.isValid;
    context.history = history;
    await updateInterface(renderHistory(history), context);
    return;
  }

  if (
    inputs.event.name === 'history-next' &&
    context.networks?.current &&
    context.dashboard?.address
  ) {
    let history = context.history as HistoryType;
    await updateInterface(renderHistory(history, true), context);
    const totalPages = Math.max(1, Math.ceil(
      Math.max(0, history.totalCount) / Math.max(1, history.pageSize),
    ));
    const nextPage = Math.min(history.page + 1, totalPages);
    const nextOffset = (nextPage - 1) * history.pageSize;
    if (history.filter === 'qtum') {
      const histories: HistoriesType = await getNativeHistory(
        context.dashboard.address.qtum,
        context.networks.current,
        history.pageSize,
        nextOffset
      );
      history.items = histories.items;
      history.hasMore = histories.totalCount > nextOffset + history.pageSize;
      history.totalCount = histories.totalCount;
      history.isValid = histories.isValid;
    } else {
      const histories: HistoriesType = await getQRC20History(
        context.dashboard.address.qtum,
        context.networks.current,
        history.pageSize,
        nextOffset,
      );
      history.items = histories.items;
      history.hasMore = histories.totalCount > nextOffset + history.pageSize;
      history.totalCount = histories.totalCount;
      history.isValid = histories.isValid;
    }
    history.offset = nextOffset;
    history.page = nextPage;
    context.history = history;
    await updateInterface(renderHistory(history), context);
    return;
  }

  if (
    inputs.event.name === 'history-previous' &&
    context.networks?.current &&
    context.dashboard?.address
  ) {
    let history = context.history as HistoryType;
    await updateInterface(renderHistory(history, true), context);
    const previousPage = Math.max(1, history.page - 1);
    const previousOffset = (previousPage - 1) * history.pageSize;
    if (history.filter === 'qtum') {
      const histories: HistoriesType = await getNativeHistory(
        context.dashboard.address.qtum,
        context.networks.current,
        history.pageSize,
        previousOffset,
      );
      history.items = histories.items;
      history.hasMore = histories.totalCount > previousOffset + history.pageSize;
      history.totalCount = histories.totalCount;
      history.isValid = histories.isValid;
    } else {
      const histories: HistoriesType = await getQRC20History(
        context.dashboard.address.qtum,
        context.networks.current,
        history.pageSize,
        previousOffset,
      );
      history.items = histories.items;
      history.hasMore = histories.totalCount > previousOffset + history.pageSize;
      history.totalCount = histories.totalCount;
      history.isValid = histories.isValid;
    }
    history.offset = previousOffset;
    history.page = previousPage;
    context.history = history;
    await updateInterface(renderHistory(history), context);
    return;
  }

  if (
    inputs.event.type === UserInputEventType.InputChangeEvent &&
    inputs.event.name === 'history-type' &&
    context.networks?.current &&
    context.dashboard?.address
  ) {
    let history: HistoryType = {
      items: [],
      offset: 0,
      pageSize: HISTORY_PAGE_SIZE,
      hasMore: true,
      page: 1,
      totalCount: 0,
      filter: inputs.event.value === 'qtum' ? 'qtum' : 'qrc20',
      isValid: false,
    };
    await updateInterface(renderHistory(history, true), context);
    if (history.filter === 'qtum') {
      const histories: HistoriesType = await getNativeHistory(
        context.dashboard.address.qtum,
        context.networks.current,
        history.pageSize,
        history.offset
      );
      history.items = histories.items;
      history.hasMore = histories.totalCount > history.pageSize;
      history.totalCount = histories.totalCount;
      history.isValid = histories.isValid;
    } else {
      const histories: HistoriesType = await getQRC20History(
        context.dashboard.address.qtum,
        context.networks.current,
        history.pageSize,
        history.offset
      );
      history.items = histories.items;
      history.hasMore = histories.totalCount > history.pageSize;
      history.totalCount = histories.totalCount;
      history.isValid = histories.isValid;
    }
    context.history = history;
    await updateInterface(renderHistory(history), context);
    return;
  }

  if (
    inputs.event.name === 'history-refresh' &&
    context.networks?.current &&
    context.dashboard?.address
  ) {
    let history = context.history as HistoryType;
    await updateInterface(renderHistory(history, true), context);
    if (history.filter === 'qtum') {
      const histories: HistoriesType = await getNativeHistory(
        context.dashboard.address.qtum,
        context.networks.current,
        history.pageSize,
        history.offset,
      );
      history.items = histories.items;
      history.hasMore = histories.totalCount > history.offset + history.pageSize;
      history.totalCount = histories.totalCount;
      history.isValid = histories.isValid;
    } else {
      const histories: HistoriesType = await getQRC20History(
        context.dashboard.address.qtum,
        context.networks.current,
        history.pageSize,
        history.offset,
      );
      history.items = histories.items;
      history.hasMore = histories.totalCount > history.offset + history.pageSize;
      history.totalCount = histories.totalCount;
      history.isValid = histories.isValid;
    }
    context.history = history;
    await updateInterface(renderHistory(history), context);
    return;
  }

  if (inputs.event.name === 'back-to-dashboard' && context.dashboard) {
    await updateInterface(renderDashboard(context.networks, context.dashboard), context);
    return;
  }

  async function login(networks: NetworksType, wallet: QtumWallet) {
    context.dashboard = { address: null, native: null, tokens: null, keyType: 'private-key' };
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
    context.dashboard.histories = await getTop5History(context.dashboard.address.qtum, networks.current);
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

  if (inputs.event.name === 'submit-import-private-key' && context.home) {

    const importKey = state?.['import-key-form']?.['import-key'] as string;
    const bip38Passphrase = state?.['import-key-form']?.['import-bip38-passphrase'] as string || '';

    if (!importKey) {
      await updateInterface(
        renderImportPrivateKey(
          context.home.keyType,
          `${
            context.home.keyType === 'encrypted-wif'
              ? 'Encrypted WIF'
              : context.home.keyType === 'wif'
              ? 'WIF'
              : 'Private key'
          } is required`,
        ),
        context,
      );
      return;
    }

    let privateKey: string;
    if (context.home.keyType === 'encrypted-wif') {
      try {
        if (!isValidEncryptedWIF(importKey)) {
          await updateInterface(
            renderImportPrivateKey(
              context.home.keyType,
              'Invalid encrypted WIF',
            ),
            context,
          );
          return;
        }
        await updateInterface(
          renderImportPrivateKey(
            context.home.keyType,
            undefined,
            undefined,
            true,
          ),
          context,
        );
        privateKey = await wifToPrivateKey(
          await decryptBIP38(
            importKey,
            bip38Passphrase,
            context.networks.current.chainId,
          ),
          context.networks.current.chainId,
        );
      } catch (error) {
        const isWrongPassphrase = (error as Error).message.startsWith('Wrong passphrase');
        await updateInterface(
          renderImportPrivateKey(
            context.home.keyType,
            isWrongPassphrase ? undefined : error.message,
            isWrongPassphrase ? error.message : undefined,
          ),
          context,
        );
        return;
      }
    } else if (context.home.keyType === 'wif') {
      if (!isValidWIF(importKey)) {
        await updateInterface(
          renderImportPrivateKey(
            context.home.keyType,
            'Invalid WIF',
          ),
          context,
        );
        return;
      }
      await updateInterface(
        renderImportPrivateKey(
          context.home.keyType,
          undefined,
          undefined,
          true,
        ),
        context,
      )
      const chainId = await getChainIdFromWIF(importKey);
      const nextNetwork = await getNetwork(String(chainId), context.networks);
      context.networks = await setAndGetNetworks(
        nextNetwork,
        context.networks,
      );
      privateKey = await wifToPrivateKey(importKey, chainId);
    } else {
      if (!isValidPrivateKey(importKey)) {
        await updateInterface(
          renderImportPrivateKey(
            context.home.keyType,
            'Invalid private key',
          ),
        );
        return;
      }
      await updateInterface(
        renderImportPrivateKey(
          context.home.keyType,
          undefined,
          undefined,
          true,
        ),
        context,
      );
      privateKey = importKey;
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

  if (inputs.event.name === 'remove-wallet') {
    await updateInterface(renderRemoveWallet(), context);
    return;
  }

  if (inputs.event.name === 'remove-wallet-confirm') {
    await clearWallet();
    await updateInterface(renderHome());
    return;
  }
};
