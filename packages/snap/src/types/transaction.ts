import type { TransactionParams } from '@metamask/transaction-controller';

export interface TransactionParamsWithGas extends TransactionParams {
  gas?: string;
}
