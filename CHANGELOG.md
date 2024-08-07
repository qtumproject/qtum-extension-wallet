## Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2024-08-07
### Changed
- Changed the transaction send flow
  - The snap no longer waits for the transaction to be confirmed on the Qtum chain. It immediately returns the transaction hash as soon as it is received.
  - There is a possibility that if the get transaction method by hash is used with the newly acquired hash, the get transaction method can revert with the following message: "invalid hash."
- `UI` for homepage & creating wallet dialog

### Fixed
- `eth_sendTransaction` timeout issue

## [0.1.0] - 2024-06-24
### Added
- Initial release of the snap.

[Unreleased]: https://github.com/qtumproject/qtum-extension-wallet/compare/0.2.0...HEAD
[0.2.0]: https://github.com/qtumproject/qtum-extension-wallet/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/qtumproject/qtum-extension-wallet/releases/tag/0.1.0



