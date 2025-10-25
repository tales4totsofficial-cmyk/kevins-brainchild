// Card Benefits Data for Reference
// This file contains detailed information about the three credit cards

export interface CardBenefit {
  category: string;
  benefit: string;
  value?: string;
  terms?: string;
}

export interface CardData {
  name: string;
  issuer: string;
  annualFee: string;
  signupBonus: string;
  earningRates: {
    local: string;
    overseas: string;
    special?: string;
  };
  benefits: CardBenefit[];
  keyFeatures: string[];
}

export const citiPrestige: CardData = {
  name: "Citi Prestige",
  issuer: "Citibank Singapore",
  annualFee: "S$651.82 (from July 2025)",
  signupBonus: "Up to 162,500 ThankYou Points (≈65,000 miles) with qualifying spend",
  earningRates: {
    local: "1.3 miles per dollar",
    overseas: "2 miles per dollar",
  },
  benefits: [
    {
      category: "Travel",
      benefit: "12 Priority Pass visits/year",
      value: "Over 1,700 lounges globally"
    },
    {
      category: "Travel",
      benefit: "Unlimited 4th night free",
      value: "Via Citi Concierge"
    },
    {
      category: "Travel",
      benefit: "Travel Insurance",
      value: "Up to S$1M coverage"
    },
    {
      category: "Dining",
      benefit: "Citibank Gourmet Pleasures",
      value: "Dining deals and 1-for-1 offers"
    },
    {
      category: "Lifestyle",
      benefit: "Golf",
      value: "6 complimentary rounds annually"
    },
    {
      category: "Lifestyle",
      benefit: "Sands LifeStyle",
      value: "Complimentary Prestige tier upgrade"
    }
  ],
  keyFeatures: [
    "Points never expire",
    "Transfer to 11 airline partners",
    "24/7 Citi Prestige Concierge",
    "Free supplementary cards (up to 4)"
  ]
};

export const krisPlus: CardData = {
  name: "Kris+ App",
  issuer: "Singapore Airlines",
  annualFee: "FREE",
  signupBonus: "S$5 referral bonus + S$10 credit with UOB card",
  earningRates: {
    local: "Up to 6 miles per SGD",
    overseas: "Up to 6 miles per SGD",
    special: "3 mpd from UOB + 3 mpd from Kris+"
  },
  benefits: [
    {
      category: "Spending",
      benefit: "Convert miles to cash",
      value: "100 KrisPay miles = SGD 1"
    },
    {
      category: "Spending",
      benefit: "Partner outlets",
      value: "Over 1,700 outlets in Singapore"
    },
    {
      category: "Dining",
      benefit: "Dining privileges",
      value: "1-for-1 meals and exclusive discounts"
    },
    {
      category: "Travel",
      benefit: "Miles transfer",
      value: "Transfer to KrisFlyer account (1:1 rate)"
    },
    {
      category: "Lifestyle",
      benefit: "In-app services",
      value: "Book taxis, tours, shop on KrisShop"
    }
  ],
  keyFeatures: [
    "No annual fee",
    "Direct miles earning",
    "Flexible redemption",
    "Double rewards with credit cards",
    "Miles expire after 6 months"
  ]
};

export const amexPlatinum: CardData = {
  name: "American Express Platinum",
  issuer: "American Express Singapore",
  annualFee: "S$1,744 (inclusive of 9% GST)",
  signupBonus: "110,000 Membership Rewards points (new customers)",
  earningRates: {
    local: "2 points per S$1.60",
    overseas: "2 points per S$1.60",
    special: "Up to 20 points per S$1.60 at Platinum 10Xcelerator Partners"
  },
  benefits: [
    {
      category: "Travel",
      benefit: "Airport Lounge Access",
      value: "Over 1,550 lounges worldwide + 2 guests"
    },
    {
      category: "Travel",
      benefit: "Airline Credit",
      value: "Up to S$200 annually (Singapore Airlines/Scoot)"
    },
    {
      category: "Travel",
      benefit: "Hotel Benefits",
      value: "S$800 value at Fine Hotels + Resorts"
    },
    {
      category: "Dining",
      benefit: "Global Dining Credit",
      value: "Up to S$400 annually"
    },
    {
      category: "Dining",
      benefit: "Love Dining",
      value: "Up to 50% off food bill"
    },
    {
      category: "Lifestyle",
      benefit: "Lifestyle Credit",
      value: "Up to S$400 annually"
    },
    {
      category: "Lifestyle",
      benefit: "Tower Club Singapore",
      value: "Complimentary access"
    }
  ],
  keyFeatures: [
    "Charge card (pay in full monthly)",
    "No pre-set spending limit",
    "Points don't expire",
    "Comprehensive travel insurance",
    "Purchase protection up to S$10,000"
  ]
};

// Export all cards for reference
export const allCards = [citiPrestige, krisPlus, amexPlatinum];