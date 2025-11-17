import { Bold, Box, Divider, Heading, Image, JSXElement, Spinner, Text } from "@metamask/snaps-sdk/jsx";
import { DialogType } from "@metamask/snaps-sdk";
import {qtumIcon} from "@/helpers";

export const snapDialog = async (type: DialogType, content: JSXElement) => {
  return snap.request({ method: 'snap_dialog', params: { type, content } });
};

export const errorSnapDialog = async (options: { title?: string, message?: string }) => {
  const { title, message } = options;

  return await snapDialog(DialogType.Alert, (
    <Box>
      <Heading>{title ?? 'Error'}</Heading>
      <Text>{message ?? 'Something went wrong.'}</Text>
    </Box>
  ));
};

export const renderSwitchingNetwork = (network: string) => (
  <Box alignment="center">
    <Text> </Text>
    <Box direction="horizontal" alignment="space-between">
      <Text> </Text>
      <Image src={qtumIcon} alt="Qtum"/>
      <Text> </Text>
    </Box>
    <Text alignment="center">Switching network to {network}</Text>
    <Box direction="horizontal" alignment="space-between">
      <Text> </Text>
      <Spinner />
      <Text> </Text>
    </Box>
  </Box>
);
