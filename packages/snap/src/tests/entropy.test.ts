import { genPkHexFromEntropy } from '../helpers/entropy';
import { SnapMock } from './utils';

describe('entropy', () => {
  const snapMock = new SnapMock();

  beforeEach(() => {
    (global as any).snap = snapMock;
  });

  afterEach(() => {
    snapMock.reset();
  });

  it('should generate a private key from entropy', async () => {
    const pk = await genPkHexFromEntropy();
    expect(pk).toBe(
      '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff'
    );
  });

  it('should generate a private key from entropy with salt', async () => {
    const pk = await genPkHexFromEntropy('some salt');
    expect(pk).toBe(
      '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff'
    );
    expect(snapMock.getRequests()).toEqual([
      {
        method: 'snap_getEntropy',
        params: {
          version: 1,
          salt: 'some salt',
        },
      },
    ]);
  });
});
