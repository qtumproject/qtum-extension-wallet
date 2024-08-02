import bs58check from 'bs58check';
import { Buffer } from 'buffer';

// eslint-disable-next-line jsdoc/require-jsdoc
export function toBase58Check(ethAddress: string, version: number) {
  const hash = Buffer.from(ethAddress.slice(2), 'hex');
  const payload = Buffer.allocUnsafe(21);
  payload.writeUInt8(version, 0);
  hash.copy(payload, 1);
  return bs58check.encode(payload);
}

// eslint-disable-next-line jsdoc/require-jsdoc
export function fromBase58Check(qtumAddress: string) {
  const payload = bs58check.decode(qtumAddress);
  const buffer = Buffer.from(payload);
  return `0x${buffer.toString('hex').slice(2)}`;
}
