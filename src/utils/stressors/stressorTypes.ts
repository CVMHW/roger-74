
/**
 * Stressor Types
 * 
 * Defines the types and categories of stressors that Roger can recognize
 */

// Main stressor categories
export type StressorCategory = 
  | 'academic'
  | 'social'
  | 'family'
  | 'health'
  | 'safety'
  | 'personal'
  | 'future'
  | 'environmental'
  | 'other';

// Age ranges for stressors
export type AgeRange = 
  | 'child' // 9-12
  | 'early-teen' // 13-14
  | 'mid-teen' // 15-16
  | 'late-teen' // 17-18
  | 'young-adult' // 19-24
  | 'adult' // 25+
  | 'all'; // All ages

// Stressor severity levels
export type SeverityLevel = 
  | 'mild'
  | 'moderate'
  | 'severe';

// Stressor frequency levels
export type FrequencyLevel =
  | 'rare'
  | 'occasional'
  | 'common'
  | 'very-common';

// Stressor data structure
export interface Stressor {
  id: string;
  name: string;
  category: StressorCategory;
  description: string;
  ageRanges: AgeRange[];
  severity: SeverityLevel;
  frequency: FrequencyLevel;
  keywords: string[];
  relatedStressors?: string[]; // IDs of related stressors
  factSheet?: string; // Brief facts about this stressor
  commonResponses?: string[]; // How patients might express this stressor
}

// Detected stressor in user message
export interface DetectedStressor {
  stressor: Stressor;
  confidence: number; // 0-1 scale of detection confidence
  keywords: string[]; // Matched keywords
  intensity?: SeverityLevel; // Detected intensity in this instance
}

