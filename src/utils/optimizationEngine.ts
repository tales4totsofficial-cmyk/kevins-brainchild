import { UserSpendingProfile } from '../types/userProfile';
import { RecommendationResult } from '../types/recommendation';
import { OptimizationSummary, SpendingOptimization } from '../types/optimization';

export class OptimizationEngine {
  static generateOptimizationSummary(
    userProfile: UserSpendingProfile, 
    cardRecommendations: RecommendationResult
  ): OptimizationSummary {
    const optimizations = this.generateSpendingOptimizations(userProfile, cardRecommendations);
    const totalPotentialSavings = optimizations.reduce((sum, opt) => sum + opt.potentialSavings, 0);
    const totalCurrentSpending = this.calculateTotalSpending(userProfile);
    const overallSavingsPercentage = (totalPotentialSavings / totalCurrentSpending) * 100;
    
    return {
      totalPotentialSavings,
      totalCurrentSpending,
      overallSavingsPercentage,
      optimizations
    };
  }

  private static generateSpendingOptimizations(
    userProfile: UserSpendingProfile, 
    cardRecommendations: RecommendationResult
  ): SpendingOptimization[] {
    const optimizations: SpendingOptimization[] = [];
    
    // Travel optimizations
    if (userProfile.travel?.amount && userProfile.travel.amount > 0) {
      const monthlyTravel = userProfile.travel.frequency === 'daily' ? userProfile.travel.amount * 30 :
                           userProfile.travel.frequency === 'weekly' ? userProfile.travel.amount * 4.33 :
                           userProfile.travel.amount;
      
      optimizations.push({
        spendingType: 'Travel',
        vendor: 'Airlines & Hotels',
        expectedMonthlySpend: monthlyTravel,
        potentialSavings: Math.round(monthlyTravel * 0.08),
        savingsPercentage: 8,
        card: 'Citi Prestige',
        earningRate: '2.0 miles per $',
        instructions: 'Use Citi Prestige for all airline bookings and hotel stays to earn 2x miles'
      });
    }
    
    // Dining optimizations
    if (userProfile.dining?.amount && userProfile.dining.amount > 0) {
      const monthlyDining = userProfile.dining.frequency === 'daily' ? userProfile.dining.amount * 30 :
                           userProfile.dining.frequency === 'weekly' ? userProfile.dining.amount * 4.33 :
                           userProfile.dining.amount;
      
      optimizations.push({
        spendingType: 'Dining',
        vendor: 'Restaurants & Food Delivery',
        expectedMonthlySpend: monthlyDining,
        potentialSavings: Math.round(monthlyDining * 0.05),
        savingsPercentage: 5,
        card: 'Amex Platinum',
        earningRate: '5 points per $',
        instructions: 'Use Amex Platinum for dining and take advantage of Love Dining program (up to 50% off)'
      });
    }
    
    // Shopping optimizations
    if (userProfile.shopping?.amount && userProfile.shopping.amount > 0) {
      const monthlyShopping = userProfile.shopping.frequency === 'daily' ? userProfile.shopping.amount * 30 :
                             userProfile.shopping.frequency === 'weekly' ? userProfile.shopping.amount * 4.33 :
                             userProfile.shopping.amount;
      
      optimizations.push({
        spendingType: 'Shopping',
        vendor: 'Online Stores & Retail',
        expectedMonthlySpend: monthlyShopping,
        potentialSavings: Math.round(monthlyShopping * 0.06),
        savingsPercentage: 6,
        card: 'Kris+ App',
        earningRate: '6% back in miles',
        instructions: 'Use Kris+ app for shopping at partner stores to earn 6% back in miles'
      });
    }
    
    // Groceries optimizations
    if (userProfile.groceries?.amount && userProfile.groceries.amount > 0) {
      const monthlyGroceries = userProfile.groceries.frequency === 'daily' ? userProfile.groceries.amount * 30 :
                              userProfile.groceries.frequency === 'weekly' ? userProfile.groceries.amount * 4.33 :
                              userProfile.groceries.amount;
      
      optimizations.push({
        spendingType: 'Groceries',
        vendor: 'Supermarkets & Grocery Stores',
        expectedMonthlySpend: monthlyGroceries,
        potentialSavings: Math.round(monthlyGroceries * 0.04),
        savingsPercentage: 4,
        card: 'Kris+ App',
        earningRate: '6% back in miles',
        instructions: 'Use Kris+ app for grocery shopping to earn 6% back in miles'
      });
    }
    
    // Entertainment optimizations
    if (userProfile.entertainment?.amount && userProfile.entertainment.amount > 0) {
      const monthlyEntertainment = userProfile.entertainment.frequency === 'daily' ? userProfile.entertainment.amount * 30 :
                                  userProfile.entertainment.frequency === 'weekly' ? userProfile.entertainment.amount * 4.33 :
                                  userProfile.entertainment.amount;
      
      optimizations.push({
        spendingType: 'Entertainment',
        vendor: 'Movies, Streaming & Events',
        expectedMonthlySpend: monthlyEntertainment,
        potentialSavings: Math.round(monthlyEntertainment * 0.03),
        savingsPercentage: 3,
        card: 'Amex Platinum',
        earningRate: '2 points per $',
        instructions: 'Use Amex Platinum for entertainment spending and take advantage of entertainment credits'
      });
    }
    
    return optimizations;
  }

  private static calculateTotalSpending(profile: UserSpendingProfile): number {
    const categories = ['dining', 'travel', 'shopping', 'groceries', 'entertainment', 'utilities', 'other'] as const;
    return categories.reduce((total, category) => {
      const categoryData = profile[category];
      if (categoryData?.amount) {
        const multiplier = categoryData.frequency === 'daily' ? 30 : 
                         categoryData.frequency === 'weekly' ? 4.33 : 1;
        return total + (categoryData.amount * multiplier);
      }
      return total;
    }, 0);
  }
}
