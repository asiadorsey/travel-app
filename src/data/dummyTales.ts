// src/data/dummyTales.ts

// ITale Interface Definition
export interface ITale {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  type: 'video' | 'hotel' | 'event' | 'restaurant' | 'attraction' | 'adventure' | 'culture & arts' | 'food & dining' | 'wellness' | 'luxury' | 'workshop';
  category?: string;
  featured?: boolean;
  rating?: number; // Numeric rating
  priceRange?: string;

  // Comprehensive list of specific properties found in dummy data
  videoUrl?: string;
  starRating?: number;
  tags?: string[];
  time?: string;
  duration?: string;
  amenities?: string[];
  date?: string;
  averageDuration?: string;
  cuisine?: string[];
  bestTimeToVisit?: string;
  checkInTime?: string;
  capacity?: number;
  durationRecommended?: string;
  checkOutTime?: string;
  accessibilityOptions?: string[];
  dietaryRestrictions?: string[];
  averageCostPerPerson?: string;
  reservationsRecommended?: boolean; // <<< NEWLY ADDED

  // THESE ARE THE *ONLY* PLACES 'price' and 'personalityType' SHOULD BE
  price?: number; // Optional: for numerical price comparison, if available
  personalityType?: string; // Optional: for personality-based filtering
}

// Import all tale arrays
import { videos } from './tales/videos';
import { hotels } from './tales/hotels';
import { events } from './tales/events';
import { restaurants } from './tales/restaurants';
import { attractions } from './tales/attractions';

// Combine all tales into a single array
export const dummyTales: ITale[] = [
  ...videos,
  ...hotels,
  ...events,
  ...restaurants,
  ...attractions
];