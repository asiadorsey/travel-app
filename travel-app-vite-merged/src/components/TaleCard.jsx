// src/components/TaleCard.jsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import Heroicons
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
  PlusCircleIcon,
  CheckCircleIcon,
  TagIcon,
  ClockIcon as TimeIcon,
  GiftIcon,
  HeartIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/solid";

import { MapPinIcon as MapPinOutlineIcon } from "@heroicons/react/24/outline";

import { useSavedTales } from "../context/SavedTalesContext.jsx";
import { useTrip } from "../context/TripContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

// Helper to pick the correct icon based on tale type or category
const getCategoryIcon = (type, category) => {
  const lowerCaseType = type?.toLowerCase();
  const lowerCaseCategory = category?.toLowerCase();

  switch (lowerCaseType) {
    case "video":
      return PlayCircleIcon;
    case "hotel":
      return BuildingOfficeIcon;
    case "event":
      return CalendarDaysIcon;
    case "restaurant":
      return CubeTransparentIcon;
    case "attraction":
      return GlobeAltIcon;
    case "adventure":
      return SunIcon;
    case "wellness":
      return HandRaisedIcon;
    case "luxury":
      return SparklesIcon;
    case "workshop":
      return CameraIcon;
    default:
      switch (lowerCaseCategory) {
        case "culture & arts":
          return BookOpenIcon;
        case "food & dining":
          return CubeTransparentIcon;
        case "historical site":
          return GlobeAltIcon;
        default:
          return ArrowLongRightIcon;
      }
  }
};

const TaleCard = ({ tale }) => {
  const IconComponent = getCategoryIcon(tale.type, tale.category);
  const [isHovered, setIsHovered] = useState(false);
  const [showTripSelector, setShowTripSelector] = useState(false);

  // Context hooks
  const { isTaleSaved, saveTale, removeSavedTale } = useSavedTales();
  const { trips, addExperienceToTrip } = useTrip();
  const { success, error: showError } = useToast();

  // Check if tale is saved
  const saved = isTaleSaved(tale.id);

  // Handle save/unsave
  const handleToggleSave = async () => {
    if (saved) {
      const success = await removeSavedTale(tale.id);
      if (success) {
        success("Tale removed from saved");
      }
    } else {
      const success = await saveTale(tale);
      if (success) {
        success("Tale saved successfully!");
      }
    }
  };

  // Handle adding to trip
  const handleAddToTrip = async (tripId) => {
    const experience = {
      taleId: tale.id,
      title: tale.title,
      location: tale.location,
      imageUrl: tale.imageUrl,
      type: tale.type,
      priority: 'recommended',
      estimatedDuration: 2,
      notes: '',
      tags: tale.tags || []
    };

    const success = await addExperienceToTrip(tripId, experience);
    if (success) {
      success("Added to trip!");
      setShowTripSelector(false);
    }
  };

  // Format price range
  const formatPriceRange = (priceRange) => {
    if (!priceRange) return '';
    if (priceRange === 'Free') return 'Free';
    if (priceRange === '$') return 'Budget';
    if (priceRange === '$$') return 'Moderate';
    if (priceRange === '$$$') return 'Expensive';
    if (priceRange === '$$$$') return 'Luxury';
    return priceRange;
  };

  // Get rating display
  const getRatingDisplay = () => {
    if (!tale.rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="text-sm font-medium text-gray-700">{tale.rating}</span>
      </div>
    );
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      layout
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={tale.imageUrl}
          alt={tale.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Type Badge */}
        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <IconComponent className="w-3 h-3" />
          {tale.type}
        </div>

        {/* Featured Badge */}
        {tale.featured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <SparklesIcon className="w-3 h-3" />
            Featured
          </div>
        )}

        {/* Video Play Button */}
        {tale.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <PlayCircleIcon className="w-16 h-16 text-white drop-shadow-lg" />
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleSave();
          }}
          className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110"
        >
          {saved ? (
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
            {tale.title}
          </h3>
          {getRatingDisplay()}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {tale.description}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPinIcon className="w-4 h-4" />
          <span>{tale.location}</span>
        </div>

        {/* Tags */}
        {tale.tags && tale.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tale.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {tale.tags.length > 3 && (
              <span className="text-gray-400 text-xs">+{tale.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="flex items-center gap-1 text-gray-600">
            <CurrencyDollarIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {formatPriceRange(tale.priceRange)}
            </span>
          </div>

          {/* Add to Trip Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTripSelector(!showTripSelector);
            }}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <PlusCircleIcon className="w-4 h-4" />
            Add to Trip
          </button>
        </div>

        {/* Trip Selector */}
        <AnimatePresence>
          {showTripSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-gray-200"
            >
              <div className="space-y-2">
                {trips.length === 0 ? (
                  <p className="text-sm text-gray-500">No trips created yet</p>
                ) : (
                  trips.map((trip) => (
                    <button
                      key={trip.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToTrip(trip.id);
                      }}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="font-medium text-sm">{trip.title}</div>
                      <div className="text-xs text-gray-500">
                        {trip.destination} • {trip.days?.length || 0} days
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TaleCard;
