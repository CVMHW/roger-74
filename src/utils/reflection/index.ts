
// Export all reflection utilities from a single entry point

// Core types and categories
export * from './core/types';
export * from './core/feelingCategories';
export * from './core/emotionMappers';

// Child emotion utilities
export * from './children/childEmotionsWheel';
export * from './children/childEmotionCategories';

// Generators and response builders
export * from './generators/contextAwareGenerator';
export * from './generators/minimalResponseHandler';
export * from './generators/reflectionResponseGenerator';

// Main data exports
export * from './data/contextAwareReflections';
export * from './feelingDetection';

// Core principles
export * from './principles/reflectionPrinciples';

// Legacy exports for backward compatibility
export * from './reflectionTypes';
export * from './feelingCategories';
export * from './reflectionGenerators';
