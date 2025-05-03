
/**
 * Multi-Head Attention for Memory Processing
 * 
 * Inspired by transformer architecture and LM2 models,
 * this system provides enhanced context understanding by:
 * 1. Processing conversation through multiple attention heads
 * 2. Focusing on different aspects of memory (recency, importance, relevance)
 * 3. Combining attention outputs for comprehensive understanding
 */

import { retrieveRelevantMemories, MemoryPiece } from './memoryBank';
import { getContextualMemory } from '../nlpProcessor';
import { getFiveResponseMemory } from './fiveResponseMemory';

/**
 * Process input through multiple attention heads
 */
export const processWithMultiHeadAttention = (
  userInput: string,
  conversationHistory: string[] = []
): {
  relevantMemories: MemoryPiece[];
  dominantTopics: string[];
  emotionalContext: string[];
  patientConcerns: string[];
  conversationSummary: string;
} => {
  try {
    console.log("MULTI-HEAD ATTENTION: Processing input");
    
    // Head 1: Topic-focused attention
    const topicsFocus = extractTopics(userInput, conversationHistory);
    
    // Head 2: Emotional-focused attention
    const emotionsFocus = extractEmotions(userInput, conversationHistory);
    
    // Head 3: Problem-focused attention
    const problemsFocus = extractProblems(userInput, conversationHistory);
    
    // Retrieve memories using the multi-head context
    const relevantMemories = retrieveRelevantMemories(
      userInput,
      topicsFocus,
      emotionsFocus,
      5
    );
    
    // Generate conversation summary
    const conversationSummary = generateConversationSummary(
      userInput,
      conversationHistory,
      topicsFocus,
      emotionsFocus
    );
    
    return {
      relevantMemories,
      dominantTopics: topicsFocus,
      emotionalContext: emotionsFocus,
      patientConcerns: problemsFocus,
      conversationSummary
    };
    
  } catch (error) {
    console.error('MULTI-HEAD ATTENTION: Error processing input', error);
    
    // Fallback to basic processing
    return {
      relevantMemories: [],
      dominantTopics: [],
      emotionalContext: [],
      patientConcerns: [],
      conversationSummary: ""
    };
  }
};

/**
 * Extract topics from input and conversation history (Head 1)
 */
const extractTopics = (userInput: string, conversationHistory: string[] = []): string[] => {
  const combinedText = [userInput, ...conversationHistory.slice(0, 5)].join(' ');
  const topics: string[] = [];
  
  const topicPatterns = [
    { regex: /\b(work|job|career|boss|colleague|office|workplace)\b/i, topic: 'work' },
    { regex: /\b(family|parent|child|mom|dad|brother|sister|spouse|marriage)\b/i, topic: 'family' },
    { regex: /\b(friend|relationship|partner|social|dating|love)\b/i, topic: 'relationships' },
    { regex: /\b(health|sick|pain|doctor|hospital|illness|symptom|medicine)\b/i, topic: 'health' },
    { regex: /\b(money|finance|bill|debt|afford|budget|cost|spend|income)\b/i, topic: 'finances' },
    { regex: /\b(stress|anxiety|worry|concern|nervous|overwhelm|pressure)\b/i, topic: 'stress' },
    { regex: /\b(sad|depress|unhappy|down|blue|grief|loss|low)\b/i, topic: 'sadness' },
    { regex: /\b(future|goal|plan|direction|purpose|meaning|hope)\b/i, topic: 'future' },
    { regex: /\b(sleep|tired|exhausted|insomnia|rest|fatigue|energy)\b/i, topic: 'sleep' },
    { regex: /\b(anger|angry|mad|furious|rage|irritate|frustrate)\b/i, topic: 'anger' },
    { regex: /\b(school|college|university|education|study|learn|class)\b/i, topic: 'education' },
    { regex: /\b(home|house|apartment|living|residence|move|neighbor)\b/i, topic: 'housing' },
    { regex: /\b(trauma|ptsd|abuse|assault|violence|attack|victim|survivor)\b/i, topic: 'trauma' },
    { regex: /\b(identity|self|confidence|worth|esteem|value|meaning)\b/i, topic: 'self-concept' }
  ];
  
  // Extract topics using regex patterns
  for (const { regex, topic } of topicPatterns) {
    if (regex.test(combinedText.toLowerCase())) {
      topics.push(topic);
    }
  }
  
  // Fallback to contextual memory if no topics found
  if (topics.length === 0) {
    try {
      const memory = getContextualMemory(userInput);
      if (memory.dominantTopics.length > 0) {
        topics.push(...memory.dominantTopics);
      }
    } catch (error) {
      console.error('Failed to get contextual memory for topics:', error);
    }
  }
  
  return topics;
};

/**
 * Extract emotions from input and conversation history (Head 2)
 */
const extractEmotions = (userInput: string, conversationHistory: string[] = []): string[] => {
  const combinedText = [userInput, ...conversationHistory.slice(0, 3)].join(' ');
  const emotions: string[] = [];
  
  const emotionPatterns = [
    { regex: /\b(sad|depress|down|unhappy|miserable|heartbroken|grief|loss|miss|lonely)\b/i, emotion: 'sadness' },
    { regex: /\b(angry|mad|furious|upset|irritated|annoyed|frustrated|outraged|bitter)\b/i, emotion: 'anger' },
    { regex: /\b(happy|joy|delighted|glad|pleased|cheerful|excited|thrilled|content)\b/i, emotion: 'happiness' },
    { regex: /\b(anxious|nervous|worried|concerned|afraid|scared|fear|dread|panic|stress)\b/i, emotion: 'anxiety' },
    { regex: /\b(confused|uncertain|unsure|puzzled|perplexed|lost|bewildered)\b/i, emotion: 'confusion' },
    { regex: /\b(exhausted|tired|fatigue|drained|burnt out|overwhelmed)\b/i, emotion: 'fatigue' },
    { regex: /\b(hope|optimistic|looking forward|positive|better future)\b/i, emotion: 'hope' },
    { regex: /\b(grateful|thankful|appreciate|blessed|fortunate|lucky)\b/i, emotion: 'gratitude' },
    { regex: /\b(lonely|alone|isolated|abandoned|rejected|disconnected)\b/i, emotion: 'loneliness' },
    { regex: /\b(shame|embarrass|humiliate|guilty|regret|remorse)\b/i, emotion: 'shame' },
    { regex: /\b(proud|accomplish|success|achievement|confidence|satisfied)\b/i, emotion: 'pride' }
  ];
  
  // Extract emotions using regex patterns
  for (const { regex, emotion } of emotionPatterns) {
    if (regex.test(combinedText.toLowerCase())) {
      emotions.push(emotion);
    }
  }
  
  // Fallback to contextual memory if no emotions found
  if (emotions.length === 0) {
    try {
      const memory = getContextualMemory(userInput);
      if (memory.dominantEmotion && memory.dominantEmotion !== 'neutral') {
        emotions.push(memory.dominantEmotion);
      }
    } catch (error) {
      console.error('Failed to get contextual memory for emotions:', error);
    }
  }
  
  return emotions;
};

/**
 * Extract problems/concerns from input and conversation history (Head 3)
 */
const extractProblems = (userInput: string, conversationHistory: string[] = []): string[] => {
  const combinedText = [userInput, ...conversationHistory.slice(0, 5)].join(' ');
  const problems: string[] = [];
  
  const problemPatterns = [
    { regex: /\b(can'?t sleep|insomnia|trouble sleeping|wake up|nightmares)\b/i, problem: 'sleep-issues' },
    { regex: /\b(anxious|anxiety|worry|panic attack|on edge|stress|overwhelm)\b/i, problem: 'anxiety' },
    { regex: /\b(sad|depressed|depression|hopeless|down|blue|unhappy|miserable)\b/i, problem: 'depression' },
    { regex: /\b(no friends|lonely|alone|isolated|no social life|disconnected)\b/i, problem: 'loneliness' },
    { regex: /\b(fight|argument|broke up|divorce|separated|relationship problem)\b/i, problem: 'relationship-conflict' },
    { regex: /\b(job loss|unemployed|fired|laid off|no work|employment issue)\b/i, problem: 'unemployment' },
    { regex: /\b(no money|can'?t afford|debt|bills|financial|broke|poor)\b/i, problem: 'financial-stress' },
    { regex: /\b(sick|ill|pain|disease|condition|diagnosis|chronic|symptoms)\b/i, problem: 'health-issues' },
    { regex: /\b(trauma|flashback|nightmare|ptsd|assault|attack|abuse|violated)\b/i, problem: 'trauma' },
    { regex: /\b(confused|confusion|uncertain|unsure|don'?t know what to do|lost)\b/i, problem: 'confusion' },
    { regex: /\b(family problem|parents|mother|father|sibling|family drama)\b/i, problem: 'family-issues' }
  ];
  
  // Extract problems using regex patterns
  for (const { regex, problem } of problemPatterns) {
    if (regex.test(combinedText.toLowerCase())) {
      problems.push(problem);
    }
  }
  
  // Fallback to contextual memory if no problems found
  if (problems.length === 0) {
    try {
      const memory = getContextualMemory(userInput);
      if (memory.detectedProblems.length > 0) {
        problems.push(...memory.detectedProblems);
      }
    } catch (error) {
      console.error('Failed to get contextual memory for problems:', error);
    }
  }
  
  return problems;
};

/**
 * Generate a comprehensive conversation summary
 */
const generateConversationSummary = (
  userInput: string,
  conversationHistory: string[] = [],
  topics: string[] = [],
  emotions: string[] = []
): string => {
  try {
    // Use recent conversation history (last 3-5 turns)
    const recentHistory = conversationHistory.slice(0, 6);
    
    // Get the most recent patient messages from 5ResponseMemory for redundancy
    const fiveResponseMemory = getFiveResponseMemory();
    const recentPatientMessages = fiveResponseMemory
      .filter(entry => entry.role === 'patient')
      .slice(0, 3)
      .map(entry => entry.content);
    
    // Create topic summary
    const topicSummary = topics.length > 0
      ? `Patient is discussing ${topics.join(', ')}.`
      : 'No clear topics identified.';
    
    // Create emotional summary
    const emotionSummary = emotions.length > 0
      ? `Patient appears to be feeling ${emotions.join(', ')}.`
      : 'No clear emotions detected.';
    
    // Identify key concerns
    let concernSummary = 'No specific concerns identified.';
    if (userInput.includes('?')) {
      concernSummary = 'Patient has asked a question that needs addressing.';
    } else if (/\b(help|need|struggle|difficult|hard|problem)\b/i.test(userInput)) {
      concernSummary = 'Patient may be expressing a need for help or support.';
    }
    
    // Combine summaries
    return `${topicSummary} ${emotionSummary} ${concernSummary}`;
    
  } catch (error) {
    console.error('Error generating conversation summary:', error);
    return "Conversation summary unavailable.";
  }
};

export default {
  processWithMultiHeadAttention
};
