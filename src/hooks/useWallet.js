import { useContext } from 'react';
import { WalletContext } from '../context';
import { WalletStatus } from '../constants';

const useWallet = () => {
  const wallet = useContext(WalletContext);
  const connected = wallet.status === WalletStatus.connected;
  const connecting = wallet.status === WalletStatus.connecting;

  return {
    ...wallet,
    connected,
    connecting,
  };
};

export default useWallet;
