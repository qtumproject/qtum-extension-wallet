import { Box, Heading, Text } from "@metamask/snaps-sdk/jsx";

export const errorSnapDialog = async (options: { title?: string, message?: string }) => {
  const { title, message } = options;

  return snap.request({
    method: 'snap_dialog',
    params: {
      type: 'alert',
      content: (
        <Box>
          <Heading>{title ?? 'Error'}</Heading>
          <Text>{message ?? 'Something went wrong.'}</Text>
        </Box>
      ),
    },
  });
};
