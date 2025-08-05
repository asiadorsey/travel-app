import React, { useState, useEffect } from 'react';
import { X, Crown, Check, Star, Zap, Clock } from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

interface TierUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerType: 'save-limit' | 'ai-limit' | 'upgrade-button' | 'default';
  trialInfo: {
    usedSaves: number;
    maxSaves: number;
  };
  refreshUserTier: () => void;
}

const TierUpgradeModal: React.FC<TierUpgradeModalProps> = ({
  isOpen,
  onClose,
  triggerType,
  trialInfo,
  refreshUserTier
}) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 12 });
  const { trackEvent } = useAnalytics();

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Pricing plans
  const pricingPlans = [
    {
      id: 'basic',
      name: 'Travel Plus',
      price: 9.99,
      period: 'month',
      features: ['Unlimited saves', 'Basic planning', 'Mobile access'],
      icon: '⭐'
    },
    {
      id: 'premium',
      name: 'Travel Pro',
      price: 19.99,
      originalPrice: 29.99,
      period: 'month',
      popular: true,
      badge: '33% OFF',
      features: ['Everything in Plus', 'AI recommendations', 'Priority support'],
      icon: '👑'
    },
    {
      id: 'enterprise',
      name: 'Travel Enterprise',
      price: 49.99,
      period: 'month',
      features: ['Everything in Pro', 'White-label', 'API access'],
      icon: '⚡'
    }
  ];

  if (!isOpen) return null;

  const getModalContent = () => {
    switch (triggerType) {
      case 'save-limit':
        return {
          title: '🚫 Save Limit Reached',
          subtitle: `You've used ${trialInfo.usedSaves}/${trialInfo.maxSaves} free saves`,
          description: 'Upgrade to save unlimited destinations and unlock powerful travel planning features.',
          buttonText: 'Upgrade to Save More'
        };
      case 'ai-limit':
        return {
          title: '🤖 AI Features Locked',
          subtitle: 'Get personalized recommendations',
          description: 'Unlock AI-powered travel suggestions, itinerary optimization, and smart recommendations.',
          buttonText: 'Unlock AI Features'
        };
      case 'upgrade-button':
        return {
          title: '✨ Upgrade Your Travel Experience',
          subtitle: 'Unlock premium features',
          description: 'Get access to AI recommendations, unlimited saves, and advanced planning tools.',
          buttonText: 'Upgrade to Premium'
        };
      default:
        return {
          title: '🎯 Go Premium',
          subtitle: 'Unlock all features',
          description: 'Get the full travel planning experience with unlimited saves and AI features.',
          buttonText: 'Upgrade Now'
        };
    }
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);

    // Track upgrade start
    trackEvent('upgrade_start', {
      plan: selectedPlan,
      triggerType,
      trialSavesUsed: trialInfo?.usedSaves || 0,
      trialSavesRemaining: trialInfo ? trialInfo.maxSaves - trialInfo.usedSaves : 3
    });

    try {
      console.log('🚀 Starting upgrade simulation...');

      // Simulate realistic loading time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update localStorage to simulate backend upgrade
      localStorage.setItem('userTier', 'premium');
      localStorage.setItem('upgradeDate', new Date().toISOString());
      localStorage.setItem('selectedPlan', selectedPlan);

      console.log('✅ Upgrade simulation complete');

      // Track upgrade complete
      trackEvent('upgrade_complete', {
        plan: selectedPlan,
        triggerType,
        previousTier: 'anonymous',
        newTier: 'premium'
      });

      // Show success state
      setShowSuccess(true);

      // Wait a moment, then refresh
      setTimeout(() => {
        refreshUserTier(); // Update context
        onClose(); // Close modal
        window.location.reload(); // Refresh to show premium features
      }, 1500);

    } catch (error) {
      console.error('❌ Upgrade failed:', error);
      alert('Upgrade failed! Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal content */}
        <div className="text-center">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 -m-6 mb-6 rounded-t-lg relative">
            <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
            <p className="text-lg text-white/90 mb-4">{content.subtitle}</p>

            {/* Countdown Timer */}
            <div className="bg-white/20 rounded-lg p-3 mt-4">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>Limited Time Offer:</span>
                <span className="font-mono font-bold">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-center mb-6">{content.description}</p>

          {/* Progress indicator for anonymous users */}
          {trialInfo && trialInfo.usedSaves > 0 && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Free saves used</span>
                <span>{trialInfo.usedSaves}/{trialInfo.maxSaves}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(trialInfo.usedSaves / trialInfo.maxSaves) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedPlan === plan.id
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className="text-2xl mb-2">{plan.icon}</div>
                  <h3 className="font-semibold text-lg mb-1">{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                    {plan.originalPrice && (
                      <div className="text-sm text-gray-400 line-through">
                        ${plan.originalPrice}/{plan.period}
                      </div>
                    )}
                  </div>

                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Upgrade button */}
          <button
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50"
          >
            {isUpgrading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Upgrading...
              </div>
            ) : showSuccess ? (
              <div className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Success!
              </div>
            ) : (
              `Upgrade to ${pricingPlans.find(p => p.id === selectedPlan)?.name} - $${pricingPlans.find(p => p.id === selectedPlan)?.price}/${pricingPlans.find(p => p.id === selectedPlan)?.period}`
            )}
          </button>

          {/* Cancel button */}
          <button
            onClick={onClose}
            className="w-full mt-3 text-gray-500 hover:text-gray-700 py-2"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default TierUpgradeModal;