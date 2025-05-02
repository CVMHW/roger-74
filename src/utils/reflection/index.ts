
/**
 * Public API for reflection utilities
 */

import { ConcernType } from "./reflectionTypes";
import { detectDevelopmentalStage } from "./reflectionStrategies";
import { identifyEnhancedFeelings } from "./feelingDetection";
import { generateReflectionResponse } from "./generators/reflectionResponseGenerator";

export {
  detectDevelopmentalStage,
  identifyEnhancedFeelings,
  generateReflectionResponse
};

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type { ConcernType };
