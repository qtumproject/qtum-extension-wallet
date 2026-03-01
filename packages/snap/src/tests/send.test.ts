import { QtumWallet } from 'qtum-ethers-wrapper';

import {
  estimateNative,
  estimateQRC20,
  sendNative,
  sendQRC20,
  totalAmount,
} from '@/helpers/send';
import { MAINNET_CHAIN } from '@/tests/utils';

const mockSendTransaction = jest.fn();
const mockEstimateGas = jest.fn();
const mockGetGasPrice = jest.fn();

jest.mock('qtum-ethers-wrapper', () => ({
  QtumWallet: jest.fn().mockImplementation(() => ({
    sendTransaction: mockSendTransaction,
    estimateGas: mockEstimateGas,
    getGasPrice: mockGetGasPrice,
  })),
}));

jest.mock('@/helpers/qrc20', () => ({
  createQRC20: jest.fn(() => ({
    contractInterface: {
      encodeFunctionData: jest.fn().mockReturnValue('0x12345'),
    },
    decimals: jest.fn().mockResolvedValue(8),
  })),
}));

describe('send', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send native tokens', async () => {
    const wallet = new QtumWallet('pk');
    mockEstimateGas.mockResolvedValue({
      _isBigNumber: true,
      toString: () => '21000',
      mul: jest.fn().mockReturnValue({ _isBigNumber: true, toString: () => '840000' }),
    });
    mockGetGasPrice.mockResolvedValue({
      _isBigNumber: true,
      toString: () => '40',
      mul: jest.fn().mockReturnValue({ _isBigNumber: true, toString: () => '840000' }),
    });
    mockSendTransaction.mockResolvedValue({ hash: '0x123' });
    const result = await sendNative(
      'qWoj2omccdtDBfDbaxzA6SKHFFnpfa2Bwt',
      '1',
      8,
      wallet,
      MAINNET_CHAIN,
    );
    expect(result.isValid).toBe(true);
    if ('hash' in result) {
      expect(result.hash).toBe('123');
    }
  });

  it('should send QRC20 tokens', async () => {
    const wallet = new QtumWallet('pk');
    mockEstimateGas.mockResolvedValue({
      _isBigNumber: true,
      toString: () => '50000',
      mul: jest.fn().mockReturnValue({ _isBigNumber: true, toString: () => '2000000' }),
    });
    mockGetGasPrice.mockResolvedValue({
      _isBigNumber: true,
      toString: () => '40',
      mul: jest.fn().mockReturnValue({ _isBigNumber: true, toString: () => '2000000' }),
    });
    mockSendTransaction.mockResolvedValue({ hash: '0x123' });
    const result = await sendQRC20(
      '0x11223344556677889900aabbccddeeff00112233',
      'qWoj2omccdtDBfDbaxzA6SKHFFnpfa2Bwt',
      '1',
      8,
      wallet,
      MAINNET_CHAIN,
    );
    expect(result.isValid).toBe(true);
    if ('hash' in result) {
      expect(result.hash).toBe('123');
    }
  });

  it('should calculate total amount for native transaction', () => {
    const gas = {
      gasLimit: '21000',
      gasPrice: '40',
      fee: '840000',
    };
    const total = totalAmount('QTUM', '1', false, gas);
    expect(total).toBe('840001.0 QTUM');
  });

  it('should calculate total amount for QRC20 transaction', () => {
    const gas = {
      gasLimit: '50000',
      gasPrice: '40',
      fee: '2000000',
    };
    const total = totalAmount('TST', '1', true, gas);
    expect(total).toBe('1 TST + 0.000000000002 QTUM');
  });
});
