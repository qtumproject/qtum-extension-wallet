import type { StorageEnum } from '@/enums';
import type { StorageType } from '@/types';

const getState = async () => {
  return await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });
};

const getItem = async <T extends StorageEnum>(
  key: T,
): Promise<StorageType[T]> => {
  const state = await getState();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return state?.[key] ? JSON.parse(state[key]) : null;
};

const setItem = async <T extends StorageEnum>(
  key: T,
  inputData: StorageType[T],
) => {
  const state = (await getState()) ?? {};

  state[key] = JSON.stringify(inputData);
  return await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState: state },
  });
};

const clear = async () => {
  return await snap.request({
    method: 'snap_manageState',
    params: { operation: 'clear' },
  });
};

export const snapStorage = {
  getState,
  getItem,
  setItem,
  clear,
};
