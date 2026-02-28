import { DialogType } from '@metamask/snaps-sdk';
import { Box, Copyable, Divider, Heading, Text } from '@metamask/snaps-sdk/jsx';

import { snapDialog } from '@/helpers';

export async function showWalletCreatedSnapDialog(
  ethAddr: string,
  qtumAddr: string,
) {
  return await snapDialog(
    DialogType.Confirmation,
    <Box
      children={[
        <Heading children="Your Wallet" />,
        <Box children={<Divider />} />,

        <Text children="Your Qtum address:" />,
        <Copyable value={qtumAddr} />,

        <Text children="Your Qtum address in hexadecimal format:" />,
        <Copyable value={ethAddr} />,
      ]}
    />,
  );
}
