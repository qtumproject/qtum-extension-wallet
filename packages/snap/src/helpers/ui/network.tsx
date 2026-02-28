import type { DialogResult } from '@metamask/snaps-sdk';
import { DialogType } from '@metamask/snaps-sdk';
import { Bold, Box, Divider, Heading, Text } from '@metamask/snaps-sdk/jsx';

import { snapDialog } from '@/helpers';

export const renderSwitchingNetworkDialog = async (
  toNetwork: string,
): Promise<DialogResult> => {
  return await snapDialog(
    DialogType.Confirmation,
    <Box
      children={[
        <Heading children="Switch Network" />,
        <Box children={<Divider />} />,
        <Text
          children={[
            'Do you want to switch the network to ',
            <Bold children={toNetwork} />,
            '?',
          ]}
        />,
      ]}
    />,
  );
};
