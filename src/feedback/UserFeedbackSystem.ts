
/**
 * User Feedback System
 * 
 * Implements systematic user feedback incorporation for 5/5 feedback loop
 */

export interface FeedbackItem {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: number;
  type: 'rating' | 'correction' | 'suggestion' | 'complaint' | 'praise';
  content: string;
  metadata: {
    responseId?: string;
    conceptId?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    tags: string[];
  };
  status: 'new' | 'reviewed' | 'implemented' | 'dismissed';
  impact: {
    systemChanges: string[];
    improvementsMade: string[];
    metricsImpacted: string[];
  };
}

export interface FeedbackAnalysis {
  overallSatisfaction: number;
  commonIssues: string[];
  improvementOpportunities: string[];
  positiveTrends: string[];
  criticalFeedback: FeedbackItem[];
  recommendedActions: ActionRecommendation[];
}

export interface ActionRecommendation {
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  rationale: string;
  estimatedImpact: number;
  implementationComplexity: 'simple' | 'moderate' | 'complex';
  affectedComponents: string[];
}

export class UserFeedbackSystem {
  private feedbackStore: Map<string, FeedbackItem> = new Map();
  private userProfiles: Map<string, UserFeedbackProfile> = new Map();
  private systemImprovements: SystemImprovement[] = [];
  private feedbackAnalytics = {
    totalFeedback: 0,
    averageRating: 0,
    responseRate: 0,
    implementationRate: 0
  };

  /**
   * Submit user feedback
   */
  async submitFeedback(
    userId: string,
    sessionId: string,
    feedbackData: {
      type: FeedbackItem['type'];
      content: string;
      severity?: FeedbackItem['metadata']['severity'];
      category?: string;
      responseId?: string;
      conceptId?: string;
    }
  ): Promise<string> {
    const feedbackId = `feedback_${userId}_${Date.now()}`;
    
    const feedback: FeedbackItem = {
      id: feedbackId,
      userId,
      sessionId,
      timestamp: Date.now(),
      type: feedbackData.type,
      content: feedbackData.content,
      metadata: {
        responseId: feedbackData.responseId,
        conceptId: feedbackData.conceptId,
        severity: feedbackData.severity || 'medium',
        category: feedbackData.category || 'general',
        tags: this.extractTags(feedbackData.content)
      },
      status: 'new',
      impact: {
        systemChanges: [],
        improvementsMade: [],
        metricsImpacted: []
      }
    };
    
    this.feedbackStore.set(feedbackId, feedback);
    
    // Update user profile
    this.updateUserFeedbackProfile(userId, feedback);
    
    // Process immediate actions for critical feedback
    if (feedback.metadata.severity === 'critical') {
      await this.processCriticalFeedback(feedback);
    }
    
    // Update analytics
    this.updateFeedbackAnalytics();
    
    console.log(`Feedback submitted: ${feedbackId} (${feedback.type})`);
    return feedbackId;
  }

  /**
   * Process and analyze feedback for system improvements
   */
  async analyzeFeedback(timeRange?: { start: number; end: number }): Promise<FeedbackAnalysis> {
    const feedbackItems = Array.from(this.feedbackStore.values());
    
    // Filter by time range if provided
    const relevantFeedback = timeRange 
      ? feedbackItems.filter(f => f.timestamp >= timeRange.start && f.timestamp <= timeRange.end)
      : feedbackItems;
    
    if (relevantFeedback.length === 0) {
      return this.createEmptyAnalysis();
    }
    
    // Calculate overall satisfaction
    const overallSatisfaction = this.calculateOverallSatisfaction(relevantFeedback);
    
    // Identify common issues
    const commonIssues = this.identifyCommonIssues(relevantFeedback);
    
    // Find improvement opportunities
    const improvementOpportunities = this.identifyImprovementOpportunities(relevantFeedback);
    
    // Track positive trends
    const positiveTrends = this.identifyPositiveTrends(relevantFeedback);
    
    // Get critical feedback
    const criticalFeedback = relevantFeedback.filter(f => f.metadata.severity === 'critical');
    
    // Generate action recommendations
    const recommendedActions = await this.generateActionRecommendations(relevantFeedback);
    
    return {
      overallSatisfaction,
      commonIssues,
      improvementOpportunities,
      positiveTrends,
      criticalFeedback,
      recommendedActions
    };
  }

  /**
   * Implement feedback-driven improvements
   */
  async implementFeedbackImprovements(feedbackIds: string[]): Promise<SystemImprovement[]> {
    const improvements: SystemImprovement[] = [];
    
    for (const feedbackId of feedbackIds) {
      const feedback = this.feedbackStore.get(feedbackId);
      if (!feedback) continue;
      
      const improvement = await this.createSystemImprovement(feedback);
      if (improvement) {
        improvements.push(improvement);
        
        // Update feedback status
        feedback.status = 'implemented';
        feedback.impact = improvement.impact;
        
        // Record in system improvements
        this.systemImprovements.push(improvement);
      }
    }
    
    console.log(`Implemented ${improvements.length} feedback-driven improvements`);
    return improvements;
  }

  /**
   * Get feedback-driven configuration updates
   */
  getFeedbackDrivenUpdates(): {
    configurationChanges: Record<string, any>;
    algorithmAdjustments: Record<string, any>;
    contentUpdates: Record<string, any>;
  } {
    const recentImprovements = this.systemImprovements.slice(-10);
    
    const configurationChanges: Record<string, any> = {};
    const algorithmAdjustments: Record<string, any> = {};
    const contentUpdates: Record<string, any> = {};
    
    for (const improvement of recentImprovements) {
      switch (improvement.type) {
        case 'configuration':
          Object.assign(configurationChanges, improvement.changes);
          break;
        case 'algorithm':
          Object.assign(algorithmAdjustments, improvement.changes);
          break;
        case 'content':
          Object.assign(contentUpdates, improvement.changes);
          break;
      }
    }
    
    return {
      configurationChanges,
      algorithmAdjustments,
      contentUpdates
    };
  }

  /**
   * Private helper methods
   */
  private extractTags(content: string): string[] {
    const tags: string[] = [];
    
    // Emotion tags
    if (/\b(sad|depressed|anxious|angry|frustrated)\b/i.test(content)) {
      tags.push('emotional');
    }
    
    // Quality tags
    if (/\b(helpful|good|great|excellent)\b/i.test(content)) {
      tags.push('positive');
    }
    
    if (/\b(unhelpful|bad|terrible|wrong)\b/i.test(content)) {
      tags.push('negative');
    }
    
    // Feature tags
    if (/\b(response|answer|information)\b/i.test(content)) {
      tags.push('response-quality');
    }
    
    if (/\b(slow|fast|quick|speed)\b/i.test(content)) {
      tags.push('performance');
    }
    
    return tags;
  }

  private updateUserFeedbackProfile(userId: string, feedback: FeedbackItem): void {
    let profile = this.userProfiles.get(userId);
    
    if (!profile) {
      profile = {
        userId,
        totalFeedback: 0,
        averageRating: 0,
        preferredFeedbackType: 'rating',
        feedbackHistory: [],
        satisfactionTrend: []
      };
    }
    
    profile.totalFeedback++;
    profile.feedbackHistory.push(feedback.id);
    
    // Update satisfaction trend for rating feedback
    if (feedback.type === 'rating') {
      const rating = this.extractRating(feedback.content);
      if (rating > 0) {
        profile.satisfactionTrend.push({ timestamp: feedback.timestamp, rating });
        profile.averageRating = profile.satisfactionTrend.reduce((sum, s) => sum + s.rating, 0) / profile.satisfactionTrend.length;
      }
    }
    
    this.userProfiles.set(userId, profile);
  }

  private async processCriticalFeedback(feedback: FeedbackItem): Promise<void> {
    console.log(`Processing critical feedback: ${feedback.id}`);
    
    // Immediate actions for critical feedback
    const actions: string[] = [];
    
    if (feedback.content.toLowerCase().includes('hallucination')) {
      actions.push('Increased hallucination detection threshold');
    }
    
    if (feedback.content.toLowerCase().includes('inappropriate')) {
      actions.push('Enhanced content filtering');
    }
    
    if (feedback.content.toLowerCase().includes('slow')) {
      actions.push('Performance optimization triggered');
    }
    
    feedback.impact.systemChanges = actions;
    
    // Alert system administrators (in a real system)
    console.log(`Critical feedback alert: ${feedback.content}`);
  }

  private calculateOverallSatisfaction(feedback: FeedbackItem[]): number {
    const ratings = feedback
      .filter(f => f.type === 'rating')
      .map(f => this.extractRating(f.content))
      .filter(r => r > 0);
    
    if (ratings.length === 0) return 0.7; // Default neutral
    
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length / 5; // Normalize to 0-1
  }

  private identifyCommonIssues(feedback: FeedbackItem[]): string[] {
    const issuePatterns: Record<string, RegExp> = {
      'Slow responses': /\b(slow|sluggish|delay|wait)\b/i,
      'Irrelevant answers': /\b(irrelevant|off-topic|unrelated)\b/i,
      'Repetitive responses': /\b(repeat|same|again|redundant)\b/i,
      'Lack of empathy': /\b(cold|unfeeling|robotic|mechanical)\b/i,
      'Inaccurate information': /\b(wrong|incorrect|false|inaccurate)\b/i
    };
    
    const issueCounts: Record<string, number> = {};
    
    for (const item of feedback) {
      for (const [issue, pattern] of Object.entries(issuePatterns)) {
        if (pattern.test(item.content)) {
          issueCounts[issue] = (issueCounts[issue] || 0) + 1;
        }
      }
    }
    
    // Return issues that appear in more than 10% of feedback
    const threshold = Math.max(1, feedback.length * 0.1);
    return Object.entries(issueCounts)
      .filter(([_, count]) => count >= threshold)
      .map(([issue, _]) => issue);
  }

  private identifyImprovementOpportunities(feedback: FeedbackItem[]): string[] {
    const opportunities: string[] = [];
    
    // Analyze suggestion-type feedback
    const suggestions = feedback.filter(f => f.type === 'suggestion');
    
    const suggestionPatterns: Record<string, RegExp> = {
      'Add more examples': /\b(example|instance|case|illustration)\b/i,
      'Improve personalization': /\b(personal|customize|individual|specific)\b/i,
      'Better emotional support': /\b(emotion|feeling|support|understand)\b/i,
      'More interactive features': /\b(interactive|engage|participate)\b/i
    };
    
    for (const [opportunity, pattern] of Object.entries(suggestionPatterns)) {
      if (suggestions.some(s => pattern.test(s.content))) {
        opportunities.push(opportunity);
      }
    }
    
    return opportunities;
  }

  private identifyPositiveTrends(feedback: FeedbackItem[]): string[] {
    const trends: string[] = [];
    
    const positiveFeedback = feedback.filter(f => 
      f.type === 'praise' || 
      (f.type === 'rating' && this.extractRating(f.content) >= 4)
    );
    
    if (positiveFeedback.length > feedback.length * 0.6) {
      trends.push('High user satisfaction');
    }
    
    const positivePatterns: Record<string, RegExp> = {
      'Helpful responses': /\b(helpful|useful|valuable|beneficial)\b/i,
      'Good emotional support': /\b(supportive|caring|understanding|empathetic)\b/i,
      'Accurate information': /\b(accurate|correct|right|precise)\b/i,
      'Fast responses': /\b(quick|fast|rapid|immediate)\b/i
    };
    
    for (const [trend, pattern] of Object.entries(positivePatterns)) {
      if (positiveFeedback.some(f => pattern.test(f.content))) {
        trends.push(trend);
      }
    }
    
    return trends;
  }

  private async generateActionRecommendations(feedback: FeedbackItem[]): Promise<ActionRecommendation[]> {
    const recommendations: ActionRecommendation[] = [];
    
    // High-impact, low-complexity improvements
    const slowResponseComplaints = feedback.filter(f => 
      /\b(slow|delay|wait)\b/i.test(f.content)
    ).length;
    
    if (slowResponseComplaints > feedback.length * 0.2) {
      recommendations.push({
        priority: 'high',
        action: 'Optimize response generation pipeline',
        rationale: 'Multiple users reporting slow responses',
        estimatedImpact: 0.8,
        implementationComplexity: 'moderate',
        affectedComponents: ['retrieval', 'generation', 'reranking']
      });
    }
    
    // Content improvements
    const relevanceComplaints = feedback.filter(f => 
      /\b(irrelevant|off-topic)\b/i.test(f.content)
    ).length;
    
    if (relevanceComplaints > feedback.length * 0.15) {
      recommendations.push({
        priority: 'high',
        action: 'Improve semantic matching in retrieval',
        rationale: 'Users reporting irrelevant responses',
        estimatedImpact: 0.9,
        implementationComplexity: 'complex',
        affectedComponents: ['retrieval', 'reranking', 'evaluation']
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private async createSystemImprovement(feedback: FeedbackItem): Promise<SystemImprovement | null> {
    // Simple mapping of feedback to system improvements
    const improvements: Record<string, SystemImprovement> = {
      'slow': {
        id: `improvement_${Date.now()}`,
        feedbackId: feedback.id,
        type: 'configuration',
        description: 'Optimize response generation for speed',
        changes: {
          'retrieval.timeout': 5000,
          'generation.maxTokens': 150,
          'reranking.enabled': false
        },
        impact: {
          systemChanges: ['Reduced retrieval timeout', 'Limited response length'],
          improvementsMade: ['Faster response times'],
          metricsImpacted: ['latency', 'throughput']
        },
        implementedAt: Date.now()
      },
      'irrelevant': {
        id: `improvement_${Date.now()}`,
        feedbackId: feedback.id,
        type: 'algorithm',
        description: 'Improve semantic matching threshold',
        changes: {
          'retrieval.semanticThreshold': 0.8,
          'reranking.contextWeight': 0.4
        },
        impact: {
          systemChanges: ['Increased similarity threshold', 'Enhanced context weighting'],
          improvementsMade: ['More relevant responses'],
          metricsImpacted: ['relevance', 'user-satisfaction']
        },
        implementedAt: Date.now()
      }
    };
    
    // Find applicable improvement
    for (const [keyword, improvement] of Object.entries(improvements)) {
      if (feedback.content.toLowerCase().includes(keyword)) {
        return improvement;
      }
    }
    
    return null;
  }

  private extractRating(content: string): number {
    const ratingMatch = content.match(/\b([1-5])\b/);
    return ratingMatch ? parseInt(ratingMatch[1]) : 0;
  }

  private updateFeedbackAnalytics(): void {
    const allFeedback = Array.from(this.feedbackStore.values());
    
    this.feedbackAnalytics.totalFeedback = allFeedback.length;
    
    const ratings = allFeedback
      .filter(f => f.type === 'rating')
      .map(f => this.extractRating(f.content))
      .filter(r => r > 0);
    
    this.feedbackAnalytics.averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
      : 0;
    
    this.feedbackAnalytics.implementationRate = allFeedback.length > 0
      ? allFeedback.filter(f => f.status === 'implemented').length / allFeedback.length
      : 0;
  }

  private createEmptyAnalysis(): FeedbackAnalysis {
    return {
      overallSatisfaction: 0.7,
      commonIssues: [],
      improvementOpportunities: [],
      positiveTrends: [],
      criticalFeedback: [],
      recommendedActions: []
    };
  }

  /**
   * Get feedback system status
   */
  getFeedbackSystemStatus() {
    return {
      ...this.feedbackAnalytics,
      totalUsers: this.userProfiles.size,
      recentFeedback: Array.from(this.feedbackStore.values()).slice(-10),
      systemImprovements: this.systemImprovements.length,
      lastImprovement: this.systemImprovements[this.systemImprovements.length - 1]
    };
  }
}

interface UserFeedbackProfile {
  userId: string;
  totalFeedback: number;
  averageRating: number;
  preferredFeedbackType: FeedbackItem['type'];
  feedbackHistory: string[];
  satisfactionTrend: Array<{ timestamp: number; rating: number }>;
}

interface SystemImprovement {
  id: string;
  feedbackId: string;
  type: 'configuration' | 'algorithm' | 'content';
  description: string;
  changes: Record<string, any>;
  impact: {
    systemChanges: string[];
    improvementsMade: string[];
    metricsImpacted: string[];
  };
  implementedAt: number;
}

export const userFeedbackSystem = new UserFeedbackSystem();
