## Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-04-11
### Added
- **New UI Components**
  - Dashboard page with comprehensive wallet overview
  - History page with transaction list and pagination
  - QRC20 token management interface with add-token functionality
  - Receive page with QR code display and network selector
  - Send page for native QTUM and QRC20 token transfers
  - Network switch dialog with confirmation UI
  - Transaction display components with detailed information
  - Custom PaddedBox component for better layout

- **Enhanced Wallet Management UI**
  - Home page with wallet creation and import flows
  - Private key display and management interface
  - BIP38 encrypted WIF import with masked passphrase input
  - WIF (Wallet Import Format) support with improved user inputs
  - Wallet removal confirmation dialog (renamed from logout)

- **Transaction & History Features**
  - Transaction history with pagination and list UI
  - Separate views for native QTUM and QRC20 token transactions
  - Add-token button integrated in QRC20 history view
  - Transaction confirmation waiting UI with status indicators
  - Gas estimation display for native and token transactions

- **Security & Validation UI**
  - Origin checks and display in snap dialogs
  - Address validation with chainId checks displayed to user
  - Masked input fields for sensitive data (passphrases, private keys)
  - Confirmation dialogs for sensitive operations

### Changed
- **UI Architecture Refactoring**
  - Migrated all UI extensions from `.ts` to `.tsx` for better React support
  - Completely redesigned snap UI components
  - Updated footer text across all pages
  - Modified all JSXElement required parameters for consistency

- **Component Updates**
  - Enhanced receive component with network selector
  - Updated network switch UI dialog with better user experience
  - Improved transaction display with better formatting
  - Updated `WAITING_CONFIRMATIONS` logic and UI
  - Better balance display using formatUnits for improved readability

### Removed
- Deprecated base and homepage UI files in favor of new component architecture

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

[Unreleased]: https://github.com/qtumproject/qtum-extension-wallet/compare/1.0.0...HEAD
[1.0.0]: https://github.com/qtumproject/qtum-extension-wallet/compare/0.2.0...1.0.0
[0.2.0]: https://github.com/qtumproject/qtum-extension-wallet/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/qtumproject/qtum-extension-wallet/releases/tag/0.1.0



