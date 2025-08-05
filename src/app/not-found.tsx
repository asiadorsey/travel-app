// src/app/not-found.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { HomeIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-talea-dun via-talea-mint to-talea-rose-taupe flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* 404 Number */}
        <div className="text-8xl font-bold text-talea-dark-green mb-4">404</div>
        
        {/* Error Message */}
        <h1 className="text-3xl font-bold text-talea-dark-slate-gray mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-talea-dark-slate-gray mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Quick Actions */}
        <div className="space-y-4 mb-8">
          <Link 
            href="/"
            className="flex items-center justify-center w-full px-6 py-3 bg-talea-dark-green text-white rounded-lg hover:bg-talea-rose-taupe transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          
          <Link 
            href="/explore"
            className="flex items-center justify-center w-full px-6 py-3 bg-white text-talea-dark-green border-2 border-talea-dark-green rounded-lg hover:bg-talea-mint transition-colors"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Explore Experiences
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="text-sm text-talea-dark-slate-gray">
          <p className="mb-2">Or try one of these popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/favorites" className="text-talea-dark-green hover:text-talea-rose-taupe transition-colors">
              Favorites
            </Link>
            <Link href="/saved" className="text-talea-dark-green hover:text-talea-rose-taupe transition-colors">
              Saved
            </Link>
            <Link href="/search" className="text-talea-dark-green hover:text-talea-rose-taupe transition-colors">
              Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 