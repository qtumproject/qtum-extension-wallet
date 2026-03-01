import { TransactionType } from '@metamask/transaction-controller';

import {
  determineTransactionType,
  parseStandardTokenTransactionData,
  readAddressAsContract,
} from '../../helpers/parsers/tx';

jest.mock('../../config', () => ({
  getProvider: jest.fn(),
}));

describe('tx parser', () => {
  const mockGetCode = jest.fn();

  beforeEach(() => {
    const { getProvider } = require('../../config');
    getProvider.mockResolvedValue({
      getCode: mockGetCode,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should parse standard token transaction data', () => {
    const data =
      '0xa9059cbb0000000000000000000000007e7e11223344556677889900aabbccddeeff00110000000000000000000000000000000000000000000000000000000000000001';
    const parsed = parseStandardTokenTransactionData(data);
    expect(parsed?.name).toBe('transfer');
  });

  it('should read address as contract', async () => {
    mockGetCode.mockResolvedValue('0x123');
    const contract = await readAddressAsContract('0x123');
    expect(contract.isContractAddress).toBe(true);
    expect(contract.contractCode).toBe('0x123');
  });

  it('should determine transaction type as simple send', async () => {
    mockGetCode.mockResolvedValue('0x');
    const type = await determineTransactionType({
      from: '0x123',
      to: '0x123',
      value: '0x1',
    });
    expect(type.type).toBe(TransactionType.simpleSend);
  });

  it('should determine transaction type as deploy contract', async () => {
    const type = await determineTransactionType({ from: '0x123', data: '0x123' });
    expect(type.type).toBe(TransactionType.deployContract);
  });

  it('should determine transaction type as contract interaction', async () => {
    mockGetCode.mockResolvedValue('0x123');
    const type = await determineTransactionType({
      from: '0x123',
      to: '0x123',
      data: '0x123',
    });
    expect(type.type).toBe(TransactionType.contractInteraction);
  });

  it('should determine transaction type as token method transfer', async () => {
    mockGetCode.mockResolvedValue('0x123');
    const data =
      '0xa9059cbb0000000000000000000000007e7e11223344556677889900aabbccddeeff00110000000000000000000000000000000000000000000000000000000000000001';
    const type = await determineTransactionType({
      from: '0x123',
      to: '0x123',
      data,
    });
    expect(type.type).toBe(TransactionType.tokenMethodTransfer);
  });
});
