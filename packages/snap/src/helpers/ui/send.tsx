import {
  Banner,
  Box,
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Field,
  Form,
  Heading,
  Icon,
  Image,
  Input,
  Link,
  Option,
  Section,
  Skeleton,
  Spinner,
  Text,
  Tooltip
} from '@metamask/snaps-sdk/jsx';

import { qtumIcon } from '@/consts';
import { SendEnum } from '@/enums';
import { PaddedBox, Gap } from '@/helpers';
import { formatBalance } from '@/helpers/format';
import type { SendErrorsType, SendResponseType, SendType, TokenType } from '@/types';

export const renderSendTransaction = (
  name: string,
  symbol: string,
  recipient: string,
  amount: string,
  response?: SendResponseType,
  isConfirm: boolean = false,
  loading: boolean = false
) => (
  <Box alignment="center">
    <Gap/>
    <Box direction="horizontal" alignment="space-between">
      <Gap/><Image src={qtumIcon} alt="Qtum"/><Gap/>
    </Box>
    <Box direction="horizontal" alignment="center">
      <Text>Sending</Text>
      <Text color="muted">/</Text>
      <Text fontWeight="medium">{name}</Text>
    </Box>
    <Divider/>
    <Box>
      <Box direction="horizontal" alignment="center">
        <Text>{amount}</Text>
        <Text fontWeight="medium">{symbol}</Text>
      </Box>
      <Text children={<Icon name="arrow-2-down"/>} alignment="center"></Text>
      <Text alignment="center">{recipient}</Text>
    </Box>
    {!isConfirm && !loading && (
      <Box>
        <Banner title="" severity="warning">
          <Text>Are you sure you want to proceed with this transaction?</Text>
        </Banner>
        <Gap/><Divider/><Gap/>
        <Section>
          <Button name="send-confirm">Confirm</Button>
          <Divider/>
          <Button name="send-cancel" variant="destructive">Cancel</Button>
        </Section>
      </Box>
    )}
    {!response && !isConfirm && loading && (
      <Box alignment="center">
        <PaddedBox size={75} direction="vertical" children={
          <PaddedBox direction="horizontal" children={<Spinner/>}/>
        }/>
      </Box>
    )}
    {response && isConfirm && !loading && (
      <Box>
        {response.isValid && (
          <Banner title="Success" severity="success">
            <Text>Transaction completed successfully.</Text>
            <Text size="sm" children={
              <Link href={response.transactionLink}>{response.hash}</Link>
            }></Text>
          </Banner>
        )}
        {!response.isValid && (
          <Banner title="Error" severity="danger">
            <Text>Unable to process transaction</Text>
          </Banner>
        )}
        <Gap/><Divider/><Gap/>
        <Section>
          <Button name="refresh" variant="destructive">Close</Button>
        </Section>
      </Box>
    )}
    <Text size="sm" alignment="center" color="muted">Powered by Qtum</Text>
  </Box>
);

export const renderSend = (
  send: SendType,
  tokens: TokenType[],
  loading: boolean = false,
  contractAddress?: string,
  errors?: SendErrorsType
) => {

  return (
    <Box>
      <Box direction="horizontal" crossAlignment="center" alignment="space-between">
        <Heading>Send</Heading>
        <Box>
          <Checkbox name="isQRC20" label="QRC20" variant="toggle" checked={send.type === SendEnum.Token} disabled={tokens.length == 0}/>
        </Box>
      </Box>
      <Divider/>
      <Form name="send-form">
        {send.type === SendEnum.Token && tokens.length > 0 && (
          <Box>
            <Box direction="horizontal">
              <Text>Token</Text>
              <Tooltip content={<Text size="sm">
                Choose the QRC20 token you want to send
              </Text>}><Icon name="info" /></Tooltip>
            </Box>
            <Field>
              <Dropdown name="contract-address" value={contractAddress ?? undefined}>
                {tokens.map((token) => (
                  <Option key={token.contractAddress} value={token.contractAddress ?? ''}>{token.name}</Option>
                ))}
              </Dropdown>
            </Field>
          </Box>
        )}
        <Box direction="horizontal">
          <Text>Recipient</Text>
          <Tooltip content={<Text size="sm">
            Enter the recipient's address carefully
          </Text>}><Icon name="info" /></Tooltip>
        </Box>
        <Field error={errors?.recipient}>
          <Input name="recipient"/>
        </Field>
        <Box direction="horizontal" alignment="space-between">
          <Box direction="horizontal">
            <Text>Amount</Text>
            <Tooltip content={<Text size="sm">
              Enter the amount you want to send
            </Text>}><Icon name="info" /></Tooltip>
          </Box>
          {loading && (
            <Skeleton height={22} width="20%" borderRadius="medium"/>
          )}
          {!loading && send.type === SendEnum.Native && send.native && (
            <Text color="muted" size="sm">{formatBalance(send.native.balance, 18)} {send.native.symbol}</Text>
          )}
          {!loading && send.type === SendEnum.Token && send.token && (
            <Text color="muted" size="sm">{formatBalance(send.token.balance, send.token.decimals)} {send.token.symbol}</Text>
          )}
        </Box>
        <Field error={errors?.amount}>
          <Input name="amount" type="number"/>
        </Field>
      </Form>
      <Divider/>
      <Section>
        <Button name="send-action" type="submit" form="send-form">Send</Button>
        <Divider/>
        <Button name="back-to-dashboard" variant="destructive">Back</Button>
      </Section>
      <Text size="sm" alignment="center" color="muted">Powered by Qtum</Text>
    </Box>
  );
}
