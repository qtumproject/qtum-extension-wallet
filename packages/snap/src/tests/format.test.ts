import {
  formatAddr,
  formatAmount,
  formatBalance,
  formatDateDM,
  formatDateDMY,
  formatDateDMYT,
  formatDateMY,
  formatDateTime,
  formatDidShort,
  formatNumber,
  formatUnits,
  getQtumAddress,
} from '../helpers/format';

describe('format', () => {
  it('should format units', () => {
    expect(formatUnits('123456789', 8)).toBe('1.23456789');
  });

  it('should get a qtum address', async () => {
    const hexAddress = '0x7e7e11223344556677889900aabbccddeeff0011';
    const qtumAddress = await getQtumAddress(hexAddress, 81);
    expect(qtumAddress).toBe('QY8pGkeAuXTzxVQNY8p1BzRt3cDLEZZ93h');
  });

  it('should format a date as DD MMM YYYY HH:mm', () => {
    expect(formatDateDMYT('2023-01-01T12:30:00')).toBe('01 Jan 2023 12:30');
  });

  it('should format an address', () => {
    const address = '0x11223344556677889900aabbccddeeff00112233';
    expect(formatAddr(address, 6)).toBe('0x1122...112233');
  });

  it('should format a short DID', () => {
    const did = 'did:qtum:11223344556677889900aabbccddeeff00112233';
    expect(formatDidShort(did)).toBe('112233...112233');
  });

  it('should format a date as MM / YYYY', () => {
    expect(formatDateMY('2023-01-01')).toBe('01 / 2023');
  });

  it('should format a date as DD MMM, YYYY', () => {
    expect(formatDateDMY('2023-01-01')).toBe('01 Jan, 2023');
  });

  it('should format a date and time', () => {
    expect(formatDateTime('2023-01-01T12:30:00')).toBe('01 Jan, 2023, 12:30 PM');
  });

  it('should format a date as D MMM', () => {
    expect(formatDateDM('2023-01-01')).toBe('1 Jan');
  });

  it('should format a number', () => {
    expect(formatNumber(12345.6789)).toBe('12,345.67');
  });

  it('should format an amount', () => {
    expect(formatAmount('123456789', 8)).toBe('1.23456789');
  });

  it('should format a balance', () => {
    expect(formatBalance('123000000000', 8)).toBe('1230');
    expect(formatBalance('123123321000901', 18)).toBe('0');
    expect(formatBalance('1231233210009001', 18)).toBe('0.001');
    expect(formatBalance('12312332100090001', 18)).toBe('0.012');
    expect(formatBalance('123000000000000091', 18)).toBe('0.123');
    expect(formatBalance('123456789101112131123', 18)).toBe('123.456');
    expect(formatBalance('1234567891011121311231', 18)).toBe('1234.56');
    expect(formatBalance('12345678910111213112312', 18)).toBe('12345.6');
    expect(formatBalance('123456789101112131123126', 18)).toBe('123456');
    expect(formatBalance('1234567891011121311231269', 18)).toBe('1.234M');
    expect(formatBalance('12345678910111213112312312', 18)).toBe('12.345M');
    expect(formatBalance('123456789101112131123123126', 18)).toBe('123.456M');
    expect(formatBalance('1234567891011121311231231269', 18)).toBe('1.234B');
    expect(formatBalance('12345678910111213112312312697', 18)).toBe('12.345B');
    expect(formatBalance('123456789101112131123123126978', 18)).toBe('123.456B');
    expect(formatBalance('1234567891011121311231231269784', 18)).toBe('1.234T');
    expect(formatBalance('12345678910111213112312312697843', 18)).toBe('12.345T');
    expect(formatBalance('123456789101112131123123126978432', 18)).toBe('123.456T');
  });
});
