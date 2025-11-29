import {
  Box,
  Text,
  Divider,
  Button,
  Section,
  Heading,
  Icon,
  Form,
  Field,
  Input,
  Tooltip,
  Spinner
} from '@metamask/snaps-sdk/jsx';

import { Gap } from '@/helpers';
import { TokenType } from '@/types';

export const renderAddQRC20 = (
  token?: TokenType, errorContractAddress?: string, isSearching: boolean = false
) => {
  return (
    <Box>
      <Heading>Add QRC20</Heading>
      <Divider/>
      <Form name="qrc20-form">
        <Box direction="horizontal">
          <Text>Contract Address</Text>
          <Tooltip content={<Text size="sm">
            Ensure this is a valid QRC20 token address
          </Text>}><Icon name="info" /></Tooltip>
        </Box>
        <Field error={errorContractAddress}>
          <Input name="qrc20-contract-address" disabled={!!token}/>
        </Field>
      </Form>
      {token && !isSearching && (
        <Box>
          <Divider/>
          <Text>Name</Text>
          <Section><Text color="muted">{token?.name}</Text></Section>
          <Text>Symbol</Text>
          <Section><Text color="muted">{token?.symbol}</Text></Section>
          <Text>Decimals</Text>
          <Section><Text color="muted">{String(token?.decimals)}</Text></Section>
        </Box>
      )}
      <Divider/>
      {!token && isSearching && (
        <Box>
          <Gap/>
          <Box direction="horizontal" alignment="space-between">
            <Gap/><Spinner/><Gap/>
          </Box>
          <Gap/>
        </Box>
      )}
      <Section>
        <Button name={token ? 'add-qrc20' : 'search-qrc20'} disabled={isSearching} type="submit" form="qrc20-form">
          {token ? 'Add' : 'Search'}
        </Button>
        <Divider/>
        <Button name="back-to-dashboard" disabled={isSearching} variant="destructive">Back</Button>
      </Section>
      <Text size="sm" alignment="center" color="muted">Powered by Qtum</Text>
    </Box>
  );
}
