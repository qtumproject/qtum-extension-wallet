import { sleep } from '../helpers/promise';

describe('promise', () => {
  it('should resolve after a specified amount of time', async () => {
    jest.useFakeTimers();
    const spy = jest.fn();

    const promise = sleep(1000);
    promise.then(spy);

    // At this point in time, the callback should not have been called yet
    expect(spy).not.toHaveBeenCalled();

    // Fast-forward time
    jest.runAllTimers();

    // Wait for the promise to resolve
    await promise;

    // Now the callback should have been called
    expect(spy).toHaveBeenCalled();
  });
});
