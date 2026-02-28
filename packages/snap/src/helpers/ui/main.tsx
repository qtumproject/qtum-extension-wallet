import { DialogType } from '@metamask/snaps-sdk';
import type { JSXElement } from '@metamask/snaps-sdk/jsx';
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

import { FOOTER_TEXT, QTUM_ICON } from '@/consts';
import { makeSpacerSVG } from '@/helpers';
import type { PaddedBoxType, EllipsisOptions, GapType } from '@/types';

export const Ellipsis = (options: EllipsisOptions) => {
  const head = options.head ?? 6;
  const tail = options.tail ?? 5;
  const ellipsis = options.ellipsis ?? '...';

  const value = (options.data ?? '').trim();
  if (!value) {
    return '';
  }

  const has0x = value.startsWith('0x') || value.startsWith('0X');
  const prefix = has0x ? value.slice(0, 2) : '';
  const body = has0x ? value.slice(2) : value;

  if (body.length <= head + tail) {
    return value;
  }

  const start = body.slice(0, head);
  const end = body.slice(-tail);
  return `${prefix}${start}${ellipsis}${end}`;
};

export const Gap = (params: GapType = { space: 1, size: 'sm' }): JSXElement => (
  <Text
    children={' '.repeat(params.space ?? 1)}
    size={params.size ?? 'sm'}
  ></Text>
);

export const PaddedBox = (params: PaddedBoxType): JSXElement => (
  <Box
    direction={params.direction}
    alignment="space-between"
    crossAlignment="center"
    children={[
      <Image
        src={makeSpacerSVG(
          params.direction === 'horizontal' ? params.size : 1,
          params.direction === 'vertical' ? params.size : 1,
        )}
      />,
      params.children,
      <Image
        src={makeSpacerSVG(
          params.direction === 'horizontal' ? params.size : 1,
          params.direction === 'vertical' ? params.size : 1,
        )}
      />,
    ]}
  ></Box>
);

export const snapDialog = async (type: DialogType, content: JSXElement) => {
  return snap.request({ method: 'snap_dialog', params: { type, content } });
};

export const errorSnapDialog = async (options: {
  title?: string;
  message?: string;
}) => {
  const { title, message } = options;

  return await snapDialog(
    DialogType.Alert,
    <Box
      children={[
        <Heading children={title ?? 'Error'} />,
        <Text children={message ?? 'Something went wrong'} />,
      ]}
    />,
  );
};

export const renderExportPrivateKey = (
  exportType: string,
  privateKey: string,
  wif: string,
  encryptedWIF?: string,
  errorPassphrase?: string,
  loading: boolean = false,
) => (
  <Box
    children={[
      <Box
        direction="horizontal"
        alignment="space-between"
        crossAlignment="center"
        children={[
          <Heading children="Export" />,
          <Selector
            name="export-type"
            title="Select type"
            value={exportType}
            disabled={loading}
            children={[
              <SelectorOption
                key="private-key"
                value="private-key"
                children={<Card title="Private Key" value="" />}
              />,
              <SelectorOption
                key="wif"
                value="wif"
                children={<Card title="WIF" value="" />}
              />,
              <SelectorOption
                key="encrypted-wif"
                value="encrypted-wif"
                children={<Card title="Encrypted WIF" value="" />}
              />,
            ]}
          />,
        ]}
      />,
      <Box children={<Divider />} />,
      exportType === 'private-key' && (
        <Box
          children={[
            <Text children="Private Key" />,
            <Copyable value={privateKey} sensitive={true} />,
          ]}
        />
      ),
      exportType === 'wif' && (
        <Box
          children={[
            <Text children="Wallet Import Format" />,
            <Copyable value={wif} sensitive={true} />,
          ]}
        />
      ),
      exportType === 'encrypted-wif' && (
        <Form
          name="export-key-form"
          children={[
            <Box
              direction="horizontal"
              children={[
                <Text children="Passphrase" />,
                <Tooltip
                  content={
                    <Text
                      size="sm"
                      children="Enter a passphrase to encrypt the WIF. Keep it safe — it's required to decrypt."
                    />
                  }
                  children={<Icon name="info" />}
                />,
              ]}
            />,
            <Field
              error={errorPassphrase}
              children={
                <Input
                  name="export-bip38-passphrase"
                  placeholder="(Optional)"
                />
              }
            />,
            encryptedWIF ? (
              <Box
                children={[
                  <Gap />,
                  <Divider />,
                  <Gap />,
                  <Text children="Encrypted WIF" />,
                  <Copyable value={encryptedWIF} sensitive={true} />,
                ]}
              />
            ) : (
              <Box
                children={[
                  <Gap />,
                  <Divider />,
                  <Gap />,
                  loading ? (
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
                        <Box
                          direction="horizontal"
                          alignment="center"
                          children={[
                            <Text
                              alignment="center"
                              color="muted"
                              size="sm"
                              children="BIP38"
                            />,
                            <Text
                              alignment="center"
                              color="muted"
                              size="sm"
                              children="/"
                            />,
                            <Text
                              size="sm"
                              children={
                                <Link
                                  href="https://docs.qtum.info/qtum-documentation/qtum-features-and-advances/qtum-bip38"
                                  children="For more"
                                />
                              }
                            />,
                          ]}
                        />
                      }
                    />
                  ),
                ]}
              />
            ),
          ]}
        />
      ),
      <Box children={<Divider />} />,
      <Section
        children={[
          exportType === 'encrypted-wif' && (
            <Box
              children={[
                <Button
                  name="encrypt-bip38"
                  form="export-private-key-form"
                  disabled={loading}
                  children={loading ? 'Generating...' : 'Generate'}
                />,
                <Divider />,
              ]}
            />
          ),
          <Button
            name="back-to-dashboard"
            variant="destructive"
            disabled={loading}
            children="Close"
          />,
        ]}
      />,
      <Text
        size="sm"
        alignment="center"
        color="muted"
        children={FOOTER_TEXT}
      />,
    ]}
  />
);

export const renderRemoveWallet = () => (
  <Box
    children={[
      <Box
        children={[
          <PaddedBox
            direction="vertical"
            children={
              <PaddedBox
                direction="horizontal"
                children={<Image src={QTUM_ICON} alt="Qtum" />}
              />
            }
          />,
          <Text
            alignment="center"
            size="md"
            fontWeight="medium"
            children="Confirm remove wallet"
          />,
        ]}
      />,
      <Divider />,
      <Banner
        title=""
        severity="warning"
        children={
          <Text
            size="md"
            children="Are you sure you want to remove wallet? Ensure you have securely saved the private key, otherwise you will no longer be able to access this wallet."
          />
        }
      />,
      <Divider />,
      <Section
        children={[
          <Button name="remove-wallet-confirm" children="Confirm" />,
          <Divider />,
          <Button
            name="back-to-dashboard"
            variant="destructive"
            children="Cancel"
          />,
        ]}
      />,
      <Text
        size="sm"
        alignment="center"
        color="muted"
        children={FOOTER_TEXT}
      />,
    ]}
  />
);
