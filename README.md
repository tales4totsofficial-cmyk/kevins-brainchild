# Kevin's Brainchild - Credit Card Recommendation App

A React Native + Expo app that intelligently recommends the best credit card between Citi Prestige, Kris+, and Amex Platinum based on user lifestyle and spending preferences.

## 🚀 Features

- **Smart Recommendation Engine**: Analyzes user preferences to recommend the most suitable credit card
- **Interactive Quiz**: Step-by-step questionnaire to understand user needs
- **Beautiful UI**: Modern, intuitive interface with smooth animations
- **Cross-Platform**: Works on Web, iOS, and Android
- **Detailed Comparison**: Comprehensive card comparison with all benefits and features

## 🎯 Supported Cards

### 🏦 Citi Prestige (S$651.82/year)
- **Earning**: 1.3 mpd local, 2 mpd overseas
- **Travel**: 12 Priority Pass visits, 4th night free hotels, S$1M travel insurance
- **Lifestyle**: 6 golf rounds, 24/7 concierge, dining deals
- **Best for**: Frequent travelers who want hotel benefits and golf

### ✈️ Kris+ (FREE)
- **Earning**: Up to 6 mpd at 1,700+ outlets in Singapore
- **Spending**: 100 miles = S$1 (6-month expiry)
- **Travel**: Transfer to KrisFlyer for flights
- **Best for**: Singapore residents who shop/dine locally and want flexibility

### 💎 Amex Platinum (S$1,744/year)
- **Earning**: Up to 20x points at partners, 5x on flights, 2x general
- **Travel**: 1,550+ lounges, S$200 airline credit, hotel elite status
- **Lifestyle**: S$400 dining credit, S$400 lifestyle credit, Tower Club access
- **Best for**: High spenders who want premium lifestyle benefits

## 🛠️ Technology Stack

- **React Native + Expo**: Cross-platform mobile development
- **TypeScript**: Type-safe development
- **Expo Linear Gradient**: Beautiful gradient backgrounds
- **Custom Recommendation Engine**: Intelligent scoring algorithm

## 📱 How It Works

1. **Welcome Screen**: Introduction to the app and card options
2. **Action Selection**: Choose what activities you want to do (travel, dining, shopping, etc.)
3. **Frequency Selection**: How often you do these activities
4. **Importance Selection**: How important these activities are to you
5. **Recommendations**: Get personalized card recommendations with match percentages
6. **Comparison**: View detailed comparison of all three cards

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kevins-brainchild
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   # For web
   npm run web
   
   # For iOS (requires macOS)
   npm run ios
   
   # For Android
   npm run android
   ```

### Development Commands

```bash
# Start web development server
npm run web

# Start iOS simulator (macOS only)
npm run ios

# Start Android emulator
npm run android

# Build for production
npm run build

# Run tests
npm test
```

## 🧠 Recommendation Algorithm

The app uses a sophisticated scoring system that considers:

- **User Preferences**: Activities, frequency, and importance
- **Card Benefits**: Travel, dining, lifestyle, and business benefits
- **Annual Fees**: Cost vs. value analysis
- **Earning Rates**: Miles/points earning potential
- **Sign-up Bonuses**: Initial value propositions

### Scoring Factors

1. **Category Matching**: How well card benefits match user activities
2. **Frequency Weighting**: Higher scores for frequently used benefits
3. **Importance Weighting**: Higher scores for highly important activities
4. **Base Card Value**: Annual fee, earning rates, and sign-up bonuses

## 📊 User Experience Flow

```
Welcome Screen
    ↓
Action Selection (What do you want to do?)
    ↓
Frequency Selection (How often?)
    ↓
Importance Selection (How important?)
    ↓
Recommendations (Personalized results)
    ↓
[Optional] Add More Preferences
    ↓
[Optional] View Card Comparison
```

## 🎨 Design Features

- **Modern UI**: Clean, intuitive interface with smooth animations
- **Responsive Design**: Works perfectly on all screen sizes
- **Color-coded Results**: Visual indicators for match quality
- **Interactive Elements**: Touch-friendly buttons and smooth transitions
- **Gradient Backgrounds**: Beautiful visual appeal

## 🔧 Customization

### Adding New Cards
1. Add card data to `src/data/cards.ts`
2. Update recommendation engine in `src/utils/recommendationEngine.ts`
3. Add card icon and styling

### Modifying Recommendation Logic
1. Edit scoring functions in `RecommendationEngine` class
2. Adjust category matching in `calculateCategoryScore()`
3. Update frequency and importance multipliers

### Styling Changes
1. Modify component styles in individual component files
2. Update color scheme in `styles` objects
3. Adjust layout and spacing as needed

## 📱 Platform Support

- **Web**: Full functionality in modern browsers
- **iOS**: Native iOS app with all features
- **Android**: Native Android app with all features
- **Expo Go**: Test on physical devices with Expo Go app

## 🚀 Deployment

### Web Deployment
```bash
npm run build
# Deploy the web build to your hosting service
```

### Mobile App Deployment
```bash
# Build for app stores
expo build:android
expo build:ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Singapore Airlines for Kris+ app information
- Citibank Singapore for Citi Prestige details
- American Express Singapore for Amex Platinum information
- Expo team for the excellent development platform

---

**Kevin's Brainchild** - Making credit card selection smarter and more personalized! 🎯

