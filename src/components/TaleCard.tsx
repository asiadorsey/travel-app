// src/components/TaleCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Import Heroicons - Ensure these are all from @heroicons/react/24/solid
import {
  ArrowLongRightIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  HandRaisedIcon,
  PlayCircleIcon,
  SparklesIcon,
  StarIcon,
  SunIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  WifiIcon,
  TicketIcon,
  CameraIcon,
  BookOpenIcon,
  PlusCircleIcon, // For "Add"
  CheckCircleIcon, // For "Saved"
  TagIcon,
  ClockIcon as TimeIcon,
  GiftIcon,
  HeartIcon,
  CubeTransparentIcon
} from '@heroicons/react/24/solid';

import { ITale } from '../data/dummyTales'; // Ensure correct path to ITale

import { useSavedTales } from '@/context/SavedTalesContext'; // <<< NEW: Import useSavedTales

interface TaleCardProps {
  tale: ITale;
  // REMOVED: isSaved: boolean; // Now derived from useSavedTales
  // REMOVED: onToggleSave: (taleId: string) => void; // Now from useSavedTales
}

// Helper to pick the correct icon based on tale type or category
const getCategoryIcon = (type: string, category?: string) => {
  const lowerCaseType = type?.toLowerCase();
  const lowerCaseCategory = category?.toLowerCase();

  switch (lowerCaseType) {
    case 'video':
      return PlayCircleIcon;
    case 'hotel':
      return BuildingOfficeIcon;
    case 'event':
      return CalendarDaysIcon;
    case 'restaurant':
      return CubeTransparentIcon; // Keeping CubeTransparentIcon as placeholder
    case 'attraction':
      return GlobeAltIcon;
    case 'adventure':
      return SunIcon;
    case 'wellness':
      return HandRaisedIcon;
    case 'luxury':
      return SparklesIcon;
    case 'workshop':
      return CameraIcon;
    default:
      switch (lowerCaseCategory) {
        case 'culture & arts':
          return BookOpenIcon;
        case 'food & dining':
          return CubeTransparentIcon; // Keeping CubeTransparentIcon as placeholder
        case 'historical site':
          return GlobeAltIcon;
        default:
          return ArrowLongRightIcon;
      }
  }
};

const TaleCard: React.FC<TaleCardProps> = ({ tale }) => { // REMOVED isSaved, onToggleSave from props
  const IconComponent = getCategoryIcon(tale.type, tale.category);

  // <<< NEW: Get saved state and toggle function from useSavedTales
  const { savedTaleIds, onToggleSave, loadingSavedTales, savedTalesError } = useSavedTales();
  const isSaved = savedTaleIds.has(tale.id); // <<< NEW: Check if this tale is saved

  // Determine if the save button should be disabled
  // It should be disabled if saved tales are still loading or if there's a save error
  const isSaveDisabled = loadingSavedTales || savedTalesError !== null; // <<< NEW: Disable logic

  // Updated handleAddClick to use onToggleSave callback
  const handleAddClick = async (e: React.MouseEvent) => { // <<< Changed to async
    e.preventDefault(); // Prevent navigating to the Link
    e.stopPropagation(); // Stop event from bubbling up to the Link
    console.log(`Toggling save for tale: ${tale.title} (ID: ${tale.id}). New state: ${!isSaved ? 'Saved' : 'Unsaved'}`);
    await onToggleSave(tale.id); // <<< Call the passed-in function with the tale's ID
  };

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

  // Determine which icon to show based on isSaved prop
  const SaveIcon = isSaved ? CheckCircleIcon : PlusCircleIcon;
  const saveButtonClasses = `
    absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 z-10
    ${isSaved ? 'bg-talea-mint text-white hover:bg-talea-dark-green focus:ring-talea-dark-green' : 'bg-white bg-opacity-90 text-talea-mint hover:bg-talea-mint hover:text-white focus:ring-talea-mint'}
    ${isSaveDisabled ? 'opacity-50 cursor-not-allowed' : ''} {/* <<< NEW: Add disabled styling */}
  `;

  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg group border border-talea-dun relative">
        <div className="relative w-full h-48">
          <Image
            src={tale.imageUrl}
            alt={tale.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-xl group-hover:brightness-90 transition-brightness duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-t-xl"></div>

          {/* Add/Saved Button - Now dynamic based on isSaved prop */}
          <button
            onClick={handleAddClick}
            disabled={isSaveDisabled} // <<< NEW: Disable button when not ready
            className={saveButtonClasses} // Use dynamic classes
            aria-label={isSaved ? "Remove from list" : "Add to list"}
          >
            <SaveIcon className="h-6 w-6" /> {/* Use dynamic icon */}
          </button>

          {tale.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-t-xl">
              <PlayCircleIcon className="h-16 w-16 text-white opacity-80" />
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center text-sm text-talea-dark-slate-gray mb-2">
            {IconComponent && (
              <IconComponent className="h-5 w-5 mr-2 text-talea-rose-taupe" />
            )}
            <span className="font-medium">{tale.category ? tale.category : tale.type.charAt(0).toUpperCase() + tale.type.slice(1)}</span>
          </div>

          <h3 className="text-xl font-semibold mb-2 truncate group-hover:text-talea-mint transition-colors duration-300 text-talea-dark-slate-gray">
            {tale.title}
          </h3>
          <p className="text-sm mb-2 text-talea-dark-slate-gray flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1 text-talea-rose-taupe" />
            {tale.location}
          </p>
          <p className="text-base line-clamp-3 text-talea-dark-slate-gray">{tale.description}</p>

          {/* <<< NEW: Display savedTalesError if any */}
          {savedTalesError && (
            <p className="text-red-500 text-xs mt-2">Error: {savedTalesError}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-talea-dark-slate-gray">
            {tale.rating && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-slate-gray">
                <StarIcon className="h-4 w-4 mr-1 text-yellow-500" />
                <span>{tale.rating}</span>
              </div>
            )}
            {tale.priceRange && (
              <div className="flex items-center mb-1 text-talea-dark-slate-gray">
                <CurrencyDollarIcon className="h-4 w-4 mr-1 text-talea-dark-green" />
                <span>{tale.priceRange}</span>
              </div>
            )}
            {tale.averageCostPerPerson && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-slate-gray">
                <CurrencyDollarIcon className="h-4 w-4 mr-1 text-talea-dark-green" />
                <span>Avg. Cost: {tale.averageCostPerPerson}</span>
              </div>
            )}
            {tale.type === 'hotel' && tale.amenities && tale.amenities.length > 0 && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-slate-gray">
                <WifiIcon className="h-4 w-4 mr-1 text-talea-rose-taupe" />
                <span>{tale.amenities.slice(0, 2).join(', ')}{tale.amenities.length > 2 ? '...' : ''}</span>
              </div>
            )}
            {tale.type === 'hotel' && tale.checkInTime && tale.checkOutTime && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-slate-gray">
                <ClockIcon className="h-4 w-4 mr-1 text-talea-rose-taupe" />
                <span>Check-in: {tale.checkInTime}</span>
              </div>
            )}
            {tale.type === 'event' && tale.date && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-slate-gray">
                <CalendarDaysIcon className="h-4 w-4 mr-1 text-talea-rose-taupe" />
                <span>{tale.date}</span>
              </div>
            )}
            {tale.type === 'event' && tale.capacity && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-slate-gray">
                <TicketIcon className="h-4 w-4 mr-1 text-talea-rose-taupe" />
                <span>Capacity: {tale.capacity}</span>
              </div>
            )}
            {tale.type === 'restaurant' && tale.cuisine && tale.cuisine.length > 0 && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-slate-gray">
                <CubeTransparentIcon className="h-4 w-4 mr-1 text-talea-rose-taupe" />
                <span>{tale.cuisine.slice(0, 1).join(', ')}{tale.cuisine.length > 1 ? '...' : ''}</span>
              </div>
            )}
            {tale.type === 'restaurant' && tale.averageDuration && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-slate-gray">
                <TimeIcon className="h-4 w-4 mr-1 text-talea-rose-taupe" />
                <span>Avg. Visit: {tale.averageDuration}</span>
              </div>
            )}
            {tale.type === 'restaurant' && tale.reservationsRecommended && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-green">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                <span>Reservations Recommended</span>
              </div>
            )}
            {tale.type === 'attraction' && tale.durationRecommended && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-slate-gray">
                <ClockIcon className="h-4 w-4 mr-1 text-talea-rose-taupe" />
                <span>Rec. Duration: {tale.durationRecommended}</span>
              </div>
            )}
            {tale.bestTimeToVisit && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-slate-gray">
                <SunIcon className="h-4 w-4 mr-1 text-talea-rose-taupe" />
                <span>Best: {tale.bestTimeToVisit}</span>
              </div>
            )}
            {tale.tags && tale.tags.length > 0 && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-slate-gray">
                <TagIcon className="h-4 w-4 mr-1 text-talea-rose-taupe" />
                <span>{tale.tags.slice(0, 2).join(', ')}{tale.tags.length > 2 ? '...' : ''}</span>
              </div>
            )}
            {tale.accessibilityOptions && tale.accessibilityOptions.length > 0 && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-green">
                <HandRaisedIcon className="h-4 w-4 mr-1" />
                <span>Accessible</span>
              </div>
            )}
            {tale.type === 'restaurant' && tale.dietaryRestrictions && tale.dietaryRestrictions.length > 0 && (
              <div className="flex items-center mr-3 mb-1 text-talea-dark-green">
                <BookOpenIcon className="h-4 w-4 mr-1" />
                <span>Dietary Options</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaleCard;
