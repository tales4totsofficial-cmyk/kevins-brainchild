export interface CardRecommendation {
  cardName: string;
  cardIssuer: string;
  score: number;
  reasons: string[];
  benefits: {
    category: string;
    benefit: string;
    value: string;
    relevance: number; // 0-100, how relevant to user
  }[];
  usageStrategy: string;
  annualFee: string;
  estimatedValue: number; // Estimated annual value in SGD
}

export interface SpendingAllocation {
  vendor: string;
  card: string;
  spendingType: string;
  percentage: number;
  dollarAmount: number;
  earningRate: string;
  estimatedRewards: number;
  instructions: string;
}

export interface CardCombination {
  cards: CardRecommendation[];
  totalScore: number;
  totalAnnualFees: number;
  estimatedTotalValue: number;
  netValue: number; // Total value minus fees
  strategy: string;
  usageInstructions: string[];
  compatibility: number; // How well cards work together
  spendingAllocations: SpendingAllocation[];
  monthlySpendingPlan: {
    totalMonthlySpending: number;
    allocations: SpendingAllocation[];
  };
}

export interface RecommendationResult {
  primaryCombination: CardCombination;
  alternativeCombinations: CardCombination[];
  analysis: {
    userSpendingPattern: string;
    recommendedStrategy: string;
    keyInsights: string[];
    potentialSavings: number;
  };
}
