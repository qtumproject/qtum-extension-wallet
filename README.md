# QTum Wallet

The QTum Wallet plays the role of an RPC proxy that accepts requests from MetaMask and forwards them to the QTum network using the QTum ethers adapter.

## QTum Wallet FAQ

- **Q: What does the QTum Wallet do?**

  **A:** It acts as a proxy between the QTum blockchain and MetaMask.

- **Q: What does the snap NOT do?**

  **A:** QTum Wallet does not have access to users’ private keys or crypto assets.

- **Q: How do I use the QTum Wallet's features?**

  **A:** It is mainly used for interaction with the QTum blockchain. You can send any transaction with the snap to the QTum blockchain.

- **Q: How do I reach out for snap support?**

  **A:** Visit the ... Discord support channel or send an email to [support email].

- **Q: How do I interact with the QTum Blockchain via QTum Wallet?**

  **A:** Any DApps integrated with the QTum snap will relay requests to interact with contracts on the QTum blockchain via MetaMask itself (the snap should be installed).

- **Q: What applications can I use QTum Wallet Snap on?**

  **A:** Currently, you can use the QTum bridge to transfer supported assets from the Ethereum Mainnet.

## QTum Wallet Knowledge Doc

- **Q: What happens if I lose the keys for my account?**

  **A:** Please be extremely careful with your keys - there is no way to recover them if they are lost. QTum Wallet does not have access to users’ keys and cannot help you recover them.

- **Q: Is QTum Wallet secure?**

  **A:** Snap is extremely safe. To ensure the user's complete safety, Snap does not have access to users’ private keys. In addition, a security audit has been conducted by [Sayfer](link).

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
