/**
 * Personality Service
 * 
 * Manages Roger's therapeutic personality and response style
 */

export interface PersonalityContext {
  communicationStyle: 'empathetic' | 'direct' | 'supportive' | 'collaborative';
  responseLength: 'brief' | 'moderate' | 'detailed';
  therapeuticApproach: 'person-centered' | 'cognitive' | 'existential' | 'integrated';
  emotionalTone: 'warm' | 'professional' | 'gentle' | 'encouraging';
  developmentalStage: 'child' | 'teen' | 'adult' | 'elder';
}

export class PersonalityService {
  /**
   * Get contextual personality based on conversation state
   */
  async getContextualPersonality(
    userInput: string,
    emotionAnalysis: any,
    conversationLength: number
  ): Promise<PersonalityContext> {
    // Adapt communication style based on emotion
    const communicationStyle = this.adaptCommunicationStyle(emotionAnalysis);
    
    // Adapt response length based on conversation stage
    const responseLength = this.adaptResponseLength(conversationLength, userInput);
    
    // Select therapeutic approach based on content
    const therapeuticApproach = this.selectTherapeuticApproach(userInput, emotionAnalysis);
    
    // Set emotional tone based on user's emotional state
    const emotionalTone = this.setEmotionalTone(emotionAnalysis);
    
    // Detect developmental stage from language patterns
    const developmentalStage = this.detectDevelopmentalStage(userInput);

    return {
      communicationStyle,
      responseLength,
      therapeuticApproach,
      emotionalTone,
      developmentalStage
    };
  }

  private adaptCommunicationStyle(emotionAnalysis: any): 'empathetic' | 'direct' | 'supportive' | 'collaborative' {
    if (!emotionAnalysis) return 'supportive';
    
    if (emotionAnalysis.intensity > 0.7) return 'empathetic';
    if (emotionAnalysis.primaryEmotion === 'confused') return 'collaborative';
    if (emotionAnalysis.primaryEmotion === 'angry') return 'direct';
    return 'supportive';
  }

  private adaptResponseLength(conversationLength: number, userInput: string): 'brief' | 'moderate' | 'detailed' {
    // Early conversation - keep responses moderate
    if (conversationLength < 3) return 'moderate';
    
    // Long user input suggests they want detailed responses
    if (userInput.length > 200) return 'detailed';
    
    // Short user input suggests brief responses
    if (userInput.length < 50) return 'brief';
    
    return 'moderate';
  }

  private selectTherapeuticApproach(userInput: string, emotionAnalysis: any): 'person-centered' | 'cognitive' | 'existential' | 'integrated' {
    const input = userInput.toLowerCase();
    
    // Existential themes
    if (input.includes('meaning') || input.includes('purpose') || input.includes('why')) {
      return 'existential';
    }
    
    // Cognitive patterns
    if (input.includes('think') || input.includes('thought') || input.includes('believe')) {
      return 'cognitive';
    }
    
    // Default to person-centered for emotional content
    if (emotionAnalysis && emotionAnalysis.intensity > 0.5) {
      return 'person-centered';
    }
    
    return 'integrated';
  }

  private setEmotionalTone(emotionAnalysis: any): 'warm' | 'professional' | 'gentle' | 'encouraging' {
    if (!emotionAnalysis) return 'warm';
    
    if (emotionAnalysis.primaryEmotion === 'sad') return 'gentle';
    if (emotionAnalysis.primaryEmotion === 'anxious') return 'encouraging';
    if (emotionAnalysis.primaryEmotion === 'angry') return 'professional';
    return 'warm';
  }

  private detectDevelopmentalStage(userInput: string): 'child' | 'teen' | 'adult' | 'elder' {
    const input = userInput.toLowerCase();
    
    // Simple heuristics - in practice, this would be more sophisticated
    if (input.includes('school') || input.includes('mom') || input.includes('dad')) {
      return 'child';
    }
    if (input.includes('college') || input.includes('friends') || input.includes('party')) {
      return 'teen';
    }
    if (input.includes('retirement') || input.includes('grandchildren')) {
      return 'elder';
    }
    
    return 'adult';
  }

  /**
   * Health check for personality service
   */
  async isHealthy(): Promise<boolean> {
    try {
      const testPersonality = await this.getContextualPersonality("test", null, 1);
      return testPersonality.communicationStyle === 'supportive';
    } catch {
      return false;
    }
  }
}
