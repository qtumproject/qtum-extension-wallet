import type { TransactionParams } from '@metamask/transaction-controller';

export type TransactionParamsWithGas = TransactionParams & {
  gas?: string;
};
