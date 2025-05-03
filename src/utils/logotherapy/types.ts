
/**
 * Type definitions for logotherapy module
 */

export interface MemoryEntry {
  content: string;
  type: string;
  timestamp: number;
  importance: number;
}

export interface MessageEntry {
  sender: string;
  content: string;
  timestamp?: number;
}

export type PersonalityMode = 
  | 'curious' 
  | 'empathetic' 
  | 'reflective' 
  | 'direct' 
  | 'analytical' 
  | 'warm' 
  | 'thoughtful' 
  | 'conversational' 
  | 'gentle' 
  | 'grounded' 
  | 'existential'
  | 'meaning-focused'
  | 'warm-social'; // Added this missing personality type

