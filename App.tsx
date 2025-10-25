import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { UserProfileScreen } from './src/components/UserProfileScreen';
import { SpendingAnalysisScreen } from './src/components/SpendingAnalysisScreen';
import { OptimizationStrategyScreen } from './src/components/OptimizationStrategyScreen';
import { UserSpendingProfile } from './src/types/userProfile';
import { RecommendationResult } from './src/types/recommendation';

type AppScreen = 'welcome' | 'user-profile' | 'spending-analysis' | 'optimization-strategy';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [userProfile, setUserProfile] = useState<UserSpendingProfile | null>(null);
  const [cardRecommendations, setCardRecommendations] = useState<RecommendationResult | null>(null);
  

  const handleStartUserProfile = () => {
    // Reset profile data when starting a new profile
    setUserProfile(null);
    setCardRecommendations(null);
    setCurrentScreen('user-profile');
  };

  const handleProfileComplete = (profile: UserSpendingProfile) => {
    setUserProfile(profile);
    setCurrentScreen('spending-analysis');
  };

  const handleSpendingAnalysisComplete = (recommendations: RecommendationResult) => {
    setCardRecommendations(recommendations);
    setCurrentScreen('optimization-strategy');
  };

  const handleOptimizationComplete = () => {
    alert('All modules completed! You now have a comprehensive credit card optimization strategy. 🎉');
    setCurrentScreen('welcome');
  };

  const handleBack = () => {
    setCurrentScreen('welcome');
  };

  const renderWelcomeScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcomeContent}>
        <Text style={styles.title}>Kevin's Brainchild</Text>
        <Text style={styles.subtitle}>Credit Card Optimization Platform</Text>
        
        <View style={styles.moduleContainer}>
          <Text style={styles.moduleTitle}>📊 Build Your Spending Profile</Text>
          <Text style={styles.moduleDescription}>
            Tell us about your spending habits and preferences to get personalized recommendations
          </Text>
          <TouchableOpacity 
            style={styles.moduleButton}
            onPress={handleStartUserProfile}
          >
            <Text style={styles.moduleButtonText}>Start Building Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.moduleContainer}>
          <Text style={styles.moduleTitle}>💳 Get Card Recommendations</Text>
          <Text style={styles.moduleDescription}>
            Discover the best credit card combinations for your spending patterns
          </Text>
          <TouchableOpacity 
            style={[styles.moduleButton, !userProfile && styles.disabledButton]}
            disabled={!userProfile}
            onPress={() => setCurrentScreen('spending-analysis')}
          >
            <Text style={[styles.moduleButtonText, !userProfile && styles.disabledButtonText]}>
              {userProfile ? 'View My Recommendations' : 'Complete Profile First'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.moduleContainer}>
          <Text style={styles.moduleTitle}>💰 Optimize Your Savings</Text>
          <Text style={styles.moduleDescription}>
            Learn how to maximize your savings with smart spending strategies
          </Text>
          <TouchableOpacity 
            style={[styles.moduleButton, (!userProfile || !cardRecommendations) && styles.disabledButton]}
            disabled={!userProfile || !cardRecommendations}
            onPress={() => setCurrentScreen('optimization-strategy')}
          >
            <Text style={[styles.moduleButtonText, (!userProfile || !cardRecommendations) && styles.disabledButtonText]}>
              {userProfile && cardRecommendations ? 'View Savings Strategies' : 'Complete Previous Steps First'}
            </Text>
          </TouchableOpacity>
        </View>

        {userProfile && (
          <View style={styles.profileSummary}>
            <Text style={styles.profileSummaryTitle}>Profile Created!</Text>
            <Text style={styles.profileSummaryText}>
              Welcome, {userProfile.name}! Your spending profile is ready.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return renderWelcomeScreen();
      case 'user-profile':
        return (
          <UserProfileScreen
            key={userProfile ? 'existing' : 'new'}
            onProfileComplete={handleProfileComplete}
            onBack={handleBack}
          />
        );
      case 'spending-analysis':
        return userProfile ? (
          <SpendingAnalysisScreen
            userProfile={userProfile}
            onComplete={handleSpendingAnalysisComplete}
            onBack={() => setCurrentScreen('user-profile')}
          />
        ) : renderWelcomeScreen();
      case 'optimization-strategy':
        return userProfile && cardRecommendations ? (
          <OptimizationStrategyScreen
            userProfile={userProfile}
            cardRecommendations={cardRecommendations}
            onComplete={handleOptimizationComplete}
            onBack={() => setCurrentScreen('spending-analysis')}
          />
        ) : renderWelcomeScreen();
      default:
        return renderWelcomeScreen();
    }
  };

  return renderCurrentScreen();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  moduleContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  moduleButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  moduleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#999',
  },
  profileSummary: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  profileSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d5a2d',
    marginBottom: 8,
  },
  profileSummaryText: {
    fontSize: 16,
    color: '#2d5a2d',
  },
});