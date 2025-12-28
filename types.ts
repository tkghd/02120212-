
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type AccountType = 'Personal' | 'Corporate' | 'Web3' | 'Savings' | 'Vault';
export type TransferMode = 'Domestic' | 'Global' | 'Crypto';

export interface CorporateEntity {
  name: string;
  location: string;
  capital: string;
  status: 'ACTIVE' | 'SYNC' | 'PENDING';
}

export interface PortfolioItem {
  name: string;
  url: string;
  revenue: string;
  status: 'ACTIVE' | 'SYNCING';
}

export interface BankAccount {
  id: string;
  name: string;
  branch: string;
  accountNumber: string;
  balance: string;
  type: AccountType;
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  status: 'completed' | 'pending' | 'flagged';
}

export interface WealthInsight {
  analysis: string;
  healthScore: number;
  recommendation: string;
  visualCode: string;
  mutationName: string;
}

export interface SpinnerData {
  id: string | number;
  mutationName: string;
  reasoning: string;
  p5Code: string;
  totalTokens?: number;
  generationTimeMs?: number;
  tokensPerSecond?: string | number;
  tpsHistory?: number[];
}

export interface CandidateState {
  data: SpinnerData | null;
  buffer: string;
  tpsHistory: number[];
}
