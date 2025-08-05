// src/components/FeaturedSection.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Masonry from 'react-masonry-css';

// Import Heroicons
import {
  ArrowLongRightIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  HandRaisedIcon,
  PhoneIcon,
  PlayCircleIcon,
  SparklesIcon,
  StarIcon,
  SunIcon,
  BuildingStorefrontIcon,
  MapPinIcon
} from '@heroicons/react/24/solid';

import { ITale } from '../data/dummyTales';

interface FeaturedSectionProps {
  featuredTales: ITale[];
}

// Helper to pick the correct icon based on category
const getCategoryIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'hotel':
      return BuildingOfficeIcon;
    case 'event':
      return CalendarDaysIcon;
    case 'restaurant':
      return BuildingStorefrontIcon;
    case 'attraction':
      return GlobeAltIcon;
    case 'travel tips':
      return SparklesIcon;
    case 'video':
      return PlayCircleIcon;
    default:
      return ArrowLongRightIcon;
  }
};

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ featuredTales }) => {
  // Adjusted breakpoints for potentially larger featured cards
  const breakpointColumnsObj = {
    default: 3, // For larger screens, 3 columns
    1100: 2,    // For medium screens, 2 columns
    700: 1,     // For small screens, 1 column
  };

  if (!featuredTales || featuredTales.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No featured experiences available.
      </div>
    );
  }

  // Ensure only the first 3 tales are used for featured section
  const talesToDisplay = featuredTales.slice(0, 3);

  return (
    // More dynamic section styling
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-talea-dark-green to-talea-rose-taupe rounded-[30px] shadow-3xl mb-20 relative overflow-hidden border-4 border-talea-mint animate-pulse-border">
      {/* Subtle background pattern/texture overlay */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-12 leading-tight drop-shadow-lg animate-fade-in-up">
          Featured Experiences
        </h2>

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {talesToDisplay.map((tale, index) => {
            const IconComponent = getCategoryIcon(tale.type);
            let href = '';
            switch (tale.type) {
              case 'video':
                href = `/videos/${tale.id}`;
                break;
              case 'hotel':
                href = `/hotels/${tale.id}`;
                break;
              case 'event':
                href = `/events/${tale.id}`;
                break;
              case 'restaurant':
                href = `/restaurants/${tale.id}`;
                break;
              case 'attraction':
                href = `/attractions/${tale.id}`;
                break;
              default:
                href = `/404`;
            }

            return (
              <div key={`${tale.type}-${tale.id}`} className="mb-8 my-masonry-grid_item animate-card-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <Link href={href} passHref>
                  {/* Distinct card styling for featured section */}
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.04] hover:shadow-3xl group border-2 border-talea-dun hover:border-talea-mint relative">
                    {/* Optional: Subtle glow effect on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 20px rgba(87, 165, 122, 0.6)' }}></div>

                    <div className="relative w-full h-56 sm:h-64 lg:h-72">
                      <Image
                        src={tale.imageUrl}
                        alt={tale.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-t-2xl group-hover:brightness-90 transition-brightness duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-t-2xl"></div>
                      {tale.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-t-2xl">
                          <PlayCircleIcon className="h-16 w-16 text-white opacity-80" />
                        </div>
                      )}
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center text-sm text-talea-dark-slate-gray mb-2">
                        {IconComponent && (
                          <IconComponent className="h-5 w-5 mr-2 text-talea-rose-taupe" />
                        )}
                        <span>{tale.category ? tale.category : tale.type.charAt(0).toUpperCase() + tale.type.slice(1)}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-talea-dark-slate-gray mb-2 leading-tight group-hover:text-talea-mint transition-colors duration-300">
                        {tale.title}
                      </h3>
                      <p className="text-talea-dark-slate-gray text-sm sm:text-base line-clamp-2">
                        {tale.description}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-talea-dark-slate-gray">
                        <div className="flex items-center mr-3 mb-1">
                          <MapPinIcon className="h-4 w-4 mr-1 text-talea-rose-taupe" />
                          <span>{tale.location}</span>
                        </div>
                        {tale.rating && (
                          <div className="flex items-center mr-3 mb-1">
                            <StarIcon className="h-4 w-4 mr-1 text-yellow-500" />
                            <span>{tale.rating}</span>
                          </div>
                        )}
                        {tale.priceRange && (
                          <div className="flex items-center mb-1">
                            <CurrencyDollarIcon className="h-4 w-4 mr-1 text-talea-dark-green" />
                            <span>{tale.priceRange}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </Masonry>
      </div>
    </section>
  );
};

export default FeaturedSection;
