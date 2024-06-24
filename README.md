# Qtum Wallet

The Qtum Wallet acts as an RPC proxy that accepts requests from DApps to MetaMask, for example, by using ethers.js or web3.js, and forwards them to the Qtum network using the Qtum ethers adapter.

## Qtum Wallet FAQ

- **Q: What does the Qtum Wallet do?**

  **A:** It acts as a proxy between the Qtum blockchain and MetaMask.

- **Q: What does the snap NOT do?**

  **A:** Qtum Wallet does not have access to users’ private keys or crypto assets.

- **Q: How do I use the Qtum Wallet's features?**

  **A:** It is mainly used for interaction with the Qtum blockchain. You can send any EVM transaction with the snap to the Qtum network.

- **Q: How do I reach out for snap support?**

  **A:** Visit the Qtum Discord support channel or send an email to support@qtum.info.

- **Q: How do I interact with the Qtum Blockchain via Qtum Wallet?**

  **A:** Any DApps integrated with the Qtum snap will relay requests to interact with contracts on the Qtum blockchain via MetaMask itself (the snap should be installed).

- **Q: What applications can I use Qtum Wallet Snap on?**

  **A:** Currently, you can use the Qtum bridge to transfer supported assets from the Ethereum Mainnet. Also you can visit [wallet.bridge.qtum.net](https://wallet.bridge.qtum.net) to change networks, send ERC-20 and native tokens, and view balances.

## Qtum Wallet Knowledge Doc

- **Q: What happens if I lose the keys for my account?**

  **A:** Please be extremely careful with your keys - there is no way to recover them if they are lost. Qtum Wallet does not have access to users’ keys and cannot help you recover them. However, the Qtum private key is generated from the MetaMask mnemonic entropy, so it can be recovered if you still have your MetaMask mnemonic (for the first account).

- **Q: Is Qtum Wallet secure?**

  **A:** Snap is extremely safe. To ensure the user's complete safety, Snap does not have access to users’ private keys. In addition, a security audit has been conducted by [Sayfer](...).

## Contributing

### Getting Started

Clone the repository:

```shell
yarn install && yarn start
```

### Publishing new versions

#### Check release version

```bash
yarn rsc 0.1.0
```

#### Bump version for all packages

```bash
yarn apply-version 0.1.0
```

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and fix any automatically fixable issues.

## Notes

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
