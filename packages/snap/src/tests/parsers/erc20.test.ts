import {
  getErc20TokenDetails,
  parseErc20Transfer,
} from '../../helpers/parsers/erc20';

jest.mock('../../config', () => ({
  getProvider: jest.fn(),
}));

jest.mock('@qtumproject/qtum-wallet-connector', () => ({
  Erc20__factory: {
    connect: jest.fn(),
  },
}));

describe('erc20 parser', () => {
  const mockName = jest.fn();
  const mockSymbol = jest.fn();
  const mockDecimals = jest.fn();

  beforeEach(() => {
    const { Erc20__factory } = require('@qtumproject/qtum-wallet-connector');
    Erc20__factory.connect.mockReturnValue({
      name: mockName,
      symbol: mockSymbol,
      decimals: mockDecimals,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should parse ERC20 transfer data', () => {
    const data =
      '0xa9059cbb0000000000000000000000007e7e11223344556677889900aabbccddeeff00110000000000000000000000000000000000000000000000000000000000000001';
    const parsed = parseErc20Transfer(data);
    expect(parsed[0]).toBe('0x7e7E11223344556677889900AabBcCDDeeFf0011');
    expect(parsed[1].toString()).toBe('1');
  });

  it('should get ERC20 token details', async () => {
    mockName.mockResolvedValue('Test Token');
    mockSymbol.mockResolvedValue('TST');
    mockDecimals.mockResolvedValue(8);

    const [name, symbol, decimals] = await getErc20TokenDetails('0x123');
    expect(name).toBe('Test Token');
    expect(symbol).toBe('TST');
    expect(decimals).toBe(8);
  });
});
