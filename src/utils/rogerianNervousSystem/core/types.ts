
/**
 * Unified Type Definitions for Roger's Nervous System
 * 
 * This module establishes consistent type definitions across all systems
 * to eliminate inconsistencies and ensure proper integration
 */

// Base types for consistent usage across all modules
export type EmotionType = 'sadness' | 'anxiety' | 'anger' | 'joy' | 'fear' | 'surprise' | 'disgust' | 'neutral' | 'depression';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ConcernType = 'crisis' | 'tentative-harm' | 'depression' | 'anxiety' | 'none';
export type MemoryRole = 'user' | 'assistant' | 'patient' | 'roger' | 'system';
export type SystemName = 'crisis-detection' | 'emotion-analysis' | 'memory-storage' | 'rag-enhancement' | 'personality-integration' | 'logotherapy' | 'core-processing';

// Emotional context structure - updated with therapeutic context
export interface EmotionalContext {
  hasDetectedEmotion: boolean;
  primaryEmotion?: EmotionType;
  secondaryEmotions?: EmotionType[];
  isDepressionMentioned: boolean;
  emotionalIntensity?: SeverityLevel;
  confidence?: number;
  therapeuticContext?: string; // Added for therapeutic context support
  rogerResponse?: string; // Added for Roger's specific response
}

// Memory context structure  
export interface MemoryContext {
  relevantMemories: MemoryPiece[];
  isNewConversation: boolean;
  conversationThemes: string[];
  memoryCoherence?: number;
}

// Crisis context structure
export interface CrisisContext {
  isCrisisDetected: boolean;
  crisisType?: string;
  severity?: SeverityLevel;
  immediateIntervention?: boolean;
}

// RAG context structure
export interface RAGContext {
  shouldApplyRAG: boolean;
  queryAugmentation?: string;
  retrievedKnowledge?: string[];
  confidence?: number;
  sources?: string[];
}

// Personality insights structure - updated with therapeutic context
export interface PersonalityInsights {
  shouldIncludeInsight: boolean;
  insight?: string;
  confidence?: number;
  category?: string;
  therapeuticContext?: string; // Added for therapeutic context support
}

// Memory piece structure
export interface MemoryPiece {
  id: string;
  content: string;
  role: MemoryRole;
  timestamp: number;
  importance: number;
  metadata?: Record<string, any>;
  embedding?: number[];
}

// Comprehensive nervous system context
export interface NervousSystemContext {
  userInput: string;
  conversationHistory: string[];
  messageCount: number;
  developmentalStage?: string;
  concernType?: ConcernType;
  severityLevel?: SeverityLevel;
  emotionalContext: EmotionalContext;
  personalityInsights: PersonalityInsights;
  memoryContext: MemoryContext;
  crisisContext: CrisisContext;
  ragContext: RAGContext;
  smallTalkContext?: SmallTalkContext;
}

// Small talk context structure
export interface SmallTalkContext {
  isSmallTalk: boolean;
  category?: 'weather' | 'food' | 'entertainment' | 'general' | 'greeting';
  confidence?: number;
  shouldTransition?: boolean;
}

// Processing result structure
export interface ProcessingResult {
  enhancedResponse: string;
  context: NervousSystemContext;
  systemsEngaged: SystemName[];
  processingTime?: number;
  confidence?: number;
}

// RAG retrieval result
export interface RetrievalResult {
  retrievedContent: string[];
  confidence: number;
  sources?: string[];
  metadata?: Record<string, any>;
}

// Emotion detection result
export interface EmotionDetectionResult {
  hasDetectedEmotion: boolean;
  primaryEmotion?: EmotionType;
  confidence: number;
  explicitEmotion?: string;
  emotionalContent?: {
    hasEmotion: boolean;
    primaryEmotion?: EmotionType;
    intensity?: SeverityLevel;
  };
}

// System configuration options
export interface SystemConfiguration {
  enableRAG: boolean;
  enableCrisisDetection: boolean;
  enableSmallTalkDetection: boolean;
  enablePersonalityInsights: boolean;
  memoryRetentionDays: number;
  ragConfidenceThreshold: number;
  emotionConfidenceThreshold: number;
}
