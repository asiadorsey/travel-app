/**
 * @typedef {Object} ITale
 * @property {string} id - Unique identifier
 * @property {string} title - Tale title
 * @property {string} description - Tale description
 * @property {string} imageUrl - Image URL
 * @property {string} location - Location
 * @property {'video' | 'hotel' | 'event' | 'restaurant' | 'attraction' | 'adventure' | 'culture & arts' | 'food & dining' | 'wellness' | 'luxury' | 'workshop'} type - Tale type
 * @property {string} [category] - Optional category
 * @property {boolean} [featured] - Whether the tale is featured
 * @property {number} [rating] - Optional rating
 * @property {string} [priceRange] - Optional price range
 * @property {string} [videoUrl] - Optional video URL
 * @property {number} [starRating] - Optional star rating
 * @property {string[]} [tags] - Optional tags array
 * @property {string} [time] - Optional time
 * @property {string} [duration] - Optional duration
 * @property {string[]} [amenities] - Optional amenities array
 * @property {string} [date] - Optional date
 * @property {string} [averageDuration] - Optional average duration
 * @property {string[]} [cuisine] - Optional cuisine array
 * @property {string} [bestTimeToVisit] - Optional best time to visit
 * @property {string} [checkInTime] - Optional check-in time
 * @property {number} [capacity] - Optional capacity
 * @property {string} [durationRecommended] - Optional recommended duration
 * @property {string} [checkOutTime] - Optional check-out time
 * @property {string[]} [accessibilityOptions] - Optional accessibility options
 * @property {string[]} [dietaryRestrictions] - Optional dietary restrictions
 * @property {string} [averageCostPerPerson] - Optional average cost per person
 * @property {boolean} [reservationsRecommended] - Optional reservations recommendation
 * @property {number} [price] - Optional price (ONLY PLACE 'price' SHOULD BE)
 * @property {string} [personalityType] - Optional personality type (ONLY PLACE 'personalityType' SHOULD BE)
 */

// Export the type for use in other files
export const TaleTypes = {
  // This object can be used for runtime type checking if needed
  isTale: (obj) => obj && typeof obj.id === 'string' && typeof obj.title === 'string',
  isValidType: (type) => ['video', 'hotel', 'event', 'restaurant', 'attraction', 'adventure', 'culture & arts', 'food & dining', 'wellness', 'luxury', 'workshop'].includes(type)
};
