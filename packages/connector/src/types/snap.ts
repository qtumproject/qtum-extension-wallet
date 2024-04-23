import type {
  Filter,
  FilterByBlockHash,
} from '@ethersproject/abstract-provider';
import type { Deferrable } from '@ethersproject/properties';
import type { TransactionRequest } from '@ethersproject/providers';

import type { RPCMethods } from '@/enums';

export type GetSnapsResponse = {
  [k: string]: {
    permissionName?: string;
    id?: string;
    version?: string;
    initialPermissions?: { [k: string]: unknown };
  };
};

export type SnapRequestParams = {
  [RPCMethods.WalletCreateRandom]: undefined;
  [RPCMethods.WalletFromMnemonic]: [string];
  [RPCMethods.WalletFromPrivateKey]: [string];
  [RPCMethods.WalletExportPrivateKey]: [];
  [RPCMethods.WalletGetAddress]: [];
  [RPCMethods.EthSubscribe]: [];
  [RPCMethods.EthUnsubscribe]: [];
  [RPCMethods.WalletAddEthereumChain]: [];
  [RPCMethods.WalletSwitchEthereumChain]: [];
  [RPCMethods.WalletRequestPermissions]: [];
  [RPCMethods.WalletRevokePermissions]: [];
  [RPCMethods.WalletGetPermissions]: [];
  [RPCMethods.WalletRegisterOnboarding]: [];
  [RPCMethods.WalletWatchAsset]: [];
  [RPCMethods.WalletScanQrCode]: [];
  [RPCMethods.WalletGetSnaps]: [];
  [RPCMethods.WalletRequestSnaps]: [];
  [RPCMethods.WalletSnap]: [];
  [RPCMethods.WalletInvokeSnap]: [];
  [RPCMethods.EthDecrypt]: [];
  [RPCMethods.EthGetEncryptionPublicKey]: [];
  [RPCMethods.EthRequestAccounts]: [];
  [RPCMethods.EthAccounts]: [];
  [RPCMethods.EthSignTypedDataV4]: [];
  [RPCMethods.PersonalSign]: [];
  [RPCMethods.EthSendTransaction]: [Deferrable<TransactionRequest>];
  [RPCMethods.Web3ClientVersion]: [];
  [RPCMethods.EthBlockNumber]: [];
  [RPCMethods.EthCall]: [];
  [RPCMethods.EthChainId]: [];
  [RPCMethods.EthCoinbase]: [];
  [RPCMethods.EthEstimateGas]: [
    {
      value: string;
      from: string;
      to: string;
    },
  ];
  [RPCMethods.EthFeeHistory]: [];
  [RPCMethods.EthGasPrice]: [];
  [RPCMethods.EthGetBalance]: [];
  [RPCMethods.EthGetBlockByHash]: [];
  [RPCMethods.EthGetBlockByNumber]: [];
  [RPCMethods.EthGetBlockReceipts]: [];
  [RPCMethods.EthGetBlockTransactionCountByHash]: [];
  [RPCMethods.EthGetBlockTransactionCountByNumber]: [];
  [RPCMethods.EthGetCode]: [];
  [RPCMethods.EthGetFilterChanges]: [];
  [RPCMethods.EthGetFilterLogs]: [];
  [RPCMethods.EthGetLogs]: [
    Filter | FilterByBlockHash | Promise<Filter | FilterByBlockHash>,
  ];
  [RPCMethods.EthGetProof]: [];
  [RPCMethods.EthGetStorageAt]: [];
  [RPCMethods.EthGetTransactionByBlockHashAndIndex]: [];
  [RPCMethods.EthGetTransactionByBlockNumberAndIndex]: [];
  [RPCMethods.EthGetTransactionByHash]: [string];
  [RPCMethods.EthGetTransactionCount]: [];
  [RPCMethods.EthGetTransactionReceipt]: [string];
  [RPCMethods.EthGetUncleCountByBlockHash]: [];
  [RPCMethods.EthGetUncleCountByBlockNumber]: [];
  [RPCMethods.EthMaxPriorityFeePerGas]: [];
  [RPCMethods.EthNewBlockFilter]: [];
  [RPCMethods.EthNewFilter]: [];
  [RPCMethods.EthNewPendingTransactionFilter]: [];
  [RPCMethods.EthSendRawTransaction]: [];
  [RPCMethods.EthSyncing]: [];
  [RPCMethods.EthUninstallFilter]: [];
};

export type SnapRequestsResponses = {
  [RPCMethods.WalletCreateRandom]: undefined;
  [RPCMethods.WalletFromMnemonic]: [string];
  [RPCMethods.WalletFromPrivateKey]: [string];
  [RPCMethods.WalletExportPrivateKey]: [];
  [RPCMethods.WalletGetAddress]: string;
  [RPCMethods.EthSubscribe]: [];
  [RPCMethods.EthUnsubscribe]: [];
  [RPCMethods.WalletAddEthereumChain]: [];
  [RPCMethods.WalletSwitchEthereumChain]: [];
  [RPCMethods.WalletRequestPermissions]: [];
  [RPCMethods.WalletRevokePermissions]: [];
  [RPCMethods.WalletGetPermissions]: [];
  [RPCMethods.WalletRegisterOnboarding]: [];
  [RPCMethods.WalletWatchAsset]: [];
  [RPCMethods.WalletScanQrCode]: [];
  [RPCMethods.WalletGetSnaps]: [];
  [RPCMethods.WalletRequestSnaps]: [];
  [RPCMethods.WalletSnap]: [];
  [RPCMethods.WalletInvokeSnap]: [];
  [RPCMethods.EthDecrypt]: [];
  [RPCMethods.EthGetEncryptionPublicKey]: [];
  [RPCMethods.EthRequestAccounts]: [];
  [RPCMethods.EthAccounts]: [];
  [RPCMethods.EthSignTypedDataV4]: [];
  [RPCMethods.PersonalSign]: [];
  [RPCMethods.EthSendTransaction]: [Deferrable<TransactionRequest>];
  [RPCMethods.Web3ClientVersion]: [];
  [RPCMethods.EthBlockNumber]: [];
  [RPCMethods.EthCall]: [];
  [RPCMethods.EthChainId]: [];
  [RPCMethods.EthCoinbase]: [];
  [RPCMethods.EthEstimateGas]: [
    {
      value: string;
      from: string;
      to: string;
    },
  ];
  [RPCMethods.EthFeeHistory]: [];
  [RPCMethods.EthGasPrice]: [];
  [RPCMethods.EthGetBalance]: [];
  [RPCMethods.EthGetBlockByHash]: [];
  [RPCMethods.EthGetBlockByNumber]: [];
  [RPCMethods.EthGetBlockReceipts]: [];
  [RPCMethods.EthGetBlockTransactionCountByHash]: [];
  [RPCMethods.EthGetBlockTransactionCountByNumber]: [];
  [RPCMethods.EthGetCode]: [];
  [RPCMethods.EthGetFilterChanges]: [];
  [RPCMethods.EthGetFilterLogs]: [];
  [RPCMethods.EthGetLogs]: [
    Filter | FilterByBlockHash | Promise<Filter | FilterByBlockHash>,
  ];
  [RPCMethods.EthGetProof]: [];
  [RPCMethods.EthGetStorageAt]: [];
  [RPCMethods.EthGetTransactionByBlockHashAndIndex]: [];
  [RPCMethods.EthGetTransactionByBlockNumberAndIndex]: [];
  [RPCMethods.EthGetTransactionByHash]: [string];
  [RPCMethods.EthGetTransactionCount]: [];
  [RPCMethods.EthGetTransactionReceipt]: [string];
  [RPCMethods.EthGetUncleCountByBlockHash]: [];
  [RPCMethods.EthGetUncleCountByBlockNumber]: [];
  [RPCMethods.EthMaxPriorityFeePerGas]: [];
  [RPCMethods.EthNewBlockFilter]: [];
  [RPCMethods.EthNewFilter]: [];
  [RPCMethods.EthNewPendingTransactionFilter]: [];
  [RPCMethods.EthSendRawTransaction]: [];
  [RPCMethods.EthSyncing]: [];
  [RPCMethods.EthUninstallFilter]: [];
};
