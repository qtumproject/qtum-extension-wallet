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
  Spinner
} from '@metamask/snaps-sdk/jsx';

import { QRC20_PAGE_SIZE, WAITING_CONFIRMATIONS } from '@/consts';
import { formatBalance, formatDateTime } from '@/helpers/format';
import { PaddedBox, makeSpacerSVG, toTitleCase } from '@/helpers';
import type { DashboardType, NetworksType, TokenType } from '@/types';
import { SNAP_VERSION } from '@/consts';

export const renderDashboard = (
  networks: NetworksType, dashboard: DashboardType, tokens: TokenType[] = [], chainId?: string
) => {

  const loadingNative = dashboard.native === null;
  const loadingTokens = dashboard.tokens === null;
  const loadingHistories = dashboard.histories === null;
  const loadingAny = loadingNative || loadingTokens || loadingHistories;

  let start: number = 0;
  let visible: TokenType[] = [];
  const totalPages = Math.max(1, Math.ceil(
    (dashboard.tokens ? dashboard.tokens.length : tokens.length) / QRC20_PAGE_SIZE
  ));
  const currentPage = Math.min(Math.max(dashboard.tokensPage ?? 1, 1), totalPages);
  const showPagination = (dashboard.tokens ? dashboard.tokens.length : tokens.length) > QRC20_PAGE_SIZE;
  if (!loadingTokens && dashboard.tokens) {
    start = (currentPage - 1) * QRC20_PAGE_SIZE;
    visible = dashboard.tokens.slice(start, start + QRC20_PAGE_SIZE);
  }

  const countedTokens: number = tokens.length >= 5 ? 5 : tokens.length;

  return (
    <Box>
      <Box
        direction="horizontal"
        crossAlignment="center"
        alignment="space-between"
      >
        {!loadingNative && dashboard.native ? (
          <Box direction="horizontal" alignment="space-between">
            <Text>{formatBalance(String(dashboard.native.balance), 18)}</Text>
            <Text fontWeight="medium">{dashboard.native.symbol}</Text>
          </Box>
        ) : (
          <Skeleton height={24} width="20%" borderRadius="medium" />
        )}
        <Box direction="horizontal" crossAlignment="center">
          <Button
            name="send-native"
            children={<Icon name="send" size="md" />}
            disabled={loadingAny}
          ></Button>
          <Button
            name="receive-page"
            children={<Icon name="receive" size="md" />}
            disabled={loadingAny}
          ></Button>
          <Button
            name="dashboard-refresh"
            children={<Icon name="refresh" size="md" />}
            disabled={loadingAny}
          ></Button>
        </Box>
        <Selector
          name="networks"
          title="Select network"
          value={chainId ?? networks.current.chainId}
          disabled={loadingAny}
        >
          {networks.list.map((network) => (
            <SelectorOption
              key={String(network.chainId)}
              value={String(network.chainId)}
            >
              <Card title={network.chainName} value="" />
            </SelectorOption>
          ))}
        </Selector>
      </Box>
      <Divider />
      <Section>
        <Box
          direction="horizontal"
          crossAlignment="center"
          alignment="space-between"
        >
          <Box direction="horizontal" crossAlignment="center">
            <Text
              fontWeight="medium"
              color={loadingTokens ? 'muted' : 'default'}
            >
              Tokens
            </Text>
            <Tooltip
              content={<Text size="sm">Locally saved QRC20 token list</Text>}
            >
              <Icon name="info" />
            </Tooltip>
          </Box>
          <Button
            name="qrc20"
            children={<Icon name="add" size="md" />}
            disabled={loadingTokens}
          ></Button>
        </Box>
      </Section>
      {!loadingTokens && dashboard.tokens ? (
        <Box>
          {dashboard.tokens.length === 0 ? (
            <PaddedBox
              size={20}
              direction="vertical"
              children={
                <Box direction="horizontal" alignment="center">
                  <Text alignment="center" color="muted" size="sm">
                    No QRC20
                  </Text>
                  <Text alignment="center" color="muted" size="sm">
                    /
                  </Text>
                  <Text
                    size="sm"
                    children={
                      <Link
                        href={`${networks.current.blockExplorerUrls?.[0]}qrc20`}
                      >
                        explore tokens here
                      </Link>
                    }
                  ></Text>
                </Box>
              }
            />
          ) : (
            visible.map((token: TokenType) => (
              <Box
                direction="horizontal"
                crossAlignment="center"
                alignment="space-between"
              >
                <Box direction="horizontal" crossAlignment="center">
                  <Image src={makeSpacerSVG(8)} />
                  <Box direction="horizontal" alignment="space-between">
                    <Text>{formatBalance(token.balance, token.decimals)}</Text>
                    <Text fontWeight="medium">{token.symbol}</Text>
                  </Box>
                </Box>
                <Box direction="horizontal" crossAlignment="center">
                  <Button
                    name={`send-qrc20-${token.contractAddress}`}
                    children={<Icon name="send" />}
                  ></Button>
                  <Button
                    name={`delete-qrc20-${token.contractAddress}`}
                    children={<Icon name="trash" />}
                  ></Button>
                  <Image src={makeSpacerSVG(8)} />
                </Box>
              </Box>
            ))
          )}
        </Box>
      ) : (
        <Box>
          {tokens && tokens.length !== 0 ? (
            Array.from({ length: countedTokens }).map((value, index, array) => (
              <Box
                direction="horizontal"
                crossAlignment="center"
                alignment="space-between"
              >
                <Skeleton
                  height={20}
                  width={(index % 2 == 0) ? '30%' : '25%'}
                  borderRadius="medium"
                />
                <Box direction="horizontal" crossAlignment="center">
                  <Button
                    name={'send-qrc20-loading'}
                    children={<Icon name="send" />}
                    disabled={true}
                  ></Button>
                  <Button
                    name={'delete-qrc20-loading'}
                    children={<Icon name="trash" />}
                    disabled={true}
                  ></Button>
                  <Image src={makeSpacerSVG(8)} />
                </Box>
              </Box>
            ))
          ) : (
            <PaddedBox
              size={20}
              direction="vertical"
              children={
                <Box direction="horizontal" alignment="center">
                  <Text alignment="center" color="muted" size="sm">
                    No QRC20
                  </Text>
                  <Text alignment="center" color="muted" size="sm">
                    /
                  </Text>
                  <Text
                    size="sm"
                    children={
                      <Link
                        href={`${networks.current.blockExplorerUrls?.[0]}qrc20`}
                      >
                        explore tokens here
                      </Link>
                    }
                  ></Text>
                </Box>
              }
            />
          )}
        </Box>
      )}
      {showPagination && (
        <Box
          direction="horizontal"
          alignment="space-between"
          crossAlignment="center"
        >
          <Box direction="horizontal">
            <Image src={makeSpacerSVG(8)} />
            <Button
              name="qrc20-previous"
              children={<Icon name="arrow-left" />}
              disabled={!(currentPage > 1) || loadingTokens}
            />
          </Box>
          <Text size="sm" color="muted">
            {String(currentPage)} / {String(totalPages)}
          </Text>
          <Box direction="horizontal">
            <Button
              name="qrc20-next"
              children={<Icon name="arrow-right" />}
              disabled={!(currentPage < totalPages) || loadingTokens}
            />
            <Image src={makeSpacerSVG(8)} />
          </Box>
        </Box>
      )}
      <Divider />
      <Section direction="horizontal" alignment="space-between">
        <Box direction="horizontal" crossAlignment="center">
          <Text
            fontWeight="medium"
            color={loadingHistories ? 'muted' : 'default'}
          >
            History
          </Text>
          <Tooltip
            content={
              <Text size="sm">Recent transaction history — latest 5</Text>
            }
          >
            <Icon name="info" />
          </Tooltip>
        </Box>
        <Button
          name="open-history"
          children="More"
          disabled={loadingAny}
        ></Button>
      </Section>
      {!loadingHistories && dashboard.histories ? (
        <Box>
          {dashboard.histories.totalCount === 0 ? (
            <PaddedBox
              size={20}
              direction="vertical"
              children={
                <PaddedBox
                  direction="horizontal"
                  children={
                    <Text alignment="center" color="muted" size="sm">
                      No transactions yet
                    </Text>
                  }
                />
              }
            />
          ) : (
            dashboard.histories.items.map((item) => (
              <Box direction="vertical">
                <Box
                  direction="horizontal"
                  crossAlignment="center"
                  alignment="space-between"
                >
                  <Box direction="horizontal" crossAlignment="center">
                    <Icon
                      name={
                        ['send', 'contract'].includes(item.direction)
                          ? 'minus'
                          : 'add'
                      }
                      size="md"
                    />
                    <Text size="sm">
                      {item.amount} {item.symbol}
                    </Text>
                  </Box>
                  <Box direction="horizontal" crossAlignment="center">
                    <Text size="sm" color="muted">
                      {toTitleCase(item.status)}
                    </Text>
                    {item.confirmations <= 5 && (
                      <Text size="sm" color="muted">
                        · {String(item.confirmations)}/{String(WAITING_CONFIRMATIONS)}
                      </Text>
                    )}
                  </Box>
                </Box>
                <Box
                  direction="horizontal"
                  crossAlignment="center"
                  alignment="space-between"
                >
                  <Box direction="horizontal" crossAlignment="center">
                    <Image src={makeSpacerSVG(20)} />
                    <Text size="sm" color="muted">
                      {item.timestamp
                        ? formatDateTime(new Date(item.timestamp * 1000))
                        : '-'}
                    </Text>
                  </Box>
                  <Text size="sm" color="muted">
                    {item.type}
                  </Text>
                </Box>
              </Box>
            ))
          )}
        </Box>
      ) : (
        <PaddedBox
          size={16}
          direction="vertical"
          children={<PaddedBox direction="horizontal" children={<Spinner />} />}
        />
      )}
      <Divider />
      <Section>
        <Button
          name="export-private-key"
          children="Export Private Key"
          disabled={loadingAny}
        ></Button>
        <Divider />
        <Button
          name="remove-wallet"
          variant="destructive"
          children="Remove Wallet"
          disabled={loadingAny}
        ></Button>
      </Section>
      <Text size="sm" alignment="center" color="muted">
        {SNAP_VERSION} / Powered by Qtum
      </Text>
    </Box>
  );
}
