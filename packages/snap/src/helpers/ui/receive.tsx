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
import { ReceiveContext } from '@/types';

export const renderReceive = (params: ReceiveContext) => (
  <Box>
    <Box direction="horizontal" crossAlignment="center" alignment="space-between">
      <Heading>Receive</Heading>
      <Dropdown name="receive-type">
        <Option value="qtum">Qtum</Option>
        <Option value="hex">Hexadecimal</Option>
      </Dropdown>
    </Box>
    <Divider/>
    {params.addressType === 'qtum' && (
      <Box>
        <Box direction="horizontal" alignment="space-between">
          <Gap/>
          <Image src={params.qrCodes.qtum} alt="Qtum Address"/>
          <Gap/>
        </Box>
        <Box>
          <Text alignment="center" size="sm" color="muted">Your Qtum address</Text>
          <Copyable value={params.addresses.qtum}/>
        </Box>
      </Box>
    )}
    {params.addressType === 'hex' && (
      <Box>
        <Box direction="horizontal" alignment="space-between">
          <Gap/>
          <Image src={params.qrCodes.hex} alt="Qtum Address in Hexadecimal"/>
          <Gap/>
        </Box>
        <Box>
          <Text alignment="center" size="sm" color="muted">Your Qtum address in Hexadecimal format</Text>
          <Copyable value={params.addresses.hex}/>
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
