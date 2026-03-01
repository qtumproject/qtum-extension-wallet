import {
  Box,
  Text,
  Divider,
  Button,
  Form,
  Field,
  Input,
  Tooltip,
  Icon,
  Image,
  Section,
  Heading,
  Selector,
  SelectorOption,
  Card,
} from '@metamask/snaps-sdk/jsx';

import { FOOTER_TEXT, QTUM_ICON } from '@/consts';
import { PaddedBox } from '@/helpers';

export const renderHome = () => (
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
          <PaddedBox
            direction="horizontal"
            children={<Heading size="md" children="Qtum Wallet" />}
          />,
          <Text
            alignment="center"
            size="md"
            color="muted"
            children="Securely manage your Qtum inside MetaMask"
          />,
        ]}
      />,
      <Box children={<Divider />} />,
      <Section
        children={[
          <Button
            name="create-wallet"
            variant="primary"
            children="Create a Wallet"
          />,
          <Divider />,
          <Button
            name="drive-internal-mnemonic"
            children="Drive from Internal Mnemonic"
          />,
          <Divider />,
          <Button
            name="drive-external-mnemonic"
            children="Drive from External Mnemonic"
          />,
          <Divider />,
          <Button
            name="import-private-key"
            children="Import from Private Key"
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

export const renderDriveInternalMnemonic = (errorDerivationPath?: string) => (
  <Box
    children={[
      <Heading children="Derive from Internal Mnemonic" />,
      <Box children={<Divider />} />,
      <Form
        name="drive-internal-mnemonic-form"
        children={[
          <Box
            direction="horizontal"
            children={[
              <Text children="Derivation Path" />,
              <Tooltip
                content={
                  <Text
                    size="sm"
                    children="Specifies which key to derive under the m/44'/88' path."
                  />
                }
                children={<Icon name="info" />}
              />,
            ]}
          />,
          <Field
            error={errorDerivationPath}
            children={
              <Input
                name="derivation-path"
                placeholder="/0'/0/0"
                value="0'/0/0"
              />
            }
          />,
        ]}
      />,
      <Section
        children={[
          <Button
            type="submit"
            name="submit-drive-internal-mnemonic"
            form="drive-internal-mnemonic-form"
            children="Derive"
          />,
          <Divider />,
          <Button
            name="cancel-wallet"
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

export const renderDriveExternalMnemonic = (
  errorMnemonic?: string,
  errorDerivationPath?: string,
) => (
  <Box
    children={[
      <Heading children="Derive from External Mnemonic" />,
      <Box children={<Divider />} />,
      <Form
        name="drive-external-mnemonic-form"
        children={[
          <Box
            direction="horizontal"
            children={[
              <Text children="Mnemonic" />,
              <Tooltip
                content={
                  <Text
                    size="sm"
                    children="Only the derived private key is saved in MetaMask — your mnemonic phrase is never stored."
                  />
                }
                children={<Icon name="info" />}
              />,
            ]}
          />,
          <Field
            error={errorMnemonic}
            children={<Input name="mnemonic" placeholder="12–24 words" />}
          />,
          <Box
            direction="horizontal"
            children={[
              <Text children="Passphrase" />,
              <Tooltip
                content={
                  <Text
                    size="sm"
                    children="Adds a two-factor protection to your mnemonic phrase. No passphrase, no recovery."
                  />
                }
                children={<Icon name="info" />}
              />,
            ]}
          />,
          <Field
            children={<Input name="passphrase" placeholder="(Optional)" />}
          />,
          <Box
            direction="horizontal"
            children={[
              <Text children="Derivation Path" />,
              <Tooltip
                content={
                  <Text
                    size="sm"
                    children="The derivation path tells the wallet which key to derive"
                  />
                }
                children={<Icon name="info" />}
              />,
            ]}
          />,
          <Field
            error={errorDerivationPath}
            children={
              <Input
                name="derivation-path"
                placeholder="m/44'/88'/0'/0/0"
                value="m/44'/88'/0'/0/0"
              />
            }
          />,
        ]}
      />,
      <Section
        children={[
          <Button
            type="submit"
            name="submit-drive-external-mnemonic"
            form="drive-internal-mnemonic-form"
            children="Derive"
          />,
          <Divider />,
          <Button
            name="cancel-wallet"
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

export const renderImportPrivateKey = (
  importType: string,
  errorImportKey?: string,
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
          <Heading children="Import" />,
          <Selector
            name="import-type"
            title="Select type"
            value={importType}
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
      <Form
        name="import-key-form"
        children={[
          <Box
            direction="horizontal"
            children={[
              <Text
                children={
                  importType === 'encrypted-wif'
                    ? 'Encrypted WIF'
                    : importType === 'wif'
                      ? 'Wallet Import Format'
                      : 'Private Key'
                }
              />,
              <Tooltip
                content={
                  <Text
                    size="sm"
                    children={
                      importType === 'encrypted-wif'
                        ? 'Paste your Qtum BIP38 - Encrypted WIF (Wallet Import Format).'
                        : importType === 'wif'
                          ? 'Paste your Qtum WIF (Wallet Import Format).'
                          : 'Paste your Qtum private key.'
                    }
                  />
                }
                children={<Icon name="info" />}
              />,
            ]}
          />,
          <Field
            error={errorImportKey}
            children={<Input name="import-key" />}
          />,
          importType === 'encrypted-wif' && (
            <Box
              children={[
                <Box
                  direction="horizontal"
                  children={[
                    <Text children="Passphrase" />,
                    <Tooltip
                      content={
                        <Text
                          size="sm"
                          children="Enter the passphrase to decrypt it."
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
                      name="import-bip38-passphrase"
                      placeholder="(Optional)"
                      type="password"
                    />
                  }
                />,
              ]}
            />
          ),
        ]}
      />,
      <Section
        children={[
          <Button
            name="submit-import-private-key"
            form="import-key-form"
            type="submit"
            disabled={loading}
            children={loading ? 'Importing...' : 'Import'}
          />,
          <Divider />,
          <Button
            name="cancel-wallet"
            variant="destructive"
            disabled={loading}
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
