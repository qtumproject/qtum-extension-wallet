import {
  Box, Text, Container, Divider, Copyable, Button, Dropdown, Option, Section, Image, Heading
} from '@metamask/snaps-sdk/jsx';
import { Chain } from "@qtumproject/qtum-wallet-connector";

import { formatUnits } from "@/helpers/format";

export const renderReceive = (
  params: { qtumAddress: string; qtumAddressSVG: string, hexAddress: string; hexAddressSVG: string; },
) => (
  <Container>
    <Box>
    <Heading size="md">Receive</Heading>
    <Divider/>
      <Text alignment="center">Qtum Address</Text>
      <Box direction="horizontal" alignment="space-between">
        <Text> </Text>
        <Image src={params.qtumAddressSVG} alt="Qtum Address"/>
        <Text> </Text>
      </Box>
      <Copyable value={params.qtumAddress}/>
      <Divider/>
      <Text alignment="center">Qtum Address in Hexadecimal</Text>
      <Box direction="horizontal" alignment="space-between">
        <Text> </Text>
        <Image src={params.hexAddressSVG} alt="Qtum Address in Hexadecimal"/>
        <Text> </Text>
      </Box>
      <Copyable value={params.hexAddress}/>
      <Divider/>
      <Section>
        <Button name="back-to-dashboard" variant="destructive">Back</Button>
      </Section>
    </Box>
  </Container>
);

export const renderDashboard = (
  networks: { list: Chain[]; current: Chain },
  params: { qtumAddress?: string; hexAddress?: string; balance?: string },
) => (
  <Container>
    <Box>
      <Box direction="horizontal" crossAlignment="center" alignment="space-between">
        <Text>{formatUnits(params.balance ?? '0', 18)} QTUM</Text>
        <Dropdown name="networks">
          {networks.list.map((network) => (
            <Option value={String(network.chainId)}>
              {network.chainName}
            </Option>
          ))}
        </Dropdown>
      </Box>
      <Divider/>
      <Section direction="horizontal" alignment="space-between">
        <Text fontWeight="bold">QRC20</Text>
        <Button variant="primary">Add</Button>
      </Section>
      <Divider/>
      <Box direction="horizontal" crossAlignment="center" alignment="space-between">
        <Text>4.1 USDT</Text>
        <Box direction="horizontal" crossAlignment="center" alignment="space-between">
          <Button variant="destructive">Delete</Button>
        </Box>
      </Box>
      <Box direction="horizontal" crossAlignment="center" alignment="space-between">
        <Text>567.89 USDC</Text>
        <Box direction="horizontal" crossAlignment="center" alignment="space-between">
          <Button variant="destructive">Delete</Button>
        </Box>
      </Box>
      <Divider/>
      <Section>
        <Button name="send">Send QTUM</Button>
        <Divider/>
        <Button name="send-qrc20">Send QRC20</Button>
        <Divider/>
        <Button name="receive">Receive</Button>
      </Section>
      <Divider/>
      <Section>
        <Button name="export-private-key">Export Private Key</Button>
        <Divider/>
        <Button name="logout" variant="destructive">Logout</Button>
      </Section>
    </Box>
  </Container>
);
