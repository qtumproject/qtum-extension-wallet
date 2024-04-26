# Qtum Snap

Qtum Snap is a MetaMask Snap that allows you to work with Qtum network by using ethers js providers.

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
