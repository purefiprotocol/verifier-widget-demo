import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { PureFIWidget } from '@purefi/verifier-widget';
import { WalletStatus, WalletType, METAMASK_KEY } from '../constants';

import ethereum from '../ethereum';

import WalletContext from './WalletContext';
import { DEFAULT_NETWORK, NETWORKS } from '../config';

const WalletProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const [account, setAccount] = useState('');
  const [status, setStatus] = useState(WalletStatus.connecting);
  const [balance, setBalance] = useState('');
  const [networkId, setNetworkId] = useState(null);
  const [activeNetwork, setActiveNetwork] = useState(DEFAULT_NETWORK);
  const [walletType, setWalletType] = useState(WalletType.none);

  const refetchQueries = useCallback(async () => {
    await queryClient.invalidateQueries();
  }, [queryClient]);

  const setWalletAccount = useCallback(
    async (newAccount) => {
      if (newAccount) {
        const accountBalance = await ethereum.getBalance();
        setBalance(accountBalance);
        setStatus(WalletStatus.connected);
      } else {
        setBalance('');
        setStatus(WalletStatus.disconnected);
        setNetworkId(null);
        localStorage.removeItem(METAMASK_KEY);
      }

      setAccount(newAccount);
      await refetchQueries();
    },
    [refetchQueries]
  );

  const setWalletNetworkId = useCallback(
    async (chainId) => {
      setNetworkId(chainId);
      const network = NETWORKS[chainId];

      if (network) {
        setActiveNetwork(network);
      }

      const accountBalance = await ethereum.getBalance();
      setBalance(accountBalance);

      await refetchQueries();
    },
    [refetchQueries]
  );

  const connect = useCallback(
    async (type, initialization = false) => {
      try {
        const requestWalletModal = !initialization;

        if (type === WalletType.metamask) {
          const isWalletInstalled = await ethereum.isMetaMaskProviderExist();

          if (isWalletInstalled) {
            const walletAccount = await ethereum.getMetaMaskWalletAccount(
              requestWalletModal
            );

            ethereum.setWalletAccount(walletAccount);
            await setWalletAccount(walletAccount);
            ethereum.init(null, setWalletAccount, setWalletNetworkId);

            localStorage.setItem(METAMASK_KEY, 'true');
          }
        }

        setWalletType(type);
      } catch {
        setStatus(WalletStatus.disconnected);
      }
    },
    [setWalletAccount, setWalletNetworkId]
  );

  const disconnect = useCallback(async () => {
    if (walletType === WalletType.metamask) {
      localStorage.removeItem(METAMASK_KEY);
    }

    setWalletType(WalletType.none);
    setAccount('');
    setStatus(WalletStatus.disconnected);
  }, [walletType]);

  const init = useCallback(async () => {
    const isMetamaskKeyExist = localStorage.getItem(METAMASK_KEY);
    const isMetaMaskProviderExist = await ethereum.isMetaMaskProviderExist();

    const isMetaMaskWalletConnected =
      isMetamaskKeyExist && isMetaMaskProviderExist;

    if (isMetaMaskWalletConnected) {
      await connect(WalletType.metamask, true);
    } else {
      setStatus(WalletStatus.disconnected);
    }
  }, [connect]);

  const handleNetworkChange = useCallback(
    async (network) => {
      ethereum.setNetwork(network);
      setActiveNetwork(network);
      await refetchQueries();
    },
    [refetchQueries]
  );

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (account && activeNetwork) {
      const signer = ethereum.getSigner();
      PureFIWidget.setSigner(signer);
    } else {
      PureFIWidget.unsetSigner();
    }
  }, [account, activeNetwork]);

  return (
    <WalletContext.Provider
      value={{
        account,
        connect,
        status,
        balance,
        networkId,
        walletType,
        disconnect,
        activeNetwork,
        onNetworkChange: handleNetworkChange,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
