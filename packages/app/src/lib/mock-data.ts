import { Stablecoin } from "@/types/stablecoin";

export const mockStablecoins: Stablecoin[] = [
  {
    id: "usdc",
    name: "USD Coin",
    token: "USDC",
    peggedAsset: "USD",
    issuer: "Circle",
    tokenProgram: "SPL Token",
    tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    mintAuthority: "Circle/Coinbase",
    bridgingMechanisms: ["Wormhole", "Allbridge"],
    networksLiveOn: ["Ethereum", "Solana", "Avalanche", "Polygon"],
    redemptionMechanisms: ["Direct redemption through Circle", "Exchange"],
    solscanLink: "https://solscan.io/token/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    artemisLink: "https://artemis.xyz/token/usdc",
    assetReservesLink: "https://www.circle.com/en/transparency",
    marketCap: 45000000000,
    uniqueAddresses: 1250000,
    transactionVolume: {
      daily: 2500000000,
      monthly: 75000000000,
      yearly: 900000000000
    },
    executiveSummary: "USDC is a fully-backed stablecoin issued by Circle, with transparent reserves held in cash and short-term US Treasury bonds. It's the most widely used stablecoin on Solana with deep liquidity across DEXs and CEXs.",
    logoUrl: "https://i.postimg.cc/y6mGy9m7/image.png"
  },
  {
    id: "usdt",
    name: "Tether",
    token: "USDT",
    peggedAsset: "USD",
    issuer: "Tether Limited",
    tokenProgram: "SPL Token",
    tokenAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    mintAuthority: "Tether Limited",
    bridgingMechanisms: ["Wormhole", "Allbridge"],
    networksLiveOn: ["Ethereum", "Solana", "Tron", "BSC"],
    redemptionMechanisms: ["Direct redemption through Tether", "Exchange"],
    solscanLink: "https://solscan.io/token/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    artemisLink: "https://artemis.xyz/token/usdt",
    assetReservesLink: "https://tether.to/en/transparency",
    marketCap: 85000000000,
    uniqueAddresses: 950000,
    transactionVolume: {
      daily: 2100000000,
      monthly: 63000000000,
      yearly: 756000000000
    },
    executiveSummary: "USDT is the largest stablecoin by market cap, issued by Tether Limited. While historically facing questions about its reserves, it maintains its peg and provides high liquidity across Solana DeFi.",
    logoUrl: "https://cryptologos.cc/logos/tether-usdt-logo.png"
  },
  {
    id: "pyusd",
    name: "PayPal USD",
    token: "PYUSD",
    peggedAsset: "USD",
    issuer: "PayPal",
    tokenProgram: "Token 2022",
    tokenAddress: "HYdzX8K9JKCYyRXq4jBwXkEAQnrfLZCjQQNhgHNdH3P9",
    mintAuthority: "PayPal",
    bridgingMechanisms: ["Wormhole", "Portal Bridge"],
    networksLiveOn: ["Ethereum", "Solana"],
    redemptionMechanisms: ["Direct redemption through PayPal", "Exchange"],
    solscanLink: "https://solscan.io/token/HYdzX8K9JKCYyRXq4jBwXkEAQnrfLZCjQQNhgHNdH3P9",
    artemisLink: "https://artemis.xyz/token/pyusd",
    assetReservesLink: "https://www.paypal.com/pyusd/transparency",
    marketCap: 750000000,
    uniqueAddresses: 125000,
    transactionVolume: {
      daily: 50000000,
      monthly: 1500000000,
      yearly: 18000000000
    },
    executiveSummary: "PYUSD is PayPal's stablecoin, fully backed by USD deposits, US Treasuries and cash equivalents. Its integration with PayPal's payment infrastructure provides a bridge between traditional finance and crypto.",
    logoUrl: "https://cryptologos.cc/logos/paypal-pyusd-logo.png"
  },
  {
    id: "uxd",
    name: "UXD Stablecoin",
    token: "UXD",
    peggedAsset: "USD",
    issuer: "UXD Protocol",
    tokenProgram: "SPL Token",
    tokenAddress: "7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT",
    mintAuthority: "UXD Protocol",
    bridgingMechanisms: ["Native to Solana"],
    networksLiveOn: ["Solana"],
    redemptionMechanisms: ["UXD Protocol", "DEX"],
    solscanLink: "https://solscan.io/token/7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT",
    artemisLink: "https://artemis.xyz/token/uxd",
    assetReservesLink: "https://uxd.fi/transparency",
    marketCap: 85000000,
    uniqueAddresses: 32000,
    transactionVolume: {
      daily: 8500000,
      monthly: 255000000,
      yearly: 3060000000
    },
    executiveSummary: "UXD is an algorithmic stablecoin that maintains its peg through delta-neutral positions using derivatives. This design allows for a fully decentralized stablecoin without governance control.",
    logoUrl: "https://assets.coingecko.com/coins/images/25444/small/uxd-icon-dark.png"
  }
];

export const solanaStablecoinStats = {
  totalMarketCap: 46500000000, // Total market cap of all stablecoins on Solana
  totalUniqueUsers: 1750000, // Total unique addresses using stablecoins
  totalTransactionVolume: {
    daily: 2750000000,
    monthly: 82500000000,
    yearly: 990000000000
  },
  percentageOfSolanaVolume: 42, // Percentage of total Solana volume
  stablecoinCount: 12, // Total number of tracked stablecoins
  dominantStablecoin: "USDC", // Most used stablecoin
  dominantStablecoinShare: 78, // Market share percentage of dominant stablecoin
  yearOverYearGrowth: 35, // YoY growth percentage
}; 