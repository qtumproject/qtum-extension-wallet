import { RPCMethods } from '@qtumproject/qtum-wallet-connector';

describe('onRpcRequest error paths', () => {
  async function loadOnRpcRequest() {
    // Prepare globals required by src/polyfill.ts (imported by index.ts)
    // Must be set BEFORE importing the module.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = (global as any).window ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).crypto = (global as any).crypto ?? {};

    const mod = await import('../index');
    return mod.onRpcRequest as ({ request }: any) => Promise<unknown>;
  }

  it('throws for unsupported method', async () => {
    const onRpcRequest = await loadOnRpcRequest();

    await expect(
      onRpcRequest({
        request: { id: '1', jsonrpc: '2.0', method: 'unknown_method' },
        origin: 'tests',
      }),
    ).rejects.toThrow('Method not supported');
  });

  it('throws TypeError when WalletFromPrivateKey missing value', async () => {
    const onRpcRequest = await loadOnRpcRequest();

    await expect(
      onRpcRequest({
        request: { id: '2', jsonrpc: '2.0', method: RPCMethods.WalletFromPrivateKey, params: [''] },
        origin: 'tests',
      }),
    ).rejects.toThrow('Private key not provided');
  });
});
