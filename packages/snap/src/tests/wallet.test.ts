import {
  createWallet,
  deriveFromExternalMnemonic,
  deriveFromInternalMnemonic,
  importPrivateKey,
} from '../helpers/wallet';
import { snapStorage } from '../rpc';
import { SnapMock } from './utils';
import { StorageEnum } from '../enums';

describe('wallet', () => {
  const snapMock = new SnapMock();

  beforeEach(() => {
    (global as any).snap = snapMock;
  });

  afterEach(() => {
    snapMock.reset();
  });

  it('should import a private key', async () => {
    const privateKey =
      '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff';
    const { wallet } = await importPrivateKey(privateKey);
    expect(wallet.privateKey).toBe(`0x${privateKey}`);
    expect(await snapStorage.getItem(StorageEnum.Identity)).toEqual({
      privateKey: `0x${privateKey}`,
    });
  });

  it('should create a new wallet', async () => {
    const { wallet } = await createWallet();
    expect(wallet.privateKey).toBeDefined();
    expect(await snapStorage.getItem(StorageEnum.Identity)).toEqual({
      privateKey: wallet.privateKey,
    });
  });

  it('should derive from internal mnemonic', async () => {
    const { wallet } = await deriveFromInternalMnemonic({
      derivationPath: "m/44'/88'/0'/0/0",
    });
    expect(wallet.privateKey).toBeDefined();
    expect(await snapStorage.getItem(StorageEnum.Identity)).toEqual({
      privateKey: wallet.privateKey,
    });
  });

  it('should derive from external mnemonic', async () => {
    const mnemonic =
      'test test test test test test test test test test test junk';
    const { wallet } = await deriveFromExternalMnemonic({
      mnemonic,
      derivationPath: "m/44'/88'/0'/0/0",
    });
    expect(wallet.privateKey).toBeDefined();
    expect(await snapStorage.getItem(StorageEnum.Identity)).toEqual({
      privateKey: wallet.privateKey,
    });
  });
});
