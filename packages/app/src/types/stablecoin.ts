export interface Stablecoin {
  // Basic Info
  id: string;
  name: string;
  token: string;
  peggedAsset: string;
  issuer: string;
  tokenProgram: 'SPL Token' | 'Token 2022';
  tokenAddress: string;
  mintAuthority: string;

  // Mechanism Info
  bridgingMechanisms: string[];
  networksLiveOn: string[];
  redemptionMechanisms: string[];

  // Links
  solscanLink: string;
  artemisLink: string;
  assetReservesLink: string;

  // Quantitative Data
  marketCap: number;
  uniqueAddresses: number;
  transactionVolume: {
    daily: number;
    monthly: number;
    yearly: number;
  };

  // Summary
  executiveSummary: string;

  // Optional image
  logoUrl?: string;
}
