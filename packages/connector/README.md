# Qtum Wallet Connector

Qtum Wallet connector is used to install snap and exposes methods for calling snap on dApps and other applications.

## Usage

### Installation

```bash
npm install @qtumproject/qtum-wallet-connector
```

```bash
yarn add @qtumproject/qtum-wallet-connector
```

### Define raw provider (object which is similar to window.ethereum)

```typescript
import { QtumWallet } from '@qtumproject/qtum-wallet-connector';

export const qtumWallet = new QtumWallet();
```

### Establish connection

```typescript
import { qtumWallet } from '@/path/to/qtumWallet';

const init = async () => {
  await qtumWallet.enable();
};
```

### Check if snap or metamask is installed

```typescript
import { isMetamaskInstalled } from '@qtumproject/qtum-wallet-connector';

import { qtumWallet } from '@/path/to/qtumWallet';

const checkSnapStatus = async () => {
  return {
    isMetamaskInstalled: await isMetamaskInstalled(),
    isSnapInstalled: await qtumWallet.isInstalled(),
  };
};
```

### After that it can be used as provider inside ethers.js

#### Example

```typescript
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(connector);
```

#### React example

```typescript
import { providers } from 'ethers';
import { useMemo } from 'react';

import { qtumWallet } from '@/path/to/qtumWallet';

export const useProvider = () => {
  const provider = useMemo(() => {
    try {
      return new providers.Web3Provider(
        qtumWallet as providers.ExternalProvider,
      );
    } catch (error) {
      return undefined;
    }
  }, []);

  const signer = useMemo(() => {
    return provider?.getSigner();
  }, [provider]);

  return {
    provider,
    signer,
  };
};
```
