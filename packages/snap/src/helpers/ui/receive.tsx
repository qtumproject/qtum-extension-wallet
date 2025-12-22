import {
  Box,
  Button,
  Card, Copyable,
  Divider,
  Heading,
  Image,
  Section, Selector, SelectorOption,
  Text
} from '@metamask/snaps-sdk/jsx';

import { Gap } from '@/helpers';
import { ReceiveType } from '@/types';

export const renderReceive = (receive: ReceiveType) => (
  <Box>
    <Box
      direction="horizontal"
      crossAlignment="center"
      alignment="space-between"
    >
      <Heading>Receive</Heading>
      <Selector name="receive-type" title="Select receive">
        <SelectorOption key="qtum" value="qtum">
          <Card title="Qtum" value="" />
        </SelectorOption>
        <SelectorOption key="hexadecimal" value="hexadecimal">
          <Card title="Hexadecimal" value="" />
        </SelectorOption>
      </Selector>
    </Box>
    <Divider />
    {receive.type === 'qtum' && (
      <Box>
        <Box direction="horizontal" alignment="space-between">
          <Gap />
          <Image src={receive.qrCodes.qtum} alt="Qtum Address" />
          <Gap />
        </Box>
        <Box>
          <Text alignment="center" size="sm" color="muted">
            Your Qtum address
          </Text>
          <Copyable value={receive.address.qtum} />
        </Box>
      </Box>
    )}
    {receive.type === 'hexadecimal' && (
      <Box>
        <Box direction="horizontal" alignment="space-between">
          <Gap />
          <Image
            src={receive.qrCodes.hexadecimal}
            alt="Qtum Address in Hexadecimal"
          />
          <Gap />
        </Box>
        <Box>
          <Text alignment="center" size="sm" color="muted">
            Your Qtum address in Hexadecimal format
          </Text>
          <Copyable value={receive.address.hexadecimal} />
        </Box>
      </Box>
    )}
    <Divider />
    <Section>
      <Button name="back-to-dashboard" variant="destructive">
        Back
      </Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">
      Powered by Qtum
    </Text>
  </Box>
);
