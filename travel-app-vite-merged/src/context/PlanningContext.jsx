// src/context/PlanningContext.jsx
"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useReducer,
} from "react";
import { useTrip } from "./TripContext.jsx";

// Create the context
const PlanningContext = createContext(null);

// Custom hook to use the Planning context
export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error("usePlanning must be used within a PlanningProvider");
  }
  return context;
};

// Planning state reducer
const planningReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PLANNING_MODE':
      return { ...state, isPlanning: action.payload };
    
    case 'SET_CURRENT_TRIP':
      return { ...state, currentTripId: action.payload };
    
    case 'SET_SELECTED_EXPERIENCE':
      return { ...state, selectedExperience: action.payload };
    
    case 'SET_SELECTED_DAY':
      return { ...state, selectedDay: action.payload };
    
    case 'UPDATE_DAYS':
      return { ...state, days: action.payload };
    
    case 'UPDATE_UNASSIGNED':
      return { ...state, unassignedExperiences: action.payload };
    
    case 'ADD_DAY':
      return { 
        ...state, 
        days: [...state.days, action.payload].sort((a, b) => a.dayNumber - b.dayNumber)
      };
    
    case 'REMOVE_DAY':
      return { 
        ...state, 
        days: state.days.filter(day => day.dayNumber !== action.payload)
      };
    
    case 'UPDATE_DAY':
      return {
        ...state,
        days: state.days.map(day => 
          day.dayNumber === action.payload.dayNumber 
            ? { ...day, ...action.payload.updates }
            : day
        )
      };
    
    case 'MOVE_EXPERIENCE':
      const { experienceId: moveExpId, fromDay, toDay, timeSlot: moveTimeSlot } = action.payload;
      
      // Remove from source
      let updatedDays = state.days.map(day => {
        if (day.dayNumber === fromDay) {
          return {
            ...day,
            experiences: day.experiences.filter(exp => exp.id !== moveExpId)
          };
        }
        return day;
      });
      
      // Add to target
      if (toDay !== 'unassigned') {
        const targetDayIndex = updatedDays.findIndex(day => day.dayNumber === toDay);
        if (targetDayIndex !== -1) {
          const experience = state.days
            .find(day => day.dayNumber === fromDay)
            ?.experiences.find(exp => exp.id === moveExpId);
          
          if (experience) {
            updatedDays[targetDayIndex] = {
              ...updatedDays[targetDayIndex],
              experiences: [...updatedDays[targetDayIndex].experiences, { ...experience, timeSlot: moveTimeSlot }]
            };
          }
        }
      }
      
      return { ...state, days: updatedDays };
    
    case 'ADD_EXPERIENCE_TO_DAY':
      const { dayNumber: addDayNumber, experience: addExp, timeSlot: addTimeSlot } = action.payload;
      
      return {
        ...state,
        days: state.days.map(day => 
          day.dayNumber === addDayNumber
            ? { ...day, experiences: [...day.experiences, { ...addExp, timeSlot: addTimeSlot }] }
            : day
        )
      };
    
    case 'REMOVE_EXPERIENCE_FROM_DAY':
      const { dayNumber: removeDayNumber, experienceId: removeExpId } = action.payload;
      
      return {
        ...state,
        days: state.days.map(day => 
          day.dayNumber === removeDayNumber
            ? { ...day, experiences: day.experiences.filter(exp => exp.id !== removeExpId) }
            : day
        )
      };
    
    case 'REORDER_EXPERIENCES':
      const { dayNumber: reorderDayNumber, experienceIds } = action.payload;
      
      return {
        ...state,
        days: state.days.map(day => 
          day.dayNumber === reorderDayNumber
            ? { 
                ...day, 
                experiences: experienceIds.map(id => 
                  day.experiences.find(exp => exp.id === id)
                ).filter(Boolean)
              }
            : day
        )
      };
    
    case 'RESET_PLANNING':
      return {
        currentTripId: null,
        isPlanning: false,
        unassignedExperiences: [],
        days: [],
        selectedExperience: null,
        selectedDay: null
      };
    
    default:
      return state;
  }
};

// Initial planning state
const initialPlanningState = {
  currentTripId: null,
  isPlanning: false,
  unassignedExperiences: [],
  days: [],
  selectedExperience: null,
  selectedDay: null
};

// Provider component
export const PlanningProvider = ({ children }) => {
  const [planningState, dispatch] = useReducer(planningReducer, initialPlanningState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { currentTrip } = useTrip();

  // Sync planning state with current trip
  useEffect(() => {
    if (currentTrip) {
      dispatch({ type: 'SET_CURRENT_TRIP', payload: currentTrip.id });
      
      // Initialize days if they don't exist
      if (currentTrip.days && currentTrip.days.length > 0) {
        dispatch({ type: 'UPDATE_DAYS', payload: currentTrip.days });
      } else {
        // Create default days based on trip duration
        const startDate = new Date(currentTrip.startDate);
        const endDate = new Date(currentTrip.endDate);
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        const defaultDays = Array.from({ length: daysDiff }, (_, index) => ({
          dayNumber: index + 1,
          date: new Date(startDate.getTime() + (index * 24 * 60 * 60 * 1000)),
          title: `Day ${index + 1}`,
          notes: '',
          experiences: [],
          budget: 0,
          isExpanded: true
        }));
        
        dispatch({ type: 'UPDATE_DAYS', payload: defaultDays });
      }
      
      // Set unassigned experiences
      if (currentTrip.unassignedExperiences) {
        dispatch({ type: 'UPDATE_UNASSIGNED', payload: currentTrip.unassignedExperiences });
      }
    } else {
      dispatch({ type: 'RESET_PLANNING' });
    }
  }, [currentTrip]);

  // Start planning mode
  const startPlanning = useCallback(() => {
    if (!currentTrip) {
      setError("No trip selected for planning");
      return false;
    }
    
    dispatch({ type: 'SET_PLANNING_MODE', payload: true });
    setError(null);
    return true;
  }, [currentTrip]);

  // Stop planning mode
  const stopPlanning = useCallback(() => {
    dispatch({ type: 'SET_PLANNING_MODE', payload: false });
    setError(null);
  }, []);

  // Select an experience
  const selectExperience = useCallback((experience) => {
    dispatch({ type: 'SET_SELECTED_EXPERIENCE', payload: experience });
  }, []);

  // Select a day
  const selectDay = useCallback((dayNumber) => {
    dispatch({ type: 'SET_SELECTED_DAY', payload: dayNumber });
  }, []);

  // Add experience to day
  const addExperienceToDay = useCallback((dayNumber, experience, timeSlot = 'flexible') => {
    dispatch({ 
      type: 'ADD_EXPERIENCE_TO_DAY', 
      payload: { dayNumber, experience, timeSlot } 
    });
    
    // Remove from unassigned
    dispatch({ 
      type: 'UPDATE_UNASSIGNED', 
      payload: planningState.unassignedExperiences.filter(exp => exp.id !== experience.id) 
    });
    
    setError(null);
    return true;
  }, [planningState.unassignedExperiences]);

  // Remove experience from day
  const removeExperienceFromDay = useCallback((dayNumber, experienceId) => {
    // Find the experience to add back to unassigned
    const day = planningState.days.find(d => d.dayNumber === dayNumber);
    const experience = day?.experiences.find(exp => exp.id === experienceId);
    
    if (experience) {
      dispatch({ 
        type: 'UPDATE_UNASSIGNED', 
        payload: [...planningState.unassignedExperiences, experience] 
      });
    }
    
    dispatch({ 
      type: 'REMOVE_EXPERIENCE_FROM_DAY', 
      payload: { dayNumber, experienceId } 
    });
    
    setError(null);
    return true;
  }, [planningState.days, planningState.unassignedExperiences]);

  // Move experience between days
  const moveExperience = useCallback((experienceId, fromDay, toDay, timeSlot) => {
    dispatch({ 
      type: 'MOVE_EXPERIENCE', 
      payload: { experienceId, fromDay, toDay, timeSlot } 
    });
    
    setError(null);
    return true;
  }, []);

  // Reorder experiences within a day
  const reorderExperiences = useCallback((dayNumber, experienceIds) => {
    dispatch({ 
      type: 'REORDER_EXPERIENCES', 
      payload: { dayNumber, experienceIds } 
    });
    
    setError(null);
    return true;
  }, []);

  // Update day details
  const updateDay = useCallback((dayNumber, updates) => {
    dispatch({ 
      type: 'UPDATE_DAY', 
      payload: { dayNumber, updates } 
    });
    
    setError(null);
    return true;
  }, []);

  // Get planning statistics
  const getPlanningStats = useCallback(() => {
    const totalExperiences = planningState.days.reduce((sum, day) => sum + day.experiences.length, 0);
    const unassignedCount = planningState.unassignedExperiences.length;
    const totalDays = planningState.days.length;
    
    return {
      totalExperiences,
      unassignedCount,
      totalDays,
      assignedExperiences: totalExperiences,
      planningProgress: totalDays > 0 ? (totalExperiences / (totalExperiences + unassignedCount)) * 100 : 0
    };
  }, [planningState]);

  const value = {
    ...planningState,
    isLoading,
    error,
    startPlanning,
    stopPlanning,
    selectExperience,
    selectDay,
    addExperienceToDay,
    removeExperienceFromDay,
    moveExperience,
    reorderExperiences,
    updateDay,
    getPlanningStats,
  };

  return (
    <PlanningContext.Provider value={value}>
      {children}
    </PlanningContext.Provider>
  );
};
