export interface SpendingCategoryData {
  category: string;
  amount: number;
  percentage: number;
  frequency: string;
  averageTransaction: number;
  color: string;
}

export interface SpendingInsights {
  totalMonthlySpending: number;
  topSpendingCategory: string;
  spendingPattern: 'conservative' | 'moderate' | 'high';
  recommendedCardFocus: string[];
  monthlySavingsPotential: number;
  keyInsights: string[];
}

export interface SpendingSummary {
  categories: SpendingCategoryData[];
  insights: SpendingInsights;
  monthlyBreakdown: {
    essential: number;
    discretionary: number;
    luxury: number;
  };
}

