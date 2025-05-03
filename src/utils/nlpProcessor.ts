
import { toast } from '../components/ui/sonner';

// Define model configuration
const MODEL_NAME = 'distilbert-base-uncased-finetuned-sst-2-english';
let tokenizer: any = null;
let model: any = null;
let modelLoading = false;
let modelLoaded = false;

// Flag to track if we should attempt to use transformer models
let useTransformerModels = false;

// Enhanced memory system for persistent storage
const MEMORY_STORAGE = {
  patientStatements: [] as string[],
  rogerResponses: [] as string[],
  detectedEmotions: {} as Record<string, number>,
  detectedTopics: {} as Record<string, number>,
  conversationSummary: [] as string[],
  detectedProblems: [] as string[],
  lastUpdated: Date.now(),
  persistentMemory: true
};

/**
 * Initialize the NLP model asynchronously
 * Only attempts to load if the transformers library is available
 */
export const initializeNLPModel = async (): Promise<boolean> => {
  if (modelLoaded) return true;
  if (modelLoading) return false;
  
  try {
    modelLoading = true;
    
    // Check if we can import the transformers library
    try {
      const { AutoTokenizer, AutoModelForSequenceClassification } = await import('@huggingface/transformers');
      
      console.log('Loading NLP model and tokenizer...');
      tokenizer = await AutoTokenizer.from_pretrained(MODEL_NAME);
      model = await AutoModelForSequenceClassification.from_pretrained(MODEL_NAME);
      
      useTransformerModels = true;
      modelLoaded = true;
      console.log('NLP model loaded successfully');
    } catch (error) {
      console.error('Error importing transformers library:', error);
      useTransformerModels = false;
      toast.error('Using simplified emotion detection (transformers not available)');
    }
    
    modelLoading = false;
    return useTransformerModels;
  } catch (error) {
    console.error('Error loading NLP model:', error);
    modelLoading = false;
    toast.error('Could not load the NLP model. Using fallback methods.');
    return false;
  }
};

/**
 * Enhanced memory recording function - records all aspects of a conversation
 * Treats memory retention as UNCONDITIONAL requirement
 */
export const recordToMemory = (
  patientStatement: string, 
  rogerResponse?: string, 
  emotions?: string[], 
  topics?: string[],
  problems?: string[]
): void => {
  // Always record patient statements (UNCONDITIONAL)
  if (patientStatement) {
    MEMORY_STORAGE.patientStatements.push(patientStatement);
    
    // Limit size to prevent memory overflow while maintaining context
    if (MEMORY_STORAGE.patientStatements.length > 100) {
      MEMORY_STORAGE.patientStatements = MEMORY_STORAGE.patientStatements.slice(-100);
    }
  }
  
  // Record Roger's response if provided
  if (rogerResponse) {
    MEMORY_STORAGE.rogerResponses.push(rogerResponse);
    
    if (MEMORY_STORAGE.rogerResponses.length > 100) {
      MEMORY_STORAGE.rogerResponses = MEMORY_STORAGE.rogerResponses.slice(-100);
    }
  }
  
  // Record emotions with frequency count
  if (emotions && emotions.length > 0) {
    emotions.forEach(emotion => {
      MEMORY_STORAGE.detectedEmotions[emotion] = (MEMORY_STORAGE.detectedEmotions[emotion] || 0) + 1;
    });
  }
  
  // Record topics with frequency count
  if (topics && topics.length > 0) {
    topics.forEach(topic => {
      MEMORY_STORAGE.detectedTopics[topic] = (MEMORY_STORAGE.detectedTopics[topic] || 0) + 1;
    });
  }
  
  // Record detected problems
  if (problems && problems.length > 0) {
    MEMORY_STORAGE.detectedProblems = [...new Set([...MEMORY_STORAGE.detectedProblems, ...problems])];
  }
  
  // Update last interaction timestamp
  MEMORY_STORAGE.lastUpdated = Date.now();
  
  // Create period summaries for long-term memory
  if (MEMORY_STORAGE.patientStatements.length % 10 === 0) {
    try {
      const recentStatements = MEMORY_STORAGE.patientStatements.slice(-10);
      const summary = createConversationSummary(recentStatements);
      MEMORY_STORAGE.conversationSummary.push(summary);
    } catch (error) {
      console.error('Error creating conversation summary:', error);
    }
  }
};

/**
 * Creates a summary of recent conversation for long-term memory
 */
const createConversationSummary = (statements: string[]): string => {
  // Extract main topics
  const topTopics = Object.entries(MEMORY_STORAGE.detectedTopics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic]) => topic);
    
  // Extract main emotions
  const topEmotions = Object.entries(MEMORY_STORAGE.detectedEmotions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emotion]) => emotion);
    
  return `Patient discussed ${topTopics.join(', ')} while expressing ${topEmotions.join(', ')}. Key statements included: "${statements[0]}", "${statements[statements.length-1]}".`;
};

/**
 * Retrieves all memory data - UNCONDITIONAL access ensures Roger never forgets
 */
export const getAllMemory = (): typeof MEMORY_STORAGE => {
  return MEMORY_STORAGE;
};

/**
 * Gets most relevant memories based on current context - supports UNCONDITIONAL memory rule
 */
export const getContextualMemory = (currentInput: string): {
  relevantStatements: string[];
  dominantEmotion: string;
  dominantTopics: string[];
  detectedProblems: string[];
  summary: string;
} => {
  // Find most relevant previous statements using basic keyword matching
  const keywords = currentInput.toLowerCase().split(/\W+/).filter(word => 
    word.length > 3 && !['this', 'that', 'with', 'would', 'could', 'have', 'been'].includes(word)
  );
  
  // Find patient statements that match current context
  const relevantStatements = MEMORY_STORAGE.patientStatements.filter(statement => 
    keywords.some(keyword => statement.toLowerCase().includes(keyword))
  );
  
  // Get dominant emotion
  const dominantEmotion = Object.entries(MEMORY_STORAGE.detectedEmotions)
    .sort((a, b) => b[1] - a[1])
    .map(([emotion]) => emotion)[0] || 'neutral';
  
  // Get dominant topics
  const dominantTopics = Object.entries(MEMORY_STORAGE.detectedTopics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic]) => topic);
  
  // Create summary
  const summary = MEMORY_STORAGE.conversationSummary.length > 0 
    ? MEMORY_STORAGE.conversationSummary.join(' ') 
    : "No conversation summary available yet.";
  
  return {
    relevantStatements: relevantStatements.length > 0 
      ? relevantStatements 
      : MEMORY_STORAGE.patientStatements.slice(-3),
    dominantEmotion,
    dominantTopics,
    detectedProblems: MEMORY_STORAGE.detectedProblems,
    summary
  };
};

/**
 * Detect emotion in text using transformer model
 * Uses fallback pattern matching if model isn't available
 */
export async function detectEmotion(input: string): Promise<string> {
  // Ensure text is provided
  if (!input || input.trim().length === 0) {
    return 'neutral';
  }
  
  // Try to use the transformer model if available
  if (useTransformerModels) {
    try {
      // Initialize model if not already loaded
      if (!modelLoaded) {
        const initialized = await initializeNLPModel();
        if (!initialized) {
          return detectEmotionFallback(input);
        }
      }
      
      // Dynamically import transformers if needed
      const { AutoTokenizer, AutoModelForSequenceClassification } = await import('@huggingface/transformers');
      
      // Tokenize input
      const encoded = await tokenizer.encode(input, { return_tensors: 'pt' });
      
      // Get model prediction
      const output = await model(encoded);
      const logits = output.logits;
      const probabilities = logits.softmax(1);
      const emotionIndex = probabilities.argmax().item();
      
      // Map model output to emotion
      const modelEmotion = model.config.id2label[emotionIndex] || 'neutral';
      
      // Enhance basic sentiment with more specific emotion detection
      return enhanceEmotionDetection(modelEmotion, input);
      
    } catch (error) {
      console.error('Error in emotion detection:', error);
      return detectEmotionFallback(input);
    }
  }
  
  // Fall back to pattern matching when transformers aren't available
  return detectEmotionFallback(input);
}

/**
 * Fallback emotion detection using pattern matching
 */
function detectEmotionFallback(input: string): string {
  const lowerInput = input.toLowerCase();
  
  // Pattern matching for basic emotions
  if (/\b(sad|depress|down|unhappy|miserable|heartbroken)\b/i.test(lowerInput)) return 'sad';
  if (/\b(angry|mad|furious|upset|irritated|annoyed)\b/i.test(lowerInput)) return 'angry';
  if (/\b(happy|joy|delighted|glad|pleased|cheerful)\b/i.test(lowerInput)) return 'happy';
  if (/\b(anxious|nervous|worried|concerned|afraid|scared)\b/i.test(lowerInput)) return 'anxious';
  if (/\b(confused|uncertain|unsure|puzzled|perplexed)\b/i.test(lowerInput)) return 'confused';
  
  // Default to neutral if no patterns match
  return 'neutral';
}

/**
 * Enhance basic sentiment with more specific emotion detection
 */
function enhanceEmotionDetection(baseEmotion: string, input: string): string {
  const lowerInput = input.toLowerCase();
  
  // Enhanced emotion detection based on base sentiment and additional patterns
  if (baseEmotion === 'positive') {
    if (/\b(relief|relieved)\b/i.test(lowerInput)) return 'relieved';
    if (/\b(proud|accomplishment|achievement)\b/i.test(lowerInput)) return 'proud';
    if (/\b(grateful|thankful|appreciate)\b/i.test(lowerInput)) return 'grateful';
    if (/\b(excite|thrill|enthusiasm)\b/i.test(lowerInput)) return 'excited';
    return 'happy';
  }
  
  if (baseEmotion === 'negative') {
    if (/\b(anxious|nervous|worried|concern|fear)\b/i.test(lowerInput)) return 'anxious';
    if (/\b(angry|mad|furious|irritate|annoy)\b/i.test(lowerInput)) return 'angry';
    if (/\b(sad|depress|down|unhappy|miserable)\b/i.test(lowerInput)) return 'sad';
    if (/\b(embarrass|ashamed|humiliated)\b/i.test(lowerInput)) return 'embarrassed';
    if (/\b(guilty|regret|remorse)\b/i.test(lowerInput)) return 'guilty';
    if (/\b(overwhelm|stress|burnout)\b/i.test(lowerInput)) return 'overwhelmed';
    return 'distressed';
  }
  
  return baseEmotion;
}

/**
 * Extract key topics from text
 */
export function extractKeyTopics(input: string): string[] {
  const lowerInput = input.toLowerCase();
  const topics = [];
  
  // Define topic patterns to check
  const topicPatterns = [
    { regex: /\b(work|job|career|boss|colleague|coworker)\b/i, topic: 'work' },
    { regex: /\b(family|parent|child|mom|dad|brother|sister|spouse|husband|wife)\b/i, topic: 'family' },
    { regex: /\b(friend|relationship|partner|social)\b/i, topic: 'relationships' },
    { regex: /\b(health|sick|pain|doctor|hospital|illness|disease|medical)\b/i, topic: 'health' },
    { regex: /\b(money|finance|bill|debt|afford|budget|cost|payment|spend)\b/i, topic: 'finances' },
    { regex: /\b(stress|anxious|worry|concern|nervous|overwhelm|pressure)\b/i, topic: 'stress' },
    { regex: /\b(sad|depress|unhappy|down|blue|miserable)\b/i, topic: 'sadness' },
    { regex: /\b(future|goal|plan|direction|purpose|meaning)\b/i, topic: 'future' },
    { regex: /\b(sleep|tired|exhausted|insomnia|rest|fatigue)\b/i, topic: 'sleep' },
    { regex: /\b(anger|angry|mad|furious|rage|irritate|frustrat)\b/i, topic: 'anger' }
  ];
  
  // Check each pattern and add matching topics
  for (const pattern of topicPatterns) {
    if (pattern.regex.test(lowerInput) && !topics.includes(pattern.topic)) {
      topics.push(pattern.topic);
    }
  }
  
  return topics;
}

/**
 * Analyze problem severity based on text content
 * Returns a value between 0-1 indicating severity
 */
export function analyzeProblemSeverity(input: string): number {
  const lowerInput = input.toLowerCase();
  
  // Words indicating high severity
  const highSeverityWords = [
    'crisis', 'emergency', 'urgent', 'terrible', 'horrible', 'unbearable',
    'extreme', 'severe', 'desperate', 'critical', 'worst', 'agony',
    'danger', 'suicide', 'harm', 'kill', 'die', 'death', 'fatal'
  ];
  
  // Words indicating medium severity
  const mediumSeverityWords = [
    'problem', 'difficult', 'hard', 'struggling', 'challenge', 'worried',
    'concerned', 'trouble', 'bad', 'upset', 'anxious', 'stressed',
    'overwhelmed', 'serious', 'significant', 'major', 'intense'
  ];
  
  // Count occurrences of severity indicators
  let highCount = 0;
  let mediumCount = 0;
  
  highSeverityWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerInput.match(regex);
    if (matches) highCount += matches.length;
  });
  
  mediumSeverityWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerInput.match(regex);
    if (matches) mediumCount += matches.length;
  });
  
  // Calculate severity score (0-1)
  const baseScore = Math.min(
    (highCount * 0.3 + mediumCount * 0.1) / 
    Math.max(input.split(' ').length / 10, 1),
    1
  );
  
  // Add intensity for exclamation marks and capitalization
  const exclamationCount = (input.match(/!/g) || []).length;
  const allCapsWords = input.split(' ').filter(word => 
    word.length > 3 && word === word.toUpperCase()
  ).length;
  
  // Factor in intensity indicators
  const intensityBonus = Math.min((exclamationCount * 0.05 + allCapsWords * 0.03), 0.3);
  
  return Math.min(baseScore + intensityBonus, 1);
}

/**
 * Detect problems in text using both NLP and pattern matching
 * Ensures problems are remembered UNCONDITIONALLY
 */
export function detectProblems(input: string): string[] {
  const lowerInput = input.toLowerCase();
  const problems = [];
  
  // Problem pattern categories
  const problemPatterns = [
    { regex: /\b(can'?t sleep|insomnia|trouble sleeping|wake up|(stay|staying) awake)\b/i, problem: 'sleep-issues' },
    { regex: /\b(anxious|anxiety|worry|worried|nervous|panic attack|on edge)\b/i, problem: 'anxiety' },
    { regex: /\b(sad|depressed|depression|hopeless|down|blue|unhappy|miserable)\b/i, problem: 'depression' },
    { regex: /\b(no friends|lonely|alone|isolated|no one to talk to|no social life)\b/i, problem: 'loneliness' },
    { regex: /\b(fight|fighting|argument|broke up|divorce|separated)\b/i, problem: 'relationship-conflict' },
    { regex: /\b(job loss|unemployed|fired|laid off|no work|can'?t find (a job|work))\b/i, problem: 'unemployment' },
    { regex: /\b(no money|can'?t afford|debt|bills|financial|broke|poor)\b/i, problem: 'financial-stress' },
    { regex: /\b(sick|ill|pain|disease|condition|diagnosis|chronic|symptoms)\b/i, problem: 'health-issues' },
    { regex: /\b(drink|drinking|alcohol|drunk|sober|alcoholic|addiction|substance|drugs)\b/i, problem: 'substance-use' },
    { regex: /\b(lost|grief|died|passed away|death|funeral|mourning)\b/i, problem: 'grief' },
    { regex: /\b(work stress|too much work|overworked|boss|workload|burnout|job stress)\b/i, problem: 'work-stress' },
    { regex: /\b(trauma|flashback|nightmare|ptsd|assault|attack|abuse)\b/i, problem: 'trauma' }
  ];
  
  // Check each problem pattern
  for (const pattern of problemPatterns) {
    if (pattern.regex.test(lowerInput) && !problems.includes(pattern.problem)) {
      problems.push(pattern.problem);
    }
  }
  
  // Record problems to memory (UNCONDITIONAL)
  if (problems.length > 0) {
    recordToMemory(input, undefined, undefined, undefined, problems);
  }
  
  return problems;
}

// Initialize the NLP model in the background
initializeNLPModel().catch(error => console.error('Failed to initialize NLP model:', error));
