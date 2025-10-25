export interface SpendingOptimization {
  spendingType: string;
  vendor: string;
  expectedMonthlySpend: number;
  potentialSavings: number;
  savingsPercentage: number;
  card: string;
  earningRate: string;
  instructions: string;
}

export interface OptimizationSummary {
  totalPotentialSavings: number;
  totalCurrentSpending: number;
  overallSavingsPercentage: number;
  optimizations: SpendingOptimization[];
}

