# QTum Wallet

QTum wallet is a snap, that allows to interact with QTum blockchain by implementing metamask RPC requests handlers https://docs.metamask.io/wallet/reference/json-rpc-api/.

## Methods

### To interact with it, simply use wallet_invokeSnap as proxy to call snap methods.

```javascript
await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: 'snapId',
    request: { method: 'eth_call', params: [...myParams] },
  },
});
```
