import { pgTable, serial, text, varchar, timestamp, numeric, json, boolean } from 'drizzle-orm/pg-core';

/**
 * Stablecoins table schema
 */
export const stablecoins = pgTable('stablecoins', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  token: varchar('token', { length: 50 }).notNull(),
  peggedAsset: varchar('pegged_asset', { length: 50 }).notNull(),
  issuer: varchar('issuer', { length: 255 }).notNull(),
  tokenProgram: varchar('token_program', { length: 50 }).notNull(),
  tokenAddress: varchar('token_address', { length: 255 }).notNull(),
  mintAuthority: varchar('mint_authority', { length: 255 }).notNull(),
  
  // Arrays stored as JSON
  bridgingMechanisms: json('bridging_mechanisms').$type<string[]>().default([]),
  networksLiveOn: json('networks_live_on').$type<string[]>().default([]),
  redemptionMechanisms: json('redemption_mechanisms').$type<string[]>().default([]),
  
  // Links
  solscanLink: text('solscan_link'),
  artemisLink: text('artemis_link'),
  assetReservesLink: text('asset_reserves_link'),
  
  // Current Quantitative Data (updated daily)
  transactionVolume30d: numeric('transaction_volume_30d', { precision: 38, scale: 2 }).default('0'),
  transactionCount30d: numeric('transaction_count_30d', { precision: 38, scale: 0 }).default('0'),
  totalSupply: numeric('total_supply', { precision: 38, scale: 2 }).default('0'),
  uniqueAddresses30d: numeric('unique_addresses_30d', { precision: 38, scale: 0 }).default('0'),
  
  // Additional metrics
  price: numeric('price', { precision: 10, scale: 6 }).default('1'),
  
  // Summary
  executiveSummary: text('executive_summary'),
  
  // Optional image
  logoUrl: text('logo_url'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * API sources table to track where metrics are fetched from
 */
export const apiSources = pgTable('api_sources', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  url: text('url').notNull(),
  apiKey: text('api_key'),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  lastFetched: timestamp('last_fetched'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Export types
export type Stablecoin = typeof stablecoins.$inferSelect;
export type NewStablecoin = typeof stablecoins.$inferInsert;
export type ApiSource = typeof apiSources.$inferSelect;
export type NewApiSource = typeof apiSources.$inferInsert; 