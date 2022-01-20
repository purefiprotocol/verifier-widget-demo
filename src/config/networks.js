import binanceLogo from '../assets/icons/bsc2.svg';
import binanceContainedLogo from '../assets/icons/bsc.svg';

const AMOUNT_OF_BLOCKS_PER_YEAR_BSC = 10500000;

export const BSC_MAINNET_NETWORK = {
  name: 'BSC Mainnet',
  networkId: 56,
  avatar: binanceLogo,
  avatarContained: binanceContainedLogo,
  amountOfBlocksPerYear: AMOUNT_OF_BLOCKS_PER_YEAR_BSC,
  symbol: 'BNB',
};

export const BSC_TEST_NETWORK = {
  name: 'BSC Test',
  networkId: 97,
  avatar: binanceLogo,
  avatarContained: binanceContainedLogo,
  amountOfBlocksPerYear: AMOUNT_OF_BLOCKS_PER_YEAR_BSC,
  symbol: 'BNB',
};

const NETWORKS = {
  [BSC_MAINNET_NETWORK.networkId]: BSC_MAINNET_NETWORK,
  [BSC_TEST_NETWORK.networkId]: BSC_TEST_NETWORK,
};

export { NETWORKS };

export const DEFAULT_NETWORK = BSC_MAINNET_NETWORK;
