import { ethers } from 'ethers';

import {
  formatUnits,
  getQtumAddress,
  formatAddr,
  formatDidShort,
  formatNumber,
  formatAmount,
  formatBalance,
  formatDateDMYT,
  formatDateMY,
  formatDateDMY,
  formatDateTime,
  formatDateDM,
} from '../helpers/format';

describe('helpers/format', () => {
  it('formatUnits rounds to specified decimals', () => {
    const val = ethers.utils.parseUnits('1.23456789', 8);
    expect(formatUnits(val, 8)).toBe('1.23456789');
    expect(formatUnits(val, 8, 4)).toBe('1.2346');
  });

  it('getQtumAddress returns base58 string and varies by chainId', async () => {
    const hexAddr = '0x0000000000000000000000000000000000000001';
    const mainnet = await getQtumAddress(hexAddr, 81);
    const testnet = await getQtumAddress(hexAddr, 8889);

    const base58re =
      /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/u;
    expect(typeof mainnet).toBe('string');
    expect(mainnet.length).toBeGreaterThan(20);
    expect(base58re.test(mainnet)).toBe(true);
    expect(base58re.test(testnet)).toBe(true);
    expect(mainnet).not.toBe(testnet);

    await expect(getQtumAddress(hexAddr, 1 as any)).rejects.toThrow(
      'Unsupported chainId',
    );
  });

  it('formatAddr and formatDidShort', () => {
    const long = 'abcdef0123456789abcdef0123456789abcdef01';
    const formatted = formatAddr(long, 6);
    expect(formatted).toBe(`${long.slice(0, 6)}...${long.slice(-6)}`);

    const did = 'did:key:z6MkfK9q9x5q1u6G7';
    const short = formatDidShort(did);
    expect(typeof short).toBe('string');
    expect(short).toContain('...');
  });

  it('formatNumber removes trailing zeros and groups', () => {
    expect(formatNumber(1234.5)).toBe('1,234.5');
    expect(formatNumber(0)).toBe('0');
  });

  it('formatAmount and formatBalance basic behavior', () => {
    expect(formatAmount('1234.5000')).toBe('1,234.5');
    const withDecimals = formatAmount('1.234500', 8);
    expect(withDecimals).toBe('1.2345');

    // Balance prefixes for large numbers
    expect(formatBalance('1000000')).toMatch(/1M$/u);
    expect(formatBalance('2500000000')).toMatch(/2.5B$/u);
  });

  it('date formatters return non-empty strings', () => {
    const d = '2025-01-31T16:25:00Z';
    expect(formatDateDMYT(d)).toStrictEqual(expect.any(String));
    expect(formatDateMY(d)).toStrictEqual(expect.any(String));
    expect(formatDateDMY(d)).toStrictEqual(expect.any(String));
    expect(formatDateTime(d)).toStrictEqual(expect.any(String));
    expect(formatDateDM(d)).toStrictEqual(expect.any(String));
  });
});
