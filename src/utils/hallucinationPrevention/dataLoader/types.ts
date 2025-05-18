
/**
 * Vector Database Data Loader Types
 * 
 * Type definitions for the data loader system
 */

// Interface for knowledge entries
export interface KnowledgeEntry {
  content: string;
  category: string;
  importance: number;
  source?: string;
}

// Collection names as constants
export const COLLECTIONS = {
  ROGER_KNOWLEDGE: 'roger_knowledge',
  USER_MESSAGES: 'user_messages',
  ROGER_RESPONSES: 'roger_responses',
  FACTS: 'facts'
};
