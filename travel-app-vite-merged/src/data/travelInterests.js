// src/data/travelInterests.js

export const TRAVEL_INTERESTS = [
  // Food & Dining
  { id: "foodie", name: "Foodie", category: "interest", icon: "🍽️", description: "Love exploring local cuisine and food culture" },
  { id: "wine-tasting", name: "Wine Tasting", category: "interest", icon: "🍷", description: "Enjoy vineyard tours and wine experiences" },
  { id: "street-food", name: "Street Food", category: "interest", icon: "🌮", description: "Hunt for the best local street food" },

  // Adventure & Outdoor
  { id: "adventure-seeker", name: "Adventure Seeker", category: "interest", icon: "🏃", description: "Thrives on outdoor activities and adrenaline" },
  { id: "hiking", name: "Hiking", category: "interest", icon: "🥾", description: "Love mountain trails and nature walks" },
  { id: "water-sports", name: "Water Sports", category: "interest", icon: "🏄", description: "Surfing, diving, and aquatic adventures" },

  // Culture & Arts
  { id: "art-lover", name: "Art Lover", category: "interest", icon: "🎨", description: "Appreciates galleries, museums, and creative spaces" },
  { id: "history-buff", name: "History Buff", category: "interest", icon: "🏛️", description: "Fascinated by historical sites and stories" },
  { id: "music-festivals", name: "Music Festivals", category: "interest", icon: "🎵", description: "Enjoys live music and festival experiences" },

  // Lifestyle & Preferences
  { id: "luxury-travel", name: "Luxury Travel", category: "preference", icon: "✨", description: "Prefers high-end accommodations and experiences" },
  { id: "budget-conscious", name: "Budget Travel", category: "preference", icon: "💰", description: "Finds amazing experiences on a budget" },
  { id: "solo-traveler", name: "Solo Traveler", category: "preference", icon: "🎒", description: "Enjoys independent travel adventures" },
  { id: "group-traveler", name: "Group Traveler", category: "preference", icon: "👥", description: "Prefers traveling with others" },

  // Photography & Documentation
  { id: "photography", name: "Photography", category: "interest", icon: "📸", description: "Captures stunning travel moments" },
  { id: "instagram-worthy", name: "Instagram Spots", category: "interest", icon: "📱", description: "Seeks the most photogenic locations" },
];

// Personality types for matching system
export const PERSONALITY_TYPES = [
  {
    id: "explorer",
    name: "The Explorer",
    description: "Adventurous and curious, always seeking new experiences",
    interests: ["adventure-seeker", "hiking", "water-sports", "photography"],
    color: "blue"
  },
  {
    id: "culture-vulture",
    name: "The Culture Vulture",
    description: "Deeply interested in history, arts, and local traditions",
    interests: ["art-lover", "history-buff", "music-festivals"],
    color: "purple"
  },
  {
    id: "food-enthusiast",
    name: "The Food Enthusiast",
    description: "Passionate about culinary experiences and local flavors",
    interests: ["foodie", "wine-tasting", "street-food"],
    color: "orange"
  },
  {
    id: "luxury-seeker",
    name: "The Luxury Seeker",
    description: "Values premium experiences and high-end accommodations",
    interests: ["luxury-travel", "wine-tasting"],
    color: "gold"
  },
  {
    id: "budget-adventurer",
    name: "The Budget Adventurer",
    description: "Finds amazing experiences without breaking the bank",
    interests: ["budget-conscious", "street-food", "hiking"],
    color: "green"
  },
  {
    id: "social-traveler",
    name: "The Social Traveler",
    description: "Enjoys group experiences and meeting new people",
    interests: ["group-traveler", "music-festivals", "foodie"],
    color: "pink"
  },
  {
    id: "solo-explorer",
    name: "The Solo Explorer",
    description: "Independent and self-reliant in their travels",
    interests: ["solo-traveler", "photography", "hiking"],
    color: "teal"
  }
];

// Helper function to match personality type based on interests
export const getPersonalityType = (selectedInterests) => {
  if (!selectedInterests || selectedInterests.length === 0) {
    return PERSONALITY_TYPES[0]; // Default to Explorer
  }

  const scores = PERSONALITY_TYPES.map(personality => {
    const matchingInterests = personality.interests.filter(interest => 
      selectedInterests.includes(interest)
    );
    return {
      personality,
      score: matchingInterests.length
    };
  });

  // Sort by score (highest first) and return the best match
  scores.sort((a, b) => b.score - a.score);
  return scores[0].personality;
};
