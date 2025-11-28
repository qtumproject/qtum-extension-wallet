import { Erc20__factory } from '@qtumproject/qtum-wallet-connector';
import { QtumWallet} from 'qtum-ethers-wrapper';
import type { Provider } from '@ethersproject/providers';
import { Signer} from 'ethers';

import { getQRC20TokensForCurrentNetwork } from '@/storage/qrc20';
import {AbstractFactoryClassType, AbstractFactoryClassReturnType, QRC20TokenType, type QRC20StorageType} from '@/types';

const createContract = <F extends AbstractFactoryClassType>(
  address: string, signerOrProvider: Signer | Provider, factoryClass: F,
): AbstractFactoryClassReturnType<F> => {

  const contractInstance = factoryClass.connect(address, signerOrProvider) as ReturnType<F['connect']>;
  const contractInterface = factoryClass.createInterface() as ReturnType<F['createInterface']>;

  return { contractInstance, contractInterface };
}

export const createQRC20 = (address: string, signerOrProvider: Signer | Provider) => {
  return createContract(address, signerOrProvider, Erc20__factory);
}

export const getTokens = async (tokensStorages: QRC20StorageType[], wallet: QtumWallet): Promise<QRC20TokenType[]> => {
  let qrc20Tokens: QRC20TokenType[] = [];
  for (const tokensStorage of tokensStorages) {
    const token = await getToken(
      tokensStorage.contractAddress, wallet, wallet.address
    );
    qrc20Tokens.push({
      contractAddress: tokensStorage.contractAddress,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      balance: String(token.balance),
      chainId: tokensStorage.chainId
    });
  }
  return qrc20Tokens;
};

export const getToken = async (
  contractAddress: string, wallet: QtumWallet, address?: string
): Promise<QRC20TokenType> => {
  try {
    const { contractInstance } = createQRC20(contractAddress, wallet);

    const [name, symbol, decimals, balance, chainId] = await Promise.all([
      contractInstance.name(),
      contractInstance.symbol(),
      contractInstance.decimals(),
      address ? contractInstance.balanceOf(address) : Promise.resolve(undefined),
      wallet.getChainId()
    ]);
    return { contractAddress, name, symbol, decimals, balance: String(balance), chainId: String(chainId) };
  } catch (_) {
    throw new Error('Wrong QRC20 contract address');
  }
}
