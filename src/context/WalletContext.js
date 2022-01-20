import { createContext } from 'react';
import { DEFAULT_NETWORK } from '../config';
import { WalletStatus, WalletType } from '../constants';

const WalletContext = createContext({
  account: '',
  connect() {},
  disconnect() {},
  status: WalletStatus.disconnected,
  balance: '',
  networkId: null,
  walletType: WalletType.none,
  activeNetwork: DEFAULT_NETWORK,
  onNetworkChange() {},
});

export default WalletContext;
