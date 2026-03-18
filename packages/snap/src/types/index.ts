import type {
  SnapsChildren,
  GenericSnapElement,
} from '@metamask/snaps-sdk/jsx';

export * from './address';
export * from './coin';
export * from './context';
export * from './dashboard';
export * from './explorer';
export * from './global-types';
export * from './history';
export * from './home';
export * from './network';
export * from './qrc20';
export * from './receive';
export * from './send';
export * from './storage';
export * from './transaction';
export * from './wif';

export type GapType = {
  space?: number;
  size?: 'sm' | 'md';
};

export type PaddedBoxType = {
  size?: number;
  direction: 'horizontal' | 'vertical';
  children: SnapsChildren<GenericSnapElement>;
};

export type EllipsisOptions = {
  data: string;
  head?: number;
  tail?: number;
  ellipsis?: string;
};
