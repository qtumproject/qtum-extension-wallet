import { AddressType } from '@/types/address';
import { QRCodeAddressType } from '@/types';

export type ReceiveType = {
  type: 'qtum' | 'hexadecimal',
  address: AddressType,
  qrCodes: QRCodeAddressType;
}
