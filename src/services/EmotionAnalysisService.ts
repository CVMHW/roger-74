
/**
 * Emotion Analysis Service
 * 
 * Analyzes emotional content in user messages and provides
 * context for emotionally-aware responses
 */

export interface EmotionAnalysis {
  primaryEmotion: string;
  secondaryEmotions: string[];
  intensity: number;
  valence: number; // positive/negative scale
  arousal: number; // energy level
  confidence: number;
  emotionalTriggers: string[];
}

export class EmotionAnalysisService {
  private emotionKeywords = {
    'sad': ['sad', 'depressed', 'down', 'upset', 'crying', 'tears', 'grief', 'loss'],
    'anxious': ['anxious', 'worried', 'nervous', 'scared', 'panic', 'fear', 'stress'],
    'angry': ['angry', 'mad', 'furious', 'rage', 'frustrated', 'irritated'],
    'happy': ['happy', 'joy', 'excited', 'good', 'great', 'wonderful', 'amazing'],
    'confused': ['confused', 'lost', 'uncertain', 'unclear', 'mixed up'],
    'lonely': ['lonely', 'alone', 'isolated', 'disconnected', 'empty'],
    'hopeful': ['hope', 'hopeful', 'optimistic', 'positive', 'better', 'improving']
  };

  /**
   * Analyze emotional content in user input
   */
  async analyze(userInput: string): Promise<EmotionAnalysis> {
    const normalizedInput = userInput.toLowerCase();
    const words = normalizedInput.split(/\s+/);
    
    // Detect emotions based on keywords
    const emotionScores: Record<string, number> = {};
    const triggers: string[] = [];
    
    for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
      const matches = keywords.filter(keyword => normalizedInput.includes(keyword));
      if (matches.length > 0) {
        emotionScores[emotion] = matches.length;
        triggers.push(...matches);
      }
    }
    
    // Determine primary emotion
    const primaryEmotion = Object.entries(emotionScores)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';
    
    // Get secondary emotions
    const secondaryEmotions = Object.entries(emotionScores)
      .filter(([emotion]) => emotion !== primaryEmotion)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([emotion]) => emotion);
    
    // Calculate intensity based on word count and emotional markers
    const intensity = this.calculateIntensity(normalizedInput, emotionScores);
    
    // Calculate valence (positive/negative)
    const valence = this.calculateValence(primaryEmotion, emotionScores);
    
    // Calculate arousal (energy level)
    const arousal = this.calculateArousal(primaryEmotion);
    
    return {
      primaryEmotion,
      secondaryEmotions,
      intensity,
      valence,
      arousal,
      confidence: emotionScores[primaryEmotion] ? 0.8 : 0.3,
      emotionalTriggers: triggers
    };
  }

  private calculateIntensity(input: string, emotionScores: Record<string, number>): number {
    const intensifiers = ['very', 'extremely', 'really', 'so', 'absolutely', 'completely'];
    const hasIntensifiers = intensifiers.some(word => input.includes(word));
    const totalEmotionWords = Object.values(emotionScores).reduce((sum, score) => sum + score, 0);
    
    let intensity = Math.min(totalEmotionWords / 10, 1);
    if (hasIntensifiers) intensity = Math.min(intensity + 0.3, 1);
    
    return intensity;
  }

  private calculateValence(primaryEmotion: string, emotionScores: Record<string, number>): number {
    const positiveEmotions = ['happy', 'hopeful'];
    const negativeEmotions = ['sad', 'anxious', 'angry', 'lonely'];
    
    if (positiveEmotions.includes(primaryEmotion)) return 0.7;
    if (negativeEmotions.includes(primaryEmotion)) return -0.7;
    return 0;
  }

  private calculateArousal(primaryEmotion: string): number {
    const highArousal = ['angry', 'anxious', 'excited'];
    const lowArousal = ['sad', 'lonely', 'confused'];
    
    if (highArousal.includes(primaryEmotion)) return 0.8;
    if (lowArousal.includes(primaryEmotion)) return 0.2;
    return 0.5;
  }

  /**
   * Health check for emotion service
   */
  async isHealthy(): Promise<boolean> {
    try {
      const testAnalysis = await this.analyze("I feel happy");
      return testAnalysis.primaryEmotion === 'happy';
    } catch {
      return false;
    }
  }
}
