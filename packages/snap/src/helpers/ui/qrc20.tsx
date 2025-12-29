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

import { PaddedBox } from '@/helpers';
import { ParamsQRC20Type } from '@/types';
import { SNAP_VERSION } from '@/version';

export const renderAddQRC20 = (params?: ParamsQRC20Type) => {
  return (
    <Box>
      <Heading>{params?.token ? 'Add' : 'Search'} QRC20</Heading>
      <Divider />
      <Form name="qrc20-form">
        <Box direction="horizontal" crossAlignment="center">
          <Text>Contract Address</Text>
          <Tooltip
            content={
              <Text size="sm">Ensure this is a valid QRC20 token address</Text>
            }
          >
            <Icon name="info" />
          </Tooltip>
        </Box>
        <Field error={params?.errorContractAddress}>
          <Input name="qrc20-contract-address" disabled={!!params?.token} />
        </Field>
      </Form>
      {params?.token && !params?.isSearching && !params?.failedMessage && (
        <Box>
          <Divider />
          <Text>Name</Text>
          <Section>
            <Text color="muted">{params?.token?.name}</Text>
          </Section>
          <Text>Symbol</Text>
          <Section>
            <Text color="muted">{params?.token?.symbol}</Text>
          </Section>
          <Text>Decimals</Text>
          <Section>
            <Text color="muted">{String(params?.token?.decimals)}</Text>
          </Section>
        </Box>
      )}
      {!params?.token && params?.isSearching && !params?.failedMessage && (
        <Box>
          <Divider />
          <PaddedBox
            size={16}
            direction="vertical"
            children={
              <PaddedBox direction="horizontal" children={<Spinner />} />
            }
          />
        </Box>
      )}
      {!params?.token && !params?.isSearching && params?.failedMessage && (
        <Box>
          <Divider />
          <PaddedBox
            size={20}
            direction="vertical"
            children={
              <PaddedBox
                direction="horizontal"
                children={
                  <Text alignment="center" color="muted" size="sm">
                    {params?.failedMessage}
                  </Text>
                }
              />
            }
          />
        </Box>
      )}
      <Divider />
      <Section>
        <Button
          name={params?.token ? 'add-qrc20' : 'search-qrc20'}
          disabled={params?.isSearching}
          type="submit"
          form="qrc20-form"
        >
          {params?.token ? 'Add' : 'Search'}
        </Button>
        <Divider />
        <Button
          name={params?.token ? 'qrc20' : 'back-to-dashboard'}
          disabled={params?.isSearching}
          variant="destructive"
        >
          {params?.token ? 'Cancel' : 'Back'}
        </Button>
      </Section>
      <Text size="sm" alignment="center" color="muted">
        {SNAP_VERSION} / Powered by Qtum
      </Text>
    </Box>
  );
};
