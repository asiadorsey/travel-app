// src/app/explore/page.tsx
"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import Image from 'next/image';
import { dummyTales, ITale } from '@/data/dummyTales';
import { useSavedTales } from '@/context/SavedTalesContext';
import { MagnifyingGlassIcon, MapPinIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline';

// Lazy load TaleCard component
const TaleCard = React.lazy(() => import('@/components/TaleCard'));

// Define filter options
const categories = [
  'All Categories', 'Cultural Experience', 'Food & Dining', 'Adventure Experience',
  'Wellness Experience', 'Unique Accommodation', 'Historic Hotel', 'Luxury Resort',
  'Cultural Festival', 'Photography Workshop', 'Sustainable Dining', 'Natural Wonder',
  'Historical Site', 'Spiritual Experience'
];

const personalityTypes = [
  'All Personalities', 'The Adventurer\'s Call', 'The Cultural Weaver',
  'The Serenity Seeker', 'The Culinary Explorer', 'The Urban Storyteller', 'The Wild Heart'
];

const sortOptions = [
  'Default', 'Popularity', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Rating'
];

const ExplorePage: React.FC = () => {
  const { savedTaleIds } = useSavedTales();

  // State management
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [personalityFilter, setPersonalityFilter] = useState<string>('All Personalities');
  const [sortOrder, setSortOrder] = useState<string>('Default');
  const [displayedTales, setDisplayedTales] = useState<ITale[]>(dummyTales);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query.toLowerCase());
  }, []);

  // Handle category filter
  const handleCategoryChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(event.target.value);
  }, []);

  // Handle personality filter
  const handlePersonalityChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setPersonalityFilter(event.target.value);
  }, []);

  // Handle sort order
  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    setIsLoading(true);
    
    let currentTales = [...dummyTales];

    // Apply search filter
    if (searchQuery) {
      currentTales = currentTales.filter(tale =>
        tale.title.toLowerCase().includes(searchQuery) ||
        tale.location.toLowerCase().includes(searchQuery) ||
        tale.description.toLowerCase().includes(searchQuery)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'All Categories') {
      currentTales = currentTales.filter(tale => tale.category === categoryFilter);
    }

    // Apply personality filter
    if (personalityFilter !== 'All Personalities') {
      currentTales = currentTales.filter(tale => tale.personalityType === personalityFilter);
    }

    // Apply sorting
    switch (sortOrder) {
      case 'Popularity':
        currentTales.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'Newest':
        currentTales.sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());
        break;
      case 'Price: Low to High':
        currentTales.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'Price: High to Low':
        currentTales.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'Rating':
        currentTales.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Keep default order
        break;
    }

    setDisplayedTales(currentTales);
    setIsLoading(false);
  }, [searchQuery, categoryFilter, personalityFilter, sortOrder]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-talea-dun via-talea-mint to-talea-rose-taupe">
        {/* Hero Section */}
        <section className="relative py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-talea-dark-green">
              Explore Amazing Experiences
            </h1>
            <p className="text-xl text-talea-dark-slate-gray mb-8 max-w-3xl mx-auto">
              Discover curated travel experiences that match your personality and interests
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar onSearch={handleSearch} value={searchQuery} />
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="bg-white bg-opacity-80 rounded-lg px-6 py-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-talea-dark-green">{dummyTales.length}</div>
                <div className="text-sm text-talea-dark-slate-gray">Total Experiences</div>
              </div>
              <div className="bg-white bg-opacity-80 rounded-lg px-6 py-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-talea-dark-green">{savedTaleIds.size}</div>
                <div className="text-sm text-talea-dark-slate-gray">Saved by You</div>
              </div>
              <div className="bg-white bg-opacity-80 rounded-lg px-6 py-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-talea-dark-green">{new Set(dummyTales.map(t => t.location)).size}</div>
                <div className="text-sm text-talea-dark-slate-gray">Destinations</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-white bg-opacity-90 backdrop-blur-sm py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-talea-dark-slate-gray mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-talea-dark-green focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Personality Filter */}
              <div>
                <label htmlFor="personality" className="block text-sm font-medium text-talea-dark-slate-gray mb-2">
                  Personality
                </label>
                <select
                  id="personality"
                  value={personalityFilter}
                  onChange={handlePersonalityChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-talea-dark-green focus:border-transparent"
                >
                  {personalityTypes.map((personality) => (
                    <option key={personality} value={personality}>
                      {personality}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-talea-dark-slate-gray mb-2">
                  Sort By
                </label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-talea-dark-green focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="text-sm text-talea-dark-slate-gray">
                  {isLoading ? 'Loading...' : `${displayedTales.length} experiences found`}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-talea-dark-green mx-auto"></div>
                <p className="mt-4 text-talea-dark-slate-gray">Discovering amazing experiences...</p>
              </div>
            ) : displayedTales.length === 0 ? (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-talea-dark-slate-gray mb-2">No experiences found</h3>
                <p className="text-talea-dark-slate-gray mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('All Categories');
                    setPersonalityFilter('All Personalities');
                    setSortOrder('Default');
                  }}
                  className="px-6 py-3 bg-talea-dark-green text-white rounded-lg hover:bg-talea-rose-taupe transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {displayedTales.map((tale) => (
                  <Suspense key={tale.id} fallback={
                    <div className="bg-white rounded-lg p-4 animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    </div>
                  }>
                    <TaleCard tale={tale} />
                  </Suspense>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ExplorePage; 