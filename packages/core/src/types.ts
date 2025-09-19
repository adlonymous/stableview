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

  // Mechanism Info
  bridgingMechanisms?: string[];
  networksLiveOn?: string[];
  redemptionMechanisms?: string[];

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

export interface CreateStablecoinRequest {
  slug: string;
  name: string;
  token: string;
  peggedAsset: string;
  issuer: string;
  tokenProgram: string;
  tokenAddress: string;
  mintAuthority: string;
  bridgingMechanisms?: string[];
  networksLiveOn?: string[];
  redemptionMechanisms?: string[];
  solscanLink?: string;
  artemisLink?: string;
  assetReservesLink?: string;
  transactionVolume30d: string;
  transactionCountDaily: string;
  totalSupply: string;
  dailyActiveUsers: string;
  price: number;
  executiveSummary?: string;
  logoUrl?: string;
}

export interface UpdateStablecoinRequest extends Partial<CreateStablecoinRequest> {}

export interface DatabaseStablecoin {
  id: number;
  slug: string;
  name: string;
  token: string;
  pegged_asset: string;
  issuer: string;
  token_program: string;
  token_address: string;
  mint_authority: string;
  bridging_mechanisms?: string[];
  networks_live_on?: string[];
  redemption_mechanisms?: string[];
  solscan_link?: string;
  artemis_link?: string;
  asset_reserves_link?: string;
  transaction_volume_30d: string;
  transaction_count_daily: string;
  total_supply: string;
  daily_active_users: string;
  price: number;
  peg_price?: number;
  peg_price_updated_at?: string;
  executive_summary?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}
