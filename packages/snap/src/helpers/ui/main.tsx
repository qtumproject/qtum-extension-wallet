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
import { PaddedBoxType, EllipsisOptions } from '@/types';
import { qtumIcon } from '@/consts';

export const Ellipsis = (options: EllipsisOptions) => {
  const head = options.head ?? 6;
  const tail = options.tail ?? 5;
  const ellipsis = options.ellipsis ?? '...';

  const value = (options.data ?? '').trim();
  if (!value) return '';

  const has0x = value.startsWith('0x') || value.startsWith('0X');
  const prefix = has0x ? value.slice(0, 2) : '';
  const body = has0x ? value.slice(2) : value;

  if (body.length <= head + tail) return value;

  const start = body.slice(0, head);
  const end = body.slice(-tail);
  return `${prefix}${start}${ellipsis}${end}`;
};

export const Gap = (space: number = 1, size: 'sm' | 'md' = 'sm'): JSXElement => <Text size={size}>{' '.repeat(space)}</Text>;

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
    <Divider />
    <Text>Private Key</Text>
    <Copyable value={privateKey} sensitive={true} />
    <Divider />
    <Section>
      <Button name="back-to-dashboard" variant="destructive">
        Close
      </Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">
      Powered by Qtum
    </Text>
  </Box>
);

export const renderRemoveWallet = () => (
  <Box>
    <PaddedBox
      direction="vertical"
      children={
        <PaddedBox
          direction="horizontal"
          children={<Image src={qtumIcon} alt="Qtum" />}
        />
      }
    />
    <Text alignment="center" fontWeight="medium">
      Confirm Remove Wallet
    </Text>
    <Divider />
    <Banner title="Warning" severity="warning">
      <Text size="md">
        Are you sure you want to remove wallet? Ensure you have securely saved
        the private key, otherwise you will no longer be able to access this
        wallet.
      </Text>
    </Banner>
    <Divider />
    <Section>
      <Button name="remove-wallet-confirm">Confirm</Button>
      <Divider />
      <Button name="back-to-dashboard" variant="destructive">
        Cancel
      </Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">
      Powered by Qtum
    </Text>
  </Box>
);
