export const evmChains = [
  /* non evm chain*/
  {
    name: "Bitcoin",
    ticker: "BTC",
    chainId: 'btc',
    chainHex: "btc",
    rpcUrl:'' 
  },
  {
    name: "Ethereum Mainnet",
    ticker: "ETH",
    chainId: 1,
    chainHex: "0x1",
    rpcUrl: 'https://rpc.ankr.com/eth/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  },
  {
    name: "BNB Smart Chain",
    ticker: "BNB",
    chainId: 56,
    chainHex: "0x38",
    rpcUrl: 'https://rpc.ankr.com/bsc/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  },
  {
    name: "Polygon (Matic)",
    ticker: "MATIC",
    chainId: 137,
    chainHex: "0x89",
    rpcUrl: 'https://rpc.ankr.com/polygon/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  },
  {
    name: "Arbitrum One",
    ticker: "ETH",
    chainId: 42161,
    chainHex: "0xa4b1",
    rpcUrl: 'https://rpc.ankr.com/arbitrum/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  },
  {
    name: "Optimism",
    ticker: "ETH",
    chainId: 10,
    chainHex: "0xa",
    rpcUrl: 'https://rpc.ankr.com/optimism/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  },
  {
    name: "Avalanche C-Chain",
    ticker: "AVAX",
    chainId: 43114,
    chainHex: "0xa86a",
    rpcUrl: 'https://rpc.ankr.com/avalanche/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  },
  {
    name: "Fantom Opera",
    ticker: "FTM",
    chainId: 250,
    chainHex: "0xfa",
    rpcUrl: ''
  },
  {
    name: "Base",
    ticker: "ETH",
    chainId: 8453,
    chainHex: "0x2105",
    rpcUrl: 'https://rpc.ankr.com/base/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  },
  {
    name: "zkSync Era",
    ticker: "ETH",
    chainId: 324,
    chainHex: "0x144",
    rpcUrl: 'https://rpc.ankr.com/zksync_era/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  },
  {
    name: "Linea",
    ticker: "ETH",
    chainId: 59144,
    chainHex: "0xe708",
    rpcUrl: ''
  },
  {
    name: "Scroll",
    ticker: "ETH",
    chainId: 534352,
    chainHex: "0x8284",
    rpcUrl: 'https://rpc.ankr.com/scroll/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  },
  {
    name: "Cronos",
    ticker: "CRO",
    chainId: 25,
    chainHex: "0x19",
    rpcUrl: ''
  },
  {
    name: "Gnosis (xDai)",
    ticker: "xDAI",
    chainId: 100,
    chainHex: "0x64",
    rpcUrl: 'https://rpc.ankr.com/gnosis/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  },
  {
    name: "Celo",
    ticker: "CELO",
    chainId: 42220,
    chainHex: "0xa4ec",
    rpcUrl: 'https://rpc.ankr.com/celo/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  },
  {
    name: "Moonbeam",
    ticker: "GLMR",
    chainId: 1284,
    chainHex: "0x504",
    rpcUrl: 'https://rpc.ankr.com/moonbeam/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  },
  {
    name: "Moonriver",
    ticker: "MOVR",
    chainId: 1285,
    chainHex: "0x505",
    rpcUrl: ''
  },
  {
    name: "Harmony",
    ticker: "ONE",
    chainId: 1666600000,
    chainHex: "0x63564c40",
    rpcUrl: ''
  },
  {
    name: "Metis",
    ticker: "METIS",
    chainId: 1088,
    chainHex: "0x440",
    rpcUrl: ''
  },
  {
    name: "Kava EVM",
    ticker: "KAVA",
    chainId: 2222,
    chainHex: "0x8ae",
    rpcUrl: 'https://rpc.ankr.com/premium-http/kava_api/f414bb17cce648f9c2381aa7a35bda9970bc1aa99d455cae9c3d07609a1bb84d'
  }
];

export const  formatDate = (isoDate) =>{
  const date = new Date(isoDate);

  const day = date.getDate(); // Day of the month (1–31)
  const month = date.toLocaleString('en-US', { month: 'short' }); // e.g., Jan, Feb, etc.
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

