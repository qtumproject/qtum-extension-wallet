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

// eslint-disable-next-line jsdoc/require-jsdoc
export function isAddressMatchNetwork(qtumAddress: string, chainId: number) {
  const payload = bs58check.decode(qtumAddress);

  const version = {
    8889: 120,
    81: 58,
  }[chainId];

  // Check if the version matches
  return payload[0] === version;
}
