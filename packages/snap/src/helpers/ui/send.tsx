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

import { QTUM_ICON } from '@/consts';
import { SendEnum } from '@/enums';
import { PaddedBox, Gap, totalAmount, formatUnits } from '@/helpers';
import { formatBalance } from '@/helpers/format';
import type { SendErrorsType, SendResponseType, SendType, TokenType, GasEstimationType } from '@/types';
import { SNAP_VERSION } from '@/consts';

export const renderSendTransaction = (
  name: string,
  symbol: string,
  sender: string,
  recipient: string,
  amount: string,
  isToken: boolean = false,
  response?: SendResponseType,
  isConfirm: boolean = false,
  loading: boolean = false,
  gas?: GasEstimationType,
  gasLoading: boolean = false,
) => (
  <Box alignment="center">
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
      <Text alignment="center" size="md" fontWeight="medium">
        Confirm send
      </Text>
    </Box>
    <Divider />
    <Box>
      <Box direction="horizontal" alignment="space-between">
        <Text color="muted" size="sm">
          {isToken ? 'Token' : 'Native'}
        </Text>
        <Text size="sm" fontWeight="medium">
          {name}
        </Text>
      </Box>
      <Box direction="horizontal" alignment="space-between">
        <Text color="muted" size="sm">
          Amount
        </Text>
        <Text size="sm" fontWeight="medium">
          {amount} {symbol}
        </Text>
      </Box>
      <Box direction="horizontal" alignment="space-between">
        <Text color="muted" size="sm">
          From
        </Text>
        <Text size="sm" fontWeight="medium">
          {sender}
        </Text>
      </Box>
      <Box direction="horizontal" alignment="space-between">
        <Text color="muted" size="sm">
          To
        </Text>
        <Text size="sm" fontWeight="medium">
          {recipient}
        </Text>
      </Box>
      <Box direction="horizontal" alignment="space-between">
        <Text color="muted" size="sm">
          Estimated fee
        </Text>
        {gasLoading || !gas ? (
          <Skeleton height={20} width="23%" />
        ) : (
          <Text size="sm" fontWeight="medium">
            {formatUnits(gas.fee, 18)} QTUM
          </Text>
        )}
      </Box>
      <Box direction="horizontal" alignment="space-between">
        <Text color="muted" size="sm">
          Total amount
        </Text>
        {gasLoading || !gas ? (
          <Skeleton height={20} width="28%" />
        ) : (
          <Text size="sm" fontWeight="medium">
            {totalAmount(symbol, amount, isToken, gas)}
          </Text>
        )}
      </Box>
    </Box>
    <Divider />
    {!response && !isConfirm && loading && (
      <Box alignment="center">
        <PaddedBox
          size={16}
          direction="vertical"
          children={
            <PaddedBox direction="horizontal" children={<Spinner />} />
          }
        />
        <Gap />
        <Divider />
        <Gap />
      </Box>
    )}
    {!isConfirm && !loading && (
      <Box>
        <Banner title="" severity="warning">
          <Text>Are you sure you want to proceed with this transaction?</Text>
        </Banner>
        <Gap />
        <Divider />
        <Gap />
        <Section>
          <Button name="send-confirm">Confirm</Button>
          <Divider />
          <Button name="send-cancel" variant="destructive">
            Cancel
          </Button>
        </Section>
      </Box>
    )}
    {response && isConfirm && !loading && response.isValid && (
      <Box>
        <Banner title="" severity="success">
          <Text>Transaction completed successfully</Text>
          <Text
            size="sm"
            children={
              <Link href={response.transactionLink}>{response.hash}</Link>
            }
          ></Text>
        </Banner>
        <Gap />
        <Divider />
        <Gap />
        <Section>
          <Button name="back-to-dashboard" variant="destructive">
            Close
          </Button>
        </Section>
      </Box>
    )}
    {response && isConfirm && !loading && !response.isValid && (
      <Box>
        <Banner title="" severity="danger">
          <Text>Unable to process transaction</Text>
        </Banner>
        <Gap />
        <Divider />
        <Gap />
        <Section>
          <Button name="send-confirm">Resend</Button>
          <Divider />
          <Button name="send-cancel" variant="destructive">
            Cancel
          </Button>
        </Section>
      </Box>
    )}
    <Text size="sm" alignment="center" color="muted">
      {SNAP_VERSION} / Powered by Qtum
    </Text>
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
      <Box
        direction="horizontal"
        crossAlignment="center"
        alignment="space-between"
      >
        <Heading>Send</Heading>
        <Box>
          <Checkbox
            name="isQRC20"
            label="QRC20"
            variant="toggle"
            checked={send.type === SendEnum.Token}
            disabled={tokens.length == 0}
          />
        </Box>
      </Box>
      <Divider />
      <Form name="send-form">
        {send.type === SendEnum.Token && tokens.length > 0 && (
          <Box>
            <Box direction="horizontal">
              <Text>Token</Text>
              <Tooltip
                content={
                  <Text size="sm">Choose the QRC20 token you want to send</Text>
                }
              >
                <Icon name="info" />
              </Tooltip>
            </Box>
            <Field>
              <Dropdown
                name="contract-address"
                value={contractAddress ?? undefined}
              >
                {tokens.map((token) => (
                  <Option
                    key={token.contractAddress}
                    value={token.contractAddress ?? ''}
                  >
                    {token.name}
                  </Option>
                ))}
              </Dropdown>
            </Field>
          </Box>
        )}
        <Box direction="horizontal">
          <Text>Recipient</Text>
          <Tooltip
            content={
              <Text size="sm">Enter the recipient's address carefully</Text>
            }
          >
            <Icon name="info" />
          </Tooltip>
        </Box>
        <Field error={errors?.recipient}>
          <Input name="recipient" />
        </Field>
        <Box direction="horizontal" alignment="space-between">
          <Box direction="horizontal">
            <Text>Amount</Text>
            <Tooltip
              content={<Text size="sm">Enter the amount you want to send</Text>}
            >
              <Icon name="info" />
            </Tooltip>
          </Box>
          {loading && (
            <Skeleton height={22} width="25%" borderRadius="medium" />
          )}
          {!loading && send.type === SendEnum.Native && send.native && (
            <Text color="muted" size="sm">
              {formatBalance(send.native.balance, 18)} {send.native.symbol}
            </Text>
          )}
          {!loading && send.type === SendEnum.Token && send.token && (
            <Text color="muted" size="sm">
              {formatBalance(send.token.balance, send.token.decimals)}{' '}
              {send.token.symbol}
            </Text>
          )}
        </Box>
        <Field error={errors?.amount}>
          <Input name="amount" type="number" />
        </Field>
      </Form>
      <Divider />
      <Section>
        <Button name="send-action" type="submit" form="send-form">
          Send
        </Button>
        <Divider />
        <Button name="back-to-dashboard" variant="destructive">
          Back
        </Button>
      </Section>
      <Text size="sm" alignment="center" color="muted">
        {SNAP_VERSION} / Powered by Qtum
      </Text>
    </Box>
  );
}
