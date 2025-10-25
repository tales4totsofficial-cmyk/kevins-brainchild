import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { UserSpendingProfile, SpendingCategory } from '../types/userProfile';

interface UserProfileScreenProps {
  onProfileComplete: (profile: UserSpendingProfile) => void;
  onBack: () => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  onProfileComplete,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserSpendingProfile>>({
    monthlySpendingAppetite: 5000, // Default value
    dining: { amount: 500, frequency: 'monthly' }, // 10% of 5000
    travel: { amount: 2000, frequency: 'monthly' }, // 40% of 5000
    shopping: { amount: 1000, frequency: 'monthly' }, // 20% of 5000
    groceries: { amount: 500, frequency: 'monthly' }, // 10% of 5000
    entertainment: { amount: 500, frequency: 'monthly' }, // 10% of 5000
    utilities: { amount: 500, frequency: 'monthly' }, // 10% of 5000
    other: { amount: 0, frequency: 'monthly' }, // 0% - removed from calculation
    preferredAirlines: ['Singapore Airlines'],
    preferredHotels: ['Marriott'],
    preferredRestaurants: [],
    preferredStores: [],
    currentCards: [],
    cardGoals: ['Maximize Miles'],
    annualFeeTolerance: 'medium',
  });

  const totalSteps = 2;

  // Function to update spending amounts based on percentages when spending appetite changes
  const updateSpendingPercentages = (newAppetite: number) => {
    const percentages = {
      dining: 0.10,    // 10%
      travel: 0.40,    // 40%
      shopping: 0.20,  // 20%
      groceries: 0.10, // 10%
      entertainment: 0.10, // 10%
      utilities: 0.10, // 10%
      other: 0.00      // 0%
    };

    setProfile(prev => ({
      ...prev,
      monthlySpendingAppetite: newAppetite,
      dining: { amount: Math.round(newAppetite * percentages.dining), frequency: 'monthly' },
      travel: { amount: Math.round(newAppetite * percentages.travel), frequency: 'monthly' },
      shopping: { amount: Math.round(newAppetite * percentages.shopping), frequency: 'monthly' },
      groceries: { amount: Math.round(newAppetite * percentages.groceries), frequency: 'monthly' },
      entertainment: { amount: Math.round(newAppetite * percentages.entertainment), frequency: 'monthly' },
      utilities: { amount: Math.round(newAppetite * percentages.utilities), frequency: 'monthly' },
      other: { amount: Math.round(newAppetite * percentages.other), frequency: 'monthly' }
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Validate and complete profile
      if (validateProfile()) {
        onProfileComplete(profile as UserSpendingProfile);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const validateProfile = (): boolean => {
    if (!profile.name || !profile.monthlySpendingAppetite) {
      if (!profile.name) {
        Alert.alert('Required Field Missing', 'Please enter your full name to continue.');
      } else if (!profile.monthlySpendingAppetite) {
        Alert.alert('Required Field Missing', 'Please set your monthly spending appetite to continue.');
      }
      return false;
    }
    
    // Check if spending exceeds budget
    const totalSpending = calculateTotalSpending(profile);
    const monthlyAppetite = profile.monthlySpendingAppetite || 0;
    
    if (totalSpending > monthlyAppetite) {
      Alert.alert(
        'Budget Exceeded',
        `Your total spending (S$${totalSpending.toLocaleString()}) exceeds your monthly spending appetite (S$${monthlyAppetite.toLocaleString()}). Please adjust your spending amounts to continue.`,
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return true;
  };

  const updateSpendingCategory = (category: keyof UserSpendingProfile, field: keyof SpendingCategory, value: any) => {
    setProfile(prev => {
      const updatedProfile = {
        ...prev,
        [category]: {
          ...(prev[category] as SpendingCategory || {}),
          [field]: value,
        }
      };
      
      // Allow updates but show warning if over budget
      if (field === 'amount') {
        const totalSpending = calculateTotalSpending(updatedProfile);
        const monthlyAppetite = updatedProfile.monthlySpendingAppetite || 0;
        
        if (totalSpending > monthlyAppetite) {
          // Show warning but still allow the update
          setTimeout(() => {
            Alert.alert(
              'Budget Warning',
              `Total spending (S$${totalSpending.toLocaleString()}) exceeds your monthly spending appetite (S$${monthlyAppetite.toLocaleString()}). Consider adjusting your spending amounts.`,
              [{ text: 'OK' }]
            );
          }, 100);
        }
      }
      
      return updatedProfile;
    });
  };

  const calculateTotalSpending = (profile: Partial<UserSpendingProfile>): number => {
    const categories = ['dining', 'travel', 'shopping', 'groceries', 'entertainment', 'utilities', 'other'] as const;
    return categories.reduce((total, category) => {
      const categoryData = profile[category];
      if (categoryData?.amount) {
        // Convert to monthly amount based on frequency
        const multiplier = categoryData.frequency === 'daily' ? 30 : 
                         categoryData.frequency === 'weekly' ? 4.33 : 1;
        return total + (categoryData.amount * multiplier);
      }
      return total;
    }, 0);
  };

  const updateArrayField = (field: keyof UserSpendingProfile, value: string) => {
    setProfile(prev => {
      const currentArray = (prev[field] as string[]) || [];
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentArray, value]
        };
      }
    });
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information & Preferences</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={[
            styles.textInput,
            !profile.name && styles.requiredField
          ]}
          value={profile.name || ''}
          onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
          placeholder="Enter your full name"
        />
        {!profile.name && (
          <Text style={styles.requiredText}>Name is required</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Monthly Spending Appetite (SGD)</Text>
        <Text style={styles.sliderValue}>S${profile.monthlySpendingAppetite?.toLocaleString() || '5,000'}</Text>
        
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>S$2,000</Text>
          <View style={styles.sliderTrack}>
            <View 
              style={[
                styles.sliderProgress, 
                { width: `${((profile.monthlySpendingAppetite || 5000) - 2000) / (50000 - 2000) * 100}%` }
              ]} 
            />
            <TouchableOpacity
              style={[
                styles.sliderThumb,
                { left: `${((profile.monthlySpendingAppetite || 5000) - 2000) / (50000 - 2000) * 100}%` }
              ]}
              onPress={() => {}} // Will be handled by gesture
            />
          </View>
          <Text style={styles.sliderLabel}>S$50,000</Text>
        </View>

        <View style={styles.quickSelectContainer}>
          <Text style={styles.quickSelectLabel}>Quick Select:</Text>
          <View style={styles.quickSelectButtons}>
            {[5000, 10000, 15000, 25000, 35000].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quickSelectButton,
                  profile.monthlySpendingAppetite === amount && styles.quickSelectButtonSelected
                ]}
                onPress={() => updateSpendingPercentages(amount)}
              >
                <Text style={[
                  styles.quickSelectButtonText,
                  profile.monthlySpendingAppetite === amount && styles.quickSelectButtonTextSelected
                ]}>
                  S${amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sliderDescription}>
          How much are you comfortable spending per month on credit cards?
        </Text>
      </View>

      <View style={styles.preferencesSection}>
        <Text style={styles.sectionTitle}>🏆 Your Card Goals</Text>
        <View style={styles.preferenceButtons}>
          {['Maximize Miles', 'Cashback', 'Travel Benefits', 'Dining Rewards', 'Shopping Rewards'].map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.preferenceButton,
                profile.cardGoals?.includes(goal) && styles.preferenceButtonSelected
              ]}
              onPress={() => updateArrayField('cardGoals', goal)}
            >
              <Text style={[
                styles.preferenceButtonText,
                profile.cardGoals?.includes(goal) && styles.preferenceButtonTextSelected
              ]}>
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.preferencesSection}>
        <Text style={styles.sectionTitle}>✈️ Travel Preferences</Text>
        <View style={styles.preferenceButtons}>
          {['Singapore Airlines', 'Scoot', 'Cathay Pacific', 'Emirates', 'Qantas'].map((airline) => (
            <TouchableOpacity
              key={airline}
              style={[
                styles.preferenceButton,
                profile.preferredAirlines?.includes(airline) && styles.preferenceButtonSelected
              ]}
              onPress={() => updateArrayField('preferredAirlines', airline)}
            >
              <Text style={[
                styles.preferenceButtonText,
                profile.preferredAirlines?.includes(airline) && styles.preferenceButtonTextSelected
              ]}>
                {airline}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.preferencesSection}>
        <Text style={styles.sectionTitle}>🏨 Hotel Preferences</Text>
        <View style={styles.preferenceButtons}>
          {['Marriott', 'Hilton', 'IHG', 'Accor', 'Local Hotels'].map((hotel) => (
            <TouchableOpacity
              key={hotel}
              style={[
                styles.preferenceButton,
                profile.preferredHotels?.includes(hotel) && styles.preferenceButtonSelected
              ]}
              onPress={() => updateArrayField('preferredHotels', hotel)}
            >
              <Text style={[
                styles.preferenceButtonText,
                profile.preferredHotels?.includes(hotel) && styles.preferenceButtonTextSelected
              ]}>
                {hotel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.preferencesSection}>
        <Text style={styles.sectionTitle}>💰 Annual Fee Tolerance</Text>
        <View style={styles.frequencyButtons}>
          {['low', 'medium', 'high'].map((tolerance) => (
            <TouchableOpacity
              key={tolerance}
              style={[
                styles.frequencyButton,
                profile.annualFeeTolerance === tolerance && styles.frequencyButtonSelected
              ]}
              onPress={() => setProfile(prev => ({ ...prev, annualFeeTolerance: tolerance as any }))}
            >
              <Text style={[
                styles.frequencyButtonText,
                profile.annualFeeTolerance === tolerance && styles.frequencyButtonTextSelected
              ]}>
                {tolerance.charAt(0).toUpperCase() + tolerance.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

    </View>
  );

  const renderStep2 = () => {
    const totalSpending = calculateTotalSpending(profile);
    const monthlyAppetite = profile.monthlySpendingAppetite || 0;
    const remainingBudget = monthlyAppetite - totalSpending;
    const isOverBudget = totalSpending > monthlyAppetite;
    
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Your Spending Habits</Text>
        <Text style={styles.stepDescription}>Tell us about your monthly spending in different categories</Text>
        
        <View style={[styles.budgetSummary, isOverBudget && styles.budgetOverBudget]}>
          <Text style={styles.budgetTitle}>Monthly Budget Summary</Text>
          <Text style={styles.budgetText}>
            Total Spending: S${totalSpending.toLocaleString()}
          </Text>
          <Text style={styles.budgetText}>
            Monthly Appetite: S${monthlyAppetite.toLocaleString()}
          </Text>
          <Text style={[styles.budgetText, isOverBudget ? styles.budgetOverText : styles.budgetRemainingText]}>
            {isOverBudget ? 
              `Over Budget: S$${Math.abs(remainingBudget).toLocaleString()}` : 
              `Remaining: S$${remainingBudget.toLocaleString()}`
            }
          </Text>
        </View>
      
      <View style={styles.spendingGrid}>
        <View style={styles.spendingCard}>
          <Text style={styles.spendingCardTitle}>🍽️ Dining</Text>
          <TextInput
            style={styles.spendingInput}
            value={profile.dining?.amount?.toString() || ''}
            onChangeText={(text) => updateSpendingCategory('dining', 'amount', parseInt(text) || 0)}
            placeholder="Enter amount"
            keyboardType="numeric"
            selectTextOnFocus={true}
          />
          <View style={styles.frequencyButtons}>
            {['daily', 'weekly', 'monthly'].map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  profile.dining?.frequency === freq && styles.frequencyButtonSelected
                ]}
                onPress={() => updateSpendingCategory('dining', 'frequency', freq)}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  profile.dining?.frequency === freq && styles.frequencyButtonTextSelected
                ]}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.spendingCard}>
          <Text style={styles.spendingCardTitle}>✈️ Travel</Text>
          <TextInput
            style={styles.spendingInput}
            value={profile.travel?.amount?.toString() || ''}
            onChangeText={(text) => updateSpendingCategory('travel', 'amount', parseInt(text) || 0)}
            placeholder="Enter amount"
            keyboardType="numeric"
            selectTextOnFocus={true}
          />
          <View style={styles.frequencyButtons}>
            {['daily', 'weekly', 'monthly'].map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  profile.travel?.frequency === freq && styles.frequencyButtonSelected
                ]}
                onPress={() => updateSpendingCategory('travel', 'frequency', freq)}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  profile.travel?.frequency === freq && styles.frequencyButtonTextSelected
                ]}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.spendingCard}>
          <Text style={styles.spendingCardTitle}>🛍️ Shopping</Text>
          <TextInput
            style={styles.spendingInput}
            value={profile.shopping?.amount?.toString() || ''}
            onChangeText={(text) => updateSpendingCategory('shopping', 'amount', parseInt(text) || 0)}
            placeholder="Enter amount"
            keyboardType="numeric"
            selectTextOnFocus={true}
          />
          <View style={styles.frequencyButtons}>
            {['daily', 'weekly', 'monthly'].map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  profile.shopping?.frequency === freq && styles.frequencyButtonSelected
                ]}
                onPress={() => updateSpendingCategory('shopping', 'frequency', freq)}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  profile.shopping?.frequency === freq && styles.frequencyButtonTextSelected
                ]}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.spendingCard}>
          <Text style={styles.spendingCardTitle}>🛒 Groceries</Text>
          <TextInput
            style={styles.spendingInput}
            value={profile.groceries?.amount?.toString() || ''}
            onChangeText={(text) => updateSpendingCategory('groceries', 'amount', parseInt(text) || 0)}
            placeholder="Enter amount"
            keyboardType="numeric"
            selectTextOnFocus={true}
          />
          <View style={styles.frequencyButtons}>
            {['daily', 'weekly', 'monthly'].map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  profile.groceries?.frequency === freq && styles.frequencyButtonSelected
                ]}
                onPress={() => updateSpendingCategory('groceries', 'frequency', freq)}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  profile.groceries?.frequency === freq && styles.frequencyButtonTextSelected
                ]}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.spendingCard}>
          <Text style={styles.spendingCardTitle}>🎬 Entertainment</Text>
          <TextInput
            style={styles.spendingInput}
            value={profile.entertainment?.amount?.toString() || ''}
            onChangeText={(text) => updateSpendingCategory('entertainment', 'amount', parseInt(text) || 0)}
            placeholder="Enter amount"
            keyboardType="numeric"
            selectTextOnFocus={true}
          />
          <View style={styles.frequencyButtons}>
            {['daily', 'weekly', 'monthly'].map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  profile.entertainment?.frequency === freq && styles.frequencyButtonSelected
                ]}
                onPress={() => updateSpendingCategory('entertainment', 'frequency', freq)}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  profile.entertainment?.frequency === freq && styles.frequencyButtonTextSelected
                ]}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.spendingCard}>
          <Text style={styles.spendingCardTitle}>💡 Utilities</Text>
          <TextInput
            style={styles.spendingInput}
            value={profile.utilities?.amount?.toString() || ''}
            onChangeText={(text) => updateSpendingCategory('utilities', 'amount', parseInt(text) || 0)}
            placeholder="Enter amount"
            keyboardType="numeric"
            selectTextOnFocus={true}
          />
          <View style={styles.frequencyButtons}>
            {['daily', 'weekly', 'monthly'].map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  profile.utilities?.frequency === freq && styles.frequencyButtonSelected
                ]}
                onPress={() => updateSpendingCategory('utilities', 'frequency', freq)}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  profile.utilities?.frequency === freq && styles.frequencyButtonTextSelected
                ]}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
    );
  };


  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      default: return renderStep1();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Build Your Spending Profile</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step {currentStep} of {totalSteps}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton, 
            currentStep === totalSteps && styles.completeButton,
            currentStep === totalSteps && calculateTotalSpending(profile) > (profile.monthlySpendingAppetite || 0) && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={currentStep === totalSteps && calculateTotalSpending(profile) > (profile.monthlySpendingAppetite || 0)}
        >
          <Text style={[
            styles.nextButtonText,
            currentStep === totalSteps && calculateTotalSpending(profile) > (profile.monthlySpendingAppetite || 0) && styles.disabledButtonText
          ]}>
            {currentStep === totalSteps ? 
              (calculateTotalSpending(profile) > (profile.monthlySpendingAppetite || 0) ? 
                'Fix budget to continue' : 
                'Create your spending profile'
              ) : 
              'Next'
            }
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  stepContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  requiredField: {
    borderColor: '#ff6b6b',
    borderWidth: 2,
  },
  requiredText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  frequencyButton: {
    flex: 1,
    minWidth: 80,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  frequencyButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  frequencyButtonText: {
    fontSize: 14,
    color: '#333',
  },
  frequencyButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  preferenceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-start',
  },
  preferenceButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  preferenceButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  preferenceButtonText: {
    fontSize: 12,
    color: '#333',
  },
  preferenceButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#34C759',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#666',
  },
  sliderValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginHorizontal: 10,
    position: 'relative',
  },
  sliderProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
    minWidth: 50,
    textAlign: 'center',
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 22,
    height: 22,
    backgroundColor: '#007AFF',
    borderRadius: 11,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    transform: [{ translateX: -11 }],
  },
  quickSelectContainer: {
    marginBottom: 15,
  },
  quickSelectLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quickSelectButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  quickSelectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  quickSelectButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  quickSelectButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  quickSelectButtonTextSelected: {
    color: '#fff',
  },
  sliderDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  spendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  spendingCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 8,
  },
  spendingCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  spendingInput: {
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },
  preferencesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  budgetSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  budgetOverBudget: {
    backgroundColor: '#ffebee',
    borderLeftColor: '#f44336',
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  budgetText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  budgetOverText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  budgetRemainingText: {
    color: '#34C759',
    fontWeight: 'bold',
  },
});
