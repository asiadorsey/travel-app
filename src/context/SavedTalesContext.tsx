// src/context/SavedTalesContext.tsx
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { useFirebase } from '@/components/ClientProviders';
import { getCurrentTier, canSaveItem } from '@/utils/tierLogic';

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
        isPremiumUser,
        decrementTrialSave,
        currentUser,
    } = useFirebase(); // Get all necessary state from local auth
    const [savedTaleIds, setSavedTaleIds] = useState<Set<string>>(new Set());
    const [loadingSavedTales, setLoadingSavedTales] = useState(true);
    const [savedTalesError, setSavedTalesError] = useState<string | null>(null);

    const currentTier = getCurrentTier(currentUser, isPremiumUser); // Determine current tier

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

    // This function now toggles save state in localStorage with tier logic
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
                // Determine specific error message based on tier and remaining saves
                if (currentTier === 'anonymous' && trialRemainingSaves <= 0) {
                    setSavedTalesError("You've used all your free saves! Please sign up or upgrade to save more items.");
                } else if (currentTier === 'anonymous' && isTrialExpired) { // Should be covered by trialRemainingSaves <= 0, but good to be explicit
                    setSavedTalesError("Your trial has expired for saves! Please sign up or upgrade.");
                }
                // No message needed for freemium/premium if canSaveItem is false, as it should always be true for them.
                return; // Prevent save
            }

            // If it's an anonymous user and they can save, decrement their trial count
            if (currentTier === 'anonymous') {
                decrementTrialSave();
            }
        }
        // --- END NEW TIER LOGIC ---

        try {
            if (currentSavedIds.has(taleId)) {
                currentSavedIds.delete(taleId);
                console.log(`Local Storage: Tale ${taleId} unsaved for user ${userId}.`);
            } else {
                currentSavedIds.add(taleId);
                console.log(`Local Storage: Tale ${taleId} saved for user ${userId}.`);
            }
            // Update localStorage and component state
            localStorage.setItem(userSavedItemsKey, JSON.stringify(Array.from(currentSavedIds)));
            setSavedTaleIds(currentSavedIds); // Update state to trigger re-render
        } catch (error: any) {
            console.error("Error toggling save state in local storage:", error);
            setSavedTalesError(`Failed to update saved status: ${error.message}`);
        }
    }, [userId, savedTaleIds, currentTier, trialRemainingSaves, isTrialExpired, decrementTrialSave]); // Add new dependencies

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
        // --- END NEW TIER CONTEXT VALUES ---
    };

    return (
        <SavedTalesContext.Provider value={contextValue}>
            {children}
        </SavedTalesContext.Provider>
    );
};