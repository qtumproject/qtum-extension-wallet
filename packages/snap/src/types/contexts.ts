import { AddressType } from '@/types/address';
import { NetworksType } from '@/types/network';
import { NativeType, TokenType } from '@/types/qrc20';
import { QRCodeAddressType } from "@/types";

export type DashboardContext = {
  networks: NetworksType;
  address: AddressType;
  native: NativeType | null;
  tokens: TokenType[] | null;
  tokensPage?: number;
}

export type AddQRC20Context = {
  token: TokenType | null,
  dashboardContext: DashboardContext
};

export type ReceiveContext = {
  type: 'qtum' | 'hexadecimal',
  address: AddressType,
  qrCodes: QRCodeAddressType;
}

