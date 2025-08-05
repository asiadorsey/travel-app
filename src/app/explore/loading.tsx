// src/app/explore/loading.tsx
import React from 'react';

const ExploreLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-talea-dun via-talea-mint to-talea-rose-taupe">
      {/* Hero Section Skeleton */}
      <section className="relative py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="h-16 bg-gray-200 rounded-lg mb-6 animate-pulse max-w-2xl mx-auto"></div>
          <div className="h-8 bg-gray-200 rounded-lg mb-8 animate-pulse max-w-3xl mx-auto"></div>
          
          {/* Search Bar Skeleton */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white bg-opacity-80 rounded-lg px-6 py-4 backdrop-blur-sm">
                <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse w-16"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Section Skeleton */}
      <section className="bg-white bg-opacity-90 backdrop-blur-sm py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse w-20"></div>
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section Skeleton */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExploreLoading; 