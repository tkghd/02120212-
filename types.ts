
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type AccountType = 'Personal' | 'Corporate' | 'Web3' | 'Savings';
export type TransferMode = 'Domestic' | 'Global' | 'Crypto';

export interface BankAccount {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  address?: string; // For Web3
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: 'Shopping' | 'Food' | 'Transport' | 'Finance' | 'Wellness' | 'Tech' | 'Transfer';
  status: 'completed' | 'pending' | 'flagged';
}

export interface WealthInsight {
  analysis: string;
  healthScore: number;
  recommendation: string;
  visualCode: string;
  mutationName: string;
}

export interface AppState {
  activeTab: 'home' | 'transfer' | 'accounts' | 'ai' | 'business';
  isAnalyzing: boolean;
  insight: WealthInsight | null;
}

// Fix: Added missing SpinnerData and CandidateState interfaces required by Terminal.tsx

/**
 * Represents the metadata and content of a generated visualization state.
 */
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

/**
 * Represents the state of a specific generation candidate during streaming or selection.
 */
export interface CandidateState {
  data: SpinnerData | null;
  buffer: string;
  tpsHistory: number[];
}
