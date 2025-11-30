export type NativeType = {
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
  chainId: string;
}

export type TokenType = NativeType & {
  contractAddress: string;
};
