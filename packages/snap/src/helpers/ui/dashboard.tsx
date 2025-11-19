import {
  Box,
  Text,
  Container,
  Divider,
  Copyable,
  Button,
  Dropdown,
  Option,
  Section,
  Image,
  Heading,
  Icon,
  Form,
  Field,
  Checkbox,
  Input,
  Tooltip
} from '@metamask/snaps-sdk/jsx';
import { Chain } from '@qtumproject/qtum-wallet-connector';

import { formatBalance } from '@/helpers/format';
import { qtumIcon, minusIcon, plusIcon } from "@/helpers";

export type SendParams = {
  symbol: string;
  isQRC20: boolean;
  balance: string;
};

type SendErrors = {
  recipient?: string;
  amount?: string;
}

export const renderSend = (params: SendParams, errors?: SendErrors) => (
  <Container>
    <Box>
      <Box direction="horizontal" crossAlignment="center" alignment="space-between">
        <Heading>Send</Heading>
        <Box>
          <Checkbox name="isQRC20" label="QRC20" variant="toggle" checked={params.isQRC20}/>
        </Box>
      </Box>
      <Divider/>
      <Form name="send-form">
        {params.isQRC20 && (
          <Box>
            <Box direction="horizontal">
              <Text>Token</Text>
              <Tooltip content={<Text size="sm">
                QRC20 token contract address
              </Text>}><Icon name="info" /></Tooltip>
            </Box>
            <Field>
              <Input name="token-address"/>
            </Field>
          </Box>
        )}
        <Box direction="horizontal">
          <Text>Recipient</Text>
          <Tooltip content={<Text size="sm">
            Make sure recipient address
          </Text>}><Icon name="info" /></Tooltip>
        </Box>
        <Field error={errors?.recipient}>
          <Input name="recipient"/>
        </Field>
        <Box direction="horizontal" alignment="space-between">
          <Box direction="horizontal">
            <Text>Amount</Text>
            <Tooltip content={<Text size="sm">
              You want to send the amount
            </Text>}><Icon name="info" /></Tooltip>
          </Box>
          <Text color="muted">{params.balance} {params.symbol}</Text>
        </Box>
        <Field error={errors?.amount}>
          <Input name="amount" type="number"/>
        </Field>
      </Form>
      <Divider/>
      <Section>
        <Button name="send" type="submit" form="send-form">Send</Button>
        <Divider/>
        <Button name="back-to-dashboard" variant="destructive">Back</Button>
      </Section>
      <Text size="sm" alignment="center" color="muted">Powered by qtum.org</Text>
    </Box>
  </Container>
);

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
        <Heading>Receive</Heading>
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
      <Text size="sm" alignment="center" color="muted">Powered by qtum.org</Text>
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
        <Heading>Dashboard</Heading>
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
        <Text>{formatBalance(params.balance ?? '0', 18)} QTUM</Text>
        <Box direction="horizontal">
          <Button name="send-native">Send</Button>
          <Text color="muted"> | </Text>
          <Button name="receive">Receive</Button>
        </Box>
      </Box>
      <Divider/>
      <Section>
        <Box direction="horizontal" alignment="space-between">
          <Heading>QRC20</Heading>
          <Button variant="primary" children={<Image src={plusIcon}/>}></Button>
        </Box>
      </Section>
      <Section>
        <Box direction="horizontal" crossAlignment="center" alignment="space-between">
          <Text>4.1 USDT</Text>
          <Box direction="horizontal" crossAlignment="center" alignment="space-between">
            <Button name="delete-qrc20-000" children={<Image src={minusIcon}/>}></Button>
          </Box>
        </Box>
        <Box direction="horizontal" crossAlignment="center" alignment="space-between">
          <Text>567.89 USDC</Text>
          <Box direction="horizontal" crossAlignment="center" alignment="space-between">
            <Button name="delete-qrc20-001" children={<Image src={minusIcon}/>}></Button>
          </Box>
        </Box>
      </Section>
      <Divider/>
      <Section>
        <Button name="export-private-key">Export Private Key</Button>
        <Divider/>
        <Button name="logout" variant="destructive">Logout</Button>
      </Section>
      <Text size="sm" alignment="center" color="muted">Powered by qtum.org</Text>
    </Box>
  </Container>
);
