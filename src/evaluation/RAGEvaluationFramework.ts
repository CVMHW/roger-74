/**
 * RAG Evaluation Framework
 * 
 * Comprehensive evaluation system for RAG responses
 */

import { advancedVectorDB } from '../core/AdvancedVectorDatabase';
import { userFeedbackSystem } from '../feedback/UserFeedbackSystem';

export class RAGEvaluationFramework {
  private evaluationMetrics: Map<string, any> = new Map();
  private evaluationThresholds = {
    relevance: 0.7,
    coherence: 0.8,
    faithfulness: 0.75,
    overall: 0.75
  };

  constructor() {
    console.log("RAG Evaluation Framework initialized");
  }

  /**
   * Evaluate RAG response quality
   */
  async evaluateRAGResponse(params: {
    query: string;
    retrievedDocuments: string[];
    generatedResponse: string;
    groundTruth?: string;
    context?: any;
  }): Promise<any> {
    const { query, retrievedDocuments, generatedResponse, groundTruth, context } = params;
    
    // Calculate relevance score
    const relevanceScore = await this.calculateRelevance(query, retrievedDocuments);
    
    // Calculate coherence score
    const coherenceScore = await this.calculateCoherence(generatedResponse);
    
    // Calculate faithfulness score
    const faithfulnessScore = await this.calculateFaithfulness(generatedResponse, retrievedDocuments);
    
    // Calculate groundtruth alignment if available
    let groundTruthScore = 0.5;
    if (groundTruth) {
      groundTruthScore = await this.calculateGroundTruthAlignment(generatedResponse, groundTruth);
    }
    
    // Calculate overall score
    const overallScore = this.calculateOverallScore({
      relevanceScore,
      coherenceScore,
      faithfulnessScore,
      groundTruthScore
    });
    
    // Store evaluation results
    const evaluationId = `eval_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const evaluationResult = {
      evaluationId,
      query,
      relevanceScore,
      coherenceScore,
      faithfulnessScore,
      groundTruthScore,
      overallScore,
      timestamp: Date.now(),
      context: context || {}
    };
    
    this.evaluationMetrics.set(evaluationId, evaluationResult);
    
    // Submit feedback if score is below threshold
    if (overallScore < this.evaluationThresholds.overall) {
      await this.submitEvaluationFeedback(evaluationResult);
    }
    
    return evaluationResult;
  }

  /**
   * Calculate relevance between query and retrieved documents
   */
  private async calculateRelevance(query: string, documents: string[]): Promise<number> {
    if (!documents.length) return 0;
    
    try {
      // Generate query embedding
      const queryEmbedding = await advancedVectorDB.collection('evaluation').generateEmbedding(query);
      
      // Calculate similarity with each document
      const similarities = await Promise.all(documents.map(async (doc) => {
        const docEmbedding = await advancedVectorDB.collection('evaluation').generateEmbedding(doc);
        return this.cosineSimilarity(queryEmbedding, docEmbedding);
      }));
      
      // Return average similarity
      return similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
    } catch (error) {
      console.error('Error calculating relevance:', error);
      return 0.5; // Default fallback score
    }
  }

  /**
   * Calculate coherence of generated response
   */
  private async calculateCoherence(response: string): Promise<number> {
    // Simple coherence heuristics
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length <= 1) return 0.7; // Single sentence is coherent by default
    
    // Check for common coherence markers
    const hasCoherenceMarkers = sentences.some((s, i) => {
      if (i === 0) return true;
      const lowerS = s.toLowerCase().trim();
      return lowerS.startsWith('additionally') || 
             lowerS.startsWith('furthermore') || 
             lowerS.startsWith('however') || 
             lowerS.startsWith('moreover') ||
             lowerS.startsWith('also') ||
             lowerS.startsWith('in addition');
    });
    
    // Check for sentence length variation (more natural)
    const lengths = sentences.map(s => s.length);
    const avgLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
    const lengthVariation = lengths.some(len => Math.abs(len - avgLength) > 10);
    
    // Calculate coherence score
    let score = 0.7; // Base score
    if (hasCoherenceMarkers) score += 0.15;
    if (lengthVariation) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  /**
   * Calculate faithfulness to retrieved documents
   */
  private async calculateFaithfulness(response: string, documents: string[]): Promise<number> {
    if (!documents.length) return 0.5;
    
    try {
      // Extract key phrases from documents
      const documentText = documents.join(' ');
      const documentPhrases = this.extractKeyPhrases(documentText);
      
      // Check if response contains key phrases
      const responseLower = response.toLowerCase();
      const matchedPhrases = documentPhrases.filter(phrase => 
        responseLower.includes(phrase.toLowerCase())
      );
      
      // Calculate faithfulness score
      const matchRatio = matchedPhrases.length / Math.max(1, documentPhrases.length);
      return 0.5 + (matchRatio * 0.5); // Scale from 0.5 to 1.0
    } catch (error) {
      console.error('Error calculating faithfulness:', error);
      return 0.5; // Default fallback score
    }
  }

  /**
   * Calculate alignment with ground truth
   */
  private async calculateGroundTruthAlignment(response: string, groundTruth: string): Promise<number> {
    try {
      // Generate embeddings
      const responseEmbedding = await advancedVectorDB.collection('evaluation').generateEmbedding(response);
      const truthEmbedding = await advancedVectorDB.collection('evaluation').generateEmbedding(groundTruth);
      
      // Calculate similarity
      return this.cosineSimilarity(responseEmbedding, truthEmbedding);
    } catch (error) {
      console.error('Error calculating ground truth alignment:', error);
      return 0.5; // Default fallback score
    }
  }

  /**
   * Calculate overall evaluation score
   */
  private calculateOverallScore(scores: {
    relevanceScore: number;
    coherenceScore: number;
    faithfulnessScore: number;
    groundTruthScore: number;
  }): number {
    // Weighted average of all scores
    return (
      (scores.relevanceScore * 0.3) +
      (scores.coherenceScore * 0.2) +
      (scores.faithfulnessScore * 0.3) +
      (scores.groundTruthScore * 0.2)
    );
  }

  /**
   * Extract key phrases from text
   */
  private extractKeyPhrases(text: string): string[] {
    // Simple key phrase extraction
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const phrases: string[] = [];
    
    // Extract noun phrases (simplified)
    for (const sentence of sentences) {
      const words = sentence.split(/\s+/);
      
      // Extract 2-3 word phrases
      for (let i = 0; i < words.length - 1; i++) {
        if (words[i].length > 3 && words[i+1].length > 3) {
          phrases.push(`${words[i]} ${words[i+1]}`);
        }
        
        if (i < words.length - 2 && words[i+2].length > 3) {
          phrases.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
        }
      }
    }
    
    // Deduplicate and return top phrases
    return [...new Set(phrases)].slice(0, 10);
  }

  /**
   * Calculate cosine similarity between vectors
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have the same length');
    }
    
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }
    
    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);
    
    if (mag1 === 0 || mag2 === 0) return 0;
    
    return dotProduct / (mag1 * mag2);
  }

  /**
   * Submit evaluation feedback for low-quality responses
   */
  private async submitEvaluationFeedback(evaluation: any): Promise<void> {
    try {
      await userFeedbackSystem.submitFeedback(
        'system',
        evaluation.evaluationId,
        {
          type: 'suggestion',
          content: `RAG evaluation below threshold: ${evaluation.overallScore.toFixed(2)}`,
          severity: evaluation.overallScore < 0.5 ? 'high' : 'medium',
          category: 'rag-quality'
        }
      );
    } catch (error) {
      console.error('Error submitting evaluation feedback:', error);
    }
  }

  /**
   * Get evaluation metrics for analysis
   */
  getEvaluationMetrics(limit: number = 100): any[] {
    return Array.from(this.evaluationMetrics.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get evaluation statistics
   */
  getEvaluationStatistics(): any {
    const metrics = Array.from(this.evaluationMetrics.values());
    
    if (metrics.length === 0) {
      return {
        count: 0,
        averageOverallScore: 0,
        averageRelevanceScore: 0,
        averageCoherenceScore: 0,
        averageFaithfulnessScore: 0
      };
    }
    
    return {
      count: metrics.length,
      averageOverallScore: metrics.reduce((sum, m) => sum + m.overallScore, 0) / metrics.length,
      averageRelevanceScore: metrics.reduce((sum, m) => sum + m.relevanceScore, 0) / metrics.length,
      averageCoherenceScore: metrics.reduce((sum, m) => sum + m.coherenceScore, 0) / metrics.length,
      averageFaithfulnessScore: metrics.reduce((sum, m) => sum + m.faithfulnessScore, 0) / metrics.length
    };
  }
}

export const ragEvaluationFramework = new RAGEvaluationFramework();
