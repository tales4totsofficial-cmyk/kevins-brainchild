import { UserSpendingProfile } from '../types/userProfile';
import { CardRecommendation, CardCombination, RecommendationResult } from '../types/recommendation';
import { citiPrestige, krisPlus, amexPlatinum } from '../data/cards';

export class CardRecommendationEngine {
  static generateRecommendations(userProfile: UserSpendingProfile): RecommendationResult {
    // Analyze user spending patterns
    const spendingAnalysis = this.analyzeSpendingPatterns(userProfile);
    
    // Score individual cards
    const cardScores = this.scoreIndividualCards(userProfile, spendingAnalysis);
    
    // Generate card combinations
    const combinations = this.generateCardCombinations(cardScores, userProfile);
    
    // Select best combinations
    const primaryCombination = combinations[0];
    const alternativeCombinations = combinations.slice(1, 3);
    
    // Generate analysis
    const analysis = this.generateAnalysis(userProfile, spendingAnalysis, primaryCombination);
    
    return {
      primaryCombination,
      alternativeCombinations,
      analysis
    };
  }

  private static analyzeSpendingPatterns(profile: UserSpendingProfile) {
    const totalSpending = this.calculateTotalSpending(profile);
    const topCategories = this.getTopSpendingCategories(profile);
    const travelFrequency = profile.travelFrequency;
    const spendingAppetite = profile.monthlySpendingAppetite;
    
    return {
      totalSpending,
      topCategories,
      travelFrequency,
      spendingAppetite,
      isHighSpender: totalSpending > spendingAppetite * 0.8,
      isTravelFocused: topCategories.includes('travel') && travelFrequency === 'high',
      isDiningFocused: topCategories.includes('dining'),
      isShoppingFocused: topCategories.includes('shopping')
    };
  }

  private static calculateTotalSpending(profile: UserSpendingProfile): number {
    return (profile.dining?.amount || 0) +
           (profile.travel?.amount || 0) +
           (profile.shopping?.amount || 0) +
           (profile.groceries?.amount || 0) +
           (profile.entertainment?.amount || 0) +
           (profile.utilities?.amount || 0) +
           (profile.other?.amount || 0);
  }

  private static getTopSpendingCategories(profile: UserSpendingProfile): string[] {
    const categories = [
      { name: 'dining', amount: profile.dining?.amount || 0 },
      { name: 'travel', amount: profile.travel?.amount || 0 },
      { name: 'shopping', amount: profile.shopping?.amount || 0 },
      { name: 'groceries', amount: profile.groceries?.amount || 0 },
      { name: 'entertainment', amount: profile.entertainment?.amount || 0 },
      { name: 'utilities', amount: profile.utilities?.amount || 0 },
      { name: 'other', amount: profile.other?.amount || 0 }
    ];
    
    return categories
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
      .map(cat => cat.name);
  }

  private static scoreIndividualCards(profile: UserSpendingProfile, analysis: any): CardRecommendation[] {
    const cards = [
      this.scoreCitiPrestige(profile, analysis),
      this.scoreKrisPlus(profile, analysis),
      this.scoreAmexPlatinum(profile, analysis)
    ];
    
    return cards.sort((a, b) => b.score - a.score);
  }

  private static scoreCitiPrestige(profile: UserSpendingProfile, analysis: any): CardRecommendation {
    let score = 0;
    const reasons: string[] = [];
    const benefits: any[] = [];
    
    // Travel benefits scoring
    if (analysis.isTravelFocused) {
      score += 40;
      reasons.push('Excellent for frequent travelers');
      benefits.push({
        category: 'Travel',
        benefit: '12 Priority Pass visits/year',
        value: 'S$1,200+ value',
        relevance: 95
      });
      benefits.push({
        category: 'Travel',
        benefit: 'Unlimited 4th night free',
        value: 'Save S$200-500 per stay',
        relevance: 90
      });
    }
    
    // Dining benefits scoring
    if (analysis.isDiningFocused) {
      score += 25;
      reasons.push('Great dining rewards program');
      benefits.push({
        category: 'Dining',
        benefit: '1.3 miles per dollar locally',
        value: 'Higher earning rate',
        relevance: 85
      });
    }
    
    // High spending scoring
    if (analysis.isHighSpender) {
      score += 20;
      reasons.push('Rewards high spenders with better benefits');
    }
    
    // Annual fee tolerance
    if (profile.annualFeeTolerance === 'high') {
      score += 15;
      reasons.push('Premium card with high annual fee');
    } else if (profile.annualFeeTolerance === 'low') {
      score -= 20;
      reasons.push('High annual fee may not be suitable');
    }
    
    const estimatedValue = this.calculateCitiPrestigeValue(profile, analysis);
    
    return {
      cardName: 'Citi Prestige',
      cardIssuer: 'Citibank Singapore',
      score,
      reasons,
      benefits,
      usageStrategy: this.getCitiPrestigeStrategy(profile, analysis),
      annualFee: 'S$651.82',
      estimatedValue
    };
  }

  private static scoreKrisPlus(profile: UserSpendingProfile, analysis: any): CardRecommendation {
    let score = 0;
    const reasons: string[] = [];
    const benefits: any[] = [];
    
    // General spending scoring
    score += 30;
    reasons.push('No annual fee - great for all spending');
    benefits.push({
      category: 'General',
      benefit: 'No annual fee',
      value: 'S$0 cost',
      relevance: 100
    });
    
    // Singapore Airlines preference
    if (profile.preferredAirlines?.includes('Singapore Airlines')) {
      score += 35;
      reasons.push('Perfect for Singapore Airlines loyalty');
      benefits.push({
        category: 'Travel',
        benefit: 'Direct KrisFlyer miles earning',
        value: 'No conversion fees',
        relevance: 95
      });
    }
    
    // High spending scoring
    if (analysis.isHighSpender) {
      score += 20;
      reasons.push('Excellent for high-volume spending');
    }
    
    // Travel frequency
    if (profile.travelFrequency === 'high') {
      score += 15;
      reasons.push('Great for frequent travelers');
    }
    
    const estimatedValue = this.calculateKrisPlusValue(profile, analysis);
    
    return {
      cardName: 'Kris+ App',
      cardIssuer: 'Singapore Airlines',
      score,
      reasons,
      benefits,
      usageStrategy: this.getKrisPlusStrategy(profile, analysis),
      annualFee: 'S$0',
      estimatedValue
    };
  }

  private static scoreAmexPlatinum(profile: UserSpendingProfile, analysis: any): CardRecommendation {
    let score = 0;
    const reasons: string[] = [];
    const benefits: any[] = [];
    
    // Travel benefits scoring
    if (analysis.isTravelFocused) {
      score += 45;
      reasons.push('Premium travel benefits');
      benefits.push({
        category: 'Travel',
        benefit: 'Unlimited lounge access',
        value: 'S$1,000+ value',
        relevance: 95
      });
      benefits.push({
        category: 'Travel',
        benefit: 'S$200 airline credit',
        value: 'Annual credit',
        relevance: 90
      });
    }
    
    // Dining benefits scoring
    if (analysis.isDiningFocused) {
      score += 25;
      reasons.push('Excellent dining benefits');
      benefits.push({
        category: 'Dining',
        benefit: 'S$400 dining credit',
        value: 'Annual credit',
        relevance: 85
      });
    }
    
    // High spending scoring
    if (analysis.isHighSpender) {
      score += 30;
      reasons.push('Rewards high spenders with premium benefits');
    }
    
    // Annual fee tolerance
    if (profile.annualFeeTolerance === 'high') {
      score += 20;
      reasons.push('Premium card with exceptional benefits');
    } else if (profile.annualFeeTolerance === 'low') {
      score -= 30;
      reasons.push('Very high annual fee');
    }
    
    const estimatedValue = this.calculateAmexPlatinumValue(profile, analysis);
    
    return {
      cardName: 'American Express Platinum',
      cardIssuer: 'American Express Singapore',
      score,
      reasons,
      benefits,
      usageStrategy: this.getAmexPlatinumStrategy(profile, analysis),
      annualFee: 'S$1,744',
      estimatedValue
    };
  }

  private static generateCardCombinations(cardScores: CardRecommendation[], profile: UserSpendingProfile): CardCombination[] {
    const combinations: CardCombination[] = [];
    const totalMonthlySpending = this.calculateTotalSpending(profile);
    
    // Single card combinations
    cardScores.forEach(card => {
      const spendingAllocations = this.generateSpendingAllocations([card], profile, totalMonthlySpending);
      combinations.push({
        cards: [card],
        totalScore: card.score,
        totalAnnualFees: this.parseAnnualFee(card.annualFee),
        estimatedTotalValue: card.estimatedValue,
        netValue: card.estimatedValue - this.parseAnnualFee(card.annualFee),
        strategy: this.getSingleCardStrategy(card),
        usageInstructions: [card.usageStrategy],
        compatibility: 100,
        spendingAllocations,
        monthlySpendingPlan: {
          totalMonthlySpending,
          allocations: spendingAllocations
        }
      });
    });
    
    // Two card combinations
    for (let i = 0; i < cardScores.length; i++) {
      for (let j = i + 1; j < cardScores.length; j++) {
        const card1 = cardScores[i];
        const card2 = cardScores[j];
        const compatibility = this.calculateCompatibility(card1, card2);
        
        if (compatibility > 50) { // Only include compatible combinations
          const totalScore = (card1.score + card2.score) * 0.8; // Slight penalty for complexity
          const totalFees = this.parseAnnualFee(card1.annualFee) + this.parseAnnualFee(card2.annualFee);
          const totalValue = card1.estimatedValue + card2.estimatedValue;
          const spendingAllocations = this.generateSpendingAllocations([card1, card2], profile, totalMonthlySpending);
          
          combinations.push({
            cards: [card1, card2],
            totalScore,
            totalAnnualFees: totalFees,
            estimatedTotalValue: totalValue,
            netValue: totalValue - totalFees,
            strategy: this.getDualCardStrategy(card1, card2),
            usageInstructions: [
              card1.usageStrategy,
              card2.usageStrategy,
              this.getCombinationStrategy(card1, card2)
            ],
            compatibility,
            spendingAllocations,
            monthlySpendingPlan: {
              totalMonthlySpending,
              allocations: spendingAllocations
            }
          });
        }
      }
    }
    
    // Three card combination (if all cards are compatible)
    if (cardScores.length >= 3) {
      const card1 = cardScores[0];
      const card2 = cardScores[1];
      const card3 = cardScores[2];
      
      const compatibility = Math.min(
        this.calculateCompatibility(card1, card2),
        this.calculateCompatibility(card1, card3),
        this.calculateCompatibility(card2, card3)
      );
      
      if (compatibility > 40) {
        const totalScore = (card1.score + card2.score + card3.score) * 0.7; // Penalty for complexity
        const totalFees = this.parseAnnualFee(card1.annualFee) + 
                         this.parseAnnualFee(card2.annualFee) + 
                         this.parseAnnualFee(card3.annualFee);
        const totalValue = card1.estimatedValue + card2.estimatedValue + card3.estimatedValue;
        const spendingAllocations = this.generateSpendingAllocations([card1, card2, card3], profile, totalMonthlySpending);
        
        combinations.push({
          cards: [card1, card2, card3],
          totalScore,
          totalAnnualFees: totalFees,
          estimatedTotalValue: totalValue,
          netValue: totalValue - totalFees,
          strategy: this.getTripleCardStrategy(card1, card2, card3),
          usageInstructions: [
            card1.usageStrategy,
            card2.usageStrategy,
            card3.usageStrategy,
            this.getTripleCombinationStrategy(card1, card2, card3)
          ],
          compatibility,
          spendingAllocations,
          monthlySpendingPlan: {
            totalMonthlySpending,
            allocations: spendingAllocations
          }
        });
      }
    }
    
    return combinations.sort((a, b) => b.netValue - a.netValue);
  }

  private static calculateCompatibility(card1: CardRecommendation, card2: CardRecommendation): number {
    // Check for complementary benefits
    let compatibility = 50; // Base compatibility
    
    const card1Benefits = card1.benefits.map(b => b.category);
    const card2Benefits = card2.benefits.map(b => b.category);
    
    // Check for complementary categories
    const complementaryCategories = [
      ['Travel', 'Dining'],
      ['Travel', 'General'],
      ['Dining', 'General']
    ];
    
    for (const [cat1, cat2] of complementaryCategories) {
      if ((card1Benefits.includes(cat1) && card2Benefits.includes(cat2)) ||
          (card1Benefits.includes(cat2) && card2Benefits.includes(cat1))) {
        compatibility += 20;
      }
    }
    
    // Penalty for similar cards
    if (card1.cardIssuer === card2.cardIssuer) {
      compatibility -= 30;
    }
    
    return Math.max(0, Math.min(100, compatibility));
  }

  private static parseAnnualFee(feeString: string): number {
    const match = feeString.match(/S\$([\d,]+)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  }

  private static calculateCitiPrestigeValue(profile: UserSpendingProfile, analysis: any): number {
    let value = 0;
    
    // Travel benefits
    if (analysis.isTravelFocused) {
      value += 1200; // Priority Pass value
      value += 800; // 4th night free value
    }
    
    // Dining benefits
    if (analysis.isDiningFocused) {
      const diningSpending = profile.dining?.amount || 0;
      value += diningSpending * 12 * 0.013; // 1.3 miles per dollar
    }
    
    // General spending
    const totalSpending = this.calculateTotalSpending(profile);
    value += totalSpending * 12 * 0.013; // Base earning rate
    
    return Math.round(value);
  }

  private static calculateKrisPlusValue(profile: UserSpendingProfile, analysis: any): number {
    let value = 0;
    
    // General spending value
    const totalSpending = this.calculateTotalSpending(profile);
    value += totalSpending * 12 * 0.06; // 6% back in miles
    
    // Singapore Airlines preference bonus
    if (profile.preferredAirlines?.includes('Singapore Airlines')) {
      value += 500; // Bonus value for direct miles
    }
    
    return Math.round(value);
  }

  private static calculateAmexPlatinumValue(profile: UserSpendingProfile, analysis: any): number {
    let value = 0;
    
    // Travel benefits
    if (analysis.isTravelFocused) {
      value += 1000; // Lounge access value
      value += 200; // Airline credit
      value += 800; // Hotel benefits
    }
    
    // Dining benefits
    if (analysis.isDiningFocused) {
      value += 400; // Dining credit
    }
    
    // General benefits
    value += 400; // Lifestyle credit
    
    return Math.round(value);
  }

  private static getCitiPrestigeStrategy(profile: UserSpendingProfile, analysis: any): string {
    if (analysis.isTravelFocused) {
      return 'Use for all travel bookings and dining. Book 4+ night stays for maximum value.';
    } else if (analysis.isDiningFocused) {
      return 'Use for dining and entertainment. Take advantage of dining deals and 1-for-1 offers.';
    } else {
      return 'Use for general spending to earn ThankYou Points. Transfer to airline partners for flights.';
    }
  }

  private static getKrisPlusStrategy(profile: UserSpendingProfile, analysis: any): string {
    if (profile.preferredAirlines?.includes('Singapore Airlines')) {
      return 'Use for all spending to earn KrisFlyer miles directly. Perfect for Singapore Airlines flights.';
    } else {
      return 'Use for general spending and convert miles to cash for immediate value.';
    }
  }

  private static getAmexPlatinumStrategy(profile: UserSpendingProfile, analysis: any): string {
    if (analysis.isTravelFocused) {
      return 'Use for travel bookings and dining. Maximize lounge access and hotel benefits.';
    } else if (analysis.isDiningFocused) {
      return 'Use for dining and entertainment. Take advantage of dining credits and Love Dining program.';
    } else {
      return 'Use for high-value purchases and take advantage of all annual credits.';
    }
  }

  private static getSingleCardStrategy(card: CardRecommendation): string {
    return `Use ${card.cardName} for all purchases to maximize benefits and rewards.`;
  }

  private static getDualCardStrategy(card1: CardRecommendation, card2: CardRecommendation): string {
    return `Use ${card1.cardName} for primary spending and ${card2.cardName} for complementary categories.`;
  }

  private static getTripleCardStrategy(card1: CardRecommendation, card2: CardRecommendation, card3: CardRecommendation): string {
    return `Use ${card1.cardName} for travel, ${card2.cardName} for dining, and ${card3.cardName} for general spending.`;
  }

  private static getCombinationStrategy(card1: CardRecommendation, card2: CardRecommendation): string {
    return `Rotate between cards based on spending category to maximize rewards.`;
  }

  private static getTripleCombinationStrategy(card1: CardRecommendation, card2: CardRecommendation, card3: CardRecommendation): string {
    return `Use a strategic rotation: ${card1.cardName} for travel, ${card2.cardName} for dining, ${card3.cardName} for general purchases.`;
  }

  private static generateAnalysis(profile: UserSpendingProfile, spendingAnalysis: any, primaryCombination: CardCombination) {
    const insights: string[] = [];
    
    if (spendingAnalysis.isTravelFocused) {
      insights.push('Your high travel spending makes travel-focused cards highly valuable');
    }
    
    if (spendingAnalysis.isDiningFocused) {
      insights.push('Dining rewards cards will provide excellent value for your spending pattern');
    }
    
    if (spendingAnalysis.isHighSpender) {
      insights.push('Your high spending volume makes premium cards with annual fees worthwhile');
    }
    
    if (profile.travelFrequency === 'high') {
      insights.push('Frequent travel makes lounge access and travel insurance very valuable');
    }
    
    const potentialSavings = primaryCombination.netValue;
    
    return {
      userSpendingPattern: this.getSpendingPatternDescription(spendingAnalysis),
      recommendedStrategy: this.getRecommendedStrategy(primaryCombination),
      keyInsights: insights,
      potentialSavings
    };
  }

  private static getSpendingPatternDescription(analysis: any): string {
    if (analysis.isTravelFocused) {
      return 'Travel-focused spender with high travel frequency';
    } else if (analysis.isDiningFocused) {
      return 'Dining-focused spender with high restaurant spending';
    } else if (analysis.isHighSpender) {
      return 'High-volume spender across multiple categories';
    } else {
      return 'Balanced spender across different categories';
    }
  }

  private static getRecommendedStrategy(combination: CardCombination): string {
    if (combination.cards.length === 1) {
      return `Focus on maximizing ${combination.cards[0].cardName} benefits`;
    } else if (combination.cards.length === 2) {
      return `Use ${combination.cards[0].cardName} and ${combination.cards[1].cardName} strategically`;
    } else {
      return `Implement a three-card strategy for maximum coverage`;
    }
  }

  private static generateSpendingAllocations(cards: CardRecommendation[], profile: UserSpendingProfile, totalSpending: number): any[] {
    const allocations: any[] = [];
    
    if (cards.length === 1) {
      // Single card - allocate all spending to one card
      const card = cards[0];
      const categories = [
        { name: 'Dining', amount: profile.dining?.amount || 0, vendors: ['Restaurants', 'Food Delivery', 'Cafes'] },
        { name: 'Travel', amount: profile.travel?.amount || 0, vendors: ['Airlines', 'Hotels', 'Transport'] },
        { name: 'Shopping', amount: profile.shopping?.amount || 0, vendors: ['Online Stores', 'Department Stores', 'Fashion'] },
        { name: 'Groceries', amount: profile.groceries?.amount || 0, vendors: ['Supermarkets', 'Grocery Stores'] },
        { name: 'Entertainment', amount: profile.entertainment?.amount || 0, vendors: ['Movies', 'Streaming', 'Events'] },
        { name: 'Utilities', amount: profile.utilities?.amount || 0, vendors: ['Electricity', 'Internet', 'Phone'] },
        { name: 'Other', amount: profile.other?.amount || 0, vendors: ['Miscellaneous'] }
      ];

      categories.forEach(category => {
        if (category.amount > 0) {
          const percentage = (category.amount / totalSpending) * 100;
          const earningRate = this.getEarningRate(card, category.name);
          const estimatedRewards = category.amount * 12 * this.getEarningMultiplier(earningRate);
          
          category.vendors.forEach(vendor => {
            allocations.push({
              vendor,
              card: card.cardName,
              spendingType: category.name,
              percentage: Math.round(percentage / category.vendors.length),
              dollarAmount: Math.round(category.amount / category.vendors.length),
              earningRate,
              estimatedRewards: Math.round(estimatedRewards / category.vendors.length),
              instructions: this.getSpendingInstructions(card, category.name, vendor)
            });
          });
        }
      });
    } else if (cards.length === 2) {
      // Dual card strategy - allocate based on card strengths
      const card1 = cards[0];
      const card2 = cards[1];
      
      // Allocate travel and dining to best card, others to second card
      const travelDiningAmount = (profile.travel?.amount || 0) + (profile.dining?.amount || 0);
      const otherAmount = totalSpending - travelDiningAmount;
      
      // Travel & Dining allocation
      if (travelDiningAmount > 0) {
        const travelPercentage = ((profile.travel?.amount || 0) / travelDiningAmount) * 100;
        const diningPercentage = ((profile.dining?.amount || 0) / travelDiningAmount) * 100;
        
        if (profile.travel?.amount > 0) {
          allocations.push({
            vendor: 'Airlines',
            card: card1.cardName,
            spendingType: 'Travel',
            percentage: Math.round(travelPercentage),
            dollarAmount: profile.travel.amount,
            earningRate: this.getEarningRate(card1, 'Travel'),
            estimatedRewards: Math.round(profile.travel.amount * 12 * this.getEarningMultiplier(this.getEarningRate(card1, 'Travel'))),
            instructions: `Use ${card1.cardName} for all airline bookings and travel expenses`
          });
        }
        
        if (profile.dining?.amount > 0) {
          allocations.push({
            vendor: 'Restaurants',
            card: card1.cardName,
            spendingType: 'Dining',
            percentage: Math.round(diningPercentage),
            dollarAmount: profile.dining.amount,
            earningRate: this.getEarningRate(card1, 'Dining'),
            estimatedRewards: Math.round(profile.dining.amount * 12 * this.getEarningMultiplier(this.getEarningRate(card1, 'Dining'))),
            instructions: `Use ${card1.cardName} for all dining and restaurant expenses`
          });
        }
      }
      
      // Other spending allocation
      if (otherAmount > 0) {
        const otherCategories = [
          { name: 'Shopping', amount: profile.shopping?.amount || 0, vendors: ['Online Stores', 'Department Stores'] },
          { name: 'Groceries', amount: profile.groceries?.amount || 0, vendors: ['Supermarkets'] },
          { name: 'Entertainment', amount: profile.entertainment?.amount || 0, vendors: ['Movies', 'Streaming'] },
          { name: 'Utilities', amount: profile.utilities?.amount || 0, vendors: ['Electricity', 'Internet'] }
        ];
        
        otherCategories.forEach(category => {
          if (category.amount > 0) {
            const percentage = (category.amount / totalSpending) * 100;
            const earningRate = this.getEarningRate(card2, category.name);
            const estimatedRewards = category.amount * 12 * this.getEarningMultiplier(earningRate);
            
            category.vendors.forEach(vendor => {
              allocations.push({
                vendor,
                card: card2.cardName,
                spendingType: category.name,
                percentage: Math.round(percentage / category.vendors.length),
                dollarAmount: Math.round(category.amount / category.vendors.length),
                earningRate,
                estimatedRewards: Math.round(estimatedRewards / category.vendors.length),
                instructions: `Use ${card2.cardName} for ${category.name.toLowerCase()} at ${vendor}`
              });
            });
          }
        });
      }
    }
    
    return allocations;
  }

  private static getEarningRate(card: CardRecommendation, category: string): string {
    if (card.cardName === 'Citi Prestige') {
      if (category === 'Travel') return '2.0 miles per $';
      if (category === 'Dining') return '1.3 miles per $';
      return '1.3 miles per $';
    } else if (card.cardName === 'Kris+ App') {
      return '6% back in miles';
    } else if (card.cardName === 'American Express Platinum') {
      if (category === 'Travel') return '5 points per $';
      if (category === 'Dining') return '5 points per $';
      return '2 points per $';
    }
    return '1% back';
  }

  private static getEarningMultiplier(earningRate: string): number {
    if (earningRate.includes('6%')) return 0.06;
    if (earningRate.includes('5 points')) return 0.05;
    if (earningRate.includes('2.0 miles')) return 0.02;
    if (earningRate.includes('1.3 miles')) return 0.013;
    if (earningRate.includes('2 points')) return 0.02;
    return 0.01;
  }

  private static getSpendingInstructions(card: CardRecommendation, category: string, vendor: string): string {
    if (card.cardName === 'Citi Prestige') {
      if (category === 'Travel') return `Book flights and hotels with ${card.cardName} for 2x miles`;
      if (category === 'Dining') return `Use ${card.cardName} at restaurants for 1.3x miles`;
      return `Use ${card.cardName} for all ${vendor} purchases`;
    } else if (card.cardName === 'Kris+ App') {
      return `Pay with ${card.cardName} at ${vendor} to earn 6% back in miles`;
    } else if (card.cardName === 'American Express Platinum') {
      if (category === 'Travel') return `Use ${card.cardName} for ${vendor} to earn 5x points`;
      if (category === 'Dining') return `Use ${card.cardName} for dining at ${vendor} for 5x points`;
      return `Use ${card.cardName} for ${vendor} purchases`;
    }
    return `Use ${card.cardName} for ${vendor} spending`;
  }
}
