import { QtumWallet } from 'qtum-ethers-wrapper';
import { jest } from '@jest/globals';
import { providers } from 'ethers';

import {
  createQRC20,
  getTokenWithBalance,
  getTokensWithBalance,
  isValidQRC20ByExplorer,
  searchQRC20,
} from '../helpers/qrc20';
import * as rpc from '../rpc';
import { MAINNET_CHAIN, TESTNET_CHAIN } from './utils';
import type { TokenType } from '../types';
import type { ContractResponse } from '../types/explorer';

jest.mock('../rpc', () => ({
  getContract: jest.fn(),
}));

jest.mock('@qtumproject/qtum-wallet-connector', () => ({
  Erc20__factory: {
    connect: jest.fn(),
    createInterface: jest.fn(),
  },
}));

describe('qrc20', () => {
  const mockConnect = jest.fn();
  const mockCreateInterface = jest.fn();
  const mockProvider = new providers.JsonRpcProvider();

  beforeEach(() => {
    const { Erc20__factory } = require('@qtumproject/qtum-wallet-connector');
    Erc20__factory.connect.mockImplementation(mockConnect);
    Erc20__factory.createInterface.mockImplementation(mockCreateInterface);
    jest
      .spyOn(mockProvider, 'getNetwork')
      .mockImplementation(() => Promise.resolve({ chainId: 81, name: 'test' }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a QRC20 contract', () => {
    const wallet = new QtumWallet(
      '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff'
    );
    createQRC20('0x11223344556677889900aabbccddeeff00112233', wallet);
    expect(mockConnect).toHaveBeenCalledWith(
      '0x11223344556677889900aabbccddeeff00112233',
      wallet
    );
    expect(mockCreateInterface).toHaveBeenCalled();
  });

  it('should search for a QRC20 token', async () => {
    const wallet = new QtumWallet(
      '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
      mockProvider
    );
    const contractInstance = {
      name: jest.fn().mockImplementation(() => Promise.resolve('Wrapped QTUM')),
      symbol: jest.fn().mockImplementation(() => Promise.resolve('WQTUM')),
      decimals: jest.fn().mockImplementation(() => Promise.resolve(18)),
    };
    mockConnect.mockReturnValue(contractInstance);

    const token = await searchQRC20(
      '0x3D1489074167Ce1468b3b325f623D932a8CeBe27',
      wallet
    );

    expect(token.name).toBe('Wrapped QTUM');
    expect(token.symbol).toBe('WQTUM');
    expect(token.decimals).toBe(18);
  });

  it('should validate a QRC20 by explorer', async () => {
    const mockContractResponse: ContractResponse = {
      address: '0x11223344556677889900aabbccddeeff00112233',
      vm: 'evm',
      type: 'qrc20',
      createHeight: 1,
      createTransactionId: '0x',
      createOutputIndex: 0,
      createBy: '0x',
      destructHeight: null,
      balance: '0',
      totalReceived: '0',
      totalSent: '0',
      unconfirmed: '0',
      qrc20Balances: [],
      qrc721Balances: [],
      transactionCount: 0,
    };
    (rpc.getContract as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockContractResponse)
    );
    const isValid = await isValidQRC20ByExplorer(
      '0x11223344556677889900aabbccddeeff00112233',
      MAINNET_CHAIN
    );
    expect(isValid).toBe(true);
    expect(rpc.getContract).toHaveBeenCalledWith(
      '0x11223344556677889900aabbccddeeff00112233',
      MAINNET_CHAIN
    );
  });

  it('should get a token with balance', async () => {
    const wallet = new QtumWallet(
      '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff'
    );
    const contractInstance = {
      balanceOf: jest
        .fn()
        .mockImplementation(() => Promise.resolve('100000000')),
    };
    mockConnect.mockReturnValue(contractInstance);
    const token: TokenType = {
      contractAddress: '0x11223344556677889900aabbccddeeff00112233',
      name: 'Test Token',
      symbol: 'TST',
      decimals: 8,
      balance: null,
      chainId: String(TESTNET_CHAIN.chainId),
    };

    const tokenWithBalance = await getTokenWithBalance(token, wallet);
    expect(tokenWithBalance.balance).toBe('100000000');
  });

  it('should get tokens with balance', async () => {
    const wallet = new QtumWallet(
      '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff'
    );
    const contractInstance = {
      balanceOf: jest
        .fn()
        .mockImplementation(() => Promise.resolve('100000000')),
    };
    mockConnect.mockReturnValue(contractInstance);
    const tokens: TokenType[] = [
      {
        contractAddress: '0x11223344556677889900aabbccddeeff00112233',
        name: 'Test Token',
        symbol: 'TST',
        decimals: 8,
        balance: null,
        chainId: String(TESTNET_CHAIN.chainId),
      },
    ];

    const tokensWithBalance = await getTokensWithBalance(tokens, wallet);
    expect(tokensWithBalance[0].balance).toBe('100000000');
  });
});
