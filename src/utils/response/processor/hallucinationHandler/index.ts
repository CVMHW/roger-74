
/**
 * Hallucination Handler - Main Entry Point
 * 
 * Integrates the hallucination prevention system into the response
 * processing pipeline with enhanced detection capabilities.
 */

// Re-export the core functionality
export { handlePotentialHallucinations } from './core';
export { applyEarlyConversationRAG } from './earlyConversation';
