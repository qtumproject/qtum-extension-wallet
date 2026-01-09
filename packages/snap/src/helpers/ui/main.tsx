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
  Selector,
  SelectorOption,
  Card,
  Field,
  Link,
  Spinner,
  Tooltip,
  Icon,
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
  exportType: string,
  privateKey: string,
  wif: string,
  encryptedWIF?: string,
  errorPassphrase?: string,
  loading: boolean = false,
) => (
  <Box>
    <Box
      direction="horizontal"
      alignment="space-between"
      crossAlignment="center"
    >
      <Heading>Export</Heading>
      <Selector
        name="export-type"
        title="Select type"
        value={exportType}
        disabled={loading}
      >
        <SelectorOption key="private-key" value="private-key">
          <Card title="Private Key" value="" />
        </SelectorOption>
        <SelectorOption key="wif" value="wif">
          <Card title="WIF" value="" />
        </SelectorOption>
        <SelectorOption key="encrypted-wif" value="encrypted-wif">
          <Card title="Encrypted WIF" value="" />
        </SelectorOption>
      </Selector>
    </Box>
    <Divider />
    {exportType === 'private-key' && (
      <Box>
        <Text>Private Key</Text>
        <Copyable value={privateKey} sensitive={true} />
      </Box>
    )}
    {exportType === 'wif' && (
      <Box>
        <Text>Wallet Import Format</Text>
        <Copyable value={wif} sensitive={true} />
      </Box>
    )}
    {exportType === 'encrypted-wif' && (
      <Form name="export-key-form">
        <Box direction="horizontal">
          <Text>Passphrase</Text>
          <Tooltip
            content={<Text size="sm">Enter a passphrase to encrypt the WIF. Keep it safe — it's required to decrypt.</Text>}
          >
            <Icon name="info" />
          </Tooltip>
        </Box>
        <Field error={errorPassphrase}>
          <Input name="export-bip38-passphrase" placeholder="(Optional)" />
        </Field>
        {encryptedWIF ? (
          <Box>
            <Gap />
            <Divider />
            <Gap />
            <Text>Encrypted WIF</Text>
            <Copyable value={encryptedWIF} sensitive={true} />
          </Box>
        ) : (
          <Box>
            <Gap />
            <Divider />
            <Gap />
            {loading ? (
              <PaddedBox
                size={13}
                direction="vertical"
                children={
                  <PaddedBox
                    direction="horizontal"
                    children={
                      <PaddedBox
                        direction="horizontal"
                        children={<Spinner />}
                      />
                    }
                  />
                }
              />
            ) : (
              <PaddedBox
                size={17}
                direction="vertical"
                children={
                  <Box direction="horizontal" alignment="center">
                    <Text alignment="center" color="muted" size="sm">
                      BIP38
                    </Text>
                    <Text alignment="center" color="muted" size="sm">
                      /
                    </Text>
                    <Text
                      size="sm"
                      children={
                        <Link href="https://docs.qtum.info/qtum-documentation/qtum-features-and-advances/qtum-bip38">
                          For more
                        </Link>
                      }
                    ></Text>
                  </Box>
                }
              />
            )}
          </Box>
        )}
      </Form>
    )}
    <Divider />
    <Section>
      {exportType === 'encrypted-wif' && (
        <Box>
          <Button
            name="encrypt-bip38"
            form="export-private-key-form"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </Button>
          <Divider />
        </Box>
      )}
      <Button name="back-to-dashboard" variant="destructive" disabled={loading}>
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
        the Private Key / WIF / Encrypted WIF, Otherwise you will no longer be able to access this
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
