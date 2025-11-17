import {
  Box, Text, Container, Divider, Copyable, Button, Dropdown, Option, Section, Image, Heading, Icon
} from '@metamask/snaps-sdk/jsx';
import { Chain } from '@qtumproject/qtum-wallet-connector';

import { formatUnits } from '@/helpers/format';

export const renderReceive = (params: {
    qtumAddress: string;
    qtumAddressSVG: string;
    hexAddress: string;
    hexAddressSVG: string;
    selected: 'qtum' | 'hex';
  },
) => (
  <Container>
    <Box>
      <Box direction="horizontal" crossAlignment="center" alignment="space-between">
        <Text>Receive</Text>
        <Dropdown name="receive-type">
          <Option value="qtum">Qtum</Option>
          <Option value="hex">Hexadecimal</Option>
        </Dropdown>
      </Box>
      <Divider/>
      {params.selected === 'qtum' && (
        <Box>
          <Box direction="horizontal" alignment="space-between">
            <Text> </Text>
            <Image src={params.qtumAddressSVG} alt="Qtum Address"/>
            <Text> </Text>
          </Box>
          <Box>
            <Text alignment="center" size="sm" color="muted">Your Qtum address</Text>
            <Copyable value={params.qtumAddress}/>
          </Box>
        </Box>
      )}
      {params.selected === 'hex' && (
        <Box>
          <Box direction="horizontal" alignment="space-between">
            <Text> </Text>
            <Image src={params.hexAddressSVG} alt="Qtum Address in Hexadecimal"/>
            <Text> </Text>
          </Box>
          <Box>
            <Text alignment="center" size="sm" color="muted">Your Qtum address in Hexadecimal format</Text>
            <Copyable value={params.hexAddress}/>
          </Box>
        </Box>
      )}
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
        <Text>Dashboard</Text>
        <Dropdown name="networks">
          {networks.list.map((network) => (
            <Option value={String(network.chainId)}>
              {network.chainName}
            </Option>
          ))}
        </Dropdown>
      </Box>
      <Divider/>
      <Box direction="horizontal" alignment="space-between">
        <Text>{formatUnits(params.balance ?? '0', 18)} QTUM</Text>
        <Box direction="horizontal">
          <Button name="send">Send</Button>
          <Text color="muted"> | </Text>
          <Button name="receive">Receive</Button>
        </Box>
      </Box>
      <Divider/>
      <Section>
        <Box direction="horizontal" alignment="space-between">
          <Heading>QRC20</Heading>
          <Button variant="primary" children={<Icon name="add" size="inherit" color="primary"/>}>Add</Button>
        </Box>
        <Divider/>
        <Box>
          <Box direction="horizontal" crossAlignment="center" alignment="space-between">
            <Text>4.1 USDT</Text>
            <Box direction="horizontal" crossAlignment="center" alignment="space-between">
              <Button children={<Icon name="arrow-2-up" size="inherit"/>}></Button>
              <Button children={<Icon name="trash" size="inherit"/>}></Button>
            </Box>
          </Box>
          <Box direction="horizontal" crossAlignment="center" alignment="space-between">
            <Text>567.89 USDC</Text>
            <Box direction="horizontal" crossAlignment="center" alignment="space-between">
              <Button children={<Icon name="arrow-2-up" size="inherit"/>}></Button>
              <Button children={<Icon name="trash" size="inherit"/>}></Button>
            </Box>
          </Box>
        </Box>
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
