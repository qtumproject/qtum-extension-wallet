import type { DialogResult } from '@metamask/snaps-sdk';
import { DialogType } from '@metamask/snaps-sdk';
import { Box, Divider, Heading, Text } from '@metamask/snaps-sdk/jsx';

import { snapDialog } from '@/helpers';

export const renderSwitchingNetworkDialog = async (
  fromNetwork: string,
  toNetwork: string,
): Promise<DialogResult> => {
  return await snapDialog(
    DialogType.Confirmation,
    <Box
      children={[
        <Heading children="Switch Network" />,
        <Divider />,
        <Text
          children={`Do you want to switch the network from ${fromNetwork} to ${toNetwork}?`}
        />,
      ]}
    />,
  );
};
