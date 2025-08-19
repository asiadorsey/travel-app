// src/context/FirebaseContext.jsx
"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";

// Create the context with a default value
const FirebaseContext = createContext(null);

// Custom hook to use the Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

// A simple local authentication hook for testing purposes
const useLocalAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);

  // Trial state management
  const [trialRemainingSaves, setTrialRemainingSaves] = useState(3);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  // AI Companion usage tracking
  const [aiUsageToday, setAiUsageToday] = useState(0);
  const [lastAiUsageDate, setLastAiUsageDate] = useState("");

  const previousUserIdRef = useRef(null);

  useEffect(() => {
    console.log("🔄 FirebaseContext: Initializing auth state...");

    const storedUser = localStorage.getItem("localUser");
    let user = null;

    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
        console.log("✅ FirebaseContext: Using stored user:", user);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        user = { uid: "anonymous-user", isAnonymous: true, email: null };
        localStorage.setItem("localUser", JSON.stringify(user));
      }
    } else {
      console.log("⚠️ FirebaseContext: No stored user found, creating anonymous user");
      user = { uid: "anonymous-user", isAnonymous: true, email: null };
      localStorage.setItem("localUser", JSON.stringify(user));
    }

    setCurrentUser(user);

    // Initialize trial state
    const storedTrialSaves = localStorage.getItem("trialRemainingSaves");
    if (storedTrialSaves) {
      const remainingSaves = parseInt(storedTrialSaves, 10);
      setTrialRemainingSaves(remainingSaves);
      setIsTrialExpired(remainingSaves <= 0);
    }

    // Initialize premium status
    const storedTier = localStorage.getItem("userTier");
    if (storedTier === "premium") {
      setIsPremiumUser(true);
      console.log("✅ FirebaseContext: Premium user detected");
    } else {
      setIsPremiumUser(false);
      console.log("✅ FirebaseContext: Non-premium user");
    }

    // Initialize AI usage tracking
    const storedAiUsage = localStorage.getItem("aiUsageToday");
    const storedLastDate = localStorage.getItem("lastAiUsageDate");

    if (storedAiUsage) {
      setAiUsageToday(parseInt(storedAiUsage, 10));
    }

    if (storedLastDate) {
      setLastAiUsageDate(storedLastDate);
    }

    // Reset daily usage if it's a new day
    const today = new Date().toISOString().split("T")[0];
    if (storedLastDate !== today && storedLastDate) {
      console.log("New day detected, resetting AI usage.");
      setAiUsageToday(0);
      localStorage.setItem("aiUsageToday", "0");
    }

    setIsAuthReady(true);
    console.log("✅ FirebaseContext: Auth state initialized");
  }, []);

  // Update user tier
  const updateUserTier = useCallback((newTier) => {
    console.log("🔄 FirebaseContext: Updating user tier to:", newTier);
    
    if (newTier === "premium") {
      setIsPremiumUser(true);
      localStorage.setItem("userTier", "premium");
      console.log("✅ FirebaseContext: User upgraded to premium");
    } else {
      setIsPremiumUser(false);
      localStorage.setItem("userTier", newTier);
      console.log("✅ FirebaseContext: User tier updated to:", newTier);
    }
  }, []);

  // Get user tier
  const getUserTier = useCallback(() => {
    if (isPremiumUser) return "premium";
    if (trialRemainingSaves > 0) return "freemium";
    return "anonymous";
  }, [isPremiumUser, trialRemainingSaves]);

  // Get save limit based on tier
  const getSaveLimit = useCallback(() => {
    const tier = getUserTier();
    switch (tier) {
      case "premium":
        return Infinity;
      case "freemium":
        return 10;
      default:
        return 3;
    }
  }, [getUserTier]);

  // Check if user can save more
  const canSaveMore = useCallback(() => {
    const tier = getUserTier();
    if (tier === "premium") return true;
    
    const currentSaves = localStorage.getItem("savedTalesCount") || "0";
    const savedCount = parseInt(currentSaves, 10);
    const limit = getSaveLimit();
    
    return savedCount < limit;
  }, [getUserTier, getSaveLimit]);

  // Decrement trial saves
  const decrementTrialSaves = useCallback(() => {
    if (trialRemainingSaves > 0) {
      const newCount = trialRemainingSaves - 1;
      setTrialRemainingSaves(newCount);
      localStorage.setItem("trialRemainingSaves", newCount.toString());
      
      if (newCount === 0) {
        setIsTrialExpired(true);
      }
      
      return newCount;
    }
    return 0;
  }, [trialRemainingSaves]);

  // Reset trial
  const resetTrial = useCallback(() => {
    setTrialRemainingSaves(3);
    setIsTrialExpired(false);
    localStorage.setItem("trialRemainingSaves", "3");
    console.log("✅ FirebaseContext: Trial reset to 3 saves");
  }, []);

  // Track AI usage
  const trackAiUsage = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    
    if (lastAiUsageDate !== today) {
      setAiUsageToday(1);
      setLastAiUsageDate(today);
      localStorage.setItem("aiUsageToday", "1");
      localStorage.setItem("lastAiUsageDate", today);
    } else {
      const newUsage = aiUsageToday + 1;
      setAiUsageToday(newUsage);
      localStorage.setItem("aiUsageToday", newUsage.toString());
    }
  }, [aiUsageToday, lastAiUsageDate]);

  // Check if AI usage is available
  const canUseAi = useCallback(() => {
    const tier = getUserTier();
    if (tier === "premium") return true;
    
    const dailyLimit = tier === "freemium" ? 5 : 2;
    return aiUsageToday < dailyLimit;
  }, [getUserTier, aiUsageToday]);

  return {
    currentUser,
    isAuthReady,
    firebaseError,
    trialRemainingSaves,
    isTrialExpired,
    isPremiumUser,
    aiUsageToday,
    lastAiUsageDate,
    updateUserTier,
    getUserTier,
    getSaveLimit,
    canSaveMore,
    decrementTrialSaves,
    resetTrial,
    trackAiUsage,
    canUseAi,
  };
};

// Provider component
export const FirebaseProvider = ({ children }) => {
  const auth = useLocalAuth();

  const value = {
    ...auth,
    // Add any additional Firebase-specific methods here
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
