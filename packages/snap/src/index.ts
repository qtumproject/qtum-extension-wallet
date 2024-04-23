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
  text,
} from '@metamask/snaps-sdk';
import type { JsonRpcRequest } from '@metamask/utils';
import type { SnapRequestParams } from '@qtumproject/wallet-snap-connector';
import { RPCMethods } from '@qtumproject/wallet-snap-connector';
import { BigNumber, ethers } from 'ethers';
import { QtumWallet } from 'qtum-ethers-wrapper';

import { getProvider, getWallet } from '@/config';
import { StorageKeys } from '@/enums';
import {
  buildTxUi,
  getSnapDialog,
  genPkHexFromEntropy,
  showWalletCreatedSnapDialog,
  readAddressAsContract,
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
  switch (request.method) {
    case RPCMethods.WalletCreateRandom: {
      console.log('RPCMethods.WalletCreateRandom');
      console.log('request.params', JSON.stringify(request.params));

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
      console.log('RPCMethods.WalletFromPrivateKey');
      console.log('request.params', JSON.stringify(request.params));

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
      console.log('RPCMethods.WalletFromMnemonic');
      console.log('request.params', JSON.stringify(request.params));

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
            copyable(wallet.privateKey),
          ]),
        },
      });
    }

    case RPCMethods.WalletGetAddress: {
      return await getQtumAddress();
    }

    case RPCMethods.EthSubscribe: {
      console.log('RPCMethods.EthSubscribe');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthUnsubscribe: {
      console.log('RPCMethods.EthUnsubscribe');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.WalletAddEthereumChain: {
      console.log('RPCMethods.WalletAddEthereumChain');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.WalletSwitchEthereumChain: {
      console.log('RPCMethods.WalletSwitchEthereumChain');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.WalletRequestPermissions: {
      console.log('RPCMethods.WalletRequestPermissions');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.WalletRevokePermissions: {
      console.log('RPCMethods.WalletRevokePermissions');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.WalletGetPermissions: {
      console.log('RPCMethods.WalletGetPermissions');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.WalletRegisterOnboarding: {
      console.log('RPCMethods.WalletRegisterOnboarding');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.WalletWatchAsset: {
      console.log('RPCMethods.WalletWatchAsset');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.WalletScanQrCode: {
      console.log('RPCMethods.WalletScanQrCode');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.WalletGetSnaps: {
      console.log('RPCMethods.WalletGetSnaps');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.WalletRequestSnaps: {
      console.log('RPCMethods.WalletRequestSnaps');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.WalletSnap: {
      console.log('RPCMethods.WalletSnap');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.WalletInvokeSnap: {
      console.log('RPCMethods.WalletInvokeSnap');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthDecrypt: {
      console.log('RPCMethods.EthDecrypt');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetEncryptionPublicKey: {
      console.log('RPCMethods.EthGetEncryptionPublicKey');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthRequestAccounts: {
      const wallet = await getWallet();

      return [wallet.address];
    }

    case RPCMethods.EthAccounts: {
      console.log('RPCMethods.EthAccounts');
      console.log('request.params', JSON.stringify(request.params));
      const wallet = await getWallet();

      return [wallet.address];
    }

    case RPCMethods.EthSignTypedDataV4: {
      console.log('RPCMethods.EthSignTypedDataV4');
      console.log('request.params', JSON.stringify(request.params));
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
      console.log('RPCMethods.PersonalSign');
      console.log('request.params', JSON.stringify(request.params));
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
      console.log('RPCMethods.EthSendTransaction');
      console.log('request.params', JSON.stringify(request.params));
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
      console.log('RPCMethods.Web3ClientVersion');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthBlockNumber: {
      console.log('RPCMethods.EthBlockNumber');
      console.log('request.params', JSON.stringify(request.params));

      const provider = getProvider();

      return provider.getBlockNumber();
    }

    case RPCMethods.EthCall: {
      console.log('RPCMethods.EthCall');
      console.log('request.params', JSON.stringify(request.params));
      const { params } = request;

      if (!params || !Array.isArray(params)) {
        throw new Error('Params not provided');
      }

      const wallet = await getWallet();

      return wallet.call(params[0] as Deferrable<TransactionRequest>);
    }

    case RPCMethods.EthChainId: {
      const provider = getProvider();

      const { chainId } = await provider.getNetwork();

      return chainId;
    }

    case RPCMethods.EthCoinbase: {
      console.log('RPCMethods.EthCoinbase');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthEstimateGas: {
      console.log('RPCMethods.EthEstimateGas');
      console.log('request.params', JSON.stringify(request.params));

      const [transaction] =
        request.params as SnapRequestParams[RPCMethods.EthEstimateGas];

      const provider = getProvider();

      const estimatedGas = await provider.estimateGas(transaction);

      return estimatedGas.toHexString();
    }

    case RPCMethods.EthFeeHistory: {
      console.log('RPCMethods.EthFeeHistory');
      console.log('request.params', JSON.stringify(request.params));

      const [...rest] =
        request.params as SnapRequestParams[RPCMethods.EthFeeHistory];

      const provider = getProvider();

      return provider.send('eth_feeHistory', [...rest]);
    }

    case RPCMethods.EthGasPrice: {
      console.log('RPCMethods.EthGasPrice');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetBalance: {
      console.log('RPCMethods.EthGetBalance');
      console.log('request.params', JSON.stringify(request.params));
      const [address, blockTag] = request.params as [
        string,
        string | undefined,
      ];

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
      console.log('RPCMethods.EthGetBlockByHash');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetBlockByNumber: {
      console.log('RPCMethods.EthGetBlockByNumber');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetBlockReceipts: {
      console.log('RPCMethods.EthGetBlockReceipts');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetBlockTransactionCountByHash: {
      console.log('RPCMethods.EthGetBlockTransactionCountByHash');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetBlockTransactionCountByNumber: {
      console.log('RPCMethods.EthGetBlockTransactionCountByNumber');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetCode: {
      console.log('RPCMethods.EthGetCode');
      console.log('request.params', JSON.stringify(request.params));
      const [address] =
        request.params as SnapRequestParams[RPCMethods.EthGetCode];

      const { contractCode } = await readAddressAsContract(address);

      return contractCode;
    }

    case RPCMethods.EthGetFilterChanges: {
      console.log('RPCMethods.EthGetFilterChanges');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetFilterLogs: {
      console.log('RPCMethods.EthGetFilterLogs');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetLogs: {
      console.log('RPCMethods.EthGetLogs');
      console.log('request.params', JSON.stringify(request.params));

      const [filter] =
        request.params as unknown as SnapRequestParams[RPCMethods.EthGetLogs];

      const provider = getProvider();

      const logs = await provider.getLogs(filter);

      console.log('logs', JSON.stringify(logs));

      return logs;
    }

    case RPCMethods.EthGetProof: {
      console.log('RPCMethods.EthGetProof');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetStorageAt: {
      console.log('RPCMethods.EthGetStorageAt');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetTransactionByBlockHashAndIndex: {
      console.log('RPCMethods.EthGetTransactionByBlockHashAndIndex');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetTransactionByBlockNumberAndIndex: {
      console.log('RPCMethods.EthGetTransactionByBlockNumberAndIndex');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetTransactionByHash: {
      try {
        console.log('RPCMethods.EthGetTransactionByHash');
        console.log('request.params', JSON.stringify(request.params));
        const [txHash] =
          request.params as SnapRequestParams[RPCMethods.EthGetTransactionByHash];

        const provider = getProvider();

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
      console.log('RPCMethods.EthGetTransactionCount');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetTransactionReceipt: {
      try {
        console.log('RPCMethods.EthGetTransactionReceipt');
        console.log('request.params', JSON.stringify(request.params));
        const [txHash] =
          request.params as SnapRequestParams[RPCMethods.EthGetTransactionReceipt];

        const provider = getProvider();

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
      console.log('RPCMethods.EthGetUncleCountByBlockHash');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthGetUncleCountByBlockNumber: {
      console.log('RPCMethods.EthGetUncleCountByBlockNumber');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthMaxPriorityFeePerGas: {
      console.log('RPCMethods.EthMaxPriorityFeePerGas');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthNewBlockFilter: {
      console.log('RPCMethods.EthNewBlockFilter');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthNewFilter: {
      console.log('RPCMethods.EthNewFilter');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthNewPendingTransactionFilter: {
      console.log('RPCMethods.EthNewPendingTransactionFilter');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthSendRawTransaction: {
      console.log('RPCMethods.EthSendRawTransaction');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthSyncing: {
      console.log('RPCMethods.EthSyncing');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    case RPCMethods.EthUninstallFilter: {
      console.log('RPCMethods.EthUninstallFilter');
      console.log('request.params', JSON.stringify(request.params));
      return origin;
    }

    default: {
      throw new Error('Method not supported');
    }
  }
};

export { onHomePage } from '@/helpers/ui';
