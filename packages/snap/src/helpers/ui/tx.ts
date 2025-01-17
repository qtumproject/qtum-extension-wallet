import {
  address,
  divider,
  heading,
  image,
  panel,
  row,
  text,
} from '@metamask/snaps-sdk';
import {
  type TransactionParams,
  TransactionType,
} from '@metamask/transaction-controller';
import type {
  SnapRequestParams,
  RPCMethods,
} from '@qtumproject/qtum-wallet-connector';

import { formatUnits } from '@/helpers/format';
import {
  determineTransactionType,
  getErc20TokenDetails,
  parseErc20Transfer,
} from '@/helpers/parsers';

export const buildTxUi = async (
  tx: SnapRequestParams[RPCMethods.EthSendTransaction][0],
) => {
  const txTypeResult = await determineTransactionType(tx as TransactionParams);

  switch (txTypeResult.type) {
    case TransactionType.simpleSend:
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('Sending QTUM'),
            row(
              formatUnits((await tx.value)!),
              image(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 1735" width="24" height="24"><path d="M1995 1794.48l-.68-1L1649.69 1482l163.87-506.47.48-1.49v-13.11l-167.71-521.46a11.54 11.54 0 0 0-1.5-4.08v-1.3l-4.54-4.54a11.07 11.07 0 0 0-6.12-5.52L1192.7 101.9l-2.61-1.9h-558c-3.26 0-4 .52-11 5.46-3.34 2.37-8.21 5.86-14.4 10.29-11.69 8.38-28.83 20.71-50.92 36.63-37.21 26.82-89 64.21-154 111.13-110.58 79.9-222.46 160.83-223.58 161.64l-.64.46-8.47 8.47V440L.48 959.42l-.48 1.5v13.17L169.21 1495v.11a13.06 13.06 0 0 0 3.73 9.53l4.74 4.74L618 1827.91a10.65 10.65 0 0 0 8.53 5.39 13.69 13.69 0 0 0 6.57 1.7h553.6l2-2a11.47 11.47 0 0 0 3.44-1.38h.39l428.31-310.4 339 307.71a20.41 20.41 0 0 0 7.85 4.7 30.78 30.78 0 0 0 18 0 16.87 16.87 0 0 0 9.18-7.78 22.57 22.57 0 0 0 5.14-15 29.07 29.07 0 0 0-5.01-16.37zM1615.31 944.2l22.91-370.77 118.83 370.77h-141.74zm141.74 46.6l-118.84 370.77-22.9-370.77h141.74zM433.63 1411l142.52 329.54-337-244.93zm517.26-932l224.48-307.46 153.77 355.12zm429.52 45l-142.52-329.55 337 244.93zm22.05 42.92l193.11-84.66-24.14 394.18-.18 4.3zM242.79 880.74l-.17-4.11-24.15-394.32 114.11 50.38 79 34.27zM1133 148.27L907.83 456.62 681.16 148.27H1133zm418.33 842.53l-180.46 334.88-98.87-211.56-55.63-123.32h335zm-334.83-46.6l154.43-334.77 180.4 334.77H1216.5zM951.56 527.54l382.24 47.77-157.22 340.58zm46.93 800.05l178.11-308.45 157.2 340.54-382.12 47.76zM677.08 944.2l230.71-399 113.76 199.4L1137 944.2H677.08zM1137 990.8l-229.17 399.07-115.37-199.52L677.08 990.8H1137zm-316.49-390l-181.4 315.03-157.2-340.52 380.66-47.77zm42 806.69l-380.66-47.77 118.32-257.39 38.84-83.21zM264.38 944.2l180.38-334.7 98.94 216.39 55.41 118.31H264.38zm334.83 46.6L444.8 1325.57 264.38 990.8h334.83zm972.17 63.2v1l24.16 397.66-114.12-50.38-79-34.27zM239.15 439.38l337-244.93L433.63 524zm172.43 928.7l-193.12 84.66 24.15-397.56.05-1.17zm496.26 110.29L1133 1786.73H681.16zm667.06 17.24l-337 244.93L1380.41 1411zM484.9 526.7l153.77-355.11L863.15 479zM57 944.2l118.82-370.77 22.91 370.77H57zm141.75 46.6l-22.91 370.77L57 990.8h141.73zm664.4 465.2l-224.48 307.41-153.76-355.12zm466-47.66l-153.77 355.12L950.88 1456z" fill="#2e9ad0"/></svg>',
              ),
            ),
            ...(tx.to ? [text(`**To**:`), address(tx.to?.toString())] : []),

            divider(),

            row('Gas', text(formatUnits(tx.gas))),

            divider(),

            row('Total', text(formatUnits(Number(tx.gas) + Number(tx.value)))),
          ]),
        },
      });

    case TransactionType.tokenMethodApprove:
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('Set a spending cap for your'),
            address(tx.to as string),
            divider(),

            text('Details'),
            text(`**Data**: ${tx.data}`),
          ]),
        },
      });

    case TransactionType.tokenMethodTransfer:
      // eslint-disable-next-line no-case-declarations
      const [to, amount] = parseErc20Transfer(tx.data as string);
      // eslint-disable-next-line no-case-declarations
      const [name, symbol, decimals] = await getErc20TokenDetails(
        tx.to as string,
      );

      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading(`Transfer ${name} (${symbol})`),
            address(String(tx.to)),

            divider(),

            row(`To:`, address(to)),
            row(`Amount:`, text(formatUnits(amount, decimals))),
          ]),
        },
      });

    case TransactionType.deployContract:
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('Send transaction'),
            divider(),

            text('Do you want to send transaction?'),

            text(`**Data**: ${tx.data}`),
          ]),
        },
      });

    default:
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('Send transaction'),
            divider(),

            text(`**To**:`),
            address(String(tx.to)),

            divider(),

            row('Gas', text(formatUnits(tx.gas))),

            divider(),

            row('Total', text(formatUnits(Number(tx.gas) + Number(tx.value)))),

            divider(),

            text(`**Data**:`),
            text(String(tx.data)),
          ]),
        },
      });
  }
};
