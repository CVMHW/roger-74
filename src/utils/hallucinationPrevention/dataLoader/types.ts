
/**
 * Type definitions for knowledge data entries
 */

export interface KnowledgeEntry {
  content: string;
  category: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  source: string;
}
