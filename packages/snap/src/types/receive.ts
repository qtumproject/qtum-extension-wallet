import type { QRCodeAddressType } from '@/types';
import type { AddressType } from '@/types/address';

export type ReceiveType = {
  type: 'qtum' | 'hexadecimal';
  address: AddressType;
  qrCodes: QRCodeAddressType;
};
