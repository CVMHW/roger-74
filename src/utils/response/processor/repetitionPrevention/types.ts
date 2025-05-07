
/**
 * Type definitions for repetition prevention system
 */

export interface RepetitionDetectionResult {
  hasRepetition: boolean;
  repetitionType: string;
  repetitionScore: number;
  segments: string[];
}

export interface NGramSimilarityResult {
  highSimilarityFound: boolean;
  segments: string[];
}
