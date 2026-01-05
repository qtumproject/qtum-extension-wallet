import { Chain, Erc20__factory } from '@qtumproject/qtum-wallet-connector';
import { QtumWallet } from 'qtum-ethers-wrapper';
import type { Provider } from '@ethersproject/providers';
import { Signer} from 'ethers';

import type { AbstractFactoryClassType, AbstractFactoryClassReturnType, TokenType } from '@/types';
import { getContract } from '@/rpc';

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

export const searchQRC20 = async (contractAddress: string, wallet: QtumWallet): Promise<TokenType> => {
  try {
    const { contractInstance } = createQRC20(contractAddress, wallet);
    const [name, symbol, decimals, balance, chainId] = await Promise.all([
      contractInstance.name(),
      contractInstance.symbol(),
      contractInstance.decimals(),
      Promise.resolve(null),
      String(wallet.getChainId())
    ]);
    return { contractAddress, name, symbol, decimals, balance, chainId };
  } catch (error) {
    throw new Error(
      error.code === 'CALL_EXCEPTION' ?
        'Failed to fetch QRC20 token info' :
        'Something went wrong'
    );
  }
}

export const isValidQRC20ByExplorer = async (contractAddress: string, network: Chain): Promise<boolean> => {
  try {
    return (await getContract(contractAddress, network)).type === 'qrc20';
  } catch (error) {
    throw new Error('Something went wrong');
  }
};

export const getTokensWithBalance = async (tokens: TokenType[], wallet: QtumWallet): Promise<TokenType[]> => {
  return Promise.all(tokens.map((token) => getTokenWithBalance(token, wallet)));
};

export const getTokenWithBalance = async (token: TokenType, wallet: QtumWallet): Promise<TokenType> => {
  const { contractInstance } = createQRC20(token.contractAddress, wallet);
  token.balance = String(await contractInstance.balanceOf(wallet.address))
  return token;
}
