// src/app/favorites/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import DetailPageSidebar from '../../components/DetailPageSidebar'; // Import DetailPageSidebar directly
import Image from 'next/image';
import Link from 'next/link';
import { dummyTales, ITale } from '../../data/dummyTales'; // Import dummyTales and ITale interface
import { useFirebase } from '../../components/ClientProviders';

// Define a minimal interface for a favorited item stored in Firestore
interface IFavoriteItem {
  id: string;
  title: string;
  type: ITale['type'];
  timestamp: string; // ISO string
  imageUrl: string; // Now required
  location: string; // Now required
}

const FavoritesPage = () => {
  // Use local authentication
  const { currentUser, isAuthReady } = useFirebase();

  // State for favorite items fetched from localStorage
  const [favoriteItems, setFavoriteItems] = useState<IFavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to load favorites from localStorage
  useEffect(() => {
    if (!isAuthReady || !currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Load favorites from localStorage
      const favoritesKey = `favorites_${currentUser.uid}`;
      const storedFavorites = localStorage.getItem(favoritesKey);
      
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        const items: IFavoriteItem[] = [];
        
        favoriteIds.forEach((taleId: string) => {
          const fullTale = dummyTales.find(tale => tale.id === taleId);
          if (fullTale) {
            items.push({
              id: taleId,
              title: fullTale.title,
              type: fullTale.type,
              timestamp: new Date().toISOString(), // Use current time as fallback
              imageUrl: fullTale.imageUrl,
              location: fullTale.location,
            });
          }
        });
        
        setFavoriteItems(items);
      } else {
        setFavoriteItems([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error loading favorite items:", err);
      setError("Failed to load your favorite items.");
      setLoading(false);
    }
  }, [currentUser, isAuthReady]); // Re-run if user or auth state changes



  // Sidebar props for this page
  const sidebarProps = {
    taleType: 'video' as ITale['type'], // Default type for sidebar, not specifically used for content
    title: 'My Favorites', // Page title for sidebar
    location: '', // Not applicable for a list page sidebar
    rating: 0, // Not applicable for a list page sidebar
    priceRange: '', // Not applicable for a list page sidebar
  };

  if (!isAuthReady) {
    return (
      <MainLayout> {/* MainLayout now just provides Header/Footer/MobileNav */}
        <div className="text-center py-10">Initializing app features...</div>
      </MainLayout>
    );
  }

  // Display error if one exists, even if not loading
  if (error) {
    return (
      <MainLayout> {/* MainLayout now just provides Header/Footer/MobileNav */}
        <div className="text-center py-10 text-red-600">
          <h1 className="text-2xl font-bold">Error Loading Favorites</h1>
          <p className="mt-2">{error}</p>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout> {/* MainLayout now just provides Header/Footer/MobileNav */}
        <div className="text-center py-10">Loading your favorites...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout> {/* MainLayout now just provides Header/Footer/MobileNav */}
      {/* This div creates the grid layout for the sidebar and main content */}
      <div className="w-full lg:grid lg:grid-cols-[256px_1fr] min-h-screen">
        {/* Detail Page Sidebar - visible only on large screens */}
        <DetailPageSidebar
          taleType={sidebarProps.taleType}
          title={sidebarProps.title}
          location={sidebarProps.location}
          rating={sidebarProps.rating}
          priceRange={sidebarProps.priceRange}
        />

        {/* Main content area for the favorites page */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl w-full"> {/* Max width for content */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              My Favorites
            </h1>
            {currentUser && (
              <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md mb-6 text-xs break-all">
                User ID: <span className="font-mono">{currentUser.uid}</span>
              </div>
            )}

            {favoriteItems.length === 0 ? (
              <div className="text-center py-10 text-gray-600">
                <p className="text-lg">You haven't favorited any items yet.</p>
                <p className="mt-2">Go to a detail page and click "Add to Favorites" to see them here!</p>
                <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Explore Tales
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favoriteItems.map((item, index) => (
                  <Link key={item.id} href={`/videos/${item.id}`} className="block">
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                      <div className="relative w-full h-48">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-t-lg"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          priority={index === 0} // Set priority to true only for the first image
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">{item.title}</h3>
                        <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                        <p className="text-sm text-gray-500 mt-1">{item.location}</p>
                        <p className="text-xs text-gray-500 mt-2">Favorited on: {new Date(item.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FavoritesPage;