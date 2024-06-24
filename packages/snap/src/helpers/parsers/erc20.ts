// eslint-disable-next-line camelcase
import { Erc20__factory } from '@qtumproject/qtum-wallet-connector';

import { getProvider } from '@/config';
import { erc20Interface } from '@/helpers';

export const parseErc20Transfer = (data: string) => {
  return erc20Interface.decodeFunctionData('transfer', data);
};

export const getErc20TokenDetails = async (address: string) => {
  const provider = await getProvider();

  // eslint-disable-next-line camelcase
  const contract = Erc20__factory.connect(address, provider);

  return Promise.all([contract.name(), contract.symbol(), contract.decimals()]);
};
