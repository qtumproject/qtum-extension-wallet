import { SnapsChildren, GenericSnapElement } from '@metamask/snaps-sdk/jsx';

export * from './address';
export * from './coin';
export * from './context';
export * from './dashboard';
export * from './global-types';
export * from './network';
export * from './qrc20';
export * from './receive';
export * from './send';
export * from './storage';

export type PaddedBoxType = {
  size?: number,
  direction: 'horizontal' | 'vertical',
  children: SnapsChildren<GenericSnapElement>
}
