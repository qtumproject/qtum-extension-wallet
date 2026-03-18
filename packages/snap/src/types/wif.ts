export interface DecodedWIF {
  version: number;
  privateKey: Buffer;
  compressed: boolean;
}
