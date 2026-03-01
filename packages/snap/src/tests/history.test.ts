import {
  getNativeHistory,
  getQRC20History,
  getTop5History,
} from '@/helpers/history';
import {
  getNativeBasicTransaction,
  getQRC20BalanceHistory,
} from '@/rpc';
import { MAINNET_CHAIN } from '@/tests/utils';

jest.mock('@/rpc');

const mockedGetNative = getNativeBasicTransaction as jest.Mock;
const mockedGetQRC20 = getQRC20BalanceHistory as jest.Mock;

describe('history', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get native history', async () => {
    mockedGetNative.mockResolvedValue({
      totalCount: 1,
      transactions: [
        {
          id: 'tx1',
          amount: '100000000',
          confirmations: 10,
          timestamp: 1672531200,
          type: 'send',
        },
      ],
    });

    const history = await getNativeHistory(
      'qUbxboqjBRp96j3La8D1RYkyqx5uQbJ9ub',
      MAINNET_CHAIN,
      10,
      0
    );

    expect(history.items.length).toBe(1);
    expect(history.items[0].transactionID).toBe('tx1');
    expect(history.totalCount).toBe(1);
    expect(history.isValid).toBe(true);
    expect(mockedGetNative).toHaveBeenCalledWith(
      'qUbxboqjBRp96j3La8D1RYkyqx5uQbJ9ub',
      MAINNET_CHAIN,
      10,
      0
    );
  });

  it('should get QRC20 history', async () => {
    mockedGetQRC20.mockResolvedValue({
      totalCount: 1,
      transactions: [
        {
          id: 'tx2',
          confirmations: 10,
          timestamp: 1672531200,
          tokens: [
            {
              address: '0x11223344556677889900aabbccddeeff00112233',
              amount: '100000000',
              decimals: 8,
              name: 'Test Token',
              symbol: 'TST',
            },
          ],
        },
      ],
    });

    const history = await getQRC20History(
      'qUbxboqjBRp96j3La8D1RYkyqx5uQbJ9ub',
      MAINNET_CHAIN,
      10,
      0
    );

    expect(history.items.length).toBe(1);
    expect(history.items[0].transactionID).toBe('tx2');
    expect(history.totalCount).toBe(1);
    expect(history.isValid).toBe(true);
    expect(mockedGetQRC20).toHaveBeenCalledWith(
      'qUbxboqjBRp96j3La8D1RYkyqx5uQbJ9ub',
      MAINNET_CHAIN,
      10,
      0
    );
  });

  it('should get top 5 history', async () => {
    mockedGetNative.mockResolvedValue({
      totalCount: 1,
      transactions: [
        {
          id: 'tx1',
          amount: '100000000',
          confirmations: 10,
          timestamp: 1672531200,
          type: 'send',
        },
      ],
    });
    mockedGetQRC20.mockResolvedValue({
      totalCount: 1,
      transactions: [
        {
          id: 'tx2',
          confirmations: 10,
          timestamp: 1672531200,
          tokens: [
            {
              address: '0x11223344556677889900aabbccddeeff00112233',
              amount: '100000000',
              decimals: 8,
              name: 'Test Token',
              symbol: 'TST',
            },
          ],
        },
      ],
    });

    const history = await getTop5History(
      'qUbxboqjBRp96j3La8D1RYkyqx5uQbJ9ub',
      MAINNET_CHAIN
    );

    expect(history.items.length).toBe(2);
    expect(history.totalCount).toBe(2);
    expect(history.isValid).toBe(true);
    expect(mockedGetNative).toHaveBeenCalled();
    expect(mockedGetQRC20).toHaveBeenCalled();
  });
});
