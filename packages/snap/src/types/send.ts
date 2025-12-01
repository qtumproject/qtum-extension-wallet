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

export type TransactionType = {
  recipient: string;
  amount: string;
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
