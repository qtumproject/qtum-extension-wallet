import {
  Box,
  Button,
  Copyable,
  Divider,
  Dropdown,
  Heading,
  Image,
  Option,
  Section,
  Text
} from '@metamask/snaps-sdk/jsx';

import { Gap } from '@/helpers';
import { ReceiveContext } from '@/types/contexts';

export const renderReceive = (receiveContext: ReceiveContext) => (
  <Box>
    <Box direction="horizontal" crossAlignment="center" alignment="space-between">
      <Heading>Receive</Heading>
      <Dropdown name="receive-type">
        <Option value="qtum">Qtum</Option>
        <Option value="hexadecimal">Hexadecimal</Option>
      </Dropdown>
    </Box>
    <Divider/>
    {receiveContext.type === 'qtum' && (
      <Box>
        <Box direction="horizontal" alignment="space-between">
          <Gap/>
          <Image src={receiveContext.qrCodes.qtum} alt="Qtum Address"/>
          <Gap/>
        </Box>
        <Box>
          <Text alignment="center" size="sm" color="muted">Your Qtum address</Text>
          <Copyable value={receiveContext.address.qtum}/>
        </Box>
      </Box>
    )}
    {receiveContext.type === 'hexadecimal' && (
      <Box>
        <Box direction="horizontal" alignment="space-between">
          <Gap/>
          <Image src={receiveContext.qrCodes.hexadecimal} alt="Qtum Address in Hexadecimal"/>
          <Gap/>
        </Box>
        <Box>
          <Text alignment="center" size="sm" color="muted">Your Qtum address in Hexadecimal format</Text>
          <Copyable value={receiveContext.address.hexadecimal}/>
        </Box>
      </Box>
    )}
    <Divider/>
    <Section>
      <Button name="back-to-dashboard" variant="destructive">Back</Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">Powered by Qtum</Text>
  </Box>
);
