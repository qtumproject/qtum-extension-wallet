// eslint-disable-next-line import/no-unassigned-import
import './polyfill';
import type {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider';
import type {
  TypedDataDomain,
  TypedDataField,
} from '@ethersproject/abstract-signer';
import type { Deferrable } from '@ethersproject/properties';
import {
  copyable,
  DialogType,
  divider,
  heading,
  panel,
  row,
  text,
} from '@metamask/snaps-sdk';
import type { JsonRpcRequest } from '@metamask/utils';
import type { SnapRequestParams } from '@qtumproject/qtum-wallet-connector';
import { sleep, RPCMethods } from '@qtumproject/qtum-wallet-connector';
import { BigNumber, ethers } from 'ethers';
import { QtumWallet } from 'qtum-ethers-wrapper';

import { getProvider, getWallet } from '@/config';
import { DEFAULT_NETWORKS_RPC_URLS } from '@/consts';
import { StorageKeys } from '@/enums';
import {
  buildTxUi,
  genPkHexFromEntropy,
  getSnapDialog,
  networks,
  readAddressAsContract,
  showWalletCreatedSnapDialog,
} from '@/helpers';
import { getQtumAddress } from '@/helpers/format';
import { snapStorage } from '@/rpc';

export const onRpcRequest = async ({
  request,
  origin,
}: {
  request: JsonRpcRequest;
  origin: string;
}) => {
  console.log('\n\n');
  console.log('\n\n');
  console.log('request', JSON.stringify(request));
  console.log('\n\n');
  console.log('\n\n');

  switch (request.method) {
    case RPCMethods.WalletCreateRandom: {
      const res = await getSnapDialog(DialogType.Confirmation, [
        heading('Create Wallet'),
        divider(),

        text('Do you want to create wallet?'),
      ]);

      if (!res) {
        throw new Error('User rejected request');
      }

      const wallet = QtumWallet.createRandom();

      const qtumAddress = await getQtumAddress(wallet.address);

      await showWalletCreatedSnapDialog(wallet.address, qtumAddress);

      await snapStorage.setItem(StorageKeys.identity, {
        privateKey: wallet.privateKey,
      });

      return wallet.address;
    }

    case RPCMethods.WalletFromPrivateKey: {
      const [privateKey] =
        request.params as SnapRequestParams[RPCMethods.WalletFromPrivateKey];

      if (!privateKey) {
        throw new TypeError('Private key not provided');
      }

      const res = await getSnapDialog(DialogType.Confirmation, [
        heading('Import Wallet'),
        divider(),

        text('Do you want to import wallet?'),
      ]);

      if (!res) {
        throw new Error('User rejected request');
      }

      const wallet = QtumWallet.fromPrivateKey(privateKey);

      const qtumAddress = await getQtumAddress(wallet.address);

      await showWalletCreatedSnapDialog(wallet.address, qtumAddress);

      await snapStorage.setItem(StorageKeys.identity, {
        privateKey: wallet.privateKey,
      });

      return wallet.address;
    }

    case RPCMethods.WalletFromMnemonic: {
      const res = await getSnapDialog(DialogType.Confirmation, [
        heading('Create Wallet'),
        divider(),

        text('Do you want to create wallet?'),
      ]);

      if (!res) {
        throw new Error('User rejected request');
      }

      const wallet = QtumWallet.fromPrivateKey(await genPkHexFromEntropy());

      const qtumAddress = await getQtumAddress(wallet.address);

      await showWalletCreatedSnapDialog(wallet.address, qtumAddress);

      await snapStorage.setItem(StorageKeys.identity, {
        privateKey: wallet.privateKey,
      });

      return wallet.address;
    }

    case RPCMethods.WalletExportPrivateKey: {
      const wallet = await getWallet();

      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: panel([
            heading('Wallet private key'),
            divider(),
            text('Сopy:'),
            copyable({
              value: wallet.privateKey,
              sensitive: true,
            }),
          ]),
        },
      });
    }

    case RPCMethods.WalletGetAddress: {
      return await getQtumAddress();
    }

    case RPCMethods.EthSubscribe: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthUnsubscribe: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.WalletGetAllSupportedChains: {
      const { list } = await networks.get();

      return list;
    }

    case RPCMethods.WalletRemoveChain: {
      const [chainId] =
        request.params as SnapRequestParams[RPCMethods.WalletRemoveChain];

      const storedNetworks = await networks.get();

      const chainIdToRemove = ethers.utils.isHexString(chainId)
        ? ethers.BigNumber.from(chainId).toString()
        : chainId;

      const isNetworkExists = storedNetworks.list.find(
        (el) => el.chainId === chainIdToRemove,
      );

      const isNetworkFromDefaults = DEFAULT_NETWORKS_RPC_URLS.find(
        (el) => el.chainId === chainIdToRemove,
      );

      if (!isNetworkExists) {
        return await getSnapDialog(DialogType.Alert, [
          heading('Network not found'),
          divider(),

          text('Network with this chainId not found'),
        ]);
      }

      if (isNetworkFromDefaults) {
        return await getSnapDialog(DialogType.Alert, [
          heading('Network cannot be removed'),
          divider(),

          text('Network with this chainId cannot be removed'),
        ]);
      }

      const res = await getSnapDialog(DialogType.Confirmation, [
        heading('Remove Network'),
        divider(),

        row('Network:', text(isNetworkExists.chainName)),
        row('Chain ID:', text(isNetworkExists.chainId)),

        text('Do you want to remove this network?'),
      ]);

      if (!res) {
        return null;
      }

      await networks.remove(chainIdToRemove);

      return await getSnapDialog(DialogType.Alert, [
        heading('Network Removed'),
        row(isNetworkExists.chainName),
      ]);
    }

    case RPCMethods.WalletAddEthereumChain: {
      const [newChain] =
        request.params as SnapRequestParams[RPCMethods.WalletAddEthereumChain];

      const storedNetworks = await networks.get();

      const chainId = ethers.utils.isHexString(newChain.chainId)
        ? ethers.BigNumber.from(newChain.chainId).toString()
        : newChain.chainId;

      const isNetworkExists = storedNetworks.list.find(
        (el) => el.chainId === chainId,
      );

      if (isNetworkExists) {
        return await getSnapDialog(DialogType.Alert, [
          heading('Network already exists'),
          divider(),

          text('Network with this chainId already exists'),
        ]);
      }

      if (
        !(await getSnapDialog(DialogType.Confirmation, [
          heading('Add Network'),
          divider(),

          text(storedNetworks.current.chainName),
          row('Chain ID:', text(newChain.chainId)),
          row('Chain Name:', text(newChain.chainName)),
          row('RPC URLs:', text(newChain.rpcUrls.join(', '))),
          row('Native Currency:', text(newChain.nativeCurrency.symbol)),
          row(
            'Block Explorer URLs:',
            text(newChain.blockExplorerUrls.join(', ')),
          ),

          text('Do you want to add this network?'),
        ]))
      ) {
        return null;
      }

      await networks.add(newChain);

      await getSnapDialog(DialogType.Alert, [
        heading('Network Added'),
        row(newChain.chainName),
      ]);

      await sleep(300);

      return null;
    }

    case RPCMethods.WalletSwitchEthereumChain: {
      const params =
        request.params as SnapRequestParams[RPCMethods.WalletSwitchEthereumChain];

      const chainId = ethers.utils.isHexString(params[0])
        ? ethers.BigNumber.from(params[0]).toString()
        : params[0];

      try {
        await networks.setCurrent(chainId);
      } catch (error) {
        console.error(error);
      }

      return null;
    }

    case RPCMethods.WalletRequestPermissions: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.WalletRevokePermissions: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.WalletGetPermissions: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.WalletRegisterOnboarding: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.WalletWatchAsset: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.WalletScanQrCode: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.WalletGetSnaps: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.WalletRequestSnaps: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.WalletSnap: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.WalletInvokeSnap: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthDecrypt: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetEncryptionPublicKey: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthRequestAccounts: {
      const wallet = await getWallet();

      return [wallet.address];
    }

    case RPCMethods.EthAccounts: {
      const wallet = await getWallet();

      return [wallet.address];
    }

    case RPCMethods.EthSignTypedDataV4: {
      const wallet = await getWallet();

      const res = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('EthSignTypedDataV4'),
            divider(),

            text('Do you want to sign?'),
          ]),
        },
      });

      if (!res) {
        throw new Error('User rejected request');
      }

      const params = request.params as [
        string,
        {
          types: Record<string, TypedDataField[]>;
          domain: TypedDataDomain;
          message: Record<string, any>;
        },
      ];

      return await wallet._signTypedData(
        params[1].domain,
        params[1].types,
        params[1].message,
      );
    }

    case RPCMethods.PersonalSign: {
      const { params } = request;

      if (!params || !Array.isArray(params)) {
        throw new Error('Params not provided');
      }

      const wallet = await getWallet();

      const message = params[0] as string;

      console.log('message', message);

      const res = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('Personal Sign'),
            divider(),

            text('Do you want to sign the message?'),
            text(message),
          ]),
        },
      });

      if (!res) {
        throw new Error('User rejected request');
      }

      const signedMessage = await wallet.signMessage(message);

      return ethers.utils.hexlify(signedMessage);
    }

    case RPCMethods.EthSendTransaction: {
      try {
        const [transaction] =
          request.params as unknown as SnapRequestParams[RPCMethods.EthSendTransaction];

        const wallet = await getWallet();

        const res = await buildTxUi(transaction);

        if (!res) {
          throw new Error('User rejected request');
        }

        const tx = await wallet.sendTransaction(
          Object.entries(transaction).reduce<Deferrable<TransactionRequest>>(
            (acc, [key, value]) => {
              if (key === 'gas') {
                acc.gasLimit = value;

                return acc;
              }

              if (key === 'chainId') {
                return acc;
              }

              acc[key] = value;

              return acc;
            },
            {},
          ),
        );

        console.log('tx.hash', tx.hash);

        // TODO: remove due to metamask time-out restriction;
        await tx.wait();

        console.log('tx', JSON.stringify(tx));

        return tx.hash;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    case RPCMethods.Web3ClientVersion: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthBlockNumber: {
      const provider = await getProvider();

      return provider.getBlockNumber();
    }

    case RPCMethods.EthCall: {
      const { params } = request;

      if (!params || !Array.isArray(params)) {
        throw new Error('Params not provided');
      }

      const wallet = await getWallet();

      return wallet.call(params[0] as Deferrable<TransactionRequest>);
    }

    case RPCMethods.EthChainId: {
      const provider = await getProvider();

      const { chainId } = await provider.getNetwork();

      return chainId;
    }

    case RPCMethods.EthCoinbase: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthEstimateGas: {
      const [transaction] =
        request.params as SnapRequestParams[RPCMethods.EthEstimateGas];

      const provider = await getProvider();

      const estimatedGas = await provider.estimateGas(transaction);

      return estimatedGas.toHexString();
    }

    case RPCMethods.EthFeeHistory: {
      const [...rest] =
        request.params as SnapRequestParams[RPCMethods.EthFeeHistory];

      const provider = await getProvider();

      return provider.send('eth_feeHistory', [...rest]);
    }

    case RPCMethods.EthGasPrice: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetBalance: {
      // const [address, blockTag] = request.params as [
      //   string,
      //   string | undefined,
      // ];

      try {
        const wallet = await getWallet();

        const balance = await wallet.getBalance();

        return balance.toHexString();
      } catch (error) {
        console.log(JSON.stringify(error));
      }

      return '';
    }

    case RPCMethods.EthGetBlockByHash: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetBlockByNumber: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetBlockReceipts: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetBlockTransactionCountByHash: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetBlockTransactionCountByNumber: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetCode: {
      const [address] =
        request.params as SnapRequestParams[RPCMethods.EthGetCode];

      const { contractCode } = await readAddressAsContract(address);

      return contractCode;
    }

    case RPCMethods.EthGetFilterChanges: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetFilterLogs: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetLogs: {
      const [filter] =
        request.params as unknown as SnapRequestParams[RPCMethods.EthGetLogs];

      const provider = await getProvider();

      const logs = await provider.getLogs(filter);

      console.log('logs', JSON.stringify(logs));

      return logs;
    }

    case RPCMethods.EthGetProof: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetStorageAt: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetTransactionByBlockHashAndIndex: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetTransactionByBlockNumberAndIndex: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetTransactionByHash: {
      try {
        const [txHash] =
          request.params as SnapRequestParams[RPCMethods.EthGetTransactionByHash];

        const provider = await getProvider();

        const tx = await provider.getTransaction(txHash);

        console.log('tx', tx);

        return Object.entries(tx).reduce<TransactionResponse>(
          (acc, [key, value]) => {
            if (BigNumber.isBigNumber(value)) {
              acc[key] = value.toHexString();

              return acc;
            } else if (typeof value === 'function') {
              return acc;
            }

            acc[key] = value;

            return acc;
          },
          {},
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    case RPCMethods.EthGetTransactionCount: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetTransactionReceipt: {
      try {
        const [txHash] =
          request.params as SnapRequestParams[RPCMethods.EthGetTransactionReceipt];

        const provider = await getProvider();

        const txReceipt = await provider.getTransactionReceipt(txHash);

        return Object.entries(txReceipt).reduce<TransactionResponse>(
          (acc, [key, value]) => {
            if (BigNumber.isBigNumber(value)) {
              acc[key] = value.toHexString();

              return acc;
            } else if (typeof value === 'function') {
              return acc;
            }

            acc[key] = value;

            return acc;
          },
          {},
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    case RPCMethods.EthGetUncleCountByBlockHash: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthGetUncleCountByBlockNumber: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthMaxPriorityFeePerGas: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthNewBlockFilter: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthNewFilter: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthNewPendingTransactionFilter: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthSendRawTransaction: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthSyncing: {
      // TODO: implement once necessary
      return origin;
    }

    case RPCMethods.EthUninstallFilter: {
      // TODO: implement once necessary
      return origin;
    }

    default: {
      throw new Error('Method not supported');
    }
  }
};

export { onHomePage } from '@/helpers/ui';
