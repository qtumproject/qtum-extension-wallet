import { BigNumber } from 'ethers';

import { serialize } from '../helpers/utils';

describe('serialize', () => {
  it('should serialize a simple object', () => {
    const obj = {
      a: 1,
      b: 'hello',
      c: true,
    };
    expect(serialize(obj)).toEqual(obj);
  });

  it('should handle null and undefined values', () => {
    const obj = {
      a: null,
      b: undefined,
    };
    expect(serialize(obj)).toEqual({
      a: null,
      b: null,
    });
  });

  it('should serialize BigNumbers to hex strings', () => {
    const obj = {
      a: BigNumber.from(123),
      b: 'hello',
    };
    expect(serialize(obj)).toEqual({
      a: '0x7b',
      b: 'hello',
    });
  });

  it('should handle arrays', () => {
    const obj = {
      a: [1, 'hello', true, BigNumber.from(123), undefined, null],
    };
    expect(serialize(obj)).toEqual({
      a: [1, 'hello', true, '0x7b', null, null],
    });
  });

  it('should handle nested objects', () => {
    const obj = {
      a: 1,
      b: {
        c: 'hello',
        d: BigNumber.from(456),
        e: {
          f: null,
          g: [BigNumber.from(789)],
        },
      },
    };
    expect(serialize(obj)).toEqual({
      a: 1,
      b: {
        c: 'hello',
        d: '0x01c8',
        e: {
          f: null,
          g: ['0x0315'],
        },
      },
    });
  });

  it('should handle complex nested objects with different types', () => {
    const obj = {
      a: BigNumber.from(1),
      b: [
        {
          c: 'hello',
          d: BigNumber.from(2),
        },
        {
          e: [
            {
              f: BigNumber.from(3),
            },
          ],
        },
      ],
      g: {
        h: {
          i: BigNumber.from(4),
        },
      },
      j: null,
      k: undefined,
    };
    expect(serialize(obj)).toEqual({
      a: '0x01',
      b: [
        {
          c: 'hello',
          d: '0x02',
        },
        {
          e: [
            {
              f: '0x03',
            },
          ],
        },
      ],
      g: {
        h: {
          i: '0x04',
        },
      },
      j: null,
      k: null,
    });
  });

  it('should handle a transaction receipt with null values', () => {
    const receipt = {
      transactionHash: '0x123abc',
      blockNumber: BigNumber.from(12345),
      contractAddress: null,
      logs: [
        {
          logIndex: BigNumber.from(0),
          data: '0x456def',
          topics: ['0x789ghi'],
          extraField: null,
        },
      ],
      anotherField: undefined,
    };

    expect(serialize(receipt)).toEqual({
      transactionHash: '0x123abc',
      blockNumber: '0x3039',
      contractAddress: null,
      logs: [
        {
          logIndex: '0x00',
          data: '0x456def',
          topics: ['0x789ghi'],
          extraField: null,
        },
      ],
      anotherField: null,
    });
  });

  it('should remove functions from object', () => {
    const myFunc = () => 'hello';
    const obj = {
      a: 1,
      b: myFunc,
      c: {
        d: 'world',
        e: () => 42,
      },
    };
    const result = serialize(obj);
    expect(result.b).toBeUndefined();
    expect(result.c.e).toBeUndefined();
  });
});
