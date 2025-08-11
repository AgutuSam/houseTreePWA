import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mpesaService } from '../../services/mpesaService';
import { Check, Crown, Zap, Phone, AlertCircle } from 'lucide-react';

interface SubscriptionPlansProps {
  onSubscriptionPurchased?: () => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  onSubscriptionPurchased
}) => {
  const { userProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plans = mpesaService.getSubscriptionPlans();

  const handlePlanSelect = (planId: string) => {
    if (!userProfile) {
      setError('Please login to subscribe');
      return;
    }

    if (userProfile.role !== 'manager') {
      setError('Only property managers can purchase subscriptions');
      return;
    }

    setSelectedPlan(planId);
    setShowPaymentModal(true);
    setError('');
  };

  const handlePayment = async () => {
    if (!selectedPlan || !userProfile) return;

    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { transactionId, paymentResponse } = await mpesaService.purchaseSubscription(
        userProfile.uid,
        selectedPlan,
        phoneNumber
      );

      if (paymentResponse.responseCode === '0') {
        // Payment initiated successfully
        setShowPaymentModal(false);
        setSelectedPlan(null);
        setPhoneNumber('');
        
        // Show success message or redirect
        if (onSubscriptionPurchased) {
          onSubscriptionPurchased();
        }
      } else {
        setError(paymentResponse.customerMessage || 'Payment failed');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic':
        return <Check className="w-8 h-8 text-green-500" />;
      case 'premium':
        return <Crown className="w-8 h-8 text-blue-500" />;
      case 'enterprise':
        return <Zap className="w-8 h-8 text-purple-500" />;
      default:
        return <Check className="w-8 h-8 text-gray-500" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'basic':
        return 'border-green-200 bg-green-50';
      case 'premium':
        return 'border-blue-200 bg-blue-50';
      case 'enterprise':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Plan
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Select the perfect plan for your property management needs
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-150 hover:shadow-xl ${
              plan.id === 'premium' ? 'border-blue-500 transform scale-105' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {plan.id === 'premium' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {plan.price === 0 ? 'Free' : `KES ${plan.price.toLocaleString()}`}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  per {plan.duration} month{plan.duration > 1 ? 's' : ''}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelect(plan.id)}
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.id === 'premium'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : plan.id === 'enterprise'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Complete Payment
              </h3>
              
              {selectedPlan && (
                <div className="mb-6">
                  {(() => {
                    const plan = plans.find(p => p.id === selectedPlan);
                    return plan ? (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {plan.name} Plan
                          </span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            KES {plan.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {plan.duration} month subscription
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g., 0712345678"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  You will receive an M-Pesa prompt on this number
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center text-red-700">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPlan(null);
                    setPhoneNumber('');
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading || !phoneNumber.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors"
                >
                  {loading ? 'Processing...' : 'Pay with M-Pesa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
