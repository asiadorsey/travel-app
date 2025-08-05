// src/components/ClientProviders.tsx
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback, useRef, MutableRefObject } from 'react';
import { SavedTalesProvider } from '@/context/SavedTalesContext';

// Define the shape of our Firebase context value (keeping same interface for compatibility)
interface FirebaseContextType {
    db: any | null;
    auth: any | null;
    userId: string | null;
    currentUser: any | null;
    isAuthReady: boolean;
    firebaseError: string | null;
    signUpWithEmail: (email: string, password: string) => Promise<any | null>;
    signInWithEmail: (email: string, password: string) => Promise<any | null>;
    signInAnonymously: () => Promise<any | null>;
    signOutUser: () => Promise<void>;
    previousUserIdRef: MutableRefObject<string | null>;
    // Trial management
    trialRemainingSaves: number;
    isTrialExpired: boolean;
    isPremiumUser: boolean;
    decrementTrialSave: () => void;
    // AI Companion usage tracking
    aiUsageToday: number;
    lastAiUsageDate: string;
    checkAndResetDailyAiUsage: () => void;
}

// Create the Firebase context
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Custom hook to consume Firebase context
export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};

// Firebase Provider component
interface FirebaseProviderProps {
    children: ReactNode;
}

// A simple local authentication hook for testing purposes
const useLocalAuth = () => {
    const [currentUser, setCurrentUser] = useState<any | null>(null); // 'any' for simplicity, could be more specific
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [firebaseError, setFirebaseError] = useState<string | null>(null); // Keep for consistency, will always be null
    
    // Trial state management
    const [trialRemainingSaves, setTrialRemainingSaves] = useState(3); // Initial free saves
    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const [isPremiumUser, setIsPremiumUser] = useState(false);
    
    // AI Companion usage tracking
    const [aiUsageToday, setAiUsageToday] = useState(0);
    const [lastAiUsageDate, setLastAiUsageDate] = useState<string>('');

    const checkAndResetDailyAiUsage = useCallback(() => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format for daily check
        if (lastAiUsageDate !== today) {
            console.log("Local Auth: Resetting daily AI usage.");
            setAiUsageToday(0);
            setLastAiUsageDate(today);
            localStorage.setItem('lastAiUsageDate', today);
            localStorage.setItem('aiUsageToday', '0');
        }
    }, [lastAiUsageDate]); // Dependency on lastAiUsageDate

    // Check for existing local user or start with no user
    useEffect(() => {
        const storedUser = localStorage.getItem('localUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setCurrentUser(parsedUser);
            // Set isPremiumUser based on whether the user is anonymous or not
            setIsPremiumUser(!parsedUser.isAnonymous);
        } else {
            // Simulate anonymous user on first load if no local user exists
            const anonUser = { uid: `anon-${Date.now()}`, isAnonymous: true, email: 'guest@local.com' };
            localStorage.setItem('localUser', JSON.stringify(anonUser));
            setCurrentUser(anonUser);
            setIsPremiumUser(false); // Anonymous users are not premium
        }

        // Load or initialize trial remaining saves
        const storedSaves = localStorage.getItem('trialRemainingSaves');
        if (storedSaves !== null) {
            setTrialRemainingSaves(parseInt(storedSaves, 10));
        } else {
            localStorage.setItem('trialRemainingSaves', '3'); // Default 3 saves
            setTrialRemainingSaves(3);
        }

        // For now, trial expiration will be handled by remaining saves.
        // We'll add time-based expiration later if needed.
        setIsTrialExpired(false); // Reset on load

        // Initialize AI usage state
        const storedAiUsageToday = localStorage.getItem('aiUsageToday');
        if (storedAiUsageToday !== null) {
            setAiUsageToday(parseInt(storedAiUsageToday, 10));
        } else {
            localStorage.setItem('aiUsageToday', '0');
            setAiUsageToday(0);
        }

        const storedLastAiUsageDate = localStorage.getItem('lastAiUsageDate');
        if (storedLastAiUsageDate !== null) {
            setLastAiUsageDate(storedLastAiUsageDate);
        } else {
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem('lastAiUsageDate', today);
            setLastAiUsageDate(today);
        }

        // Call the reset function on every load to handle daily resets
        checkAndResetDailyAiUsage(); // This needs to be called after state is initialized

        setIsAuthReady(true);
    }, [checkAndResetDailyAiUsage]); // Add checkAndResetDailyAiUsage as a dependency

    const signUpWithEmail = useCallback(async (email: string, password: string): Promise<any | null> => {
        // Simulate sign up - in a real app, this would be more secure
        const newUser = { uid: `user-${Date.now()}`, email, isAnonymous: false };
        localStorage.setItem('localUser', JSON.stringify(newUser));
        setCurrentUser(newUser);
        setIsPremiumUser(true); // Authenticated users are premium
        setFirebaseError(null); // Clear any previous errors
        console.log("Local Auth: Signed up and logged in as:", newUser.email, newUser.uid);
        return newUser;
    }, []);

    const signInWithEmail = useCallback(async (email: string, password: string): Promise<any | null> => {
        // Simulate sign in - in a real app, this would validate credentials
        const existingUser = { uid: `user-${Date.now()}`, email, isAnonymous: false }; // For simplicity, always create new
        localStorage.setItem('localUser', JSON.stringify(existingUser));
        setCurrentUser(existingUser);
        setIsPremiumUser(true); // Authenticated users are premium
        setFirebaseError(null);
        console.log("Local Auth: Signed in as:", existingUser.email, existingUser.uid);
        return existingUser;
    }, []);

    const signInAnonymously = useCallback(async (): Promise<any | null> => {
        // Create anonymous user for guest functionality
        const anonUser = { uid: `anon-${Date.now()}`, isAnonymous: true, email: 'guest@local.com' };
        localStorage.setItem('localUser', JSON.stringify(anonUser));
        setCurrentUser(anonUser);
        setIsPremiumUser(false); // Anonymous users are not premium
        setFirebaseError(null);
        console.log("Local Auth: Signed in anonymously as:", anonUser.uid);
        return anonUser;
    }, []);

    const signOutUser = useCallback(async (): Promise<void> => {
        localStorage.removeItem('localUser');
        setCurrentUser(null);
        setIsPremiumUser(false); // Reset premium status on sign out
        setFirebaseError(null);
        console.log("Local Auth: Signed out.");
        // Don't automatically re-authenticate - let user choose to sign in again
    }, []);

    const decrementTrialSave = useCallback(() => {
        setTrialRemainingSaves(prevSaves => {
            const newSaves = Math.max(0, prevSaves - 1);
            localStorage.setItem('trialRemainingSaves', newSaves.toString());
            if (newSaves === 0) {
                setIsTrialExpired(true);
            }
            return newSaves;
        });
    }, []);

    console.log('isAuthReady:', isAuthReady);
    console.log('currentUser in useLocalAuth:', currentUser);
    console.log('Trial state:', { trialRemainingSaves, isTrialExpired, isPremiumUser });
    
    return {
        db: null, // No Firestore DB instance in local auth
        auth: null, // No Firebase Auth instance in local auth
        userId: currentUser?.uid || null,
        currentUser,
        isAuthReady,
        firebaseError,
        signUpWithEmail,
        signInWithEmail,
        signInAnonymously,
        signOutUser,
        previousUserIdRef: useRef<string | null>(null), // Keep ref for API consistency
        // Trial management
        trialRemainingSaves,
        isTrialExpired,
        isPremiumUser,
        decrementTrialSave,
        // AI Companion usage tracking
        aiUsageToday,
        lastAiUsageDate,
        checkAndResetDailyAiUsage,
    };
};

const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
    const contextValue = useLocalAuth(); // Use the local auth hook

    return (
        <FirebaseContext.Provider value={contextValue}>
            {children}
        </FirebaseContext.Provider>
    );
};

export const ClientProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <FirebaseProvider>
            <SavedTalesProvider>
                {children}
            </SavedTalesProvider>
        </FirebaseProvider>
    );
};