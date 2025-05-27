
/**
 * Smart Interaction Router
 * 
 * Efficiently routes messages to appropriate processing levels
 * Target: <400ms for greetings, <500ms for crisis, <800ms for complex
 */

export interface RouteDecision {
  type: 'greeting' | 'crisis' | 'emotional' | 'complex';
  processingLevel: 'minimal' | 'standard' | 'full';
  estimatedTime: number;
  systemsToUse: string[];
}

/**
 * Determine optimal processing route for patient messages
 */
export const determineOptimalRoute = (userInput: string, conversationHistory: string[] = []): RouteDecision => {
  const lowerInput = userInput.toLowerCase().trim();
  const messageLength = userInput.length;
  const isFirstMessage = conversationHistory.length <= 1;

  // CRISIS DETECTION - Highest Priority (300ms target)
  if (detectsCrisisContent(lowerInput)) {
    return {
      type: 'crisis',
      processingLevel: 'full',
      estimatedTime: 300,
      systemsToUse: ['crisis-detection', 'emotion-unified', 'personality-roger', 'memory-working']
    };
  }

  // GREETING DETECTION - Fastest Processing (200ms target)
  if (isGreeting(lowerInput, messageLength)) {
    return {
      type: 'greeting',
      processingLevel: 'minimal',
      estimatedTime: 200,
      systemsToUse: ['personality-roger']
    };
  }

  // EMOTIONAL CONTENT - Standard Processing (600ms target)
  if (hasEmotionalContent(lowerInput)) {
    return {
      type: 'emotional',
      processingLevel: 'standard',
      estimatedTime: 600,
      systemsToUse: ['emotion-unified', 'personality-roger', 'memory-working', 'memory-short']
    };
  }

  // COMPLEX INTERACTION - Full Processing (800ms target)
  return {
    type: 'complex',
    processingLevel: 'full',
    estimatedTime: 800,
    systemsToUse: ['emotion-unified', 'personality-roger', 'memory-working', 'memory-short', 'rag-enhancement']
  };
};

/**
 * Fast crisis content detection
 */
const detectsCrisisContent = (input: string): boolean => {
  return /\b(suicide|kill myself|self-harm|overdose|end my life|want to die|hopeless|despair|worthless|powerless)\b/i.test(input);
};

/**
 * Fast greeting detection
 */
const isGreeting = (input: string, length: number): boolean => {
  if (length > 50) return false; // Too long to be a simple greeting
  
  return /^(hi|hello|hey|good morning|good afternoon|good evening|how are you|what's up)\.?!?\s*$/i.test(input) ||
         /^(i'm|i am) (back|here)\.?!?\s*$/i.test(input);
};

/**
 * Fast emotional content detection
 */
const hasEmotionalContent = (input: string): boolean => {
  return /\b(feel|feeling|felt|sad|happy|angry|anxious|depressed|upset|overwhelmed|frustrated|lonely|scared|worried)\b/i.test(input);
};

/**
 * Execute minimal processing for greetings
 */
export const executeMinimalProcessing = async (userInput: string): Promise<string> => {
  // Direct response without heavy processing
  const greetingResponses = [
    "Hello! I'm here to listen. What would you like to share?",
    "Hi there. What's on your mind today?",
    "Good to see you. How are you feeling right now?",
    "Hello! I'm glad you're here. What would you like to talk about?"
  ];
  
  return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
};

/**
 * Execute standard processing for emotional content
 */
export const executeStandardProcessing = async (userInput: string, conversationHistory: string[]): Promise<string> => {
  // Use only essential systems
  const { detectEmotion } = await import('./emotions/unifiedEmotionDetector');
  const { getRogerPersonalityInsight } = await import('./reflection/rogerPersonality');
  
  const emotionResult = detectEmotion(userInput);
  const personalityResponse = getRogerPersonalityInsight(userInput);
  
  return emotionResult.rogerResponse || personalityResponse || "I hear what you're sharing. Tell me more about how you're feeling.";
};
