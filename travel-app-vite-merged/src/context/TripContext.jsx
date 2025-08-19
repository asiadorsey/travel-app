// src/context/TripContext.jsx
"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useFirebase } from "./FirebaseContext.jsx";

// Create the context
const TripContext = createContext(null);

// Custom hook to use the Trip context
export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
};

// Provider component
export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { currentUser } = useFirebase();

  // Load trips from localStorage on mount
  useEffect(() => {
    const loadTrips = () => {
      try {
        const stored = localStorage.getItem("userTrips");
        if (stored) {
          const parsed = JSON.parse(stored);
          setTrips(parsed);
          
          // Restore current trip if it exists
          const currentTripId = localStorage.getItem("currentTripId");
          if (currentTripId) {
            const trip = parsed.find(t => t.id === currentTripId);
            if (trip) {
              setCurrentTrip(trip);
            }
          }
        }
      } catch (error) {
        console.error("Error loading trips:", error);
        setError("Failed to load trips");
      }
    };

    if (currentUser) {
      loadTrips();
    }
  }, [currentUser]);

  // Save trips to localStorage whenever trips change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("userTrips", JSON.stringify(trips));
    }
  }, [trips, currentUser]);

  // Save current trip ID to localStorage
  useEffect(() => {
    if (currentTrip) {
      localStorage.setItem("currentTripId", currentTrip.id);
    } else {
      localStorage.removeItem("currentTripId");
    }
  }, [currentTrip]);

  // Create a new trip
  const createTrip = useCallback((tripData) => {
    if (!currentUser) {
      setError("You must be logged in to create trips");
      return null;
    }

    try {
      const newTrip = {
        id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...tripData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        days: [],
        unassignedExperiences: [],
        isPublic: false,
        tags: tripData.tags || [],
        budget: tripData.budget || 0
      };

      setTrips(prev => [...prev, newTrip]);
      setCurrentTrip(newTrip);
      setError(null);
      return newTrip;
    } catch (error) {
      setError("Failed to create trip");
      return null;
    }
  }, [currentUser]);

  // Update a trip
  const updateTrip = useCallback((tripId, updates) => {
    try {
      setTrips(prev => prev.map(trip => 
        trip.id === tripId 
          ? { ...trip, ...updates, updatedAt: new Date().toISOString() }
          : trip
      ));

      if (currentTrip?.id === tripId) {
        setCurrentTrip(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
      }

      setError(null);
      return true;
    } catch (error) {
      setError("Failed to update trip");
      return false;
    }
  }, [currentTrip]);

  // Delete a trip
  const deleteTrip = useCallback((tripId) => {
    try {
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      
      if (currentTrip?.id === tripId) {
        setCurrentTrip(null);
      }

      setError(null);
      return true;
    } catch (error) {
      setError("Failed to delete trip");
      return false;
    }
  }, [currentTrip]);

  // Select a trip
  const selectTrip = useCallback((tripId) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      setCurrentTrip(trip);
      setError(null);
      return true;
    } else {
      setError("Trip not found");
      return false;
    }
  }, [trips]);

  // Add experience to trip
  const addExperienceToTrip = useCallback((tripId, experience) => {
    try {
      const updatedTrips = trips.map(trip => {
        if (trip.id === tripId) {
          const newExperience = {
            id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...experience,
            addedAt: new Date().toISOString()
          };

          return {
            ...trip,
            unassignedExperiences: [...trip.unassignedExperiences, newExperience],
            updatedAt: new Date().toISOString()
          };
        }
        return trip;
      });

      setTrips(updatedTrips);
      
      if (currentTrip?.id === tripId) {
        setCurrentTrip(updatedTrips.find(t => t.id === tripId));
      }

      setError(null);
      return true;
    } catch (error) {
      setError("Failed to add experience to trip");
      return false;
    }
  }, [trips, currentTrip]);

  // Remove experience from trip
  const removeExperienceFromTrip = useCallback((tripId, experienceId) => {
    try {
      const updatedTrips = trips.map(trip => {
        if (trip.id === tripId) {
          return {
            ...trip,
            unassignedExperiences: trip.unassignedExperiences.filter(exp => exp.id !== experienceId),
            days: trip.days.map(day => ({
              ...day,
              experiences: day.experiences.filter(exp => exp.id !== experienceId)
            })),
            updatedAt: new Date().toISOString()
          };
        }
        return trip;
      });

      setTrips(updatedTrips);
      
      if (currentTrip?.id === tripId) {
        setCurrentTrip(updatedTrips.find(t => t.id === tripId));
      }

      setError(null);
      return true;
    } catch (error) {
      setError("Failed to remove experience from trip");
      return false;
    }
  }, [trips, currentTrip]);

  // Move experience between days
  const moveExperience = useCallback((tripId, experienceId, fromDay, toDay, timeSlot) => {
    try {
      const updatedTrips = trips.map(trip => {
        if (trip.id === tripId) {
          // Find the experience
          let experience = null;
          
          // Remove from source day
          const updatedDays = trip.days.map(day => {
            if (day.dayNumber === fromDay) {
              const expIndex = day.experiences.findIndex(exp => exp.id === experienceId);
              if (expIndex !== -1) {
                experience = { ...day.experiences[expIndex] };
                return {
                  ...day,
                  experiences: day.experiences.filter(exp => exp.id !== experienceId)
                };
              }
            }
            return day;
          });

          // Add to target day
          if (experience) {
            const targetDayIndex = updatedDays.findIndex(day => day.dayNumber === toDay);
            if (targetDayIndex !== -1) {
              updatedDays[targetDayIndex] = {
                ...updatedDays[targetDayIndex],
                experiences: [...updatedDays[targetDayIndex].experiences, { ...experience, timeSlot }]
              };
            }
          }

          return {
            ...trip,
            days: updatedDays,
            updatedAt: new Date().toISOString()
          };
        }
        return trip;
      });

      setTrips(updatedTrips);
      
      if (currentTrip?.id === tripId) {
        setCurrentTrip(updatedTrips.find(t => t.id === tripId));
      }

      setError(null);
      return true;
    } catch (error) {
      setError("Failed to move experience");
      return false;
    }
  }, [trips, currentTrip]);

  // Update experience details
  const updateExperience = useCallback((tripId, experienceId, updates) => {
    try {
      const updatedTrips = trips.map(trip => {
        if (trip.id === tripId) {
          // Update in unassigned experiences
          let updatedUnassigned = trip.unassignedExperiences.map(exp => 
            exp.id === experienceId ? { ...exp, ...updates } : exp
          );

          // Update in days
          const updatedDays = trip.days.map(day => ({
            ...day,
            experiences: day.experiences.map(exp => 
              exp.id === experienceId ? { ...exp, ...updates } : exp
            )
          }));

          return {
            ...trip,
            unassignedExperiences: updatedUnassigned,
            days: updatedDays,
            updatedAt: new Date().toISOString()
          };
        }
        return trip;
      });

      setTrips(updatedTrips);
      
      if (currentTrip?.id === tripId) {
        setCurrentTrip(updatedTrips.find(t => t.id === tripId));
      }

      setError(null);
      return true;
    } catch (error) {
      setError("Failed to update experience");
      return false;
    }
  }, [trips, currentTrip]);

  const value = {
    trips,
    currentTrip,
    isLoading,
    error,
    createTrip,
    updateTrip,
    deleteTrip,
    selectTrip,
    addExperienceToTrip,
    removeExperienceFromTrip,
    moveExperience,
    updateExperience,
  };

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  );
};
