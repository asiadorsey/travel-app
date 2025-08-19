/**
 * @typedef {Object} ITripExperience
 * @property {string} id - Unique identifier
 * @property {string} taleId - Associated tale ID
 * @property {string} title - Experience title
 * @property {string} location - Location of the experience
 * @property {string} imageUrl - Image URL for the experience
 * @property {string} type - Type of experience
 * @property {'must-see' | 'recommended' | 'optional'} priority - Priority level
 * @property {number} [estimatedDuration] - Estimated duration in hours
 * @property {string} [notes] - Additional notes
 * @property {string[]} [tags] - Associated tags
 * @property {'morning' | 'afternoon' | 'evening' | 'flexible'} [timeSlot] - Preferred time slot
 * @property {number} [dayAssignment] - Assigned day number
 */

/**
 * @typedef {Object} ITripDay
 * @property {number} dayNumber - Day number in the trip
 * @property {Date} [date] - Specific date for the day
 * @property {string} [title] - Day title or theme
 * @property {string} [notes] - Day-specific notes
 * @property {ITripExperience[]} experiences - Experiences assigned to this day
 * @property {number} [budget] - Budget allocated for this day
 * @property {boolean} isExpanded - Whether the day is expanded in UI
 */

/**
 * @typedef {Object} Trip
 * @property {string} id - Unique trip identifier
 * @property {string} title - Trip title
 * @property {string} [description] - Trip description
 * @property {Date} startDate - Trip start date
 * @property {Date} endDate - Trip end date
 * @property {string} destination - Trip destination
 * @property {ITripDay[]} days - Array of trip days
 * @property {ITripExperience[]} unassignedExperiences - Experiences not yet assigned to days
 * @property {Date} createdAt - Trip creation date
 * @property {Date} updatedAt - Trip last update date
 * @property {string} userId - User ID who owns the trip
 * @property {boolean} isPublic - Whether the trip is public
 * @property {string[]} [tags] - Trip tags
 * @property {number} [budget] - Total trip budget
 */

/**
 * @typedef {Object} TripFormData
 * @property {string} title - Trip title
 * @property {string} [description] - Trip description
 * @property {Date} startDate - Trip start date
 * @property {Date} endDate - Trip end date
 * @property {string} destination - Trip destination
 * @property {string[]} [tags] - Trip tags
 * @property {number} [budget] - Total trip budget
 */

/**
 * @typedef {Object} PlanningExperience
 * @property {string} id - Unique identifier
 * @property {string} taleId - Associated tale ID
 * @property {string} title - Experience title
 * @property {string} location - Location of the experience
 * @property {string} imageUrl - Image URL for the experience
 * @property {string} type - Type of experience
 * @property {'must-see' | 'recommended' | 'optional'} priority - Priority level
 * @property {number} [estimatedDuration] - Estimated duration in hours
 * @property {string} [notes] - Additional notes
 * @property {string[]} [tags] - Associated tags
 * @property {'morning' | 'afternoon' | 'evening' | 'flexible'} [timeSlot] - Preferred time slot
 * @property {number} [dayAssignment] - Assigned day number
 */

/**
 * @typedef {Object} ExperienceWithTale
 * @property {ITripExperience} experience - The trip experience
 * @property {ITale} tale - The associated tale data
 */

/**
 * @typedef {Object} TripDayWithTales
 * @property {ITripDay} day - The trip day
 * @property {ExperienceWithTale[]} experiencesWithTales - Experiences with their tale data
 */

/**
 * @typedef {Object} TripContextType
 * @property {Trip[]} trips - Array of user trips
 * @property {Trip | null} currentTrip - Currently selected trip
 * @property {boolean} isLoading - Loading state
 * @property {string | null} error - Error message
 * @property {function} createTrip - Function to create a new trip
 * @property {function} updateTrip - Function to update a trip
 * @property {function} deleteTrip - Function to delete a trip
 * @property {function} selectTrip - Function to select a trip
 * @property {function} addExperienceToTrip - Function to add experience to trip
 * @property {function} removeExperienceFromTrip - Function to remove experience from trip
 * @property {function} moveExperience - Function to move experience between days
 * @property {function} updateExperience - Function to update experience details
 */

// Export the types for use in other files
export const TripTypes = {
  isTripExperience: (obj) => obj && typeof obj.id === 'string' && typeof obj.title === 'string',
  isTripDay: (obj) => obj && typeof obj.dayNumber === 'number' && Array.isArray(obj.experiences),
  isTrip: (obj) => obj && typeof obj.id === 'string' && typeof obj.title === 'string'
};
