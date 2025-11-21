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
import { minusIcon, plusIcon, Gap } from "@/helpers";
import {Qrc20Token} from "@/types/storage-types";

export type SendParams = {
  symbol: string;
  isQRC20: boolean;
  balance: string;
};

type SendErrors = {
  recipient?: string;
  amount?: string;
}

export type AddQRC20 = {
  name: string;
  symbol: string;
  decimals: number;
}

export type QRC20Tokens = {
  contractAddress?: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  chainId: number;
}

export const renderAddQRC20 = (params?: AddQRC20, errorContractAddress?: string) => (
  <Container>
    <Box>
      <Heading>Add QRC20</Heading>
      <Divider/>
      <Form name="qrc20-form">
        <Box direction="horizontal">
          <Text>Contract Address</Text>
          <Tooltip content={<Text size="sm">
            Make sure QRC20 contract address
          </Text>}><Icon name="info" /></Tooltip>
        </Box>
        <Field error={errorContractAddress}>
          <Input name="contract-address" disabled={!!params}/>
        </Field>
      </Form>
      {!!params && (
        <Box>
          <Divider/>
          <Text>Name</Text>
          <Section><Text color="muted">{params?.name}</Text></Section>
          <Text>Symbol</Text>
          <Section><Text color="muted">{params?.symbol}</Text></Section>
          <Text>Decimals</Text>
          <Section><Text color="muted">{String(params?.decimals)}</Text></Section>
        </Box>
      )}
      <Divider/>
      <Section>
        <Button name={!!params ? 'add-qrc20' : 'search-qrc20'} type="submit" form="qrc20-form">
          {!!params ? 'Add' : 'Search'}
        </Button>
        <Divider/>
        <Button name="back-to-dashboard" variant="destructive">Back</Button>
      </Section>
      <Text size="sm" alignment="center" color="muted">Powered by qtum.org</Text>
    </Box>
  </Container>
);

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
              <Input name="token"/>
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
}) => (
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
  tokens: QRC20Tokens[] = []
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
          <Button name="qrc20" variant="primary" children={<Image src={plusIcon}/>}></Button>
        </Box>
      </Section>
      <Box>
        {tokens.length === 0 ? (
          <Text alignment="center" color="muted" size="sm">No QRC20 tokens</Text>
        ) : (
          tokens.map((token) => (
            <Box direction="horizontal" crossAlignment="center" alignment="space-between">
              <Box direction="horizontal">
                <Gap space={2}/>
                <Text>{formatBalance(token.balance, token.decimals)} {token.symbol}</Text>
              </Box>
              <Box direction="horizontal">
                <Box direction="horizontal" crossAlignment="center" alignment="space-between">
                  <Button name={`delete-qrc20-${token.contractAddress}`} children={<Image src={minusIcon}/>}></Button>
                </Box>
                <Gap space={2}/>
              </Box>
            </Box>
          ))
        )}
      </Box>
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
