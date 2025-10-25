export interface SpendingCategory {
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  description?: string;
}

export interface UserSpendingProfile {
  // Personal Information
  name: string;
  monthlySpendingAppetite: number;
  
  // Spending Categories
  dining: SpendingCategory;
  travel: SpendingCategory;
  shopping: SpendingCategory;
  groceries: SpendingCategory;
  entertainment: SpendingCategory;
  utilities: SpendingCategory;
  other: SpendingCategory;
  
  // Preferences
  preferredAirlines: string[];
  preferredHotels: string[];
  preferredRestaurants: string[];
  preferredStores: string[];
  
  // Travel Patterns
  travelFrequency: 'low' | 'medium' | 'high';
  domesticTravel: boolean;
  internationalTravel: boolean;
  
  // Card Preferences
  currentCards: string[];
  cardGoals: string[];
  annualFeeTolerance: 'low' | 'medium' | 'high';
}

export interface SpendingPattern {
  category: string;
  monthlyAmount: number;
  frequency: string;
  averageTransaction: number;
}
