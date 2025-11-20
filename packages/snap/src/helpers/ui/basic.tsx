import {
  Bold, Box, Button, Container, Divider, Heading, Icon, Image, JSXElement, Link, Section, Spinner, Text
} from '@metamask/snaps-sdk/jsx';
import { DialogType } from '@metamask/snaps-sdk';

import { qtumIcon } from '@/helpers';
import { SendResponse } from "@/helpers/send";

export const Gap = (): JSXElement => <Text>{' '}</Text>;

export const snapDialog = async (type: DialogType, content: JSXElement) => {
  return snap.request({ method: 'snap_dialog', params: { type, content } });
};

export const errorSnapDialog = async (options: { title?: string, message?: string }) => {
  const { title, message } = options;

  return await snapDialog(DialogType.Alert, (
    <Box>
      <Heading>{title ?? 'Error'}</Heading>
      <Text>{message ?? 'Something went wrong.'}</Text>
    </Box>
  ));
};

export const renderSwitchingNetwork = (network: string) => (
  <Box alignment="center">
    <Gap/>
    <Box direction="horizontal" alignment="space-between">
      <Gap/><Image src={qtumIcon} alt="Qtum"/><Gap/>
    </Box>
    <Text alignment="center">Switching network to {network}</Text>
    <Box direction="horizontal" alignment="space-between">
      <Gap/><Spinner/><Gap/>
    </Box>
  </Box>
);

export const renderSendTransaction = (
  name: string,
  symbol: string,
  recipient: string,
  amount: string,
  response?: SendResponse,
) => (
  <Container>
    <Box alignment="center">
      <Gap/>
      <Box direction="horizontal" alignment="space-between">
        <Gap/><Image src={qtumIcon} alt="Qtum"/><Gap/>
      </Box>
      <Text alignment="center" size="md">Sending <Bold>{name}</Bold></Text>
      <Divider/>
      <Box>
        <Text alignment="center">{amount} {symbol}</Text>
        <Text children={<Icon name="arrow-2-down"/>} alignment="center"></Text>
        <Text alignment="center">{recipient}</Text>
      </Box>
      {response === undefined && (
        <Box>
          <Gap/>
          <Box direction="horizontal" crossAlignment="center" alignment="space-between">
            <Gap/><Spinner/><Gap/>
          </Box>
        </Box>
      )}
      {response !== undefined && (
        <Box>
          {response.isValid && (
            <Box>
              <Text alignment="center" fontWeight="bold">Submitted</Text>
              <Text alignment="center" size="sm" children={
                <Link href={response.transactionLink}>{response.hash}</Link>
              }></Text>
            </Box>
          )}
          {!response.isValid && (
            <Box>
              <Text alignment="center" fontWeight="bold" color="error">Failed</Text>
              <Text alignment="center" size="sm">{response.errorMessage}</Text>
            </Box>
          )}
          <Gap/><Divider/><Gap/>
          <Section>
            <Button name="back-to-dashboard" variant="destructive">Close</Button>
          </Section>
        </Box>
      )}
      <Text size="sm" alignment="center" color="muted">Powered by qtum.org</Text>
    </Box>
  </Container>
);
