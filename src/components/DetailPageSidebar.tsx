// src/components/DetailPageSidebar.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeartIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useFirebase } from '@/components/ClientProviders';
import { useSavedTales } from '@/context/SavedTalesContext';

// Define props for the DetailPageSidebar component
interface DetailPageSidebarProps {
  taleType: 'video' | 'hotel' | 'event' | 'restaurant' | 'attraction' | 'adventure' | 'culture & arts' | 'food & dining' | 'wellness' | 'luxury' | 'workshop';
  title: string;
  location: string;
  rating?: number;
  priceRange?: string;
}

const DetailPageSidebar: React.FC<DetailPageSidebarProps> = ({
  taleType,
  title,
  location,
  rating,
  priceRange,
}) => {
  // Get user info from local auth
  const { currentUser, isAuthReady } = useFirebase();
  const { savedTaleIds, onToggleSave, loadingSavedTales } = useSavedTales();

  // State for favorite status (using localStorage for now)
  const [isFavorite, setIsFavorite] = useState(false);
  // State for displaying a temporary message
  const [message, setMessage] = useState<string | null>(null);

  // Get the current item's ID from the URL
  const itemId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  // Check if item is saved using our savedTales context
  const isSaved = itemId ? savedTaleIds.has(itemId) : false;

  // Effect to clear message after a few seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000); // Message disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleFavoriteClick = async () => {
    if (!currentUser) {
      setMessage("Please sign in to add favorites.");
      return;
    }
    try {
      // Toggle favorite status in localStorage
      const userFavoritesKey = `favorites_${currentUser.uid}`;
      const currentFavorites = JSON.parse(localStorage.getItem(userFavoritesKey) || '[]');

      if (isFavorite) {
        const updatedFavorites = currentFavorites.filter((fav: any) => fav.id !== itemId);
        localStorage.setItem(userFavoritesKey, JSON.stringify(updatedFavorites));
        setIsFavorite(false);
        setMessage('Removed from Favorites!');
      } else {
        const newFavorite = {
          id: itemId,
          title: title,
          type: taleType,
          timestamp: new Date().toISOString()
        };
        const updatedFavorites = [...currentFavorites, newFavorite];
        localStorage.setItem(userFavoritesKey, JSON.stringify(updatedFavorites));
        setIsFavorite(true);
        setMessage('Added to Favorites!');
      }
    } catch (e) {
      console.error("Error updating favorite status:", e);
      setMessage("Failed to update favorites.");
    }
  };

  const handleSaveClick = async () => {
    if (!currentUser) {
      setMessage("Please sign in to save items.");
      return;
    }
    try {
      if (itemId) {
        await onToggleSave(itemId);
        setMessage(isSaved ? 'Removed from Saved!' : 'Saved for Later!');
      }
    } catch (e) {
      console.error("Error updating saved status:", e);
      setMessage("Failed to update saved items.");
    }
  };

  const handleShareClick = async () => {
    const shareData = {
      title: title,
      text: `Check out this amazing ${taleType} experience: ${title} in ${location}!`,
      url: window.location.href, // Get the current page URL
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setMessage('Shared successfully!');
      } else {
        // Fallback for browsers that don't support Web Share API (e.g., desktop Chrome)
        // Using document.execCommand('copy') as navigator.clipboard.writeText() may not work due to iFrame restrictions.
        const textarea = document.createElement('textarea');
        textarea.value = shareData.url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setMessage('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      setMessage('Failed to share.');
    }
  };

  if (!isAuthReady) {
    return (
      <aside className="hidden lg:flex bg-white p-6 shadow-lg flex-col lg:w-64 justify-center items-center">
        <p className="text-gray-600">Loading features...</p>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:flex bg-white p-6 shadow-lg flex-col lg:w-64">
      {/* Back to Home Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Temporary Message Display */}
      {message && (
        <div className="bg-green-100 text-green-800 px-3 py-2 rounded-md mb-4 text-sm">
          {message}
        </div>
      )}

      {/* User Info Display */}
      {currentUser && (
        <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md mb-4 text-xs break-all">
          User: <span className="font-mono">{currentUser.email || 'Guest'}</span>
        </div>
      )}

      {/* Main Content Area - ENSURING FLEX COL FOR BUTTONS */}
      <div className="flex flex-col flex-grow space-y-4">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 text-sm">{location}</p>

        {rating && (
          <div className="flex items-center text-gray-700 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-yellow-500 mr-1"
            >
              <path
                fillRule="evenodd"
                d="M10.868 2.884c.321-.772 1.415-.772 1.736 0l1.832 4.409 4.757.382c.835.067 1.164 1.16.598 1.71L17.16 10.74a1.125 1.125 0 01-.32 1.094l-1.895 4.397a1.125 1.125 0 01-1.654.455l-4.204-2.11a1.125 1.125 0 00-1.076 0l-4.204 2.11a1.125 1.125 0 01-1.654-.455L3.16 11.834a1.125 1.125 0 01-.32-1.094l1.854-1.785a1.125 1.125 0 01.32-.23l4.757-.382a1.125 1.125 0 00.912-.767l1.832-4.409z"
                clipRule="evenodd"
              />
            </svg>
            <span>{rating} ({Math.floor(rating * 10)} reviews)</span>
          </div>
        )}

        {priceRange && (
          <p className="text-gray-700 text-sm">Price: {priceRange}</p>
        )}

        {/* Action Buttons */}
        <button
          onClick={handleFavoriteClick}
          className={`flex items-center justify-center py-2 px-4 rounded transition-colors duration-200 mt-4 ${isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          {isFavorite ? <HeartSolidIcon className="w-5 h-5 mr-2" /> : <HeartIcon className="w-5 h-5 mr-2" />}
          {isFavorite ? 'Favorited!' : 'Add to Favorites'}
        </button>
        <button
          onClick={handleShareClick}
          className="flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-200"
        >
          <ShareIcon className="w-5 h-5 mr-2" /> Share
        </button>
        <button
          onClick={handleSaveClick}
          disabled={loadingSavedTales}
          className={`flex items-center justify-center py-2 px-4 rounded transition-colors duration-200 ${isSaved ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } ${loadingSavedTales ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSaved ? <BookmarkSolidIcon className="w-5 h-5 mr-2" /> : <BookmarkIcon className="w-5 h-5 mr-2" />}
          {loadingSavedTales ? 'Loading...' : (isSaved ? 'Saved!' : 'Save for Later')}
        </button>
      </div>

      {/* Placeholder for additional content based on taleType */}
      <div className="mt-auto pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>Type: {taleType.charAt(0).toUpperCase() + taleType.slice(1)}</p>
        {taleType === 'video' && <p>Duration: N/A (Example)</p>}
      </div>
    </aside>
  );
};

export default DetailPageSidebar;