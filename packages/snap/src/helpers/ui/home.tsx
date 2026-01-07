import {
  Box,
  Text,
  Divider,
  Button,
  Form,
  Field,
  Input,
  Tooltip,
  Icon,
  Image,
  Section,
  Heading,
  Selector,
  SelectorOption,
  Card,
} from '@metamask/snaps-sdk/jsx';

import { QTUM_ICON } from '@/consts';
import { PaddedBox } from '@/helpers';
import { SNAP_VERSION } from '@/consts';

export const renderHome = () => (
  <Box>
    <Box>
      <PaddedBox
        direction="vertical"
        children={
          <PaddedBox
            direction="horizontal"
            children={<Image src={QTUM_ICON} alt="Qtum" />}
          />
        }
      />
      <PaddedBox
        direction="horizontal"
        children={<Heading size="md">Qtum Wallet</Heading>}
      />
      <Text alignment="center" size="md" color="muted">
        Securely manage your Qtum inside MetaMask
      </Text>
    </Box>
    <Divider />
    <Section>
      <Button name="create-wallet" variant="primary">
        Create a Wallet
      </Button>
      <Divider />
      <Button name="drive-internal-mnemonic">
        Drive from Internal Mnemonic
      </Button>
      <Divider />
      <Button name="drive-external-mnemonic">
        Drive from External Mnemonic
      </Button>
      <Divider />
      <Button name="import-private-key">Import from Private Key</Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">
      {SNAP_VERSION} / Powered by Qtum
    </Text>
  </Box>
);

export const renderDriveInternalMnemonic = (errorDerivationPath?: string) => (
  <Box>
    <Heading>Derive from Internal Mnemonic</Heading>
    <Divider />
    <Form name="drive-internal-mnemonic-form">
      <Box direction="horizontal">
        <Text>Derivation Path</Text>
        <Tooltip
          content={
            <Text size="sm">
              Specifies which key to derive under the m/44'/88' path.
            </Text>
          }
        >
          <Icon name="info" />
        </Tooltip>
      </Box>
      <Field error={errorDerivationPath}>
        <Input name="derivation-path" placeholder="/0'/0/0" value="0'/0/0" />
      </Field>
    </Form>
    <Section>
      <Button
        type="submit"
        name="submit-drive-internal-mnemonic"
        form="drive-internal-mnemonic-form"
      >
        Derive
      </Button>
      <Divider />
      <Button name="cancel-wallet" variant="destructive">
        Cancel
      </Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">
      {SNAP_VERSION} / Powered by Qtum
    </Text>
  </Box>
);

export const renderDriveExternalMnemonic = (
  errorMnemonic?: string,
  errorDerivationPath?: string,
) => (
  <Box>
    <Heading>Derive from external Mnemonic</Heading>
    <Divider />
    <Form name="drive-external-mnemonic-form">
      <Box direction="horizontal">
        <Text>Mnemonic</Text>
        <Tooltip
          content={
            <Text size="sm">
              Only the derived private key is saved in MetaMask — your mnemonic
              phrase is never stored.
            </Text>
          }
        >
          <Icon name="info" />
        </Tooltip>
      </Box>
      <Field error={errorMnemonic}>
        <Input name="mnemonic" placeholder="12–24 words" />
      </Field>
      <Box direction="horizontal">
        <Text>Passphrase</Text>
        <Tooltip
          content={
            <Text size="sm">
              Adds a two-factor protection to your mnemonic phrase. No
              passphrase, no recovery.
            </Text>
          }
        >
          <Icon name="info" />
        </Tooltip>
      </Box>
      <Field>
        <Input name="passphrase" placeholder="(Optional)" />
      </Field>
      <Box direction="horizontal">
        <Text>Derivation Path</Text>
        <Tooltip
          content={
            <Text size="sm">
              The derivation path tells the wallet which key to derive
            </Text>
          }
        >
          <Icon name="info" />
        </Tooltip>
      </Box>
      <Field error={errorDerivationPath}>
        <Input
          name="derivation-path"
          placeholder="m/44'/88'/0'/0/0"
          value="m/44'/88'/0'/0/0"
        />
      </Field>
    </Form>
    <Section>
      <Button
        type="submit"
        name="submit-drive-external-mnemonic"
        form="drive-internal-mnemonic-form"
      >
        Derive
      </Button>
      <Divider />
      <Button name="cancel-wallet" variant="destructive">
        Cancel
      </Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">
      {SNAP_VERSION} / Powered by Qtum
    </Text>
  </Box>
);

export const renderImportPrivateKey = (
  importType: string,
  errorImportKey?: string,
  errorPassphrase?: string,
  loading: boolean = false,
) => (
  <Box>
    <Box
      direction="horizontal"
      alignment="space-between"
      crossAlignment="center"
    >
      <Heading>Import</Heading>
      <Selector
        name="import-type"
        title="Select type"
        value={importType}
        disabled={loading}
      >
        <SelectorOption key="private-key" value="private-key">
          <Card title="Private Key" value="" />
        </SelectorOption>
        <SelectorOption key="wif" value="wif">
          <Card title="WIF" value="" />
        </SelectorOption>
        <SelectorOption key="encrypted-wif" value="encrypted-wif">
          <Card title="Encrypted WIF" value="" />
        </SelectorOption>
      </Selector>
    </Box>
    <Divider />
    <Form name="import-key-form">
      <Box direction="horizontal">
        <Text>
          {importType === 'encrypted-wif'
            ? 'Encrypted WIF'
            : importType === 'wif'
            ? 'Wallet Import Format'
            : 'Private Key'}
        </Text>
        <Tooltip
          content={
            <Text size="sm">
              {importType === 'encrypted-wif'
                ? 'Paste your Qtum BIP38 - Encrypted WIF (Wallet Import Format).'
                : importType === 'wif'
                ? 'Paste your Qtum WIF (Wallet Import Format).'
                : 'Paste your Qtum private key.'}
            </Text>
          }
        >
          <Icon name="info" />
        </Tooltip>
      </Box>
      <Field error={errorImportKey}>
        <Input name="import-key" />
      </Field>
      {importType === 'encrypted-wif' && (
        <Box>
          <Box direction="horizontal">
            <Text>Passphrase</Text>
            <Tooltip
              content={
                <Text size="sm">Enter the passphrase to decrypt it.</Text>
              }
            >
              <Icon name="info" />
            </Tooltip>
          </Box>
          <Field error={errorPassphrase}>
            <Input name="import-bip38-passphrase" placeholder="(Optional)" type="password" />
          </Field>
        </Box>
      )}
    </Form>
    <Section>
      <Button
        name="submit-import-private-key"
        form="import-key-form"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Importing...' : 'Import'}
      </Button>
      <Divider />
      <Button name="cancel-wallet" variant="destructive" disabled={loading}>
        Cancel
      </Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">
      {SNAP_VERSION} / Powered by Qtum
    </Text>
  </Box>
);
