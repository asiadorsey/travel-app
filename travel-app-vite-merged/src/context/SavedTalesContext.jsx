// src/context/SavedTalesContext.jsx
"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useFirebase } from "./FirebaseContext.jsx";

// Create the context
const SavedTalesContext = createContext(null);

// Custom hook to use the SavedTales context
export const useSavedTales = () => {
  const context = useContext(SavedTalesContext);
  if (!context) {
    throw new Error("useSavedTales must be used within a SavedTalesProvider");
  }
  return context;
};

// Provider component
export const SavedTalesProvider = ({ children }) => {
  const [savedTales, setSavedTales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    getUserTier, 
    getSaveLimit, 
    canSaveMore, 
    decrementTrialSaves,
    currentUser 
  } = useFirebase();

  // Load saved tales from localStorage on mount
  useEffect(() => {
    const loadSavedTales = () => {
      try {
        const stored = localStorage.getItem("savedTales");
        if (stored) {
          const parsed = JSON.parse(stored);
          setSavedTales(parsed);
        }
      } catch (error) {
        console.error("Error loading saved tales:", error);
        setError("Failed to load saved tales");
      }
    };

    if (currentUser) {
      loadSavedTales();
    }
  }, [currentUser]);

  // Save tales to localStorage whenever savedTales changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("savedTales", JSON.stringify(savedTales));
      localStorage.setItem("savedTalesCount", savedTales.length.toString());
    }
  }, [savedTales, currentUser]);

  // Check if a tale is saved
  const isTaleSaved = useCallback((taleId) => {
    return savedTales.some(tale => tale.id === taleId);
  }, [savedTales]);

  // Save a tale
  const saveTale = useCallback((tale) => {
    if (!currentUser) {
      setError("You must be logged in to save tales");
      return false;
    }

    if (isTaleSaved(tale.id)) {
      setError("Tale is already saved");
      return false;
    }

    if (!canSaveMore()) {
      const tier = getUserTier();
      if (tier === "anonymous") {
        setError("Anonymous users can only save 3 tales. Sign up for more!");
      } else {
        setError("You've reached your save limit. Upgrade to premium for unlimited saves!");
      }
      return false;
    }

    try {
      const newSavedTale = {
        ...tale,
        savedAt: new Date().toISOString(),
        userId: currentUser.uid
      };

      setSavedTales(prev => [...prev, newSavedTale]);
      
      // Decrement trial saves if user is on trial
      if (getUserTier() === "freemium") {
        decrementTrialSaves();
      }

      setError(null);
      return true;
    } catch (error) {
      setError("Failed to save tale");
      return false;
    }
  }, [currentUser, isTaleSaved, canSaveMore, getUserTier, decrementTrialSaves]);

  // Remove a saved tale
  const removeSavedTale = useCallback((taleId) => {
    try {
      setSavedTales(prev => prev.filter(tale => tale.id !== taleId));
      setError(null);
      return true;
    } catch (error) {
      setError("Failed to remove tale");
      return false;
    }
  }, []);

  // Get saved tales by type
  const getSavedTalesByType = useCallback((type) => {
    return savedTales.filter(tale => tale.type === type);
  }, [savedTales]);

  // Get saved tales by personality type
  const getSavedTalesByPersonality = useCallback((personalityType) => {
    return savedTales.filter(tale => tale.personalityType === personalityType);
  }, [savedTales]);

  // Search saved tales
  const searchSavedTales = useCallback((query) => {
    const lowercaseQuery = query.toLowerCase();
    return savedTales.filter(tale => 
      tale.title.toLowerCase().includes(lowercaseQuery) ||
      tale.description.toLowerCase().includes(lowercaseQuery) ||
      tale.location.toLowerCase().includes(lowercaseQuery) ||
      tale.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [savedTales]);

  // Clear all saved tales
  const clearAllSavedTales = useCallback(() => {
    try {
      setSavedTales([]);
      setError(null);
      return true;
    } catch (error) {
      setError("Failed to clear saved tales");
      return false;
    }
  }, []);

  // Get save statistics
  const getSaveStats = useCallback(() => {
    const tier = getUserTier();
    const limit = getSaveLimit();
    const current = savedTales.length;
    const remaining = limit === Infinity ? Infinity : Math.max(0, limit - current);
    
    return {
      current,
      limit,
      remaining,
      tier,
      canSaveMore: canSaveMore()
    };
  }, [savedTales.length, getUserTier, getSaveLimit, canSaveMore]);

  const value = {
    savedTales,
    isLoading,
    error,
    isTaleSaved,
    saveTale,
    removeSavedTale,
    getSavedTalesByType,
    getSavedTalesByPersonality,
    searchSavedTales,
    clearAllSavedTales,
    getSaveStats,
  };

  return (
    <SavedTalesContext.Provider value={value}>
      {children}
    </SavedTalesContext.Provider>
  );
};
