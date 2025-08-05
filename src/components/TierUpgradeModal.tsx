import React, { useState } from 'react';
import { X, Crown, Check } from 'lucide-react';

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
    
    try {
      console.log('🚀 Starting upgrade simulation...');
      
      // Simulate realistic loading time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update localStorage to simulate backend upgrade
      localStorage.setItem('userTier', 'premium');
      localStorage.setItem('upgradeDate', new Date().toISOString());
      localStorage.setItem('selectedPlan', 'premium');
      
      console.log('✅ Upgrade simulation complete');
      
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
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal content */}
        <div className="text-center">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 -m-6 mb-6 rounded-t-lg">
            <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
            <p className="text-lg text-white/90 mb-4">{content.subtitle}</p>
          </div>

          <p className="text-gray-700 text-center mb-6">{content.description}</p>

          {/* Features list */}
          <div className="mb-6 text-left space-y-3">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-purple-600" />
              <span className="text-sm">Unlimited saves</span>
            </div>
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-purple-600" />
              <span className="text-sm">AI-powered recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-purple-600" />
              <span className="text-sm">Advanced planning tools</span>
            </div>
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
              content.buttonText
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