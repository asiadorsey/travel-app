// src/data/index.js - Main data export file

import { videos } from './tales/videos.js';
import { hotels } from './tales/hotels.js';
import { restaurants } from './tales/restaurants.js';
import { TRAVEL_INTERESTS, PERSONALITY_TYPES, getPersonalityType } from './travelInterests.js';

// Combine all tales into a single array
export const allTales = [
  ...videos,
  ...hotels,
  ...restaurants
];

// Export individual tale arrays
export { videos, hotels, restaurants };

// Export travel interests and personality system
export { TRAVEL_INTERESTS, PERSONALITY_TYPES, getPersonalityType };

// Helper function to get tales by type
export const getTalesByType = (type) => {
  return allTales.filter(tale => tale.type === type);
};

// Helper function to get featured tales
export const getFeaturedTales = () => {
  return allTales.filter(tale => tale.featured);
};

// Helper function to get tales by personality type
export const getTalesByPersonality = (personalityType) => {
  return allTales.filter(tale => tale.personalityType === personalityType);
};

// Helper function to search tales
export const searchTales = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return allTales.filter(tale => 
    tale.title.toLowerCase().includes(lowercaseQuery) ||
    tale.description.toLowerCase().includes(lowercaseQuery) ||
    tale.location.toLowerCase().includes(lowercaseQuery) ||
    tale.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
