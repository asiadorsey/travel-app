// src/app/saved/page.tsx
"use client";

import React, { Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
// DetailPageSidebar is removed from this page's layout for a full-width saved items display
import { dummyTales, ITale } from '@/data/dummyTales';
import { useSavedTales } from '@/context/SavedTalesContext';
import { useFirebase } from '@/components/ClientProviders';
import Link from 'next/link';
import Image from 'next/image';

// Lazy load TaleCard component
const TaleCard = React.lazy(() => import('@/components/TaleCard'));

const SavedPage: React.FC = () => {
  // Get state and functions from contexts
  const { savedTaleIds, onToggleSave, loadingSavedTales, savedTalesError } = useSavedTales();
  const { userId, isAuthReady, firebaseError } = useFirebase();

  // Filter dummyTales to get only the ones that are saved
  // This ensures we have the full tale object to pass to TaleCard
  const savedTales = dummyTales.filter(tale => savedTaleIds.has(tale.id));

  // --- Conditional Rendering Logic ---

  // Handle overall app initialization status (Firebase and SavedTalesContext loading)
  if (!isAuthReady || loadingSavedTales) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-talea-dark-slate-gray text-lg font-medium">
          {firebaseError ? "Error initializing app features..." : "Loading your saved items..."}
        </div>
      </MainLayout>
    );
  }

  // Display errors if any occurred during Firebase init or Firestore fetch
  if (firebaseError || savedTalesError) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-red-600 text-center p-4">
          <h1 className="text-2xl font-bold mb-3">Error Loading Saved Items</h1>
          <p className="text-lg">{firebaseError || savedTalesError}</p>
          <p className="mt-4 text-sm text-gray-500">Please try refreshing the page or check your network connection.</p>
        </div>
      </MainLayout>
    );
  }

  // --- Main Content Display ---
  return (
    <MainLayout>
      {/* Removed lg:grid lg:grid-cols-[256px_1fr] to make content full width */}
      {/* Removed DetailPageSidebar component */}

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full"> {/* Increased max-width for better display */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 border-b-2 pb-2 border-talea-dun">
            My Saved Items
          </h1>
          {userId && (
            <div className="bg-talea-dun bg-opacity-20 text-talea-dark-slate-gray px-4 py-2 rounded-lg mb-8 text-sm font-mono break-all shadow-inner">
              User ID: <span className="font-semibold">{userId}</span>
            </div>
          )}

          {savedTales.length === 0 ? (
            <div className="text-center py-16 text-gray-600 bg-white rounded-xl shadow-lg border border-talea-dun p-8">
              <p className="text-xl font-semibold mb-4">You haven't saved any items yet.</p>
              <p className="text-md mb-6">Start exploring and add your favorite tales to your list!</p>
              <Link href="/" className="inline-block bg-talea-mint text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-talea-dark-green transition-colors duration-300 shadow-md transform hover:scale-105">
                Explore Tales
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {savedTales.map((tale) => (
                <Suspense key={tale.id} fallback={<div className="bg-gray-200 rounded-lg p-4 animate-pulse">Loading Tale...</div>}>
                  <TaleCard
                    tale={tale}
                  />
                </Suspense>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SavedPage;
