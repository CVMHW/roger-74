
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
  CONVERSATION_HISTORY = 'conversation_history',
  USER_PREFERENCES = 'user_preferences',
  CRISIS_PATTERNS = 'crisis_patterns'
}
