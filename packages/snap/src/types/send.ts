import { TransactionResponse } from '@ethersproject/abstract-provider';

import { SendEnum } from "@/enums";
import { NativeType, TokenType } from '@/types';

export type SendResponseType = {
  isValid: boolean;
  result?: TransactionResponse;
  hash?: string;
  transactionLink?: string;
  errorMessage?: string;
}

export type GasEstimationType = {
  gasLimit: string;
  gasPrice: string;
  fee: string;
}

export type TransactionType = {
  sender: string;
  recipient: string;
  amount: string;
  gas?: GasEstimationType;
};

export type SendType = {
  type: SendEnum;
  native: NativeType | null,
  token: TokenType | null;
  transaction: TransactionType | null;
};

export type SendErrorsType = {
  recipient?: string;
  amount?: string;
}
