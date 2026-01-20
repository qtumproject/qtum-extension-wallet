import {
  Box,
  Text,
  Divider,
  Button,
  Section,
  Heading,
  Icon,
  Form,
  Field,
  Input,
  Tooltip,
  Spinner,
  Banner,
} from '@metamask/snaps-sdk/jsx';

import { FOOTER_TEXT } from '@/consts';
import { Gap, PaddedBox } from '@/helpers';
import type { ParamsQRC20Type } from '@/types';

export const renderAddQRC20 = (params?: ParamsQRC20Type) => {
  return (
    <Box
      children={[
        <Heading children={`${params?.token ? 'Add' : 'Search'} QRC20`} />,
        <Divider />,
        <Form
          name="qrc20-form"
          children={[
            <Box
              direction="horizontal"
              crossAlignment="center"
              children={[
                <Text children="Contract Address" />,
                <Tooltip
                  content={
                    <Text
                      size="sm"
                      children="Ensure this is a valid QRC20 token address"
                    />
                  }
                  children={<Icon name="info" />}
                />,
              ]}
            />,
            <Field
              error={params?.errorContractAddress}
              children={
                <Input
                  name="qrc20-contract-address"
                  disabled={Boolean(params?.token)}
                />
              }
            />,
          ]}
        />,
        params?.token && !params?.isSearching && !params?.failedMessage && (
          <Box
            children={[
              <Divider />,
              <Text children="Name" />,
              <Section
                children={<Text color="muted" children={params?.token?.name} />}
              />,
              <Text children="Symbol" />,
              <Section
                children={
                  <Text color="muted" children={params?.token?.symbol} />
                }
              />,
              <Text children="Decimals" />,
              <Section
                children={
                  <Text
                    color="muted"
                    children={String(params?.token?.decimals)}
                  />
                }
              />,
            ]}
          />
        ),
        params?.warningMessage && (
          <Box
            children={[
              <Divider />,
              <Gap />,
              <Banner
                title=""
                severity="warning"
                children={<Text children={params.warningMessage} />}
              />,
            ]}
          />
        ),
        !params?.token && params?.isSearching && !params?.failedMessage && (
          <Box
            children={[
              <Divider />,
              <PaddedBox
                size={16}
                direction="vertical"
                children={
                  <PaddedBox direction="horizontal" children={<Spinner />} />
                }
              />,
            ]}
          />
        ),
        !params?.token && !params?.isSearching && params?.failedMessage && (
          <Box
            children={[
              <Divider />,
              <PaddedBox
                size={20}
                direction="vertical"
                children={
                  <PaddedBox
                    direction="horizontal"
                    children={
                      <Text
                        alignment="center"
                        color="muted"
                        size="sm"
                        children={params?.failedMessage}
                      />
                    }
                  />
                }
              />,
            ]}
          />
        ),
        <Divider />,
        <Section
          children={[
            <Button
              name={params?.token ? 'add-qrc20' : 'search-qrc20'}
              disabled={params?.isSearching}
              type="submit"
              form="qrc20-form"
              children={params?.token ? 'Add' : 'Search'}
            />,
            <Divider />,
            <Button
              name={params?.token ? 'qrc20' : 'back-to-dashboard'}
              disabled={params?.isSearching}
              variant="destructive"
              children={params?.token ? 'Cancel' : 'Back'}
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
};
