
/**
 * Unified Type System
 * 
 * Bridges all legacy and modern type definitions into a single, coherent system
 * Ensures complete interoperability between old and new code
 */

// Legacy type compatibility layer
export interface LegacyPatientContext {
  userInput: string;
  sessionId: string;
  messageCount: number;
  isNewSession: boolean;
}

// Modern unified context (extends legacy for compatibility)
export interface UnifiedPatientContext extends LegacyPatientContext {
  conversationHistory: string[];
  timestamp: number;
  emotionalState?: EmotionalState;
  memoryContext?: MemoryContext;
}

// Unified emotional state (compatible with all systems)
export interface EmotionalState {
  primaryEmotion: string;
  secondaryEmotions: string[];
  intensity: number;
  valence: number;
  arousal: number;
  confidence: number;
  emotionalTriggers: string[];
}

// Unified memory context (bridges all memory systems)
export interface MemoryContext {
  relevantItems: MemoryItem[];
  currentFocus: string;
  conversationPhase: string;
  shortTermMemory?: any[];
  workingMemory?: any[];
  episodicMemory?: any[];
}

export interface MemoryItem {
  id: string;
  content: string;
  timestamp: number;
  importance: number;
  type: string;
}

// Unified processing result (compatible with all pipelines)
export interface UnifiedProcessingResult {
  response: string;
  confidence: number;
  processingTimeMs: number;
  crisisDetected: boolean;
  systemsEngaged: string[];
  therapeuticQuality: number;
  pipelineRoute: string;
  memoryIntegration: MemoryContext;
  legacyCompatible: boolean;
  unityScore?: number;
}

// Bridge interface for legacy systems
export interface LegacyBridge {
  convertToLegacy(unified: UnifiedProcessingResult): any;
  convertFromLegacy(legacy: any): UnifiedProcessingResult;
  isLegacyFormat(input: any): boolean;
}

// Unified configuration that supports all systems
export interface UnifiedSystemConfig {
  enableLegacyCompatibility: boolean;
  preserveOldBehaviors: boolean;
  useModernEnhancements: boolean;
  sophisticationLevel: 'basic' | 'advanced' | 'expert';
  unityMode: 'strict' | 'flexible' | 'adaptive';
}
