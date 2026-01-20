import {
  Box,
  Text,
  Divider,
  Button,
  Section,
  Image,
  Icon,
  Skeleton,
  SelectorOption,
  Selector,
  Card,
  Link,
  Tooltip,
  Spinner,
} from '@metamask/snaps-sdk/jsx';

import { FOOTER_TEXT, QRC20_PAGE_SIZE, WAITING_CONFIRMATIONS } from '@/consts';
import { PaddedBox, makeSpacerSVG, toTitleCase } from '@/helpers';
import { formatBalance, formatDateTime } from '@/helpers/format';
import type { DashboardType, NetworksType, TokenType } from '@/types';

export const renderDashboard = (
  networks: NetworksType,
  dashboard: DashboardType,
  tokens: TokenType[] = [],
  chainId?: string,
) => {
  const loadingNative = dashboard.native === null;
  const loadingTokens = dashboard.tokens === null;
  const loadingHistories = dashboard.histories === null;
  const loadingAny = loadingNative || loadingTokens || loadingHistories;

  let start: number = 0;
  let visible: TokenType[] = [];
  const totalPages = Math.max(
    1,
    Math.ceil(
      (dashboard.tokens ? dashboard.tokens.length : tokens.length) /
        QRC20_PAGE_SIZE,
    ),
  );
  const currentPage = Math.min(
    Math.max(dashboard.tokensPage ?? 1, 1),
    totalPages,
  );
  const showPagination =
    (dashboard.tokens ? dashboard.tokens.length : tokens.length) >
    QRC20_PAGE_SIZE;
  if (!loadingTokens && dashboard.tokens) {
    start = (currentPage - 1) * QRC20_PAGE_SIZE;
    visible = dashboard.tokens.slice(start, start + QRC20_PAGE_SIZE);
  }

  const countedTokens: number = tokens.length >= 5 ? 5 : tokens.length;

  return (
    <Box
      children={[
        <Box
          direction="horizontal"
          crossAlignment="center"
          alignment="space-between"
          children={[
            !loadingNative && dashboard.native ? (
              <Box
                direction="horizontal"
                alignment="space-between"
                children={[
                  <Text
                    children={formatBalance(
                      String(dashboard.native.balance),
                      18,
                    )}
                  />,
                  <Text
                    fontWeight="medium"
                    children={dashboard.native.symbol}
                  />,
                ]}
              />
            ) : (
              <Skeleton height={24} width="20%" borderRadius="medium" />
            ),
            <Box
              direction="horizontal"
              crossAlignment="center"
              children={[
                <Button
                  name="send-native"
                  children={<Icon name="send" size="md" />}
                  disabled={loadingAny}
                />,
                <Button
                  name="receive-page"
                  children={<Icon name="receive" size="md" />}
                  disabled={loadingAny}
                />,
                <Button
                  name="dashboard-refresh"
                  children={<Icon name="refresh" size="md" />}
                  disabled={loadingAny}
                />,
              ]}
            />,
            <Selector
              name="networks"
              title="Select network"
              value={chainId ?? networks.current.chainId}
              disabled={loadingAny}
              children={networks.list.map((network) => (
                <SelectorOption
                  key={String(network.chainId)}
                  value={String(network.chainId)}
                  children={<Card title={network.chainName} value="" />}
                />
              ))}
            />,
          ]}
        />,
        <Divider />,
        <Section
          children={
            <Box
              direction="horizontal"
              crossAlignment="center"
              alignment="space-between"
              children={[
                <Box
                  direction="horizontal"
                  crossAlignment="center"
                  children={[
                    <Text
                      fontWeight="medium"
                      color={loadingTokens ? 'muted' : 'default'}
                      children="Tokens"
                    />,
                    <Tooltip
                      content={
                        <Text
                          size="sm"
                          children="Locally saved QRC20 token list"
                        />
                      }
                      children={<Icon name="info" />}
                    />,
                  ]}
                />,
                <Button
                  name="qrc20"
                  children={<Icon name="add" size="md" />}
                  disabled={loadingTokens}
                />,
              ]}
            />
          }
        />,
        !loadingTokens && dashboard.tokens ? (
          <Box
            children={
              dashboard.tokens.length === 0 ? (
                <PaddedBox
                  size={20}
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
                          children="No QRC20"
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
                              href={`${networks.current.blockExplorerUrls?.[0]}qrc20`}
                              children="explore tokens here"
                            />
                          }
                        />,
                      ]}
                    />
                  }
                />
              ) : (
                visible.map((token: TokenType) => (
                  <Box
                    direction="horizontal"
                    crossAlignment="center"
                    alignment="space-between"
                    children={[
                      <Box
                        direction="horizontal"
                        crossAlignment="center"
                        children={[
                          <Image src={makeSpacerSVG(8)} />,
                          <Box
                            direction="horizontal"
                            alignment="space-between"
                            children={[
                              <Text
                                children={formatBalance(
                                  token.balance ?? '0',
                                  token.decimals,
                                )}
                              />,
                              <Text
                                fontWeight="medium"
                                children={token.symbol}
                              />,
                            ]}
                          />,
                        ]}
                      />,
                      <Box
                        direction="horizontal"
                        crossAlignment="center"
                        children={[
                          <Button
                            name={`send-qrc20-${token.contractAddress}`}
                            children={<Icon name="send" />}
                          />,
                          <Button
                            name={`delete-qrc20-${token.contractAddress}`}
                            children={<Icon name="trash" />}
                          />,
                          <Image src={makeSpacerSVG(8)} />,
                        ]}
                      />,
                    ]}
                  />
                ))
              )
            }
          />
        ) : (
          <Box
            children={
              tokens && tokens.length !== 0 ? (
                Array.from({ length: countedTokens }).map(
                  (_value, index, _array) => (
                    <Box
                      direction="horizontal"
                      crossAlignment="center"
                      alignment="space-between"
                      children={[
                        <Skeleton
                          height={20}
                          width={index % 2 === 0 ? '30%' : '25%'}
                          borderRadius="medium"
                        />,
                        <Box
                          direction="horizontal"
                          crossAlignment="center"
                          children={[
                            <Button
                              name={'send-qrc20-loading'}
                              children={<Icon name="send" />}
                              disabled={true}
                            />,
                            <Button
                              name={'delete-qrc20-loading'}
                              children={<Icon name="trash" />}
                              disabled={true}
                            />,
                            <Image src={makeSpacerSVG(8)} />,
                          ]}
                        />,
                      ]}
                    />
                  ),
                )
              ) : (
                <PaddedBox
                  size={20}
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
                          children="No QRC20"
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
                              href={`${networks.current.blockExplorerUrls?.[0]}qrc20`}
                              children="explore tokens here"
                            />
                          }
                        />,
                      ]}
                    />
                  }
                />
              )
            }
          />
        ),
        showPagination && (
          <Box
            direction="horizontal"
            alignment="space-between"
            crossAlignment="center"
            children={[
              <Box
                direction="horizontal"
                children={[
                  <Image src={makeSpacerSVG(8)} />,
                  <Button
                    name="qrc20-previous"
                    children={<Icon name="arrow-left" />}
                    disabled={!(currentPage > 1) || loadingTokens}
                  />,
                ]}
              />,
              <Text
                size="sm"
                color="muted"
                children={`${String(currentPage)} / ${String(totalPages)}`}
              />,
              <Box
                direction="horizontal"
                children={[
                  <Button
                    name="qrc20-next"
                    children={<Icon name="arrow-right" />}
                    disabled={!(currentPage < totalPages) || loadingTokens}
                  />,
                  <Image src={makeSpacerSVG(8)} />,
                ]}
              />,
            ]}
          />
        ),
        <Divider />,
        <Section
          direction="horizontal"
          alignment="space-between"
          children={[
            <Box
              direction="horizontal"
              crossAlignment="center"
              children={[
                <Text
                  fontWeight="medium"
                  color={loadingHistories ? 'muted' : 'default'}
                  children="Activity"
                />,
                <Tooltip
                  content={
                    <Text
                      size="sm"
                      children="Recent transaction history — latest 5"
                    />
                  }
                  children={<Icon name="info" />}
                />,
              ]}
            />,
            <Button
              name="open-history"
              children="More"
              disabled={loadingAny}
            />,
          ]}
        />,
        !loadingHistories && dashboard.histories ? (
          <Box
            children={
              dashboard.histories.totalCount === 0 ? (
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
                          children="No transactions yet"
                        />
                      }
                    />
                  }
                />
              ) : (
                dashboard.histories.items.map((item) => (
                  <Box
                    direction="vertical"
                    children={[
                      <Box
                        direction="horizontal"
                        crossAlignment="center"
                        alignment="space-between"
                        children={[
                          <Box
                            direction="horizontal"
                            crossAlignment="center"
                            children={[
                              <Icon
                                name={
                                  ['send', 'contract'].includes(item.direction)
                                    ? 'minus'
                                    : 'add'
                                }
                                size="md"
                              />,
                              <Text
                                size="sm"
                                children={`${item.amount} ${item.symbol}`}
                              />,
                            ]}
                          />,
                          <Box
                            direction="horizontal"
                            crossAlignment="center"
                            children={[
                              <Text
                                size="sm"
                                color="muted"
                                children={toTitleCase(item.status)}
                              />,
                              item.confirmations <= 5 && (
                                <Text
                                  size="sm"
                                  color="muted"
                                  children={`· ${String(
                                    item.confirmations,
                                  )}/${String(WAITING_CONFIRMATIONS)}`}
                                />
                              ),
                            ]}
                          />,
                        ]}
                      />,
                      <Box
                        direction="horizontal"
                        crossAlignment="center"
                        alignment="space-between"
                        children={[
                          <Box
                            direction="horizontal"
                            crossAlignment="center"
                            children={[
                              <Image src={makeSpacerSVG(20)} />,
                              <Text
                                size="sm"
                                color="muted"
                                children={
                                  item.timestamp
                                    ? formatDateTime(
                                        new Date(item.timestamp * 1000),
                                      )
                                    : '-'
                                }
                              />,
                            ]}
                          />,
                          <Text size="sm" color="muted" children={item.type} />,
                        ]}
                      />,
                    ]}
                  />
                ))
              )
            }
          />
        ) : (
          <PaddedBox
            size={16}
            direction="vertical"
            children={
              <PaddedBox direction="horizontal" children={<Spinner />} />
            }
          />
        ),
        <Divider />,
        <Section
          children={[
            <Button
              name="export-private-key"
              children="Export Private Key"
              disabled={loadingAny}
            />,
            <Divider />,
            <Button
              name="remove-wallet"
              variant="destructive"
              children="Remove Wallet"
              disabled={loadingAny}
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
