
/**
 * This file is deprecated. The sadness handler has been moved to emotional/sadnessHandler.ts
 * This file is kept for backward compatibility only.
 */

import { createSadnessResponse as actualCreateSadnessResponse } from './emotional/sadnessHandler';

// Re-export the sadness handler from its new location
export const createSadnessResponse = actualCreateSadnessResponse;
