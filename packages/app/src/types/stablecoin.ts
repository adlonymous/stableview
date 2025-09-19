export interface Stablecoin {
  // Basic Info
  id: number;
  slug: string;
  name: string;
  token: string;
  peggedAsset: string;
  issuer: string;
  tokenProgram: string;
  tokenAddress: string;
  mintAuthority: string;

  // Mechanism Info (commented out as requested)
  // bridgingMechanisms: string[];
  // networksLiveOn: string[];
  // redemptionMechanisms: string[];

  // Links
  solscanLink?: string;
  artemisLink?: string;
  assetReservesLink?: string;

  // Quantitative Data from schema
  transactionVolume30d: string;
  transactionCountDaily: string;
  totalSupply: string;
  dailyActiveUsers: string;
  price: number;
  pegPrice?: number;
  pegPriceUpdatedAt?: string;

  // Summary
  executiveSummary?: string;

  // Optional image
  logoUrl?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}
