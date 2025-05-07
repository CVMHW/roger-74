
/**
 * Type definitions for pattern detection
 */

export interface PatternDetectionResult {
  isRepetitive: boolean;
  detectedPatterns: string[];
  repetitionScore: number;
  recommendations: {
    increaseSpontaneity: boolean;
    changeApproach: boolean;
    forcePerspectiveShift: boolean;
  };
}

export interface SentenceSimilarity {
  sentences: string[];
  similarity: number;
}
