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
import { ReceiveType } from '@/types';

export const renderReceive = (receive: ReceiveType) => (
  <Box>
    <Box direction="horizontal" crossAlignment="center" alignment="space-between">
      <Heading>Receive</Heading>
      <Dropdown name="receive-type">
        <Option value="qtum">Qtum</Option>
        <Option value="hexadecimal">Hexadecimal</Option>
      </Dropdown>
    </Box>
    <Divider/>
    {receive.type === 'qtum' && (
      <Box>
        <Box direction="horizontal" alignment="space-between">
          <Gap/>
          <Image src={receive.qrCodes.qtum} alt="Qtum Address"/>
          <Gap/>
        </Box>
        <Box>
          <Text alignment="center" size="sm" color="muted">Your Qtum address</Text>
          <Copyable value={receive.address.qtum}/>
        </Box>
      </Box>
    )}
    {receive.type === 'hexadecimal' && (
      <Box>
        <Box direction="horizontal" alignment="space-between">
          <Gap/>
          <Image src={receive.qrCodes.hexadecimal} alt="Qtum Address in Hexadecimal"/>
          <Gap/>
        </Box>
        <Box>
          <Text alignment="center" size="sm" color="muted">Your Qtum address in Hexadecimal format</Text>
          <Copyable value={receive.address.hexadecimal}/>
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
