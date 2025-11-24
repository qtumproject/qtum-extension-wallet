export type ReceiveAddressType = 'qtum' | 'hex';

export type ReceiveContext = {
  addressType: ReceiveAddressType,
  addresses: {
    qtum: string,
    hex: string
  },
  qrCodes: {
    qtum: string,
    hex: string
  }
}
