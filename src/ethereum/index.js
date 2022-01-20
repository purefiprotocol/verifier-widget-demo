import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { DEFAULT_NETWORK, NETWORKS, RPC } from '../config';

class Ethereum {
  metaMaskWallet = window.ethereum;

  provider =
    this.metaMaskWallet &&
    new ethers.providers.Web3Provider(this.metaMaskWallet);

  account = '';

  network = DEFAULT_NETWORK;

  init = (walletProvider, accountsChanged, networkChanged) => {
    const newProvider = walletProvider || this.metaMaskWallet;
    this.provider = new ethers.providers.Web3Provider(newProvider);

    newProvider.on('accountsChanged', ([account]) => {
      this.account = account || '';
      accountsChanged(this.account);
    });

    const provider = new ethers.providers.Web3Provider(newProvider, 'any');
    provider.on('network', ({ chainId }) => {
      this.network = NETWORKS[chainId];
      this.provider = new ethers.providers.Web3Provider(newProvider);
      networkChanged(chainId);
    });
  };

  getMetaMaskWalletAccount = async (request) => {
    const method = request ? 'eth_requestAccounts' : 'eth_accounts';
    const [account] = await this.metaMaskWallet.request({
      method,
    });
    return account || '';
  };

  isMetaMaskProviderExist = async () => {
    const provider = await detectEthereumProvider();
    return !!provider;
  };

  setWalletAccount = (account) => {
    this.account = account;
  };

  setNetwork = async (newNetwork) => {
    this.network = newNetwork;
    const chainId = `0x${newNetwork.networkId.toString(16)}`;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask
      // if it is not, then install it into the user MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId,
                chainName: newNetwork.name,
                rpcUrls: [RPC[newNetwork.networkId]],
              },
            ],
          });
        } catch (anotherError) {
          console.error(anotherError);
        }
      }
      console.error(error);
    }
  };

  getBalance = async () => {
    const balance = await this.provider.getBalance(this.account);
    return ethers.utils.formatEther(balance);
  };

  getNetwork = async () => {
    const { chainId } = await this.provider.getNetwork();
    return chainId;
  };

  getSigner = () => this.provider.getSigner();
}

const ethereum = new Ethereum();

export default ethereum;
