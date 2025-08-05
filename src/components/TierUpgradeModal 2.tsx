// src/components/TierUpgradeModal.tsx
"use client";

import React from 'react';
import { useFirebase } from '@/components/ClientProviders';
import { useRouter } from 'next/navigation';

interface TierUpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    triggerType: 'save-limit' | 'ai-limit' | 'upgrade-button';
    currentTier: 'premium' | 'freemium' | 'anonymous';
    trialRemainingSaves?: number;
}

export default function TierUpgradeModal({
    isOpen,
    onClose,
    triggerType,
    currentTier,
    trialRemainingSaves = 0
}: TierUpgradeModalProps) {
    const { signInAnonymously, currentUser } = useFirebase();
    const router = useRouter();

    if (!isOpen) return null;

    const handleSignUp = () => {
        onClose();
        router.push('/auth/signin');
    };

    const handleUpgradeToPremium = () => {
        // For now, we'll simulate upgrading to premium by updating localStorage
        // In a real app, this would integrate with a payment system
        localStorage.setItem('isPremiumUser', 'true');
        localStorage.setItem('trialRemainingSaves', '999'); // Give them plenty of saves
        onClose();
        // Force a page refresh to update the state
        window.location.reload();
    };

    const handleContinueAsGuest = async () => {
        if (!currentUser) {
            await signInAnonymously();
        }
        onClose();
    };

    const getModalContent = () => {
        switch (triggerType) {
            case 'save-limit':
                return {
                    title: 'Save Limit Reached',
                    message: `You've used all your ${trialRemainingSaves === 0 ? 3 : trialRemainingSaves} free saves!`,
                    description: 'Sign up for a free account to save unlimited items, or upgrade to Premium for exclusive features.',
                    primaryButton: 'Sign Up',
                    secondaryButton: 'Upgrade to Premium',
                    tertiaryButton: 'Continue as Guest'
                };

            case 'ai-limit':
                return {
                    title: 'AI Usage Limit Reached',
                    message: currentTier === 'anonymous'
                        ? 'You\'ve used all 3 free AI interactions!'
                        : 'You\'ve used all 5 daily AI interactions!',
                    description: 'Upgrade to Premium for unlimited AI interactions and advanced features.',
                    primaryButton: 'Upgrade to Premium',
                    secondaryButton: 'Sign Up',
                    tertiaryButton: 'Continue as Guest'
                };

            case 'upgrade-button':
                return {
                    title: 'Upgrade to Premium',
                    message: 'Unlock the full power of Talea!',
                    description: 'Get unlimited saves, unlimited AI interactions, and exclusive premium features.',
                    primaryButton: 'Upgrade to Premium',
                    secondaryButton: 'Sign Up',
                    tertiaryButton: 'Continue as Guest'
                };

            default:
                return {
                    title: 'Upgrade',
                    message: 'Unlock more features',
                    description: 'Choose your plan to get the most out of Talea.',
                    primaryButton: 'Upgrade to Premium',
                    secondaryButton: 'Sign Up',
                    tertiaryButton: 'Continue as Guest'
                };
        }
    };

    const content = getModalContent();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="text-center">
                    {/* Icon */}
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {content.title}
                    </h3>

                    {/* Message */}
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        {content.message}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mb-6">
                        {content.description}
                    </p>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={content.primaryButton === 'Sign Up' ? handleSignUp : handleUpgradeToPremium}
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {content.primaryButton}
                        </button>

                        <button
                            onClick={content.secondaryButton === 'Sign Up' ? handleSignUp : handleUpgradeToPremium}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {content.secondaryButton}
                        </button>

                        {currentTier === 'anonymous' && (
                            <button
                                onClick={handleContinueAsGuest}
                                className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {content.tertiaryButton}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 