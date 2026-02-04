import {
  Box,
  Divider,
  Heading,
  Text,
  Button,
  Icon,
  Section,
  SelectorOption,
  Card,
  Selector,
  Link,
  Spinner,
} from '@metamask/snaps-sdk/jsx';

import { FOOTER_TEXT, WAITING_CONFIRMATIONS } from '@/consts';
import { Ellipsis, PaddedBox, toTitleCase } from '@/helpers';
import { formatDateTime } from '@/helpers/format';
import type { HistoryType } from '@/types';

export const renderHistory = (
  history: HistoryType,
  isLoading: boolean = false,
) => {
  const page = Math.max(1, Number(history.page ?? 1));
  const pageSize = Math.max(1, Number(history.pageSize ?? 5));
  const total = Math.max(0, Number(history.totalCount ?? 0));
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const disablePrevious = page <= 1;
  const disableNext = page >= pageCount;
  const showPagination = total > pageSize;

  return (
    <Box
      direction="vertical"
      children={[
        <Box
          direction="horizontal"
          alignment="space-between"
          crossAlignment="center"
          children={[
            <Heading children="History" />,
            <Box
              direction="horizontal"
              crossAlignment="center"
              alignment="end"
              children={[
                <Button
                  name="history-refresh"
                  children={<Icon name="refresh" size="md" />}
                />,
                <Selector
                  name="history-type"
                  title="Select history"
                  children={[
                    <SelectorOption
                      key="qtum"
                      value="qtum"
                      children={<Card title="QTUM" value="" />}
                    />,
                    <SelectorOption
                      key="qrc20"
                      value="qrc20"
                      children={<Card title="QRC20" value="" />}
                    />,
                  ]}
                />,
              ]}
            />,
          ]}
        />,
        <Divider />,
        isLoading && (
          <PaddedBox
            size={16}
            direction="vertical"
            children={
              <PaddedBox
                direction="horizontal"
                children={
                  <PaddedBox direction="horizontal" children={<Spinner />} />
                }
              />
            }
          />
        ),
        !isLoading && !history.isValid && (
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
                    children="Something went wrong"
                  />
                }
              />
            }
          />
        ),
        !isLoading && history.items.length === 0 && history.isValid && (
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
        ),
        !isLoading &&
          history.items.length !== 0 &&
          history.isValid &&
          history.items.map((item) => [
            <Section
              direction="vertical"
              children={[
                <Box
                  direction="horizontal"
                  alignment="space-between"
                  children={[
                    <Box
                      direction="horizontal"
                      children={[
                        <Icon
                          name={
                            ['send', 'contract'].includes(item.direction)
                              ? 'minus'
                              : 'add'
                          }
                          size="md"
                        />,
                        <Text children={`${item.amount} ${item.symbol}`} />,
                        item.showAddToken && (
                          <Button
                            name={`add-token-history-${item.tokenContractAddress}`}
                            variant="primary"
                            size="sm"
                            children="Add Token"
                          />
                        ),
                      ]}
                    />,
                    WAITING_CONFIRMATIONS !== 0 &&
                    item.confirmations <= WAITING_CONFIRMATIONS ? (
                      <Text
                        size="sm"
                        color="muted"
                        children={`${toTitleCase(item.status)} · ${String(
                          item.confirmations,
                        )}/${String(WAITING_CONFIRMATIONS)}`}
                      />
                    ) : (
                      <Text
                        size="sm"
                        color="muted"
                        children={toTitleCase(item.status)}
                      />
                    ),
                  ]}
                />,
                <Box
                  direction="horizontal"
                  alignment="space-between"
                  children={[
                    <Text
                      size="sm"
                      color="muted"
                      children={
                        item.timestamp
                          ? formatDateTime(new Date(item.timestamp * 1000))
                          : '-'
                      }
                    />,
                    <Text size="sm" color="muted" children={item.type} />,
                  ]}
                />,
                <Box
                  direction="horizontal"
                  alignment="space-between"
                  children={[
                    <Text
                      size="sm"
                      color="muted"
                      children={`${String(item.confirmations)} Confirmations`}
                    />,
                    <Box
                      direction="horizontal"
                      alignment="end"
                      crossAlignment="center"
                      children={[
                        <Text
                          size="sm"
                          color="muted"
                          children={Ellipsis({
                            data: item.transactionID,
                          })}
                        />,
                        <Text
                          size="sm"
                          children={
                            <Link href={item.transactionLink} children="" />
                          }
                        />,
                      ]}
                    />,
                  ]}
                />,
              ]}
            />,
          ]),
        showPagination && (
          <Box
            direction="horizontal"
            alignment="space-between"
            crossAlignment="center"
            children={[
              <Button
                name="history-previous"
                disabled={disablePrevious}
                children={<Icon name="arrow-left" />}
              />,
              <Box
                alignment="center"
                crossAlignment="center"
                children={
                  <Text
                    size="sm"
                    color="muted"
                    children={`${String(page)} / ${String(pageCount)}`}
                  />
                }
              />,
              <Button
                name="history-next"
                disabled={disableNext}
                children={<Icon name="arrow-right" />}
              />,
            ]}
          />
        ),
        <Divider />,
        <Section
          children={
            <Button
              name="back-to-dashboard"
              variant="destructive"
              children="Back"
            />
          }
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
