import { FetcherError } from '../helpers/error-helper';

describe('error-helper', () => {
  it('should create a FetcherError with a response', () => {
    const response = new Response('Error', { status: 500 });
    const error = new FetcherError(response);
    expect(error.name).toBe('FetcherError');
    expect(error.response).toBe(response);
  });
});
