import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type {
  TypedDataDomain,
  TypedDataField,
} from '@ethersproject/abstract-signer';
import type { Deferrable } from '@ethersproject/properties';
import { DialogType } from '@metamask/snaps-sdk';
import {
  Box,
  Divider,
  Heading,
  Row,
  Text,
  Bold,
} from '@metamask/snaps-sdk/jsx';
import type { JsonRpcRequest } from '@metamask/utils';
import { BigNumber, ethers } from 'ethers';
import type { SnapRequestParams } from 'qtum-snap-connector';
import { sleep, RPCMethods, fromBase58Check } from 'qtum-snap-connector';

import { getProvider, getWallet } from '@/config';
import { DEFAULT_NETWORKS_RPC_URLS } from '@/consts';
import {
  buildTxUi,
  readAddressAsContract,
  snapDialog,
  isValidQtumOrHexadecimalAddress,
  serialize,
} from '@/helpers';
import { getQtumAddress } from '@/helpers/format';
import { networks } from '@/storage';

export const onRpcRequest = async ({
  origin,
  request,
}: {
  request: JsonRpcRequest;
  origin: string;
}) => {
  switch (request.method) {
    case RPCMethods.WalletCreateRandom: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletFromPrivateKey: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletFromMnemonic: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletExportPrivateKey: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletGetAddress: {
      return await getQtumAddress();
    }

    case RPCMethods.EthSubscribe: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthUnsubscribe: {
      throw new Error('Method not implemented');
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
            <Row label="Origin" children={<Text>{origin}</Text>} />,
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

      if (!newChain.rpcUrls.every((url) => url.startsWith('https://'))) {
        return await snapDialog(
          DialogType.Alert,
          <Box
            children={[
              <Heading children="Invalid RPC URL" />,
              <Divider />,
              <Text children="All RPC URLs must use the https:// protocol." />,
            ]}
          />,
        );
      }

      const chainId = ethers.utils.isHexString(newChain.chainId)
        ? ethers.BigNumber.from(newChain.chainId).toString()
        : newChain.chainId;

      for (const rpcUrl of newChain.rpcUrls) {
        try {
          const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
          const remoteChainId = await provider.send('eth_chainId', []);
          if (BigNumber.from(remoteChainId).toString() !== chainId) {
            return await snapDialog(
              DialogType.Alert,
              <Box
                children={[
                  <Heading children="Chain ID Mismatch" />,
                  <Divider />,
                  <Text
                    children={[
                      'The RPC URL ',
                      <Bold children={rpcUrl} />,
                      ' returned a chain ID of ',
                      <Bold
                        children={BigNumber.from(remoteChainId).toString()}
                      />,
                      ', but the expected chain ID is ',
                      <Bold children={chainId} />,
                      '.',
                    ]}
                  />,
                ]}
              />,
            );
          }
        } catch {
          return await snapDialog(
            DialogType.Alert,
            <Box
              children={[
                <Heading children="Invalid RPC URL" />,
                <Divider />,
                <Text
                  children={[
                    'The RPC URL ',
                    <Bold children={rpcUrl} />,
                    ' is not a valid RPC endpoint.',
                  ]}
                />,
              ]}
            />,
          );
        }
      }

      const storedNetworks = await networks.get();

      if (!['81', '8889'].includes(chainId)) {
        return await snapDialog(
          DialogType.Alert,
          <Box
            children={[
              <Heading children="Unsupported Chain ID" />,
              <Divider />,
              <Text
                children={[
                  'Only Chain ID ',
                  <Bold children="81" />,
                  ' and ',
                  <Bold children="8889" />,
                  ' are supported.',
                ]}
              />,
            ]}
          />,
        );
      }

      const isNetworkExists = storedNetworks.list.find((el) =>
        el.rpcUrls.some((url) => newChain.rpcUrls.includes(url)),
      );

      if (isNetworkExists) {
        return await snapDialog(
          DialogType.Alert,
          <Box
            children={[
              <Heading children="Network already exists" />,
              <Divider />,

              <Text children="A network with one of the provided RPC URLs already exists." />,
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
              <Row label="Origin" children={<Text>{origin}</Text>} />,
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

      await networks.setCurrent(chainId);
      return null;
    }

    case RPCMethods.WalletRequestPermissions: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletRevokePermissions: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletGetPermissions: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletRegisterOnboarding: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletWatchAsset: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletScanQrCode: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletGetSnaps: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletRequestSnaps: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletSnap: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.WalletInvokeSnap: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthDecrypt: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetEncryptionPublicKey: {
      throw new Error('Method not implemented');
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

      const params = request.params as [
        string,
        {
          types: Record<string, TypedDataField[]>;
          domain: TypedDataDomain;
          message: Record<string, any>;
        },
      ];

      const { domain, message } = params[1];

      const res = await snapDialog(
        DialogType.Confirmation,
        <Box
          children={[
            <Heading children="EthSignTypedDataV4" />,
            <Divider />,
            <Row label="Origin" children={<Text>{origin}</Text>} />,
            <Text children="Do you want to sign?" />,
            <Row label="Domain" children={<Text>{domain?.name ?? ''}</Text>} />,
            <Row
              label="Contract"
              children={<Text>{domain?.verifyingContract ?? ''}</Text>}
            />,
            <Divider />,
            <Text children="Message:" />,
            ...Object.entries(message).map(([key, value]) => (
              <Row
                label={key}
                children={
                  <Text>
                    {typeof value === 'object'
                      ? JSON.stringify(value, null, 2)
                      : value.toString()}
                  </Text>
                }
              />
            )),
          ]}
        />,
      );

      if (!res) {
        throw new Error('User rejected request');
      }

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
            <Row label="Origin" children={<Text>{origin}</Text>} />,
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

        const res = await buildTxUi(transaction, origin);

        if (!res) {
          throw new Error('User rejected request');
        }

        const tx = await wallet.sendTransaction(
          Object.entries(transaction).reduce<Deferrable<TransactionRequest>>(
            (acc, [key, value]) => {
              if (key === 'gas') {
                acc.gasLimit = value as BigNumber;

                return acc;
              }

              if (key === 'chainId') {
                return acc;
              }

              (acc as any)[key] = value;

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
      throw new Error('Method not implemented');
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
      throw new Error('Method not implemented');
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
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetBalance: {
      try {
        const [address] =
          request.params as SnapRequestParams[RPCMethods.EthGetBalance];

        const provider = await getProvider();

        let balance;
        if (address) {
          const { current } = await networks.get();
          if (!isValidQtumOrHexadecimalAddress(address, current.chainId)) {
            throw new Error(
              `Invalid ${current.chainName.toLowerCase()} address`,
            );
          }

          const hexAddress = ethers.utils.isAddress(address)
            ? address
            : fromBase58Check(address);

          balance = await provider.getBalance(hexAddress);
        } else {
          balance = await (await getWallet()).getBalance();
        }

        return balance.toHexString();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    case RPCMethods.EthGetBlockByHash: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetBlockByNumber: {
      try {
        const [blockNumber, includeTransactions] =
          request.params as SnapRequestParams[RPCMethods.EthGetBlockByNumber];

        const provider = await getProvider();

        let block;
        if (includeTransactions) {
          block = await provider.getBlockWithTransactions(
            BigNumber.from(blockNumber).toNumber(),
          );
        } else {
          block = await provider.getBlock(
            BigNumber.from(blockNumber).toNumber(),
          );
        }

        return serialize(block);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    case RPCMethods.EthGetBlockReceipts: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetBlockTransactionCountByHash: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetBlockTransactionCountByNumber: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetCode: {
      const [address] = request.params as [string];

      const { contractCode } = await readAddressAsContract(address);

      return contractCode;
    }

    case RPCMethods.EthGetFilterChanges: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetFilterLogs: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetLogs: {
      const [filter] =
        request.params as unknown as SnapRequestParams[RPCMethods.EthGetLogs];

      const provider = await getProvider();

      const logs = await provider.getLogs(filter);

      return logs;
    }

    case RPCMethods.EthGetProof: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetStorageAt: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetTransactionByBlockHashAndIndex: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetTransactionByBlockNumberAndIndex: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetTransactionByHash: {
      try {
        const [txHash] =
          request.params as SnapRequestParams[RPCMethods.EthGetTransactionByHash];

        const provider = await getProvider();

        const tx = await provider.getTransaction(txHash);

        return serialize(tx);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    case RPCMethods.EthGetTransactionCount: {
      try {
        const [address, blockTag] =
          request.params as SnapRequestParams[RPCMethods.EthGetTransactionCount];

        const provider = await getProvider();

        const transactionCount = await provider.getTransactionCount(
          address,
          blockTag,
        );

        return BigNumber.from(transactionCount).toHexString();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    case RPCMethods.EthGetTransactionReceipt: {
      try {
        const [txHash] =
          request.params as SnapRequestParams[RPCMethods.EthGetTransactionReceipt];

        const provider = await getProvider();

        const txReceipt = await provider.getTransactionReceipt(txHash);

        return serialize(txReceipt);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    case RPCMethods.EthGetUncleCountByBlockHash: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthGetUncleCountByBlockNumber: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthMaxPriorityFeePerGas: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthNewBlockFilter: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthNewFilter: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthNewPendingTransactionFilter: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthSendRawTransaction: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthSyncing: {
      throw new Error('Method not implemented');
    }

    case RPCMethods.EthUninstallFilter: {
      throw new Error('Method not implemented');
    }

    default: {
      throw new Error('Method not supported');
    }
  }
};
