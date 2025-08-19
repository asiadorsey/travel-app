// Planning-specific types for the new trip planning interface

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
 * @typedef {Object} PlanningDay
 * @property {number} dayNumber - Day number in the trip
 * @property {Date} [date] - Specific date for the day
 * @property {string} [title] - Day title or theme
 * @property {string} [notes] - Day-specific notes
 * @property {PlanningExperience[]} experiences - Experiences assigned to this day
 * @property {number} [budget] - Budget allocated for this day
 * @property {boolean} isExpanded - Whether the day is expanded in UI
 */

/**
 * @typedef {Object} PlanningState
 * @property {string | null} currentTripId - Currently active trip ID
 * @property {boolean} isPlanning - Whether planning mode is active
 * @property {PlanningExperience[]} unassignedExperiences - Experiences not yet assigned to days
 * @property {PlanningDay[]} days - Array of planning days
 * @property {PlanningExperience | null} selectedExperience - Currently selected experience
 * @property {number | null} selectedDay - Currently selected day
 */

/**
 * @typedef {Object} PlanningAction
 * @property {string} type - Action type
 * @property {any} payload - Action payload data
 */

/**
 * @typedef {Object} DropZone
 * @property {string} id - Unique identifier for the drop zone
 * @property {'day' | 'timeSlot' | 'unscheduled'} type - Type of drop zone
 * @property {number} [dayNumber] - Day number for day-type drop zones
 * @property {string} [timeSlot] - Time slot for timeSlot-type drop zones
 * @property {string[]} accepts - Array of accepted item types
 */

/**
 * @typedef {Object} DragItem
 * @property {string} id - Unique identifier for the dragged item
 * @property {'experience'} type - Type of dragged item
 * @property {PlanningExperience} experience - The experience being dragged
 * @property {Object} source - Source location information
 * @property {'day' | 'unscheduled'} source.type - Source type
 * @property {number} [source.dayNumber] - Source day number
 * @property {string} [source.timeSlot] - Source time slot
 */

/**
 * @typedef {Object} PlanningConfig
 * @property {number} maxExperiencesPerDay - Maximum experiences allowed per day
 * @property {('morning' | 'afternoon' | 'evening')[]} defaultTimeSlots - Default time slots
 * @property {boolean} allowFlexibleScheduling - Whether flexible scheduling is allowed
 * @property {number} autoSaveInterval - Auto-save interval in milliseconds
 * @property {number} maxDays - Maximum number of days allowed
 */

// Export the types for use in other files
export const PlanningTypes = {
  // This object can be used for runtime type checking if needed
  isPlanningExperience: (obj) => obj && typeof obj.id === 'string' && typeof obj.title === 'string',
  isPlanningDay: (obj) => obj && typeof obj.dayNumber === 'number' && Array.isArray(obj.experiences),
  isPlanningState: (obj) => obj && typeof obj.isPlanning === 'boolean' && Array.isArray(obj.days)
};
