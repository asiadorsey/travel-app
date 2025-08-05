export interface ITale {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  type: 'video' | 'hotel' | 'event' | 'restaurant' | 'attraction' | 'adventure' | 'culture & arts' | 'food & dining' | 'wellness' | 'luxury' | 'workshop';
  category?: string;
  featured?: boolean;
  rating?: number;
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
  reservationsRecommended?: boolean;

  // THESE ARE THE *ONLY* PLACES 'price' and 'personalityType' SHOULD BE
  price?: number;
  personalityType?: string;
} 