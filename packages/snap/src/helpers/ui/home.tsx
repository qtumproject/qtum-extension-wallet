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
} from '@metamask/snaps-sdk/jsx';

import { qtumIcon } from '@/consts';
import { Gap } from '@/helpers';

export const renderHome = () => (
  <Box>
    <Gap/>
    <Box direction="horizontal" alignment="space-between">
      <Gap/>
      <Image src={qtumIcon} alt="Qtum"/>
      <Gap/>
    </Box>
    <Text alignment="center" fontWeight="medium">Qtum Snap Wallet</Text>
    <Text alignment="center" size="sm" color="muted">Securely manage your Qtum inside MetaMask</Text>
    <Divider/>
    <Section>
      <Button name="create-wallet" variant="primary">Create a Wallet</Button>
      <Divider/>
      <Button name="drive-internal-mnemonic" disabled={true}>Drive from Internal Mnemonic</Button>
      <Divider/>
      <Button name="drive-external-mnemonic">Drive from External Mnemonic</Button>
      <Divider/>
      <Button name="import-private-key">Import from Private Key</Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">Powered by Qtum</Text>
  </Box>
);

export const renderDriveInternalMnemonic = (errorDerivationPath?: string) => (
  <Box>
    <Heading>Derive from Internal Mnemonic</Heading>
    <Divider/>
    <Form name="drive-internal-mnemonic-form">
      <Box direction="horizontal">
        <Text>Derivation Path</Text>
        <Tooltip content={<Text size="sm">
          Specifies which key to derive under the m/44'/88' path.
        </Text>}><Icon name="info"/></Tooltip>
      </Box>
      <Field error={errorDerivationPath}>
        <Input name="derivation-path" placeholder="/0'/0/0" value="0'/0/0"/>
      </Field>
    </Form>
    <Section>
      <Button type="submit" name="submit-drive-internal-mnemonic" form="drive-internal-mnemonic-form">Derive</Button>
      <Divider/>
      <Button name="cancel-wallet" variant="destructive">Cancel</Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">Powered by Qtum</Text>
  </Box>
);

export const renderDriveExternalMnemonic = (errorMnemonic?: string, errorDerivationPath?: string) => (
  <Box>
    <Heading>Derive from external Mnemonic</Heading>
    <Divider/>
    <Form name="drive-external-mnemonic-form">
      <Box direction="horizontal">
        <Text>Mnemonic</Text>
        <Tooltip content={<Text size="sm">
          Only the derived private key is saved in MetaMask — your mnemonic phrase is never stored.
        </Text>}><Icon name="info" /></Tooltip>
      </Box>
      <Field error={errorMnemonic}>
        <Input name="mnemonic" placeholder="12–24 words"/>
      </Field>
      <Box direction="horizontal">
        <Text>Passphrase</Text>
        <Tooltip content={<Text size="sm">
          Adds a two-factor protection to your mnemonic phrase. No passphrase, no recovery.
        </Text>}><Icon name="info" /></Tooltip>
      </Box>
      <Field>
        <Input name="passphrase" placeholder="(Optional)"/>
      </Field>
      <Box direction="horizontal">
        <Text>Derivation Path</Text>
        <Tooltip content={<Text size="sm">
          The derivation path tells the wallet which key to derive
        </Text>}><Icon name="info" /></Tooltip>
      </Box>
      <Field error={errorDerivationPath}>
        <Input name="derivation-path" placeholder="m/44'/88'/0'/0/0" value="m/44'/88'/0'/0/0"/>
      </Field>
    </Form>
    <Section>
      <Button type="submit" name="submit-drive-external-mnemonic" form="drive-internal-mnemonic-form">Derive</Button>
      <Divider/>
      <Button name="cancel-wallet" variant="destructive">Cancel</Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">Powered by Qtum</Text>
  </Box>
);

export const renderImportPrivateKey = (errorPrivateKey?: string) => (
  <Box>
    <Heading>Import Private Key</Heading>
    <Divider/>
    <Form name="import-private-key-form">
      <Box direction="horizontal">
        <Text>Private Key</Text>
        <Tooltip content={<Text size="sm">
          Paste your Qtum private key.
        </Text>}><Icon name="info" /></Tooltip>
      </Box>
      <Field error={errorPrivateKey}>
        <Input name="private-key"/>
      </Field>
    </Form>
    <Section>
      <Button name="submit-import-private-key" form="import-private-key-form" type="submit">Import</Button>
      <Divider/>
      <Button name="cancel-wallet" variant="destructive">Cancel</Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">Powered by Qtum</Text>
  </Box>
);
