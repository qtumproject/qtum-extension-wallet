# Qtum Wallet

The Qtum Wallet acts as an RPC proxy that accepts requests from DApps to MetaMask, for example, by using ethers.js or web3.js, and forwards them to the Qtum network using the Qtum ethers adapter.

## Qtum Wallet FAQ

### What is MetaMask Snaps?

MetaMask Snaps enhance the wallet experience offered by Consensys by allowing end-users to add extra functionality for Web3 and DeFi purposes above the level provided by a normal MetaMask installation.

Because of the rapidly evolving nature of blockchain technology, many new features are being developed and requested by the community. This happens at a pace that far outstrips the ability for MetaMask developers to provide in their core wallet, so by allowing a decentralized and audited framework called “Snaps”, developers can now offer their niche functionality to a greater MetaMask install by allowing “modules” called Snaps.

In the example of the Qtum Blockchain, there was not a MetaMask/Qtum wallet module to work with Qtum Bridge infrastructure. Users who would like to interface with the Qtum-Ethereum bridge would need to either develop their own wallet, or learn to use complicated command-line interfaces. MetaMask Snaps allows users to seamlessly add this functionality to an existing MetaMask installation and interface with the Qtum bridge in minutes.

### What is the Qtum Snap Wallet, and what does it do?

The Qtum Wallet is an extension of your MetaMask wallet. It is a proxy between the Qtum blockchain and MetaMask. The Qtum Snap allows you to hold the QTUM token, manage QRC20 tokens and NFTs, and connect to Qtum’s bridge that allows Web3 and DeFi between the Ethereum and Qtum blockchains.

### Why should I use the Qtum Snap with my MetaMask Wallet?

Qtum MetaMask Snap simplifies the integration of MetaMask with the Qtum blockchain. It facilitates the storage and transfer of Ethereum ERC20 assets to and from the Qtum blockchain, using the Qtum Bridge, and other QRC20 assets like Circle Bridged USDC, allowing users to access the Qtum ecosystem seamlessly without needing additional wallets.

The Qtum MetaMask Snap is an audited and non-custodial wallet, meaning that the end user keeps full control of their private keys. The Qtum or MetaMask team have no ability to access an end-user’s wallet whatsoever.

### How does the Qtum MetaMask Snap work?

Metamask Snaps are open-source extensions that enhance MetaMask's functionality in a secure manner. Each snap is a JavaScript program that operates in an isolated environment, ensuring a customized and secure wallet experience.

These “Snaps” are developed by third parties, in this case, the Qtum Foundation. They are audited by a Consensys-approved auditing team, and submitted to Consensys for review. If approved, the “Snap” will be listed on the [MetaMask Snaps Directory](https://snaps.metamask.io/)

### Is my private key and recovery phrase exposed when using the Qtum Snap?

Qtum Snap does not have access to users’ private keys.

### Can I access all Qtum apps?

Currently, you can use the Qtum bridge to transfer supported assets, like Circle Bridged USDC from the Ethereum Mainnet. For more information on the Circle set of contracts, please see here: [Introducing Bridged USDC Standard](https://www.circle.com/blog/bridged-usdc-standard)

### Does the Qtum MetaMask Snap support Qtum NFTs?

Not currently. The purpose of the Qtum MetaMask Snap was to provide access to the Qtum-Ethereum bridge in order to facilitate DeFi applications. Qtum NFT’s are supported on other Qtum wallets, but not currently the Qtum MetaMask Snap.

### How do I get help with the Qtum MetaMask Snap?

Visit Qtum’s official [Discord](https://discord.com/invite/aqkWtb6HVa) channel or send an email to support@qtum.info.

## Qtum Wallet Knowledge Doc

### What happens if I lose the keys for my account?

Please be extremely careful with your keys - there is no way to recover them if they are lost. Qtum Wallet does not have access to users’ keys and cannot help you recover them. However, the Qtum private key is generated from the MetaMask mnemonic entropy, so it can be recovered if you still have your MetaMask mnemonic (for the first account). Please be advised that your private keys and mnemonic entropy are the highest sought item from scammers, drainers, impostors, etc. Never click on suspicious links, never respond to random direct messages, and always assume that any application that is asking for this information is trying to steal your tokens.

### Is the Qtum MetaMask Snap Secure?

The Qtum MetaMask Snap was audited by an approved Consensys auditor called “Sayfer”. The Qtum Blockchain is an EVM-compatible chain that uses technology almost identical to the Ethereum and Bitcoin blockchains. The MetaMask Snap technology is not new, other projects have built and deployed Snaps previously without issue. The Qtum MetaMask Snap is a non-custodial wallet.

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
