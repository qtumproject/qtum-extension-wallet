import {
  Box, Text, Container, Divider, Button, Form, Field, Input, Image
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
        <Button name="internal-mnemonic">Drive from Internal Mnemonic</Button>
        <Divider/>
        <Button name="external-mnemonic">Drive from External Mnemonic</Button>
        <Divider/>
        <Button name="import-private-key">Import from Private Key</Button>
      </Box>
    </Box>
  </Container>
);


export const renderImportPrivateKey = (error?: string) => (
  <Container>
    <Box>
      <Text fontWeight="bold">Import Private Key</Text>
      <Divider/>
      <Form name="import-private-key-form">
        <Text>Private Key</Text>
        <Field error={error}>
          <Input name="private-key"/>
        </Field>
      </Form>
      <Box>
        <Button name="submit-import-private-key" form="import-private-key-form" type="submit">Import</Button>
        <Divider/>
        <Button name="cancel-import" variant="destructive">Cancel</Button>
      </Box>
    </Box>
  </Container>
);
