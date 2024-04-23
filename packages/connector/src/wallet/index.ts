/* eslint jsdoc/match-description: 0 */ // --> OFF
/* eslint require-atomic-updates: 0 */ // --> OFF
/* eslint jsdoc/require-param: 0 */ // --> OFF

import type { ExternalProvider } from '@ethersproject/providers';

import versionJson from '../version.json';

import { defaultSnapOrigin } from '@/consts';
import { RPCMethods } from '@/enums';
import { QtumSnapBase } from '@/instances';
import type { SnapRequestParams } from '@/types';

export class QtumWallet extends QtumSnapBase implements ExternalProvider {
  public constructor(
    snapId = defaultSnapOrigin,
    version = versionJson.version,
  ) {
    super(snapId, version);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async request<T extends RPCMethods>(request: {
    method: RPCMethods;
    params?: SnapRequestParams[T];
  }): Promise<any> {
    return this.sendSnapRequest(request.method, request.params);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async send<T extends RPCMethods>(
    req: { method: RPCMethods; params?: SnapRequestParams[T] },
    callback: (error: any, response: any) => void,
  ) {
    try {
      const response = await this.sendSnapRequest(req.method, req.params);

      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async sendAsync<T extends RPCMethods>(
    req: { method: RPCMethods; params?: SnapRequestParams[T] },
    callback: (error: any, response: any) => void,
  ) {
    try {
      const response = await this.sendSnapRequest(req.method, req.params);

      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }

  async walletFromPrivateKey(
    privateKey: string,
    callback: (error: any, response: any) => void,
  ) {
    try {
      const response = await this.sendSnapRequest(
        RPCMethods.WalletFromPrivateKey,
        [privateKey],
      );

      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }

  async walletFromMnemonic(callback: (error: any, response: any) => void) {
    try {
      const response = await this.sendSnapRequest(
        RPCMethods.WalletFromMnemonic,
      );

      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }

  async walletExportPrivateKey(callback: (error: any, response: any) => void) {
    try {
      const response = await this.sendSnapRequest(
        RPCMethods.WalletExportPrivateKey,
      );

      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }

  async walletGetAddress(callback: (error: any, response: any) => void) {
    try {
      const response = await this.sendSnapRequest(RPCMethods.WalletGetAddress);

      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }
}
