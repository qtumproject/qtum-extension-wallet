import {
  Box, Text, Container, Divider, Copyable, Button, Dropdown, Option, Section
} from '@metamask/snaps-sdk/jsx';
import { Chain } from "@qtumproject/qtum-wallet-connector";

export const renderDashboard = (
  networks: { list: Chain[], current: Chain }, params: { qtumAddress?: string; hexAddress?: string }) => (
  <Container>
    <Box>
      <Box direction="horizontal" crossAlignment="center" alignment="space-between">
        <Text>100009 QTUM</Text>
        <Dropdown name="networks">
          {networks.list.map((network) => (
            <Option key={String(network.chainId)} value={String(network.chainId)}>{network.chainName}</Option>
          ))}
        </Dropdown>
      </Box>
      <Divider/>
      <Box>
        <Text>Your Qtum address:</Text>
        <Copyable value={params.qtumAddress ?? ''}/>
        <Text>Your Qtum address in hexadecimal format:</Text>
        <Copyable value={params.hexAddress ?? ''}/>
      </Box>
      <Divider/>
      <Section>
        <Button name="logout">Export Private Key</Button>
        <Divider/>
        <Button name="logout" variant="destructive">Logout</Button>
      </Section>
    </Box>
  </Container>
);
