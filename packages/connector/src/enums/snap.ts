export enum RPCMethods {
  WalletCreateRandom = 'wallet_createRandom',
  WalletFromMnemonic = 'wallet_fromMnemonic',
  WalletFromPrivateKey = 'wallet_fromPrivateKey',
  WalletExportPrivateKey = 'wallet_exportPrivateKey',
  WalletGetAddress = 'wallet_getAddress',
  WalletGetAllSupportedChains = 'wallet_getAllSupportedChains',
  WalletRemoveChain = 'wallet_removeChain',

  EthSubscribe = 'eth_subscribe',
  EthUnsubscribe = 'eth_unsubscribe',
  WalletAddEthereumChain = 'wallet_addEthereumChain',
  WalletSwitchEthereumChain = 'wallet_switchEthereumChain',
  WalletRequestPermissions = 'wallet_requestPermissions',
  WalletRevokePermissions = 'wallet_revokePermissions',
  WalletGetPermissions = 'wallet_getPermissions',
  WalletRegisterOnboarding = 'wallet_registerOnboarding',
  WalletWatchAsset = 'wallet_watchAsset',
  WalletScanQrCode = 'wallet_scanQRCode',
  WalletGetSnaps = 'wallet_getSnaps',
  WalletRequestSnaps = 'wallet_requestSnaps',
  WalletSnap = 'wallet_snap',
  WalletInvokeSnap = 'wallet_invokeSnap',
  EthDecrypt = 'eth_decrypt',
  EthGetEncryptionPublicKey = 'eth_getEncryptionPublicKey',
  EthRequestAccounts = 'eth_requestAccounts',
  EthAccounts = 'eth_accounts',
  EthSignTypedDataV4 = 'eth_signTypedData_v4',
  PersonalSign = 'personal_sign',
  EthSendTransaction = 'eth_sendTransaction',
  Web3ClientVersion = 'web3_clientVersion',
  EthBlockNumber = 'eth_blockNumber',
  EthCall = 'eth_call',
  EthChainId = 'eth_chainId',
  EthCoinbase = 'eth_coinbase',
  EthEstimateGas = 'eth_estimateGas',
  EthFeeHistory = 'eth_feeHistory',
  EthGasPrice = 'eth_gasPrice',
  EthGetBalance = 'eth_getBalance',
  EthGetBlockByHash = 'eth_getBlockByHash',
  EthGetBlockByNumber = 'eth_getBlockByNumber',
  EthGetBlockReceipts = 'eth_getBlockReceipts',
  EthGetBlockTransactionCountByHash = 'eth_getBlockTransactionCountByHash',
  EthGetBlockTransactionCountByNumber = 'eth_getBlockTransactionCountByNumber',
  EthGetCode = 'eth_getCode',
  EthGetFilterChanges = 'eth_getFilterChanges',
  EthGetFilterLogs = 'eth_getFilterLogs',
  EthGetLogs = 'eth_getLogs',
  EthGetProof = 'eth_getProof',
  EthGetStorageAt = 'eth_getStorageAt',
  EthGetTransactionByBlockHashAndIndex = 'eth_getTransactionByBlockHashAndIndex',
  EthGetTransactionByBlockNumberAndIndex = 'eth_getTransactionByBlockNumberAndIndex',
  EthGetTransactionByHash = 'eth_getTransactionByHash',
  EthGetTransactionCount = 'eth_getTransactionCount',
  EthGetTransactionReceipt = 'eth_getTransactionReceipt',
  EthGetUncleCountByBlockHash = 'eth_getUncleCountByBlockHash',
  EthGetUncleCountByBlockNumber = 'eth_getUncleCountByBlockNumber',
  EthMaxPriorityFeePerGas = 'eth_maxPriorityFeePerGas',
  EthNewBlockFilter = 'eth_newBlockFilter',
  EthNewFilter = 'eth_newFilter',
  EthNewPendingTransactionFilter = 'eth_newPendingTransactionFilter',
  EthSendRawTransaction = 'eth_sendRawTransaction',
  EthSyncing = 'eth_syncing',
  EthUninstallFilter = 'eth_uninstallFilter',
}
