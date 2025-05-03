
/**
 * Type definitions for emotional attunement system
 */

export interface EmotionInfo {
  hasEmotion: boolean;
  primaryEmotion: string | null;
  intensity: 'low' | 'medium' | 'high' | null;
  isImplicit: boolean;
}

export interface EverydaySituationInfo {
  isEverydaySituation: boolean;
  situationType: string | null;
  practicalSupportNeeded: boolean;
}

