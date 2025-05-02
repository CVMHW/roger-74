
/**
 * Response Handlers - Main export file
 * Re-exports all handlers for easier imports
 */

// Re-export all handlers from their respective categories
export { createSadnessResponse, createDefensiveReactionResponse } from './emotional';
export { createWeatherRelatedResponse, createMildGamblingResponse } from './situational';
export { createTraumaResponseMessage } from './trauma';
export { createOhioContextResponse } from './ohio';
