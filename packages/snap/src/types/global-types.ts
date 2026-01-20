import type { NodeType } from '@metamask/snaps-sdk';
import type { providers } from 'ethers';

export type TextField = {
  value: string;
  type: NodeType.Text;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    // @ts-ignore
    ethereum: providers.ExternalProvider;
  }
}

// @ts-ignore
declare module 'wif' {
  export function encode(
    version: number,
    privateKey: Uint8Array,
    compressed?: boolean,
  ): string;

  export function decode(wif: string): {
    version: number;
    privateKey: Uint8Array;
    compressed: boolean;
  };

  const _default: {
    encode: typeof encode;
    decode: typeof decode;
  };
  export default _default;
}

// @ts-ignore
declare module 'bip38' {
  export function encrypt(
    privateKey: Uint8Array,
    compressed: boolean,
    passphrase: string,
  ): string;
  export function decrypt(
    encryptedKey: string,
    passphrase: string,
  ): { privateKey: Uint8Array; compressed: boolean };

  const _default: {
    encrypt: typeof encrypt;
    decrypt: typeof decrypt;
  };
  export default _default;
}
