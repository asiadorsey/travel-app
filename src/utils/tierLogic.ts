// src/utils/tierLogic.ts

/**
 * Tier utility functions for managing user access levels and feature permissions
 */

/**
 * Determines the current user tier based on authentication status
 * @param currentUser - The current user object from useFirebase
 * @param isPremiumUser - Boolean indicating if user has premium status
 * @returns The user's current tier: 'premium', 'freemium', or 'anonymous'
 */
export function getCurrentTier(currentUser: any, isPremiumUser: boolean): 'premium' | 'freemium' | 'anonymous' {
  if (isPremiumUser) {
    return 'premium';
  } else if (currentUser && !currentUser.isAnonymous) {
    return 'freemium';
  } else {
    return 'anonymous';
  }
}

/**
 * Checks if the user can save an item based on their tier and trial status
 * @param tier - The user's current tier from getCurrentTier
 * @param trialRemainingSaves - Number of remaining trial saves (for anonymous users)
 * @returns true if the user can save an item, false otherwise
 */
export function canSaveItem(tier: 'premium' | 'freemium' | 'anonymous', trialRemainingSaves: number): boolean {
  if (tier === 'premium' || tier === 'freemium') {
    return true; // Unlimited saves for these tiers
  } else {
    // Anonymous tier - check trial remaining saves
    return trialRemainingSaves > 0;
  }
}

/**
 * Checks if the user can use the AI companion based on their tier and daily usage
 * @param tier - The user's current tier from getCurrentTier
 * @param aiUsageToday - Number of AI uses today
 * @returns true if the user can use the AI companion, false otherwise
 */
export function canUseAi(tier: 'premium' | 'freemium' | 'anonymous', aiUsageToday: number): boolean {
  if (tier === 'premium') {
    return true; // Unlimited AI uses for premium users
  } else if (tier === 'freemium') {
    return aiUsageToday < 5; // 5 uses per day for freemium users
  } else {
    // Anonymous tier - 3 total uses
    return aiUsageToday < 3;
  }
} 