import {
  Banner,
  Box,
  Button,
  Copyable,
  Divider,
  Form,
  Heading,
  Image,
  Input,
  JSXElement,
  Section,
  Text,
} from '@metamask/snaps-sdk/jsx';
import { Component, DialogType, panel } from '@metamask/snaps-sdk';
import { SNAP_VERSION } from '@/consts';

import { makeSpacerSVG } from '@/helpers';
import { PaddedBoxType, EllipsisOptions } from '@/types';
import { QTUM_ICON } from '@/consts';

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

export const renderExportPrivateKey = (
  privateKeyHex: string,
  wifKey: string,
  bip38Key?: string,
  errorPassphrase?: string,
) => (
  <Box>
    <Heading>Export Private Key</Heading>
    <Divider />
    <Text>Private Key</Text>
    <Copyable value={privateKeyHex} sensitive={true} />
    <Divider />
    <Text>Wallet Import Format</Text>
    <Copyable value={wifKey} sensitive={true} />
    <Divider />
    <Text>Encrypt with BIP38</Text>
    <Form name="export-private-key-form">
      <Text size="sm" color="muted">Optionally add a passphrase to encrypt your private key (BIP38).</Text>
      <Divider />
      <Text>Passphrase</Text>
      <Input name="bip38-passphrase" placeholder="(Optional)" />
    </Form>
    <Section>
      <Button name="encrypt-bip38" form="export-private-key-form">Generate BIP38</Button>
    </Section>
    {errorPassphrase ? (
      <Box>
        <Divider />
        <Banner severity="warning" title="">
          <Text>{errorPassphrase}</Text>
        </Banner>
      </Box>
    ) : null}
    {bip38Key ? (
      <Box>
        <Divider />
        <Text>BIP38 Encrypted Key</Text>
        <Copyable value={bip38Key} sensitive={true} />
      </Box>
    ) : null}
    <Divider />
    <Section>
      <Button name="back-to-dashboard" variant="destructive">
        Close
      </Button>
    </Section>
    <Text size="sm" alignment="center" color="muted">
      {SNAP_VERSION} / Powered by Qtum
    </Text>
  </Box>
);

export const renderRemoveWallet = () => (
  <Box>
    <Box>
      <PaddedBox
        direction="vertical"
        children={
          <PaddedBox
            direction="horizontal"
            children={<Image src={QTUM_ICON} alt="Qtum" />}
          />
        }
      />
      <Text alignment="center" size="md" fontWeight="medium">
        Confirm remove wallet
      </Text>
    </Box>
    <Divider />
    <Banner title="" severity="warning">
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
      {SNAP_VERSION} / Powered by Qtum
    </Text>
  </Box>
);
