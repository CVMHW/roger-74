/**
 * Patient Profile Memory System
 * 
 * Maintains persistent information about the patient
 * Includes demographic data, preferences, significant events, etc.
 */

import { MemoryItem } from '../types';

// Patient profile structure
export interface PatientProfile {
  dominantTopics: Record<string, number>;
  emotionalPatterns: Record<string, number>;
  personalityTraits: Record<string, number>;
  preferences: Record<string, any>;
  significantEvents: MemoryItem[];
  lastUpdated: number;
}

// In-memory storage for patient profile
let patientProfileStore: PatientProfile = {
  dominantTopics: {},
  emotionalPatterns: {},
  personalityTraits: {},
  preferences: {},
  significantEvents: [],
  lastUpdated: Date.now()
};

/**
 * Update topic frequency in patient profile
 */
export const updatePatientTopics = (topics: string[]): void => {
  topics.forEach(topic => {
    patientProfileStore.dominantTopics[topic] = 
      (patientProfileStore.dominantTopics[topic] || 0) + 1;
  });
  
  patientProfileStore.lastUpdated = Date.now();
  persistPatientProfile();
};

/**
 * Update emotion frequency in patient profile
 */
export const updatePatientEmotions = (emotions: string[]): void => {
  emotions.forEach(emotion => {
    patientProfileStore.emotionalPatterns[emotion] = 
      (patientProfileStore.emotionalPatterns[emotion] || 0) + 1;
  });
  
  patientProfileStore.lastUpdated = Date.now();
  persistPatientProfile();
};

/**
 * Add a significant event to patient profile
 */
export const addSignificantEvent = (memoryItem: MemoryItem): void => {
  patientProfileStore.significantEvents.unshift(memoryItem);
  
  // Keep only most significant events (max 25)
  if (patientProfileStore.significantEvents.length > 25) {
    patientProfileStore.significantEvents = patientProfileStore.significantEvents.slice(0, 25);
  }
  
  patientProfileStore.lastUpdated = Date.now();
  persistPatientProfile();
};

/**
 * Update patient preference
 */
export const updatePatientPreference = (key: string, value: any): void => {
  patientProfileStore.preferences[key] = value;
  patientProfileStore.lastUpdated = Date.now();
  persistPatientProfile();
};

/**
 * Update personality trait
 */
export const updatePersonalityTrait = (trait: string, value: number = 1): void => {
  patientProfileStore.personalityTraits[trait] = 
    (patientProfileStore.personalityTraits[trait] || 0) + value;
  
  patientProfileStore.lastUpdated = Date.now();
  persistPatientProfile();
};

/**
 * Get complete patient profile
 */
export const getPatientProfile = (): PatientProfile => {
  return { ...patientProfileStore };
};

/**
 * Get top topics from patient profile
 */
export const getTopPatientTopics = (limit: number = 3): string[] => {
  return Object.entries(patientProfileStore.dominantTopics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([topic]) => topic);
};

/**
 * Get dominant emotions from patient profile
 */
export const getDominantEmotions = (limit: number = 3): string[] => {
  return Object.entries(patientProfileStore.emotionalPatterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([emotion]) => emotion);
};

/**
 * Persist patient profile to localStorage
 */
const persistPatientProfile = (): void => {
  try {
    localStorage.setItem('rogerPatientProfile', JSON.stringify(patientProfileStore));
    console.log("PATIENT PROFILE: Successfully persisted to localStorage");
  } catch (error) {
    console.error("PATIENT PROFILE: Failed to persist to localStorage", error);
  }
};

/**
 * Clear patient profile
 */
export const clearPatientProfile = (): void => {
  patientProfileStore = {
    dominantTopics: {},
    emotionalPatterns: {},
    personalityTraits: {},
    preferences: {},
    significantEvents: [],
    lastUpdated: Date.now()
  };
  
  try {
    localStorage.removeItem('rogerPatientProfile');
  } catch (error) {
    console.error("PATIENT PROFILE: Failed to clear from localStorage", error);
  }
};

/**
 * Initialize patient profile from localStorage
 */
export const initializePatientProfile = (): boolean => {
  try {
    const storedProfile = localStorage.getItem('rogerPatientProfile');
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      patientProfileStore = parsedProfile;
      console.log("PATIENT PROFILE: Initialized from localStorage");
      return true;
    }
    return false;
  } catch (error) {
    console.error("PATIENT PROFILE: Failed to initialize from localStorage", error);
    return false;
  }
};

/**
 * Get system status
 */
export const getPatientProfileStatus = () => {
  return {
    active: true,
    topicsCount: Object.keys(patientProfileStore.dominantTopics).length,
    emotionsCount: Object.keys(patientProfileStore.emotionalPatterns).length,
    significantEventsCount: patientProfileStore.significantEvents.length,
    lastUpdated: patientProfileStore.lastUpdated
  };
};

// Initialize on module load
initializePatientProfile();
