// src/components/HeroSection.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SparklesIcon, MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline'; // Re-import icons

const HeroSection: React.FC = () => {
  return (
    // Hero Section - Modernized and polished with Brand Colors
    <section className="text-center py-24 bg-gradient-to-br from-talea-dun via-talea-mint to-talea-rose-taupe rounded-[30px] shadow-3xl mb-16 relative overflow-hidden group border border-talea-dark-green">
      {/* Background elements - More dynamic and integrated */}
      <div className="absolute top-0 left-0 w-1/3 h-full opacity-50 z-0 transform -translate-x-1/4 -translate-y-1/4 rotate-12 animate-float-slow group-hover:rotate-6 transition-transform duration-500 ease-out">
        <Image
          src="https://picsum.photos/seed/hero-left-modern/400/400" // Placeholder for left floating image
          alt="Hero Decoration Left"
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-full" // Added rounded for a softer look
          sizes="33vw"
          priority={true}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-1/3 h-full opacity-50 z-0 transform translate-x-1/4 translate-y-1/4 -rotate-12 animate-float-fast group-hover:-rotate-6 transition-transform duration-500 ease-out">
        <Image
          src="https://picsum.photos/seed/hero-right-modern/400/400" // Placeholder for right floating image
          alt="Hero Decoration Right"
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-full" // Added rounded for a softer look
          sizes="33vw"
          priority={true}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4"> {/* Content layered above background */}
        {/* Adjusted text size for h1 and p */}
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-talea-dark-green to-talea-dark-slate-gray animate-fade-in">
          Discover Tales Beyond Travel
        </h1>
        <p className="text-lg sm:text-xl mb-12 max-w-4xl mx-auto font-light leading-relaxed animate-slide-up text-talea-dark-slate-gray">
          Uncover hidden gems, create unique itineraries, and share your adventures.
        </p>
        {/* Info Tags with Icons - Re-integrated */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-16 text-lg font-medium animate-fade-in-delay">
          <span className="flex items-center px-6 py-3 rounded-full bg-white bg-opacity-70 backdrop-blur-md border border-white border-opacity-30 shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105 group-hover:shadow-xl text-talea-dark-slate-gray bg-talea-dun border-talea-dark-green">
            <SparklesIcon className="h-5 w-5 mr-2 text-talea-rose-taupe" /> Curated Destinations
          </span>
          <span className="flex items-center px-6 py-3 rounded-full bg-white bg-opacity-70 backdrop-blur-md border border-white border-opacity-30 shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105 group-hover:shadow-xl text-talea-dark-slate-gray bg-talea-dun border-talea-dark-green">
            <GlobeAltIcon className="h-5 w-5 mr-2 text-talea-rose-taupe" /> Global Experiences
          </span>
          <span className="flex items-center px-6 py-3 rounded-full bg-white bg-opacity-70 backdrop-blur-md border border-white border-opacity-30 shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105 group-hover:shadow-xl text-talea-dark-slate-gray bg-talea-dun border-talea-dark-green">
            <MapPinIcon className="h-5 w-5 mr-2 text-talea-rose-taupe" /> Unique Stories
          </span>
        </div>
        <Link href="/explore" className="inline-block text-white px-14 py-6 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl transform hover:scale-105 hover:rotate-1 focus:outline-none focus:ring-4 focus:ring-opacity-75 animate-pulse-once bg-gradient-to-r from-talea-dark-green to-talea-rose-taupe ring-talea-mint">
          Start Exploring
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
