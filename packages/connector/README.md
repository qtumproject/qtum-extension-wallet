# QtumSnap Connector

QtumSnap connector is used to install snap and exposes methods for calling snap on dApps and other applications.

## Usage

### Installation

```bash
npm install @qtumproject/wallet-snap-connector
```

```bash
yarn add @qtumproject/wallet-snap-connector
```

### Define raw provider (object which is similar to window.ethereum)

```typescript
import { QtumWallet } from '@qtumproject/wallet-snap-connector';

export const qtumSnap = new QtumWallet();
```

### Establish connection

```typescript
import { qtumSnap } from '@/path/to/qtumSnap';

const init = async () => {
  await qtumSnap.enable();
};
```

### check if snap or metamask is installed

```typescript
import { isMetamaskInstalled } from '@qtumproject/wallet-snap-connector';

import { qtumSnap } from '@/path/to/qtumSnap';

const checkSnapStatus = async () => {
  return {
    isMetamaskInstalled: await isMetamaskInstalled(),
    isSnapInstalled: await qtumSnap.isInstalled(),
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

import { qtumSnap } from '@/path/to/qtumSnap';

export const useProvider = () => {
  const provider = useMemo(() => {
    try {
      return new providers.Web3Provider(qtumSnap as providers.ExternalProvider);
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
