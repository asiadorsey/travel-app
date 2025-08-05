// src/context/SavedTalesContext.tsx
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useFirebase } from '@/components/ClientProviders';
import { getCurrentTier, canSaveItem } from '@/utils/tierLogic';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
}

interface SavedTalesContextType {
    savedTaleIds: Set<string>;
    onToggleSave: (taleId: string) => Promise<void>;
    loadingSavedTales: boolean;
    savedTalesError: string | null;
    // Tier-related properties
    currentTier: 'premium' | 'freemium' | 'anonymous';
    trialRemainingSaves: number;
    isTrialExpired: boolean;
    isPremiumUser: boolean;
    // Modal controls
    isModalOpen: boolean;
    modalTriggerType: 'save-limit' | 'ai-limit' | 'upgrade-button' | 'default';
    openModal: (triggerType: 'save-limit' | 'ai-limit' | 'upgrade-button' | 'default') => void;
    closeModal: () => void;
    // Notifications
    notifications: Notification[];
    showNotification: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
    isLoading: boolean;
    // Trial info for modal
    trialInfo: {
        usedSaves: number;
        maxSaves: number;
    };
    // Refresh user tier for upgrade simulation
    refreshUserTier: () => void;
}

const SavedTalesContext = createContext<SavedTalesContextType | undefined>(undefined);

export const useSavedTales = () => {
    const context = useContext(SavedTalesContext);
    if (context === undefined) {
        throw new Error('useSavedTales must be used within a SavedTalesProvider');
    }
    return context;
};

interface SavedTalesProviderProps {
    children: ReactNode;
}

export const SavedTalesProvider: React.FC<SavedTalesProviderProps> = ({ children }) => {
    const {
        userId,
        isAuthReady,
        trialRemainingSaves,
        isTrialExpired,
        isPremiumUser: firebasePremiumUser,
        decrementTrialSave,
        currentUser,
    } = useFirebase(); // Get all necessary state from local auth
    
    const [savedTaleIds, setSavedTaleIds] = useState<Set<string>>(new Set());
    const [loadingSavedTales, setLoadingSavedTales] = useState(true);
    const [savedTalesError, setSavedTalesError] = useState<string | null>(null);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTriggerType, setModalTriggerType] = useState<'save-limit' | 'ai-limit' | 'upgrade-button' | 'default'>('default');
    
    // Notification state
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Enhanced premium detection that includes localStorage check
    const [isPremiumUser, setIsPremiumUser] = useState(firebasePremiumUser);
    
    // Check for premium status from localStorage on mount and when user changes
    useEffect(() => {
        const checkPremiumStatus = () => {
            const localTier = localStorage.getItem('userTier');
            const upgradeDate = localStorage.getItem('upgradeDate');
            
            if (localTier === 'premium' && upgradeDate) {
                console.log('🔄 Premium status detected from localStorage');
                setIsPremiumUser(true);
            } else {
                setIsPremiumUser(firebasePremiumUser);
            }
        };
        
        checkPremiumStatus();
    }, [firebasePremiumUser, currentUser]);

    const currentTier = getCurrentTier(currentUser, isPremiumUser); // Determine current tier
    
    // Calculate trial info for modal
    const maxTrialSaves = 3;
    const usedSaves = maxTrialSaves - trialRemainingSaves;
    const trialInfo = {
        usedSaves: Math.max(0, usedSaves),
        maxSaves: maxTrialSaves
    };

    // Modal controls
    const openModal = (triggerType: 'save-limit' | 'ai-limit' | 'upgrade-button' | 'default') => {
        setModalTriggerType(triggerType);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Notification function
    const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
        const notification: Notification = {
            id: Date.now().toString(),
            type,
            title,
            message,
            timestamp: Date.now()
        };
        
        setNotifications(prev => [...prev, notification]);
        console.log(`🔔 ${type.toUpperCase()}: ${title} - ${message}`);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
    };

    // Refresh user tier function for upgrade simulation
    const refreshUserTier = () => {
        const localTier = localStorage.getItem('userTier');
        if (localTier === 'premium') {
            setIsPremiumUser(true);
            console.log('🔄 User tier refreshed to premium');
        }
    };

    // Effect to load saved tales from localStorage based on userId
    useEffect(() => {
        if (!isAuthReady || !userId) {
            setLoadingSavedTales(true);
            setSavedTaleIds(new Set()); // Clear if no user or not ready
            return;
        }

        setLoadingSavedTales(true);
        setSavedTalesError(null);

        try {
            // Load saved items for the current user from localStorage
            const userSavedItemsKey = `savedTales_${userId}`;
            const storedIds = localStorage.getItem(userSavedItemsKey);
            if (storedIds) {
                setSavedTaleIds(new Set(JSON.parse(storedIds)));
                console.log(`Local Storage: Loaded ${JSON.parse(storedIds).length} tales for user ${userId}.`);
            } else {
                setSavedTaleIds(new Set());
                console.log(`Local Storage: No saved tales found for user ${userId}.`);
            }
            setLoadingSavedTales(false);
        } catch (error: any) {
            console.error("Error loading saved tales from local storage:", error);
            setSavedTalesError("Failed to load saved items from local storage.");
            setLoadingSavedTales(false);
        }
    }, [userId, isAuthReady]); // Re-run when userId or auth readiness changes

    // This function now toggles save state in localStorage with tier logic and shows modal when needed
    const onToggleSave = useCallback(async (taleId: string) => {
        if (!userId) {
            console.error("Attempted to toggle save but userId was not ready.");
            setSavedTalesError("App not ready to save items. Please try again.");
            return;
        }

        setSavedTalesError(null); // Clear previous errors

        const userSavedItemsKey = `savedTales_${userId}`;
        const currentSavedIds = new Set(savedTaleIds); // Use current state for updates

        // --- NEW TIER LOGIC FOR SAVING ---
        // Only apply limit logic if the user is attempting to SAVE (not unsave)
        if (!currentSavedIds.has(taleId)) { // User is trying to save a new item
            if (!canSaveItem(currentTier, trialRemainingSaves)) {
                // Show upgrade modal instead of just error message
                openModal('save-limit');
                return; // Prevent save
            }

            // If it's an anonymous user and they can save, decrement their trial count
            if (currentTier === 'anonymous') {
                decrementTrialSave();
            }
        }
        // --- END NEW TIER LOGIC ---

        setIsLoading(true);

        try {
            console.log('💾 Saving tale:', taleId);
            
            // Simulate save delay
            await new Promise(resolve => setTimeout(resolve, 500));

            if (currentSavedIds.has(taleId)) {
                currentSavedIds.delete(taleId);
                console.log(`Local Storage: Tale ${taleId} unsaved for user ${userId}.`);
                showNotification('info', 'Removed', 'Item removed from your collection');
            } else {
                currentSavedIds.add(taleId);
                console.log(`Local Storage: Tale ${taleId} saved for user ${userId}.`);
                showNotification('success', 'Saved!', 'Item added to your collection');
            }
            
            // Update localStorage and component state
            localStorage.setItem(userSavedItemsKey, JSON.stringify(Array.from(currentSavedIds)));
            setSavedTaleIds(currentSavedIds); // Update state to trigger re-render
            
        } catch (error: any) {
            console.error("Error toggling save state in local storage:", error);
            setSavedTalesError(`Failed to update saved status: ${error.message}`);
            showNotification('error', 'Save Failed', 'Could not save item. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [userId, savedTaleIds, currentTier, trialRemainingSaves, isTrialExpired, decrementTrialSave, openModal, showNotification]); // Add new dependencies

    const contextValue = {
        savedTaleIds,
        onToggleSave,
        loadingSavedTales,
        savedTalesError,
        // --- NEW TIER CONTEXT VALUES ---
        currentTier, // Add currentTier here
        trialRemainingSaves,
        isTrialExpired,
        isPremiumUser,
        // --- Modal controls ---
        isModalOpen,
        modalTriggerType,
        openModal,
        closeModal,
        // --- Notifications ---
        notifications,
        showNotification,
        isLoading,
        // --- Trial info ---
        trialInfo,
        // --- Refresh function ---
        refreshUserTier,
        // --- END NEW TIER CONTEXT VALUES ---
    };

    return (
        <SavedTalesContext.Provider value={contextValue}>
            {children}
        </SavedTalesContext.Provider>
    );
};