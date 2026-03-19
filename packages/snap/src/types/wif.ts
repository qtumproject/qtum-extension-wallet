export type DecodedWIF = {
  version: number;
  privateKey: Buffer;
  compressed: boolean;
};
