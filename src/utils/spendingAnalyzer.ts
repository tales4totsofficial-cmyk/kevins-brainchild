import { UserSpendingProfile } from '../types/userProfile';
import { SpendingSummary, SpendingCategoryData, SpendingInsights } from '../types/spendingSummary';

export class SpendingAnalyzer {
  static analyzeSpending(profile: UserSpendingProfile): SpendingSummary {
    const categories = this.calculateCategories(profile);
    const insights = this.generateInsights(profile, categories);
    const monthlyBreakdown = this.calculateMonthlyBreakdown(categories);

    return {
      categories,
      insights,
      monthlyBreakdown,
    };
  }

  private static calculateCategories(profile: UserSpendingProfile): SpendingCategoryData[] {
    const categoryColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
    ];

    const categories = [
      {
        category: 'Dining',
        amount: profile.dining.amount,
        frequency: profile.dining.frequency,
        color: categoryColors[0]
      },
      {
        category: 'Travel',
        amount: profile.travel.amount,
        frequency: profile.travel.frequency,
        color: categoryColors[1]
      },
      {
        category: 'Shopping',
        amount: profile.shopping.amount,
        frequency: profile.shopping.frequency,
        color: categoryColors[2]
      },
      {
        category: 'Groceries',
        amount: profile.groceries.amount,
        frequency: profile.groceries.frequency,
        color: categoryColors[3]
      },
      {
        category: 'Entertainment',
        amount: profile.entertainment.amount,
        frequency: profile.entertainment.frequency,
        color: categoryColors[4]
      },
      {
        category: 'Utilities',
        amount: profile.utilities.amount,
        frequency: profile.utilities.frequency,
        color: categoryColors[5]
      },
      {
        category: 'Other',
        amount: profile.other.amount,
        frequency: profile.other.frequency,
        color: categoryColors[6]
      }
    ];

    const totalSpending = categories.reduce((sum, cat) => sum + cat.amount, 0);

    return categories.map(cat => ({
      ...cat,
      percentage: totalSpending > 0 ? Math.round((cat.amount / totalSpending) * 100) : 0,
      averageTransaction: this.calculateAverageTransaction(cat.amount, cat.frequency)
    }));
  }

  private static calculateAverageTransaction(amount: number, frequency: string): number {
    const frequencyMultipliers = {
      'daily': 30,
      'weekly': 4.33,
      'monthly': 1
    };
    
    const multiplier = frequencyMultipliers[frequency as keyof typeof frequencyMultipliers] || 1;
    return Math.round(amount / multiplier);
  }

  private static generateInsights(profile: UserSpendingProfile, categories: SpendingCategoryData[]): SpendingInsights {
    const totalMonthlySpending = categories.reduce((sum, cat) => sum + cat.amount, 0);
    const topSpendingCategory = categories.reduce((max, cat) => cat.amount > max.amount ? cat : max, categories[0]);
    
    const spendingPattern = this.determineSpendingPattern(totalMonthlySpending, profile.monthlySpendingAppetite);
    const recommendedCardFocus = this.getRecommendedCardFocus(categories, profile);
    const monthlySavingsPotential = this.calculateSavingsPotential(totalMonthlySpending, categories);
    const keyInsights = this.generateKeyInsights(profile, categories, totalMonthlySpending);

    return {
      totalMonthlySpending,
      topSpendingCategory: topSpendingCategory.category,
      spendingPattern,
      recommendedCardFocus,
      monthlySavingsPotential,
      keyInsights
    };
  }

  private static determineSpendingPattern(totalSpending: number, monthlySpendingAppetite: number): 'conservative' | 'moderate' | 'high' {
    const spendingRatio = totalSpending / monthlySpendingAppetite;
    
    if (spendingRatio < 0.3) return 'conservative';
    if (spendingRatio < 0.6) return 'moderate';
    return 'high';
  }

  private static getRecommendedCardFocus(categories: SpendingCategoryData[], profile: UserSpendingProfile): string[] {
    const focus = [];
    
    const diningCategory = categories.find(c => c.category === 'Dining');
    if (diningCategory && diningCategory.amount > 500) {
      focus.push('Dining Rewards');
    }
    
    const travelCategory = categories.find(c => c.category === 'Travel');
    if (travelCategory && travelCategory.amount > 1000) {
      focus.push('Travel Benefits');
    }
    
    if (profile.travelFrequency === 'high') {
      focus.push('Lounge Access');
    }
    
    const shoppingCategory = categories.find(c => c.category === 'Shopping');
    if (shoppingCategory && shoppingCategory.amount > 800) {
      focus.push('Shopping Rewards');
    }
    
    return focus.length > 0 ? focus : ['General Rewards'];
  }

  private static calculateSavingsPotential(totalSpending: number, categories: SpendingCategoryData[]): number {
    // Estimate potential savings based on card rewards (2-5% average)
    const averageRewardRate = 0.035; // 3.5% average
    return Math.round(totalSpending * averageRewardRate);
  }

  private static generateKeyInsights(profile: UserSpendingProfile, categories: SpendingCategoryData[], totalSpending: number): string[] {
    const insights = [];
    
    const topCategory = categories.reduce((max, cat) => cat.amount > max.amount ? cat : max, categories[0]);
    insights.push(`Your highest spending category is ${topCategory.category} (${topCategory.percentage}% of total spending)`);
    
    if (profile.travelFrequency === 'high') {
      insights.push('High travel frequency makes you ideal for travel-focused credit cards');
    }
    
    const diningCategory = categories.find(c => c.category === 'Dining');
    if (diningCategory && diningCategory.amount > 500) {
      insights.push('Significant dining spending suggests dining rewards cards would be beneficial');
    }
    
    const discretionarySpending = categories
      .filter(c => ['Dining', 'Entertainment', 'Shopping'].includes(c.category))
      .reduce((sum, cat) => sum + cat.amount, 0);
    
    if (discretionarySpending > totalSpending * 0.4) {
      insights.push('High discretionary spending indicates good potential for rewards optimization');
    }
    
    return insights;
  }

  private static calculateMonthlyBreakdown(categories: SpendingCategoryData[]) {
    const essential = categories
      .filter(c => ['Groceries', 'Utilities'].includes(c.category))
      .reduce((sum, cat) => sum + cat.amount, 0);
    
    const discretionary = categories
      .filter(c => ['Dining', 'Entertainment', 'Shopping'].includes(c.category))
      .reduce((sum, cat) => sum + cat.amount, 0);
    
    const luxury = categories
      .filter(c => ['Travel', 'Other'].includes(c.category))
      .reduce((sum, cat) => sum + cat.amount, 0);

    return { essential, discretionary, luxury };
  }
}
