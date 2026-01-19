import { Box, Divider, Icon, Image, Text } from '@metamask/snaps-sdk/jsx';
import { DialogResult, DialogType } from '@metamask/snaps-sdk';

import { QTUM_ICON } from '@/consts';
import { Gap, snapDialog } from '@/helpers';

export async function renderSwitchingNetworkDialog (
  fromNetwork: string, toNetwork: string, dialogType: DialogType
): Promise<DialogResult> {

  return await snapDialog(
    dialogType,
    <Box
      children={[
        <Gap />,
        <Box
          direction="horizontal"
          alignment="space-between"
          children={[
            <Gap />,
            <Image src={QTUM_ICON} alt="Qtum" />,
            <Gap />,
          ]}
        />,
        <Text
          alignment="center"
          fontWeight="bold"
          children="Switch Network"
        />,
        <Divider />,
        dialogType === DialogType.Confirmation && (
          <Box
            children={[
              <Text alignment="center" children={fromNetwork} />,
              <Text
                alignment="center"
                color={<Icon name="arrow-2-down" />}
                children=""
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
}
