import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { UserSpendingProfile } from '../types/userProfile';
import { RecommendationResult } from '../types/recommendation';
import { OptimizationSummary } from '../types/optimization';
import { OptimizationEngine } from '../utils/optimizationEngine';
import { EmailService } from '../utils/emailService';

interface OptimizationStrategyScreenProps {
  userProfile: UserSpendingProfile;
  cardRecommendations: RecommendationResult;
  onComplete: () => void;
  onBack: () => void;
}

export const OptimizationStrategyScreen: React.FC<OptimizationStrategyScreenProps> = ({
  userProfile,
  cardRecommendations,
  onComplete,
  onBack,
}) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const optimizationSummary = OptimizationEngine.generateOptimizationSummary(userProfile, cardRecommendations);

  const generateEmailReport = () => {
    const totalSpending = userProfile.travel?.amount || 0 + userProfile.dining?.amount || 0 + userProfile.shopping?.amount || 0 + userProfile.groceries?.amount || 0 + userProfile.entertainment?.amount || 0 + userProfile.utilities?.amount || 0 + userProfile.other?.amount || 0;
    const totalSavings = optimizationSummary.optimizations.reduce((sum, opt) => sum + opt.potentialSavings, 0);
    const savingsPercentage = ((totalSavings / totalSpending) * 100).toFixed(1);

    const emailContent = `
Subject: Your Personalized Credit Card Optimization Report

Dear ${userProfile.name},

Thank you for using Kevin's Brainchild Credit Card Optimizer! Here's your personalized report:

📊 SPENDING ANALYSIS
Monthly Spending: S$${totalSpending.toLocaleString()}
Potential Annual Savings: S$${totalSavings.toLocaleString()}
Savings Percentage: ${savingsPercentage}%

🎯 OPTIMIZATION STRATEGIES

${optimizationSummary.optimizations.map((opt, index) => `
${index + 1}. ${opt.spendingType}
   • Use: ${opt.card} for ${opt.vendor}
   • Monthly Spend: S$${opt.expectedMonthlySpend.toLocaleString()}
   • Potential Savings: S$${opt.potentialSavings.toLocaleString()} (${opt.savingsPercentage}%)
   • Earning Rate: ${opt.earningRate}
   • Instructions: ${opt.instructions}
`).join('')}

💡 SUMMARY
With this combination, you can reduce your expenses overall by S$${totalSavings.toLocaleString()} (${savingsPercentage}%) annually.

Best regards,
Kevin's Brainchild Team
    `.trim();

    return emailContent;
  };

  const handleSendEmail = async () => {
    console.log('handleSendEmail called with email:', emailAddress);
    
    if (!emailAddress.trim()) {
      console.log('Email validation failed - empty email');
      alert('Error: Please enter a valid email address');
      return;
    }

    console.log('Generating email content...');
    const emailContent = generateEmailReport();
    console.log('Email content generated, length:', emailContent.length);
    
    // Show options to user
    const userChoice = window.confirm(
      `📧 Email Options for ${emailAddress}:\n\n` +
      `1. Click OK to send email directly (requires email server)\n` +
      `2. Click Cancel to open email client or copy to clipboard\n\n` +
      `Choose your preferred method:`
    );
    
    if (userChoice) {
      // Try to send email directly via backend
      console.log('User chose to send email directly');
      const success = await EmailService.sendEmail({
        to: emailAddress,
        subject: `Your Personalized Credit Card Optimization Report`,
        content: emailContent,
        fromName: "Kevin's Brainchild Team"
      });
      
      if (success) {
        alert('✅ Email sent successfully!\n\nCheck your inbox for the report.');
      } else {
        alert('❌ Failed to send email.\n\nPlease try the alternative method (Cancel).');
        // Fallback to email client
        EmailService.openEmailClient({
          to: emailAddress,
          subject: `Your Personalized Credit Card Optimization Report`,
          content: emailContent,
          fromName: "Kevin's Brainchild Team"
        });
      }
      setShowEmailModal(false);
    } else {
      // Show secondary options
      const secondaryChoice = window.confirm(
        `📧 Alternative Options:\n\n` +
        `1. Click OK to open your email client with pre-filled content\n` +
        `2. Click Cancel to copy content to clipboard\n\n` +
        `Choose your preferred method:`
      );
      
      if (secondaryChoice) {
        // Open email client with pre-filled content
        console.log('User chose to open email client');
        EmailService.openEmailClient({
          to: emailAddress,
          subject: `Your Personalized Credit Card Optimization Report`,
          content: emailContent,
          fromName: "Kevin's Brainchild Team"
        });
      } else {
        // Copy to clipboard
        console.log('User chose to copy to clipboard');
        const success = await EmailService.copyToClipboard(emailContent);
        if (success) {
          alert('✅ Email content copied to clipboard!\n\nYou can now paste it into any email client.');
        } else {
          alert('❌ Failed to copy to clipboard.\n\nEmail content is logged to console for manual copying.');
        }
      }
      setShowEmailModal(false);
    }
  };

  const renderEmailModal = () => (
    <Modal
      visible={showEmailModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowEmailModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>📧 Send Report via Email</Text>
          <Text style={styles.modalDescription}>
            Enter your email address to receive your personalized credit card optimization report.
          </Text>
          
          <TextInput
            style={styles.emailInput}
            placeholder="Enter your email address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowEmailModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalSendButton}
              onPress={() => {
                console.log('Send Report button pressed');
                handleSendEmail();
              }}
            >
              <Text style={styles.modalSendButtonText}>Send Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderOptimizationCard = (optimization: any, index: number) => (
    <View key={index} style={styles.optimizationCard}>
      <View style={styles.optimizationHeader}>
        <Text style={styles.spendingType}>{optimization.spendingType}</Text>
        <Text style={styles.savingsPercentage}>{optimization.savingsPercentage}% savings</Text>
      </View>
      
      <View style={styles.compactDetails}>
        <View style={styles.compactRow}>
          <Text style={styles.compactLabel}>Use {optimization.card} for {optimization.vendor}</Text>
          <Text style={styles.compactValue}>S${optimization.expectedMonthlySpend.toLocaleString()} → S${optimization.potentialSavings.toLocaleString()} saved</Text>
        </View>
        
        <View style={styles.compactRow}>
          <Text style={styles.compactEarningRate}>{optimization.earningRate}</Text>
          <Text style={styles.compactInstructions}>💡 {optimization.instructions}</Text>
        </View>
      </View>
    </View>
  );

  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>💰 Optimization Summary</Text>
      <Text style={styles.summaryDescription}>
        With this combination, you can reduce your expenses overall by S${optimizationSummary.totalPotentialSavings.toLocaleString()} ({optimizationSummary.overallSavingsPercentage.toFixed(1)}%)
      </Text>
      
      <View style={styles.summaryStats}>
        <View style={styles.summaryStat}>
          <Text style={styles.summaryStatLabel}>Total Monthly Spending</Text>
          <Text style={styles.summaryStatValue}>S${optimizationSummary.totalCurrentSpending.toLocaleString()}</Text>
        </View>
        
        <View style={styles.summaryStat}>
          <Text style={styles.summaryStatLabel}>Potential Monthly Savings</Text>
          <Text style={styles.summaryStatValue}>S${optimizationSummary.totalPotentialSavings.toLocaleString()}</Text>
        </View>
        
        <View style={styles.summaryStat}>
          <Text style={styles.summaryStatLabel}>Savings Percentage</Text>
          <Text style={styles.summaryStatValue}>{optimizationSummary.overallSavingsPercentage.toFixed(1)}%</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Optimize Your Savings</Text>
        <Text style={styles.headerSubtitle}>Learn how to maximize your savings with smart strategies</Text>
      </View>

      <ScrollView style={styles.content}>
        {renderSummary()}
        
        <Text style={styles.sectionTitle}>🎯 Spending Optimizations</Text>
        {optimizationSummary.optimizations.map((optimization, index) => renderOptimizationCard(optimization, index))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.thankYouButton} onPress={onComplete}>
            <Text style={styles.thankYouButtonText}>Thank You</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.emailButton} 
            onPress={() => {
              console.log('Email button pressed, opening modal');
              setShowEmailModal(true);
            }}
          >
            <Text style={styles.emailButtonText}>📧 Send Report via Email</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {renderEmailModal()}
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
    fontSize: 20,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    marginTop: 4,
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
  optimizationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  optimizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spendingType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  savingsPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#28a745',
    backgroundColor: '#d4edda',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  compactDetails: {
    marginBottom: 4,
  },
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  compactLabel: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
    flex: 1,
  },
  compactValue: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  compactEarningRate: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '600',
  },
  compactInstructions: {
    fontSize: 11,
    color: '#6c757d',
    fontStyle: 'italic',
    flex: 1,
    textAlign: 'right',
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  thankYouButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  thankYouButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emailButton: {
    flex: 1,
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
  emailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalSendButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
