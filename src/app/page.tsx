// src/app/page.tsx
"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/HeroSection';
import SearchBar from '@/components/SearchBar';
import FeaturedSection from '@/components/FeaturedSection';
import Link from 'next/link';
import Image from 'next/image';
import { dummyTales, ITale } from '@/data/dummyTales';
import { useSavedTales } from '@/context/SavedTalesContext';

// Lazy load TaleCard component
const TaleCard = React.lazy(() => import('@/components/TaleCard'));

// Define personality types and sort options
const personalityTypes = [
  'All Tales', // This will act as the "show all" option for personality filters
  'The Adventurer\'s Call',
  'The Cultural Weaver',
  'The Serenity Seeker',
  'The Culinary Explorer',
  'The Urban Storyteller',
  'The Wild Heart'
];

const categories = [
  'All Categories', 'Cultural Experience', 'Food & Dining', 'Adventure Experience',
  'Wellness Experience', 'Unique Accommodation', 'Historic Hotel', 'Luxury Resort',
  'Cultural Festival', 'Photography Workshop', 'Sustainable Dining', 'Natural Wonder',
  'Historical Site', 'Spiritual Experience'
];

const sortOptions = [
  'Default', 'Popularity', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Rating'
];

const HomePage: React.FC = () => {
  const { savedTaleIds } = useSavedTales();

  // State for search query, current personality filter, category filter, and sort order
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPersonalityFilter, setCurrentPersonalityFilter] = useState<string>('All Tales'); // New state for personality filter
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [sortOrder, setSortOrder] = useState<string>('Default');
  const [displayedTales, setDisplayedTales] = useState<ITale[]>(dummyTales);

  // Filter for featured tales (remains static as it's not affected by search/filters)
  const featuredTales = dummyTales.filter(tale => tale.featured);

  // Function to handle search input changes
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query.toLowerCase());
  }, []);

  // Function to handle personality filter changes
  const handlePersonalityFilterChange = useCallback((personality: string) => {
    setCurrentPersonalityFilter(personality);
    // Reset other filters/search if a personality filter is chosen for clarity
    setSearchQuery('');
    setCategoryFilter('All Categories');
    setSortOrder('Default');
  }, []);

  // Function to handle category filter changes
  const handleCategoryChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(event.target.value);
    // Reset personality filter if category filter is chosen
    setCurrentPersonalityFilter('All Tales');
  }, []);

  // Function to handle sort order changes
  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value);
  }, []);

  // Effect to apply all filters and sorting whenever relevant state changes
  useEffect(() => {
    let currentTales = [...dummyTales]; // Start with a fresh copy of all tales

    // 1. Apply Personality Filter (first, as it's a primary navigation)
    if (currentPersonalityFilter !== 'All Tales') {
      currentTales = currentTales.filter(tale => tale.personalityType === currentPersonalityFilter);
    }

    // 2. Apply Search Filter
    if (searchQuery) {
      currentTales = currentTales.filter(tale =>
        tale.title.toLowerCase().includes(searchQuery) ||
        tale.location.toLowerCase().includes(searchQuery) ||
        tale.description.toLowerCase().includes(searchQuery)
      );
    }

    // 3. Apply Category Filter
    if (categoryFilter !== 'All Categories') {
      currentTales = currentTales.filter(tale => tale.category === categoryFilter);
    }

    // 4. Apply Sorting
    if (sortOrder !== 'Default') {
      currentTales.sort((a, b) => {
        switch (sortOrder) {
          case 'Popularity':
            return (b.rating || 0) - (a.rating || 0);
          case 'Newest':
            // For 'Newest', you'd need a date property on ITale. For now, it won't sort.
            // return (new Date(b.dateAdded).getTime() || 0) - (new Date(a.dateAdded).getTime() || 0);
            return 0;
          case 'Price: Low to High':
            return (a.price || 0) - (b.price || 0);
          case 'Price: High to Low':
            return (b.price || 0) - (a.price || 0);
          case 'Rating':
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
    }

    setDisplayedTales(currentTales);
  }, [searchQuery, currentPersonalityFilter, categoryFilter, sortOrder]); // Dependencies

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <HeroSection />

        {/* Personality Navigation - Now dynamic and functional */}
        <nav className="mb-12">
          <div className="flex overflow-x-auto whitespace-nowrap py-3 px-2 -mx-2 scrollbar-hide">
            {personalityTypes.map((personality) => (
              <span
                key={personality}
                className={`inline-block text-sm px-6 py-2 rounded-full mr-3 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-sm last:mr-0
                               ${currentPersonalityFilter === personality
                    ? 'bg-talea-mint text-white shadow-md'
                    : 'bg-talea-dun text-talea-dark-slate-gray border border-talea-mint hover:bg-talea-mint hover:text-white hover:shadow-md'
                  }`}
                onClick={() => handlePersonalityFilterChange(personality)}
              >
                {personality}
              </span>
            ))}
          </div>
        </nav>

        {/* Search and Filters Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-xl shadow-xl border border-talea-dun">
            <div className="flex-grow mb-4 md:mb-0 md:mr-4 w-full md:w-auto">
              <SearchBar onSearch={handleSearch} value={searchQuery} /> {/* Pass value prop */}
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto justify-end">
              <div className="flex items-center w-full sm:w-auto">
                <label htmlFor="category-filter" className="mr-2 text-base font-medium text-talea-dark-slate-gray">Category:</label>
                <select
                  id="category-filter"
                  className="p-3 border border-talea-mint rounded-lg focus:outline-none focus:ring-3 focus:ring-talea-mint transition-all duration-200 shadow-sm text-talea-dark-slate-gray bg-white flex-grow"
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center w-full sm:w-auto">
                <label htmlFor="sort-filter" className="mr-2 text-base font-medium text-talea-dark-slate-gray">Sort By:</label>
                <select
                  id="sort-filter"
                  className="p-3 border border-talea-mint rounded-lg focus:outline-none focus:ring-3 focus:ring-talea-mint transition-all duration-200 shadow-sm text-talea-dark-slate-gray bg-white flex-grow"
                  value={sortOrder}
                  onChange={handleSortChange}
                >
                  {sortOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Conditionally render the FeaturedSection component */}
        {searchQuery === '' && currentPersonalityFilter === 'All Tales' && categoryFilter === 'All Categories' && sortOrder === 'Default' && (
          <FeaturedSection featuredTales={featuredTales} />
        )}

        {/* All Tales Section - Now renders displayedTales */}
        <section>
          <h2 className="text-3xl font-bold mb-6 border-b-2 pb-2 text-talea-dark-green border-talea-dun">All Tales</h2>
          {displayedTales.length === 0 && (searchQuery !== '' || currentPersonalityFilter !== 'All Tales' || categoryFilter !== 'All Categories') ? (
            <div className="text-center py-10 text-gray-600">
              <p className="text-lg">No tales found matching your criteria.</p>
              <p className="mt-2">Try adjusting your search, personality, category, or sort options!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayedTales.map((tale) => (
                <Suspense key={tale.id} fallback={<div className="bg-gray-200 rounded-lg p-4 animate-pulse">Loading Tale...</div>}>
                  <TaleCard
                    tale={tale}
                  />
                </Suspense>
              ))}
            </div>
          )}
        </section>

        {/* Load More Experiences Button (only show if no filters/search are active) */}
        {searchQuery === '' && currentPersonalityFilter === 'All Tales' && categoryFilter === 'All Categories' && sortOrder === 'Default' && (
          <div className="text-center mt-10">
            <button className="inline-block px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-300 transition-colors duration-300 shadow-md transform hover:scale-105 bg-talea-dun text-talea-dark-slate-gray">
              Load More Experiences
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
