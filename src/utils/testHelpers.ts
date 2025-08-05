// Testing utilities for freemium system
export const resetToAnonymous = () => {
    localStorage.setItem('userTier', 'anonymous');
    localStorage.setItem('trialSavesUsed', '0');
    localStorage.removeItem('upgradeDate');
    localStorage.removeItem('selectedPlan');
    console.log('🧪 Reset to anonymous user');
    window.location.reload();
};

export const setPremiumUser = () => {
    localStorage.setItem('userTier', 'premium');
    localStorage.setItem('upgradeDate', new Date().toISOString());
    localStorage.setItem('selectedPlan', 'premium');
    console.log('👑 Set as premium user');
    window.location.reload();
};

export const setTrialLimit = (used: number = 3) => {
    localStorage.setItem('userTier', 'anonymous');
    localStorage.setItem('trialSavesUsed', used.toString());
    console.log(`🧪 Set trial saves used to ${used}/3`);
    window.location.reload();
};

export const clearAllData = () => {
    localStorage.clear();
    console.log('🧹 Cleared all localStorage data');
    window.location.reload();
};

export const getCurrentState = () => {
    const userTier = localStorage.getItem('userTier') || 'anonymous';
    const trialSavesUsed = parseInt(localStorage.getItem('trialSavesUsed') || '0');
    const upgradeDate = localStorage.getItem('upgradeDate');
    const selectedPlan = localStorage.getItem('selectedPlan');

    console.log('📊 Current State:', {
        userTier,
        trialSavesUsed,
        upgradeDate,
        selectedPlan,
        remainingSaves: 3 - trialSavesUsed
    });

    return { userTier, trialSavesUsed, upgradeDate, selectedPlan };
};

export const simulateSave = (taleId: string = 'test-tale-' + Date.now()) => {
    const userId = localStorage.getItem('userId') || 'anonymous-user';
    const userSavedItemsKey = `savedTales_${userId}`;
    const currentSaved = localStorage.getItem(userSavedItemsKey);
    const savedTales = currentSaved ? JSON.parse(currentSaved) : [];

    if (!savedTales.includes(taleId)) {
        savedTales.push(taleId);
        localStorage.setItem(userSavedItemsKey, JSON.stringify(savedTales));

        // Update trial usage for anonymous users
        const userTier = localStorage.getItem('userTier');
        if (userTier === 'anonymous') {
            const currentUsed = parseInt(localStorage.getItem('trialSavesUsed') || '0');
            localStorage.setItem('trialSavesUsed', (currentUsed + 1).toString());
        }

        console.log(`💾 Simulated save: ${taleId}`);
        console.log(`📊 Trial saves used: ${localStorage.getItem('trialSavesUsed')}/3`);
    } else {
        console.log(`❌ Tale ${taleId} already saved`);
    }
};

// Make available globally for console testing
if (typeof window !== 'undefined') {
    (window as any).testHelpers = {
        resetToAnonymous,
        setPremiumUser,
        setTrialLimit,
        clearAllData,
        getCurrentState,
        simulateSave
    };

    console.log('🧪 Freemium Testing Commands Available:');
    console.log('testHelpers.resetToAnonymous() - Reset to anonymous user');
    console.log('testHelpers.setPremiumUser() - Set as premium user');
    console.log('testHelpers.setTrialLimit(3) - Set trial saves used');
    console.log('testHelpers.clearAllData() - Clear all localStorage');
    console.log('testHelpers.getCurrentState() - Show current state');
    console.log('testHelpers.simulateSave() - Simulate saving a tale');
} 