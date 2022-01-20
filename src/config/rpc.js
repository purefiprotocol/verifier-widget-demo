import { BSC_MAINNET_NETWORK, BSC_TEST_NETWORK } from './networks';

const rpc = {
  [BSC_MAINNET_NETWORK.networkId]: `https://bsc-dataseed1.binance.org`,
  [BSC_TEST_NETWORK.networkId]: `https://data-seed-prebsc-1-s1.binance.org:8545`,
};

export default rpc;
