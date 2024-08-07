// eslint-disable-next-line import/no-extraneous-dependencies
import { Interface } from '@ethersproject/abi';
import { abiERC721, abiERC20, abiERC1155 } from '@metamask/metamask-eth-abis';
import type { TransactionParams } from '@metamask/transaction-controller';
import { TransactionType } from '@metamask/transaction-controller';

import { getProvider } from '@/config';

type InferTransactionTypeResult = {
  // The type of transaction
  type: TransactionType;
  // The contract code, in hex format if it exists. '0x0' or '0x' are also indicators of non-existent contract code
  getCodeResponse: string | null | undefined;
};

export const erc20Interface = new Interface(abiERC20);
export const erc721Interface = new Interface(abiERC721);
export const erc1155Interface = new Interface(abiERC1155);

export const parseStandardTokenTransactionData = (data: string) => {
  try {
    return erc20Interface.parseTransaction({ data });
  } catch {
    // ignore
  }

  try {
    return erc721Interface.parseTransaction({ data });
  } catch {
    // ignore
  }

  try {
    return erc1155Interface.parseTransaction({ data });
  } catch {
    // ignore
  }

  return undefined;
};

export type Contract = {
  contractCode: string | null;
  isContractAddress: boolean;
};

export const readAddressAsContract = async (
  address: string,
): Promise<Contract> => {
  const provider = await getProvider();
  let contractCode: string | null = null;
  try {
    contractCode = await provider.getCode(address);
  } catch (err) {
    contractCode = null;
  }

  const isContractAddress = contractCode
    ? contractCode !== '0x' && contractCode !== '0x0'
    : false;

  return { contractCode, isContractAddress };
};

// eslint-disable-next-line
export function isEqualCaseInsensitive(
  value1: string,
  value2: string,
): boolean {
  if (typeof value1 !== 'string' || typeof value2 !== 'string') {
    return false;
  }
  return value1.toLowerCase() === value2.toLowerCase();
}

// eslint-disable-next-line
export async function determineTransactionType(
  txParams: TransactionParams,
): Promise<InferTransactionTypeResult> {
  const { data, to } = txParams;
  let contractCode: string | null | undefined;

  if (data && !to) {
    return {
      type: TransactionType.deployContract,
      getCodeResponse: contractCode,
    };
  }
  if (to) {
    const { contractCode: resultCode, isContractAddress } =
      await readAddressAsContract(to);

    contractCode = resultCode;

    if (isContractAddress) {
      const hasValue = txParams.value && Number(txParams.value) !== 0;

      let name = '';
      try {
        const parsedData = data
          ? parseStandardTokenTransactionData(data)
          : undefined;
        if (parsedData?.name) {
          name = parsedData.name;
        }
      } catch (error) {
        console.error('Failed to parse transaction data.', error, data);
      }

      const tokenMethodName = [
        TransactionType.tokenMethodApprove,
        TransactionType.tokenMethodSetApprovalForAll,
        TransactionType.tokenMethodTransfer,
        TransactionType.tokenMethodTransferFrom,
        TransactionType.tokenMethodIncreaseAllowance,
        TransactionType.tokenMethodSafeTransferFrom,
      ].find((methodName) => isEqualCaseInsensitive(methodName, name));

      return {
        type:
          data && tokenMethodName && !hasValue
            ? tokenMethodName
            : TransactionType.contractInteraction,
        getCodeResponse: contractCode,
      };
    }
  }

  return { type: TransactionType.simpleSend, getCodeResponse: contractCode };
}
