// eslint-disable-next-line import/no-unassigned-import
import './polyfill';
import type { TransactionRequest, TransactionResponse, } from '@ethersproject/abstract-provider';
import type { TypedDataDomain, TypedDataField, } from '@ethersproject/abstract-signer';
import type { Deferrable } from '@ethersproject/properties';
import { DialogType } from '@metamask/snaps-sdk';
import { Box, Copyable, Divider, Heading, Row, Text } from '@metamask/snaps-sdk/jsx';
import type { JsonRpcRequest } from '@metamask/utils';
import type { SnapRequestParams } from '@qtumproject/qtum-wallet-connector';
import { sleep, RPCMethods } from '@qtumproject/qtum-wallet-connector';
import { BigNumber, ethers } from 'ethers';
import { QtumWallet } from 'qtum-ethers-wrapper';

import { getProvider, getWallet } from '@/config';
import { DEFAULT_NETWORKS_RPC_URLS } from '@/consts';
import { StorageEnum } from '@/enums';
import {
  buildTxUi,
  genPkHexFromEntropy,
  readAddressAsContract,
  showWalletCreatedSnapDialog,
  snapDialog,
} from '@/helpers';
import { getQtumAddress } from '@/helpers/format';
import { snapStorage } from '@/rpc';
import { networks } from '@/storage';

export const onRpcRequest = async ({
  request,
}: {
  request: JsonRpcRequest;
  origin: string;
}) => {
  console.log('request', JSON.stringify(request));

  switch (request.method) {
    case RPCMethods.WalletCreateRandom: {
      const res = await snapDialog(
        DialogType.Confirmation,
        <Box
          children={[
            <Heading children="Create Wallet" />,
            <Divider />,
            <Text children="Do you want to create wallet?" />,
          ]}
        />,
      );

      if (!res) {
        throw new Error('User rejected request');
      }

      const wallet = QtumWallet.createRandom();

      const qtumAddress = await getQtumAddress(wallet.address);

      await showWalletCreatedSnapDialog(wallet.address, qtumAddress);

      await snapStorage.setItem(StorageEnum.Identity, {
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

      const res = await snapDialog(
        DialogType.Confirmation,
        <Box
          children={[
            <Heading children="Import Wallet" />,
            <Divider />,
            <Text children="Do you want to import wallet?" />,
          ]}
        />,
      );

      if (!res) {
        throw new Error('User rejected request');
      }

      const wallet = QtumWallet.fromPrivateKey(privateKey);

      const qtumAddress = await getQtumAddress(wallet.address);

      await showWalletCreatedSnapDialog(wallet.address, qtumAddress);

      await snapStorage.setItem(StorageEnum.Identity, {
        privateKey: wallet.privateKey,
      });

      return wallet.address;
    }

    case RPCMethods.WalletFromMnemonic: {
      const res = await snapDialog(
        DialogType.Confirmation,
        <Box
          children={[
            <Heading children="Create Wallet" />,
            <Divider />,
            <Text children="Do you want to create wallet?" />,
          ]}
        />,
      );

      if (!res) {
        throw new Error('User rejected request');
      }

      const wallet = QtumWallet.fromPrivateKey(await genPkHexFromEntropy());

      const qtumAddress = await getQtumAddress(wallet.address);

      await showWalletCreatedSnapDialog(wallet.address, qtumAddress);

      await snapStorage.setItem(StorageEnum.Identity, {
        privateKey: wallet.privateKey,
      });

      return wallet.address;
    }

    case RPCMethods.WalletExportPrivateKey: {
      const wallet = await getWallet();

      return await snapDialog(
        DialogType.Alert,
        <Box
          children={[
            <Heading children="Wallet private key" />,
            <Divider />,
            <Text children="Сopy:" />,
            <Copyable value={wallet.privateKey} sensitive={true} />,
          ]}
        />,
      );
    }

    case RPCMethods.WalletGetAddress: {
      return await getQtumAddress();
    }

    case RPCMethods.EthSubscribe: {
      return 'Not implemented';
    }

    case RPCMethods.EthUnsubscribe: {
      return 'Not implemented';
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
        return await snapDialog(
          DialogType.Alert,
          <Box
            children={[
              <Heading children="Network not found" />,
              <Divider />,

              <Text children="Network with this chainId not found" />,
            ]}
          />,
        );
      }

      if (isNetworkFromDefaults) {
        return await snapDialog(
          DialogType.Alert,
          <Box
            children={[
              <Heading children="Network cannot be removed" />,
              <Divider />,

              <Text children="Network with this chainId cannot be removed" />,
            ]}
          />,
        );
      }

      const res = await snapDialog(
        DialogType.Confirmation,
        <Box
          children={[
            <Heading children="Remove Network" />,
            <Divider />,

            <Row
              label="Network:"
              children={<Text children={isNetworkExists.chainName} />}
            />,
            <Row
              label="Chain ID:"
              children={<Text children={isNetworkExists.chainId} />}
            />,

            <Text children="Do you want to remove this network?" />,
          ]}
        />,
      );

      if (!res) {
        return null;
      }

      await networks.remove(chainIdToRemove);

      return await snapDialog(
        DialogType.Alert,
        <Box
          children={[
            <Heading children="Network Removed" />,
            <Row
              label={isNetworkExists.chainName}
              children={<Text children="" />}
            />,
          ]}
        />,
      );
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
        return await snapDialog(
          DialogType.Alert,
          <Box
            children={[
              <Heading children="Network already exists" />,
              <Divider />,

              <Text children="Network with this chainId already exists" />,
            ]}
          />,
        );
      }

      if (
        !(await snapDialog(
          DialogType.Confirmation,
          <Box
            children={[
              <Heading children="Add Network" />,
              <Divider />,

              <Text children={storedNetworks.current.chainName} />,
              <Row
                label="Chain ID:"
                children={<Text children={newChain.chainId} />}
              />,
              <Row
                label="Chain Name:"
                children={<Text children={newChain.chainName} />}
              />,
              <Row
                label="RPC URLs:"
                children={<Text children={newChain.rpcUrls.join(', ')} />}
              />,
              <Row
                label="Native Currency:"
                children={<Text children={newChain.nativeCurrency.symbol} />}
              />,
              <Row
                label="Block Explorer URLs:"
                children={
                  <Text children={newChain.blockExplorerUrls.join(', ')} />
                }
              />,

              <Text children="Do you want to add this network?" />,
            ]}
          />,
        ))
      ) {
        return null;
      }

      await networks.add(newChain);

      await snapDialog(
        DialogType.Alert,
        <Box
          children={[
            <Heading children="Network Added" />,
            <Row label={newChain.chainName} children={<Text children="" />} />,
          ]}
        />,
      );

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
      return 'Not implemented';
    }

    case RPCMethods.WalletRevokePermissions: {
      return 'Not implemented';
    }

    case RPCMethods.WalletGetPermissions: {
      return 'Not implemented';
    }

    case RPCMethods.WalletRegisterOnboarding: {
      return 'Not implemented';
    }

    case RPCMethods.WalletWatchAsset: {
      return 'Not implemented';
    }

    case RPCMethods.WalletScanQrCode: {
      return 'Not implemented';
    }

    case RPCMethods.WalletGetSnaps: {
      return 'Not implemented';
    }

    case RPCMethods.WalletRequestSnaps: {
      return 'Not implemented';
    }

    case RPCMethods.WalletSnap: {
      return 'Not implemented';
    }

    case RPCMethods.WalletInvokeSnap: {
      return 'Not implemented';
    }

    case RPCMethods.EthDecrypt: {
      return 'Not implemented';
    }

    case RPCMethods.EthGetEncryptionPublicKey: {
      return 'Not implemented';
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

      const res = await snapDialog(
        DialogType.Confirmation,
        <Box
          children={[
            <Heading children="EthSignTypedDataV4" />,
            <Divider />,

            <Text children="Do you want to sign?" />,
          ]}
        />,
      );

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

      const res = await snapDialog(
        DialogType.Confirmation,
        <Box
          children={[
            <Heading children="Personal Sign" />,
            <Divider />,

            <Text children="Do you want to sign the message?" />,
            <Text children={message} />,
          ]}
        />,
      );

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

        return tx.hash;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    case RPCMethods.Web3ClientVersion: {
      return 'Not implemented';
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
      return 'Not implemented';
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
      return 'Not implemented';
    }

    case RPCMethods.EthGetBalance: {
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
      return 'Not implemented';
    }

    case RPCMethods.EthGetBlockByNumber: {
      return 'Not implemented';
    }

    case RPCMethods.EthGetBlockReceipts: {
      return 'Not implemented';
    }

    case RPCMethods.EthGetBlockTransactionCountByHash: {
      return 'Not implemented';
    }

    case RPCMethods.EthGetBlockTransactionCountByNumber: {
      return 'Not implemented';
    }

    case RPCMethods.EthGetCode: {
      const [address] =
        request.params as SnapRequestParams[RPCMethods.EthGetCode];

      const { contractCode } = await readAddressAsContract(address);

      return contractCode;
    }

    case RPCMethods.EthGetFilterChanges: {
      return 'Not implemented';
    }

    case RPCMethods.EthGetFilterLogs: {
      return 'Not implemented';
    }

    case RPCMethods.EthGetLogs: {
      const [filter] =
        request.params as unknown as SnapRequestParams[RPCMethods.EthGetLogs];

      const provider = await getProvider();

      const logs = await provider.getLogs(filter);

      return logs;
    }

    case RPCMethods.EthGetProof: {
      return 'Not implemented';
    }

    case RPCMethods.EthGetStorageAt: {
      return 'Not implemented';
    }

    case RPCMethods.EthGetTransactionByBlockHashAndIndex: {
      return 'Not implemented';
    }

    case RPCMethods.EthGetTransactionByBlockNumberAndIndex: {
      return 'Not implemented';
    }

    case RPCMethods.EthGetTransactionByHash: {
      try {
        const [txHash] =
          request.params as SnapRequestParams[RPCMethods.EthGetTransactionByHash];

        const provider = await getProvider();

        const tx = await provider.getTransaction(txHash);

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
      return 'Not implemented';
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
      return 'Not implemented';
    }

    case RPCMethods.EthGetUncleCountByBlockNumber: {
      return 'Not implemented';
    }

    case RPCMethods.EthMaxPriorityFeePerGas: {
      return 'Not implemented';
    }

    case RPCMethods.EthNewBlockFilter: {
      return 'Not implemented';
    }

    case RPCMethods.EthNewFilter: {
      return 'Not implemented';
    }

    case RPCMethods.EthNewPendingTransactionFilter: {
      return 'Not implemented';
    }

    case RPCMethods.EthSendRawTransaction: {
      return 'Not implemented';
    }

    case RPCMethods.EthSyncing: {
      return 'Not implemented';
    }

    case RPCMethods.EthUninstallFilter: {
      return 'Not implemented';
    }

    default: {
      throw new Error('Method not supported');
    }
  }
};

export { onHomePage, onUserInput } from '@/helpers';
