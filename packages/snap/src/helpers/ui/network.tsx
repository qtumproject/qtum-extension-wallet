import type { DialogResult } from '@metamask/snaps-sdk';
import { DialogType } from '@metamask/snaps-sdk';
import { Box, Divider, Icon, Image, Text } from '@metamask/snaps-sdk/jsx';

import { QTUM_ICON } from '@/consts';
import { Gap, snapDialog } from '@/helpers';

export const renderSwitchingNetworkDialog = async (
  fromNetwork: string,
  toNetwork: string,
  dialogType: DialogType,
): Promise<DialogResult> => {
  return await snapDialog(
    dialogType,
    <Box
      children={[
        <Gap />,
        <Box
          direction="horizontal"
          alignment="space-between"
          children={[<Gap />, <Image src={QTUM_ICON} alt="Qtum" />, <Gap />]}
        />,
        <Text alignment="center" fontWeight="bold" children="Switch Network" />,
        <Divider />,
        dialogType === DialogType.Confirmation && (
          <Box
            children={[
              <Text alignment="center" children={fromNetwork} />,
              <Text
                alignment="center"
                children={<Icon name="arrow-2-down" />}
              />,
              <Text alignment="center" children={toNetwork} />,
            ]}
          />
        ),
        dialogType === DialogType.Alert && (
          <Box
            children={
              <Text alignment="center" children={`Switched to ${toNetwork}`} />
            }
          />
        ),
      ]}
    />,
  );
};
