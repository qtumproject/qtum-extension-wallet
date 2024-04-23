import type { NodeType } from '@metamask/snaps-sdk';
import type { providers } from 'ethers';

export type TextField = {
  value: string;
  type: NodeType.Text;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ethereum: providers.ExternalProvider;
  }
}
