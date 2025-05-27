
/**
 * Crisis Intervention Service
 * 
 * Detects crisis situations and provides immediate intervention responses
 */

export interface CrisisAnalysis {
  level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  requiresImmediate: boolean;
  riskFactors: string[];
  interventionType: string;
  confidence: number;
}

export class CrisisInterventionService {
  private crisisKeywords = {
    critical: ['suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead'],
    high: ['hurt myself', 'self harm', 'cutting', 'overdose', 'harm', 'die'],
    medium: ['hopeless', 'nothing matters', 'give up', 'cant go on', 'worthless'],
    low: ['struggling', 'difficult', 'hard time', 'overwhelmed', 'stressed']
  };

  /**
   * Analyze user input for crisis indicators
   */
  async analyze(userInput: string): Promise<CrisisAnalysis> {
    const normalizedInput = userInput.toLowerCase();
    const riskFactors: string[] = [];
    let highestLevel: 'none' | 'low' | 'medium' | 'high' | 'critical' = 'none';
    let confidence = 0;

    // Check for crisis keywords
    for (const [level, keywords] of Object.entries(this.crisisKeywords)) {
      const matches = keywords.filter(keyword => normalizedInput.includes(keyword));
      if (matches.length > 0) {
        riskFactors.push(...matches);
        if (this.getLevelPriority(level as any) > this.getLevelPriority(highestLevel)) {
          highestLevel = level as any;
          confidence = Math.min(matches.length * 0.3 + 0.5, 1.0);
        }
      }
    }

    const requiresImmediate = highestLevel === 'critical' || highestLevel === 'high';
    const interventionType = this.getInterventionType(highestLevel);

    return {
      level: highestLevel,
      requiresImmediate,
      riskFactors,
      interventionType,
      confidence
    };
  }

  /**
   * Generate crisis intervention response
   */
  async generateResponse(crisisAnalysis: CrisisAnalysis): Promise<string> {
    if (crisisAnalysis.level === 'critical') {
      return "I'm very concerned about what you've shared. Your safety is the most important thing right now. Please call 911 or go to your nearest emergency room immediately. You can also call the National Suicide Prevention Lifeline at 988. You don't have to go through this alone.";
    }

    if (crisisAnalysis.level === 'high') {
      return "I'm concerned about you and want to make sure you're safe. Please reach out to a crisis counselor who can provide immediate support. You can call 988 (Suicide & Crisis Lifeline) or text 'HELLO' to 741741 (Crisis Text Line). There are people who want to help you through this.";
    }

    if (crisisAnalysis.level === 'medium') {
      return "It sounds like you're going through a really difficult time. While I want to support you, it's important that you also have access to professional crisis support. The National Suicide Prevention Lifeline (988) is available 24/7 if you need someone to talk to immediately.";
    }

    return "I hear that you're struggling right now. That takes courage to share. If you ever feel like you might be in crisis, remember that help is always available at 988 or by texting 741741.";
  }

  private getLevelPriority(level: 'none' | 'low' | 'medium' | 'high' | 'critical'): number {
    const priorities = { none: 0, low: 1, medium: 2, high: 3, critical: 4 };
    return priorities[level];
  }

  private getInterventionType(level: 'none' | 'low' | 'medium' | 'high' | 'critical'): string {
    const interventions = {
      none: 'monitoring',
      low: 'supportive_listening',
      medium: 'resource_referral',
      high: 'crisis_counseling',
      critical: 'emergency_intervention'
    };
    return interventions[level];
  }

  /**
   * Health check for crisis service
   */
  async isHealthy(): Promise<boolean> {
    try {
      const testAnalysis = await this.analyze("I'm feeling stressed");
      return testAnalysis.level === 'low';
    } catch {
      return false;
    }
  }
}
