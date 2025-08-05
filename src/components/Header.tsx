// src/components/Header.tsx
"use client";

import Link from 'next/link';
import { useFirebase } from '@/components/ClientProviders';
import { useSavedTales } from '../context/SavedTalesContext';
import { Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { currentUser, isAuthReady, signOutUser, signInAnonymously, firebaseError } = useFirebase();
  const { currentTier, openModal } = useSavedTales();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSigningInAnonymously, setIsSigningInAnonymously] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOutUser();
    setIsSigningOut(false);
    router.push('/');
  };

  const handleSignInAnonymously = async () => {
    setIsSigningInAnonymously(true);
    await signInAnonymously();
    setIsSigningInAnonymously(false);
  };

  // Conditionally render based on auth state
  const renderAuthLinks = () => {
    if (!isAuthReady) {
      return (
        <>
          <span className="text-sm text-gray-500">Loading...</span>
        </>
      );
    }

    // If a user is logged in (anonymous or a real user)
    if (currentUser) {
      const isAnonymous = currentUser.isAnonymous;
      const userName = currentUser.email?.split('@')[0] || (isAnonymous ? 'Guest' : 'User');

      return (
        <>
          <span className="text-sm text-gray-500 mr-4">Hello, {userName}!</span>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </>
      );
    }

    // If no user is logged in
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleSignInAnonymously}
          disabled={isSigningInAnonymously}
          className="px-3 py-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          {isSigningInAnonymously ? 'Loading...' : 'Continue as Guest'}
        </button>
        <Link href="/auth/signin" passHref>
          <button className="px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Sign In / Sign Up
          </button>
        </Link>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="text-xl font-bold text-gray-800">Talea</div>
      </div>
      <nav className="flex items-center space-x-6">
        <Link href="/" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <Link href="/saved" className="text-gray-600 hover:text-gray-900">
          My Saved Items
        </Link>
        
        {/* Upgrade Button Section */}
        <div className="flex items-center space-x-4">
          {currentTier !== 'premium' && (
            <button
              onClick={() => openModal('upgrade-button')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 animate-pulse"
            >
              <Crown className="w-4 h-4" />
              Upgrade
            </button>
          )}
          
          {currentTier === 'premium' && (
            <div className="flex items-center gap-2 text-purple-600">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium">Premium</span>
            </div>
          )}
          
          {renderAuthLinks()}
        </div>
      </nav>
      {firebaseError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg">
          {firebaseError}
        </div>
      )}
    </header>
  );
}
