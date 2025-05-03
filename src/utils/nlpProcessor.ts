import { AutoTokenizer, AutoModelForSequenceClassification } from '@huggingface/transformers';
import { toast } from '../components/ui/sonner';

// Define model configuration
const MODEL_NAME = 'distilbert-base-uncased-finetuned-sst-2-english';
let tokenizer: any = null;
let model: any = null;
let modelLoading = false;
let modelLoaded = false;

// Flag to track if we should attempt to use transformer models
let useTransformerModels = false;

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
