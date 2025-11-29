import { Box, Divider, Icon, Image, Spinner, Text } from '@metamask/snaps-sdk/jsx';
import { DialogResult, DialogType } from '@metamask/snaps-sdk';

import { Gap, qtumIcon, snapDialog } from '@/helpers';

export const renderSwitchingNetwork = (network?: string) => (
  <Box alignment="center">
    <Gap/>
    <Box direction="horizontal" alignment="space-between">
      <Gap/>
      <Image src={qtumIcon} alt="Qtum"/>
      <Gap/>
    </Box>
    <Gap/>
    <Text alignment="center">Switching network <Icon name="arrow-2-right"/> {network ?? 'Unknown'}</Text>
    <Gap/>
    <Box direction="horizontal" alignment="space-between">
      <Gap/>
      <Spinner/>
      <Gap/>
    </Box>
  </Box>
);

export async function renderSwitchingNetworkDialog (
  fromNetwork: string, toNetwork: string, dialogType: DialogType
): Promise<DialogResult> {

  return await snapDialog(dialogType, (
    <Box>
      <Gap/>
      <Box direction="horizontal" alignment="space-between">
        <Gap/>
        <Image src={qtumIcon} alt="Qtum"/>
        <Gap/>
      </Box>
      <Text alignment="center" fontWeight="bold">Switch Network</Text>
      <Divider/>
      {dialogType === DialogType.Confirmation && (
        <Box>
          <Text alignment="center">{fromNetwork}</Text>
          <Text alignment="center" color={<Icon name="arrow-2-down"/>}></Text>
          <Text alignment="center">{toNetwork}</Text>
        </Box>
      )}
      {dialogType === DialogType.Alert && (
        <Box>
          <Text alignment="center">Switched to {toNetwork}</Text>
        </Box>
      )}
    </Box>
  ));
}
