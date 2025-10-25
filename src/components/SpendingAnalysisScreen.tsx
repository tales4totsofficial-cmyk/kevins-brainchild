import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { UserSpendingProfile } from '../types/userProfile';
import { SpendingSummary } from '../types/spendingSummary';
import { SpendingAnalyzer } from '../utils/spendingAnalyzer';
import { CardRecommendationEngine } from '../utils/cardRecommendationEngine';
import { RecommendationResult } from '../types/recommendation';

interface SpendingAnalysisScreenProps {
  userProfile: UserSpendingProfile;
  onComplete: (recommendations: RecommendationResult) => void;
  onBack: () => void;
}

export const SpendingAnalysisScreen: React.FC<SpendingAnalysisScreenProps> = ({
  userProfile,
  onComplete,
  onBack,
}) => {
  const spendingSummary = SpendingAnalyzer.analyzeSpending(userProfile);
  const recommendation = CardRecommendationEngine.generateRecommendations(userProfile);
  const screenWidth = Dimensions.get('window').width;

  const renderSpendingVisualization = () => {
    const spendingCategories = [
      { name: 'Travel', amount: userProfile.travel?.amount || 0, frequency: userProfile.travel?.frequency || 'monthly', color: '#E74C3C', icon: '✈️' },
      { name: 'Dining', amount: userProfile.dining?.amount || 0, frequency: userProfile.dining?.frequency || 'monthly', color: '#3498DB', icon: '🍽️' },
      { name: 'Shopping', amount: userProfile.shopping?.amount || 0, frequency: userProfile.shopping?.frequency || 'monthly', color: '#9B59B6', icon: '🛍️' },
      { name: 'Groceries', amount: userProfile.groceries?.amount || 0, frequency: userProfile.groceries?.frequency || 'monthly', color: '#2ECC71', icon: '🛒' },
      { name: 'Entertainment', amount: userProfile.entertainment?.amount || 0, frequency: userProfile.entertainment?.frequency || 'monthly', color: '#F39C12', icon: '🎬' },
      { name: 'Utilities', amount: userProfile.utilities?.amount || 0, frequency: userProfile.utilities?.frequency || 'monthly', color: '#1ABC9C', icon: '⚡' },
      { name: 'Other', amount: userProfile.other?.amount || 0, frequency: userProfile.other?.frequency || 'monthly', color: '#34495E', icon: '📦' }
    ];

    const monthlyAmounts = spendingCategories.map(cat => {
      const multiplier = cat.frequency === 'daily' ? 30 : cat.frequency === 'weekly' ? 4.33 : 1;
      return { ...cat, monthlyAmount: cat.amount * multiplier };
    }).filter(cat => cat.monthlyAmount > 0);

    const totalSpending = monthlyAmounts.reduce((sum, cat) => sum + cat.monthlyAmount, 0);

    return (
      <View style={styles.visualizationContainer}>
        <Text style={styles.visualizationTitle}>📊 Your Spending Analysis</Text>
        <Text style={styles.visualizationSubtitle}>Monthly spending breakdown with recommendations</Text>
        
        <View style={styles.compactSpendingContainer}>
          <View style={styles.compactSpendingGrid}>
            {monthlyAmounts.map((category, index) => {
              const percentage = (category.monthlyAmount / totalSpending) * 100;
              return (
                <View key={index} style={styles.compactSpendingItem}>
                  <Text style={styles.compactSpendingIcon}>{category.icon}</Text>
                  <Text style={styles.compactSpendingName}>{category.name}</Text>
                  <Text style={styles.compactSpendingAmount}>S${category.monthlyAmount.toLocaleString()}</Text>
                  <Text style={styles.compactSpendingPercentage}>{percentage.toFixed(0)}%</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderVendorRecommendations = () => {
    const vendorRecommendations = [
      { 
        priority: 1, 
        vendor: 'Airlines & Hotels', 
        card: 'Citi Prestige', 
        earningRate: '2.0 miles per $', 
        monthlySpend: userProfile.travel?.amount ? (userProfile.travel.frequency === 'daily' ? userProfile.travel.amount * 30 : userProfile.travel.frequency === 'weekly' ? userProfile.travel.amount * 4.33 : userProfile.travel.amount) : 0,
        potentialSavings: userProfile.travel?.amount ? Math.round((userProfile.travel.frequency === 'daily' ? userProfile.travel.amount * 30 : userProfile.travel.frequency === 'weekly' ? userProfile.travel.amount * 4.33 : userProfile.travel.amount) * 0.08) : 0,
        icon: '✈️'
      },
      { 
        priority: 2, 
        vendor: 'Restaurants & Dining', 
        card: 'Amex Platinum', 
        earningRate: '5 points per $', 
        monthlySpend: userProfile.dining?.amount ? (userProfile.dining.frequency === 'daily' ? userProfile.dining.amount * 30 : userProfile.dining.frequency === 'weekly' ? userProfile.dining.amount * 4.33 : userProfile.dining.amount) : 0,
        potentialSavings: userProfile.dining?.amount ? Math.round((userProfile.dining.frequency === 'daily' ? userProfile.dining.amount * 30 : userProfile.dining.frequency === 'weekly' ? userProfile.dining.amount * 4.33 : userProfile.dining.amount) * 0.05) : 0,
        icon: '🍽️'
      },
      { 
        priority: 3, 
        vendor: 'Online Stores & Retail', 
        card: 'Kris+ App', 
        earningRate: '6% back in miles', 
        monthlySpend: userProfile.shopping?.amount ? (userProfile.shopping.frequency === 'daily' ? userProfile.shopping.amount * 30 : userProfile.shopping.frequency === 'weekly' ? userProfile.shopping.amount * 4.33 : userProfile.shopping.amount) : 0,
        potentialSavings: userProfile.shopping?.amount ? Math.round((userProfile.shopping.frequency === 'daily' ? userProfile.shopping.amount * 30 : userProfile.shopping.frequency === 'weekly' ? userProfile.shopping.amount * 4.33 : userProfile.shopping.amount) * 0.06) : 0,
        icon: '🛍️'
      },
      { 
        priority: 4, 
        vendor: 'Supermarkets & Groceries', 
        card: 'Kris+ App', 
        earningRate: '6% back in miles', 
        monthlySpend: userProfile.groceries?.amount ? (userProfile.groceries.frequency === 'daily' ? userProfile.groceries.amount * 30 : userProfile.groceries.frequency === 'weekly' ? userProfile.groceries.amount * 4.33 : userProfile.groceries.amount) : 0,
        potentialSavings: userProfile.groceries?.amount ? Math.round((userProfile.groceries.frequency === 'daily' ? userProfile.groceries.amount * 30 : userProfile.groceries.frequency === 'weekly' ? userProfile.groceries.amount * 4.33 : userProfile.groceries.amount) * 0.04) : 0,
        icon: '🛒'
      }
    ].filter(rec => rec.monthlySpend > 0);

    return (
      <View style={styles.recommendationsContainer}>
        <Text style={styles.recommendationsTitle}>🎯 Card Recommendations</Text>
        <Text style={styles.recommendationsSubtitle}>Optimized for your spending patterns</Text>
        
        {vendorRecommendations.map((rec, index) => (
          <View key={index} style={[styles.recommendationCard, { borderLeftColor: rec.priority === 1 ? '#FF6B6B' : rec.priority === 2 ? '#4ECDC4' : rec.priority === 3 ? '#45B7D1' : '#96CEB4' }]}>
            <View style={styles.recommendationHeader}>
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityNumber}>{rec.priority}</Text>
              </View>
              <Text style={styles.vendorIcon}>{rec.icon}</Text>
              <View style={styles.vendorInfo}>
                <Text style={styles.vendorName}>{rec.vendor}</Text>
                <Text style={styles.cardName}>{rec.card}</Text>
              </View>
            </View>
            
            <View style={styles.recommendationDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Monthly Spend:</Text>
                <Text style={styles.detailValue}>S${rec.monthlySpend.toLocaleString()}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Earning Rate:</Text>
                <Text style={styles.detailValue}>{rec.earningRate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Potential Savings:</Text>
                <Text style={styles.detailValue}>S${rec.potentialSavings.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderSummary = () => {
    const totalSpending = spendingSummary.categories.reduce((sum, cat) => sum + cat.amount, 0);
    const totalPotentialSavings = recommendation.primaryCombination.estimatedTotalValue - recommendation.primaryCombination.totalAnnualFees;
    
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>💰 Analysis Summary</Text>
        <Text style={styles.summaryDescription}>
          Based on your spending patterns, here's how you can optimize your credit card usage
        </Text>
        
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatLabel}>Total Monthly Spending</Text>
            <Text style={styles.summaryStatValue}>S${totalSpending.toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatLabel}>Potential Annual Value</Text>
            <Text style={styles.summaryStatValue}>S${totalPotentialSavings.toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatLabel}>Recommended Cards</Text>
            <Text style={styles.summaryStatValue}>{recommendation.primaryCombination.cards.length}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Spending Analysis & Recommendations</Text>
        <Text style={styles.headerSubtitle}>Your personalized credit card strategy</Text>
      </View>

      <ScrollView style={styles.content}>
        {renderSummary()}
        {renderSpendingVisualization()}
        {renderVendorRecommendations()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.completeButton} onPress={() => onComplete(recommendation)}>
          <Text style={styles.completeButtonText}>See Optimization Strategies</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    marginBottom: 6,
  },
  backButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '400',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
    textAlign: 'center',
  },
  summaryDescription: {
    fontSize: 12,
    color: '#495057',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryStat: {
    alignItems: 'center',
    flex: 1,
  },
  summaryStatLabel: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 2,
    fontWeight: '500',
    textAlign: 'center',
  },
  summaryStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  visualizationContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  visualizationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  visualizationSubtitle: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 12,
  },
  compactSpendingContainer: {
    marginTop: 8,
  },
  compactSpendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'space-between',
  },
  compactSpendingItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  compactSpendingIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  compactSpendingName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    textAlign: 'center',
  },
  compactSpendingAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  compactSpendingPercentage: {
    fontSize: 10,
    fontWeight: '600',
    color: '#007AFF',
  },
  recommendationsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  recommendationsSubtitle: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 12,
  },
  recommendationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  priorityNumber: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  vendorIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  cardName: {
    fontSize: 11,
    color: '#6c757d',
    fontWeight: '500',
  },
  recommendationDetails: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  detailLabel: {
    fontSize: 11,
    color: '#6c757d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 11,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  completeButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

