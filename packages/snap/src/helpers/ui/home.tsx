import {
  Box, Text, Container, Divider, Button, Form, Field, Input,
  Tooltip, Icon, Image, Section
} from '@metamask/snaps-sdk/jsx';

import { qtumIcon } from "@/helpers/utils";

export const renderHome = () => (
  <Container>
    <Box>
      <Text> </Text>
      <Box direction="horizontal" alignment="space-between">
        <Text> </Text>
        <Image src={qtumIcon} alt="Qtum"/>
        <Text> </Text>
      </Box>
      <Text alignment="center" fontWeight="bold">Welcome to Qtum Wallet</Text>
      <Divider/>
      <Box>
        <Button name="create-wallet" variant="primary">Create a Wallet</Button>
        <Divider/>
        <Button name="drive-internal-mnemonic">Drive from Internal Mnemonic</Button>
        <Divider/>
        <Button name="drive-external-mnemonic">Drive from External Mnemonic</Button>
        <Divider/>
        <Button name="import-private-key">Import from Private Key</Button>
      </Box>
    </Box>
  </Container>
);

export const renderDriveInternalMnemonic = (errorDerivationPath?: string) => (
  <Box>
    <Text fontWeight="bold">Derive from Internal Mnemonic</Text>
    <Divider/>
    <Form name="drive-internal-mnemonic-form">
      <Box direction="horizontal">
        <Text>Derivation Path</Text>
        <Tooltip content={<Text size="sm">
          Specifies which key to derive under the m/44'/88' path.
        </Text>}><Icon name="info" /></Tooltip>
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
  </Box>
);

export const renderDriveExternalMnemonic = (errorMnemonic?: string, errorDerivationPath?: string) => (
  <Box>
    <Text fontWeight="bold">Derive from external Mnemonic</Text>
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
  </Box>
);

export const renderImportPrivateKey = (errorPrivateKey?: string) => (
  <Container>
    <Box>
      <Text fontWeight="bold">Import Private Key</Text>
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
    </Box>
  </Container>
);
