
/**
 * REFACTORED: Ohio Context Manager
 * 
 * This file has been refactored into smaller components in the ./ohio/ directory
 * for better maintainability and organization.
 * 
 * This file now re-exports the components for backward compatibility.
 */

// Re-export all components from the new modular structure
export * from './ohio';

// Legacy exports for backward compatibility
import { 
  detectChildPatient, 
  detectNewcomerPatient, 
  detectOhioReferences 
} from './ohio/detectors';

import { mapReferenceToMentalHealthTopic } from './ohio/mentalHealthMapping';
import { generateOhioContextResponse } from './ohio/responseGenerator';

// Re-export using the same names for backward compatibility
export { 
  detectChildPatient, 
  detectNewcomerPatient, 
  detectOhioReferences,
  mapReferenceToMentalHealthTopic,
  generateOhioContextResponse
};
