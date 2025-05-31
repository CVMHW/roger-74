
/**
 * Type definitions for knowledge data entries
 */

export interface KnowledgeEntry {
  content: string;
  category: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  source: string;
}

export enum COLLECTIONS {
  ROGER_KNOWLEDGE = 'roger_knowledge',
  MENTAL_HEALTH_FACTS = 'mental_health_facts',
  FACTS = 'facts',
  CONVERSATION_HISTORY = 'conversation_history',
  USER_PREFERENCES = 'user_preferences',
  USER_MESSAGES = 'user_messages',
  ROGER_RESPONSES = 'roger_responses',
  CRISIS_PATTERNS = 'crisis_patterns'
}
