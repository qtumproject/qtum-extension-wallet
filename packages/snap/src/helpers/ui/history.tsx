import {
  Box,
  Divider,
  Heading,
  Text,
  Button,
  Icon,
  Section,
  Image,
  SelectorOption,
  Card,
  Selector,
  Link,
  Spinner,
} from '@metamask/snaps-sdk/jsx';

import { Ellipsis, Gap, makeSpacerSVG, PaddedBox, toTitleCase } from '@/helpers';
import type { HistoryType } from '@/types';

export const renderHistory = (history: HistoryType, isLoading: boolean = false) => {

  const page = Math.max(1, Number(history.page ?? 1));
  const pageSize = Math.max(1, Number(history.pageSize ?? 5));
  const total = Math.max(0, Number(history.totalCount ?? 0));
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const disablePrevious = page <= 1;
  const disableNext = page >= pageCount;

  return (
    <Box direction="vertical">
      <Box
        direction="horizontal"
        alignment="space-between"
        crossAlignment="center"
      >
        <Heading size="md">History</Heading>
        <Box direction="horizontal" crossAlignment="center" alignment="end">
          <Button name="history-refresh" children={<Icon name="refresh" size="md" />}></Button>
          <Selector name="history-type" title="Select history">
            <SelectorOption key="qtum" value="qtum">
              <Card title="QTUM" value="" />
            </SelectorOption>
            <SelectorOption key="qrc20" value="qrc20">
              <Card title="QRC20" value="" />
            </SelectorOption>
          </Selector>
        </Box>
      </Box>
      <Divider />
      {isLoading && (
        <Box alignment="center">
          <PaddedBox
            size={75}
            direction="vertical"
            children={
              <PaddedBox direction="horizontal" children={<Spinner />} />
            }
          />
        </Box>
      )}
      {!isLoading && !history.isValid && (
        <Box>
          <Gap />
          <Text alignment="center" size="sm" color="muted">
            Something went wrong
          </Text>
          <Gap />
        </Box>
      )}
      {!isLoading && history.items.length === 0 && history.isValid && (
        <Box>
          <Gap />
          <Text alignment="center" size="sm" color="muted">
            No transactions yet
          </Text>
          <Gap />
        </Box>
      )}
      {!isLoading && history.items.length !== 0 && history.isValid && (
        <Box>
          {history.items.map((item) => (
            <Box>
              <Section direction="vertical">
                <Box direction="horizontal" alignment="space-between">
                  <Box direction="horizontal">
                    <Icon
                      name={
                        ['send', 'contract'].includes(item.direction)
                          ? 'minus'
                          : 'add'
                      }
                      size="md"
                    />
                    <Text>
                      {item.amount} {item.symbol}
                    </Text>
                  </Box>
                  <Text size="sm" color="muted">
                    {toTitleCase(item.status)}
                  </Text>
                </Box>
                <Box direction="horizontal" alignment="space-between">
                  <Box direction="horizontal" alignment="start">
                    <Image src={makeSpacerSVG(20)} />
                    <Text size="sm" color="muted">
                      {item.timestamp}
                    </Text>
                  </Box>
                  <Text size="sm" color="muted">
                    {item.type}
                  </Text>
                </Box>
                <Box direction="horizontal" alignment="space-between">
                  <Box direction="horizontal">
                    <Image src={makeSpacerSVG(20)} />
                    <Text size="sm" color="muted">
                      {String(item.confirmations)} Confirmations
                    </Text>
                  </Box>
                  <Box
                    direction="horizontal"
                    alignment="end"
                    crossAlignment="center"
                  >
                    <Text size="sm" color="muted">
                      {Ellipsis({ data: item.transactionID })}
                    </Text>
                    <Text size="sm">
                      <Link href={item.transactionLink}>{''}</Link>
                    </Text>
                  </Box>
                </Box>
              </Section>
              <Gap />
            </Box>
          ))}
          <Box
            direction="horizontal"
            alignment="space-between"
            crossAlignment="center"
          >
            <Button name="history-previous" disabled={disablePrevious}>
              <Icon name="arrow-left" />
            </Button>
            <Box alignment="center" crossAlignment="center">
              <Text size="sm" color="muted">
                {String(page)} / {String(pageCount)}
              </Text>
            </Box>
            <Button name="history-next" disabled={disableNext}>
              <Icon name="arrow-right" />
            </Button>
          </Box>
        </Box>
      )}
      <Divider />
      <Section>
        <Button name="back-to-dashboard" variant="destructive">
          Back
        </Button>
      </Section>
      <Text size="sm" alignment="center" color="muted">
        Powered by Qtum
      </Text>
    </Box>
  );
};
