import {
  Banner,
  Box,
  Button,
  Copyable,
  Divider,
  Heading,
  Image,
  JSXElement,
  Section,
  Text
} from '@metamask/snaps-sdk/jsx';
import { Component, DialogType, panel } from '@metamask/snaps-sdk';

import { makeSpacerSVG } from '@/helpers';
import { PaddedBoxType } from '@/types';
import {qtumIcon} from "@/consts";

export const Gap = (space: number = 1): JSXElement => <Text>{' '.repeat(space)}</Text>;

export const PaddedBox = (params: PaddedBoxType) => (
  <Box direction={params.direction} alignment="space-between" crossAlignment="center">
    <Image src={makeSpacerSVG(params.direction === 'horizontal' ? params.size : 1, params.direction === 'vertical' ? params.size : 1)}/>
    {params.children}
    <Image src={makeSpacerSVG(params.direction === 'horizontal' ? params.size : 1, params.direction === 'vertical' ? params.size : 1)}/>
  </Box>
);

export const snapDialog = async (type: DialogType, content: JSXElement) => {
  return snap.request({ method: 'snap_dialog', params: { type, content } });
};

export const errorSnapDialog = async (options: { title?: string, message?: string }) => {
  const { title, message } = options;

  return await snapDialog(DialogType.Alert, (
    <Box>
      <Heading>{title ?? 'Error'}</Heading>
      <Text>{message ?? 'Something went wrong'}</Text>
    </Box>
  ));
};

export const getSnapDialog = async (type: DialogType, content: Component[]) => {
  return snap.request({
    method: 'snap_dialog',
    params: {
      type,
      content: panel(content),
    },
  });
};

export const renderExportPrivateKey = (privateKey: string) => (
  <Box>
    <Heading>Export Private Key</Heading>
    <Divider/>
    <Text>Private Key</Text>
    <Copyable value={privateKey} sensitive={true}/>
    <Divider/>
    <Section>
      <Button name="back-to-dashboard" variant="destructive">Close</Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">Powered by Qtum</Text>
  </Box>
);

export const renderLogout = () => (
  <Box>
    <Gap/>
    <Box direction="horizontal" alignment="space-between">
      <Gap/>
      <Image src={qtumIcon} alt="Qtum"/>
      <Gap/>
    </Box>
    <Text alignment="center" fontWeight="medium">Confirm Logout</Text>
    <Divider/>
    <Banner title="Warning" severity="warning">
      <Text>Ensure you understand that logging out will permanently delete your private key.</Text>
    </Banner>
    <Divider/>
    <Section>
      <Button name="logout-confirm">Confirm</Button>
      <Divider/>
      <Button name="back-to-dashboard" variant="destructive">Cancel</Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">Powered by Qtum</Text>
  </Box>
);
