import {
  Banner,
  Box,
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Field,
  Form,
  Heading,
  Icon,
  Image,
  Input,
  Link,
  Option,
  Section,
  Skeleton,
  Spinner,
  Text,
  Tooltip,
} from '@metamask/snaps-sdk/jsx';

import { FOOTER_TEXT, QTUM_ICON } from '@/consts';
import { SendEnum } from '@/enums';
import { PaddedBox, Gap, totalAmount, formatUnits } from '@/helpers';
import { formatBalance } from '@/helpers/format';
import type {
  SendErrorsType,
  SendResponseType,
  SendType,
  TokenType,
  GasEstimationType,
} from '@/types';

export const renderSendTransaction = (
  name: string,
  symbol: string,
  sender: string,
  recipient: string,
  amount: string,
  isToken: boolean = false,
  response?: SendResponseType,
  isConfirm: boolean = false,
  loading: boolean = false,
  gas?: GasEstimationType,
  gasLoading: boolean = false,
) => (
  <Box
    alignment="center"
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
            children="Confirm send"
          />,
        ]}
      />,
      <Box children={<Divider />} />,
      <Box
        children={[
          <Box
            direction="horizontal"
            alignment="space-between"
            children={[
              <Text
                color="muted"
                size="sm"
                children={isToken ? 'Token' : 'Native'}
              />,
              <Text size="sm" fontWeight="medium" children={name} />,
            ]}
          />,
          <Box
            direction="horizontal"
            alignment="space-between"
            children={[
              <Text color="muted" size="sm" children="Amount" />,
              <Text
                size="sm"
                fontWeight="medium"
                children={`${amount} ${symbol}`}
              />,
            ]}
          />,
          <Box
            direction="horizontal"
            alignment="space-between"
            children={[
              <Text color="muted" size="sm" children="From" />,
              <Text size="sm" fontWeight="medium" children={sender} />,
            ]}
          />,
          <Box
            direction="horizontal"
            alignment="space-between"
            children={[
              <Text color="muted" size="sm" children="To" />,
              <Text size="sm" fontWeight="medium" children={recipient} />,
            ]}
          />,
          <Box
            direction="horizontal"
            alignment="space-between"
            children={[
              <Text color="muted" size="sm" children="Estimated fee" />,
              gasLoading || !gas ? (
                <Skeleton height={20} width="23%" />
              ) : (
                <Text
                  size="sm"
                  fontWeight="medium"
                  children={`${formatUnits(gas.fee, 18)} QTUM`}
                />
              ),
            ]}
          />,
          <Box
            direction="horizontal"
            alignment="space-between"
            children={[
              <Text color="muted" size="sm" children="Total amount" />,
              gasLoading || !gas ? (
                <Skeleton height={20} width="28%" />
              ) : (
                <Text
                  size="sm"
                  fontWeight="medium"
                  children={totalAmount(symbol, amount, isToken, gas)}
                />
              ),
            ]}
          />,
        ]}
      />,
      <Box children={<Divider />} />,
      !response && !isConfirm && loading && (
        <Box
          alignment="center"
          children={[
            <PaddedBox
              size={16}
              direction="vertical"
              children={
                <PaddedBox direction="horizontal" children={<Spinner />} />
              }
            />,
            <Gap />,
            <Divider />,
            <Gap />,
          ]}
        />
      ),
      !isConfirm && !loading && (
        <Box
          children={[
            <Banner
              title=""
              severity="warning"
              children={
                <Text children="Are you sure you want to proceed with this transaction?" />
              }
            />,
            <Gap />,
            <Divider />,
            <Gap />,
            <Section
              children={[
                <Button name="send-confirm" children="Confirm" />,
                <Divider />,
                <Button
                  name="send-cancel"
                  variant="destructive"
                  children="Cancel"
                />,
              ]}
            />,
          ]}
        />
      ),
      response &&
        isConfirm &&
        !loading &&
        response.isValid &&
        response.transactionLink &&
        response.hash && (
          <Box
            children={[
              <Banner
                title=""
                severity="success"
                children={[
                  <Text children="Transaction completed successfully" />,
                  <Text
                    size="sm"
                    children={
                      <Link
                        href={response.transactionLink}
                        children={response.hash}
                      />
                    }
                  />,
                ]}
              />,
              <Gap />,
              <Divider />,
              <Gap />,
              <Section
                children={
                  <Button
                    name="dashboard-refresh"
                    variant="destructive"
                    children="Close"
                  />
                }
              />,
            ]}
          />
        ),
      response && isConfirm && !loading && !response.isValid && (
        <Box
          children={[
            <Banner
              title=""
              severity="danger"
              children={<Text children="Unable to process transaction" />}
            />,
            <Gap />,
            <Divider />,
            <Gap />,
            <Section
              children={[
                <Button name="send-confirm" children="Resend" />,
                <Divider />,
                <Button
                  name="send-cancel"
                  variant="destructive"
                  children="Cancel"
                />,
              ]}
            />,
          ]}
        />
      ),
      <Text
        size="sm"
        alignment="center"
        color="muted"
        children={FOOTER_TEXT}
      />,
    ]}
  />
);

export const renderSend = (
  send: SendType,
  tokens: TokenType[],
  loading: boolean = false,
  contractAddress?: string,
  errors?: SendErrorsType,
) => {
  return (
    <Box
      children={[
        <Box
          direction="horizontal"
          crossAlignment="center"
          alignment="space-between"
          children={[
            <Heading children="Send" />,
            <Box
              children={
                <Checkbox
                  name="isQRC20"
                  label="QRC20"
                  variant="toggle"
                  checked={send.type === SendEnum.Token}
                  disabled={tokens.length === 0}
                />
              }
            />,
          ]}
        />,
        <Box children={<Divider />} />,
        <Form
          name="send-form"
          children={[
            send.type === SendEnum.Token && tokens.length > 0 && (
              <Box
                children={[
                  <Box
                    direction="horizontal"
                    children={[
                      <Text children="Token" />,
                      <Tooltip
                        content={
                          <Text
                            size="sm"
                            children="Choose the QRC20 token you want to send"
                          />
                        }
                        children={<Icon name="info" />}
                      />,
                    ]}
                  />,
                  <Field
                    children={
                      <Dropdown
                        name="contract-address"
                        value={contractAddress ?? undefined}
                        children={tokens.map((token) => (
                          <Option
                            key={token.contractAddress}
                            value={token.contractAddress ?? ''}
                            children={token.name}
                          />
                        ))}
                      />
                    }
                  />,
                ]}
              />
            ),
            <Box
              direction="horizontal"
              children={[
                <Text children="Recipient" />,
                <Tooltip
                  content={
                    <Text
                      size="sm"
                      children="Enter the recipient's address carefully"
                    />
                  }
                  children={<Icon name="info" />}
                />,
              ]}
            />,
            <Field
              error={errors?.recipient}
              children={<Input name="recipient" />}
            />,
            <Box
              direction="horizontal"
              alignment="space-between"
              children={[
                <Box
                  direction="horizontal"
                  children={[
                    <Text children="Amount" />,
                    <Tooltip
                      content={
                        <Text
                          size="sm"
                          children="Enter the amount you want to send"
                        />
                      }
                      children={<Icon name="info" />}
                    />,
                  ]}
                />,
                loading && (
                  <Skeleton height={22} width="25%" borderRadius="medium" />
                ),
                !loading && send.type === SendEnum.Native && send.native && (
                  <Text
                    color="muted"
                    size="sm"
                    children={`${formatBalance(send.native.balance ?? 0, 18)} ${
                      send.native.symbol
                    }`}
                  />
                ),
                !loading && send.type === SendEnum.Token && send.token && (
                  <Text
                    color="muted"
                    size="sm"
                    children={`${formatBalance(
                      send.token.balance ?? 0,
                      send.token.decimals,
                    )} ${send.token.symbol}`}
                  />
                ),
              ]}
            />,
            <Field
              error={errors?.amount}
              children={
                <Input name="amount" type="number" disabled={loading} />
              }
            />,
          ]}
        />,
        <Divider />,
        <Section
          children={[
            <Button
              name="send-action"
              type="submit"
              form="send-form"
              children="Send"
            />,
            <Divider />,
            <Button
              name="back-to-dashboard"
              variant="destructive"
              children="Back"
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
