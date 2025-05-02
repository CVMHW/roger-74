
/**
 * Ohio Context Response Generator
 * 
 * Generates context-aware responses based on Ohio-specific references.
 */

import { OhioReferences, OhioContextStrategy } from './references';

/**
 * Generates a context-aware response strategy based on Ohio references
 */
export const generateOhioContextResponse = (references: OhioReferences): OhioContextStrategy => {
  // Default strategy
  const strategy: OhioContextStrategy = {
    opener: '',
    shouldIncludeLocalReference: false,
    shouldIncludeMentalHealthConnection: false
  };
  
  // If no Ohio references, return empty strategy
  if (!references.hasOhioReference) {
    return strategy;
  }
  
  // Determine if we should make a local connection
  strategy.shouldIncludeLocalReference = true;
  
  // Decide whether to include mental health connection based on relevance
  strategy.shouldIncludeMentalHealthConnection = Math.random() > 0.5; // 50% chance
  
  // Generate appropriate opener based on detected references
  if (references.detectedLocations.length > 0) {
    const location = references.detectedLocations[0];
    strategy.opener = `I notice you mentioned ${location}. `;
  } 
  else if (references.detectedCulturalReferences.length > 0) {
    const culturalRef = references.detectedCulturalReferences[0];
    strategy.opener = `${culturalRef} is definitely a big part of Cleveland culture! `;
  }
  else if (references.detectedChildReferences.length > 0) {
    const childRef = references.detectedChildReferences[0];
    strategy.opener = `The ${childRef} is a fun spot in Cleveland! `;
  }
  else if (references.detectedNewcomerReferences.length > 0) {
    const newcomerRef = references.detectedNewcomerReferences[0];
    strategy.opener = `Cleveland has great ${newcomerRef} resources to help people feel welcome. `;
  }
  
  return strategy;
};
