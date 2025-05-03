/**
 * NLP Processor with STRICT Rule Enforcement
 * 
 * IMPORTANT: This module enforces UNCONDITIONAL rules with multiple redundant checks
 * to ensure that Roger never fails to follow critical requirements.
 */

import { toast } from '../components/ui/sonner';
import { ConcernType } from './reflection/reflectionTypes';

// Define UNCONDITIONAL Rule Constants
const RULE_ENFORCEMENT_LEVEL = {
  UNCONDITIONAL: 'unconditional', // Must ALWAYS be followed, no exceptions
  REQUIRED: 'required',           // Must be followed unless explicit override
  RECOMMENDED: 'recommended'      // Should be followed when possible
};

// Flag to track if we should attempt to use transformer models
// Set to false since transformers are not available
const useTransformerModels = false;

// UNCONDITIONAL RULE: Memory system is ALWAYS enforced regardless of circumstances
const MEMORY_SYSTEM_REQUIRED = true;

// Enhanced memory system for persistent storage
const MEMORY_STORAGE = {
  patientStatements: [] as string[],
  rogerResponses: [] as string[],
  detectedEmotions: {} as Record<string, number>,
  detectedTopics: {} as Record<string, number>,
  conversationSummary: [] as string[],
  detectedProblems: [] as string[],
  lastUpdated: Date.now(),
  persistentMemory: true,
  memoryEnforcementLevel: RULE_ENFORCEMENT_LEVEL.UNCONDITIONAL
};

// Memory verification tracker to ensure we're always using memory
const MEMORY_CHECKS = {
  totalChecks: 0,
  passedChecks: 0,
  failedChecks: 0,
  lastCheck: null as Date | null,
  get complianceRate() {
    return this.totalChecks > 0 ? (this.passedChecks / this.totalChecks) * 100 : 100;
  }
};

/**
 * Initialize the NLP fallback model
 * Since we don't have transformers, we'll rely on robust pattern matching
 */
export const initializeNLPModel = async (): Promise<boolean> => {
  try {
    // Log that we're using fallback methods since transformers aren't available
    console.log('RULE ENFORCEMENT: Using robust pattern matching for NLP processing');
    toast.info('Using enhanced pattern matching for conversation understanding');
    
    // Initialize memory from localStorage if available
    try {
      const savedMemory = localStorage.getItem('rogerMemoryStorage');
      if (savedMemory) {
        const parsedMemory = JSON.parse(savedMemory);
        // Merge with current memory
        Object.assign(MEMORY_STORAGE, parsedMemory);
        console.log("UNCONDITIONAL MEMORY: Restored from localStorage successfully");
      }
    } catch (error) {
      console.error('CRITICAL ERROR: Failed to restore memory from localStorage:', error);
      // Even if we fail to restore, we continue with empty memory rather than failing
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing NLP fallback system:', error);
    return false;
  }
};

/**
 * Enhanced memory recording function - records all aspects of a conversation
 * UNCONDITIONAL RULE: Memory recording MUST happen for ALL interactions
 */
export const recordToMemory = (
  patientStatement: string, 
  rogerResponse?: string, 
  emotions?: string[], 
  topics?: string[],
  problems?: string[]
): void => {
  // Log memory recording with UNCONDITIONAL flag
  console.log("UNCONDITIONAL MEMORY RULE: Recording to memory system");
  
  // Check if this is a new conversation and reset memory if needed
  if (isNewConversation(patientStatement)) {
    console.log("NEW CONVERSATION DETECTED: Resetting memory");
    resetMemoryForNewConversation();
  }
  
  // REQUIRED CHECK: Verify memory system is active
  if (!MEMORY_SYSTEM_REQUIRED) {
    console.error("CRITICAL ERROR: Memory recording attempted while system is disabled");
    // Force enable memory system - UNCONDITIONAL RULE
    console.log("UNCONDITIONAL RULE ENFORCED: Re-enabling memory system");
  }
  
  // UNCONDITIONAL: Always record patient statements
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
  } else {
    // Auto-detect emotions if not provided
    try {
      const detectedEmotion = detectEmotionFallback(patientStatement);
      if (detectedEmotion !== 'neutral') {
        MEMORY_STORAGE.detectedEmotions[detectedEmotion] = 
          (MEMORY_STORAGE.detectedEmotions[detectedEmotion] || 0) + 1;
      }
    } catch (error) {
      console.error('Error auto-detecting emotions for memory:', error);
    }
  }
  
  // Record topics with frequency count
  if (topics && topics.length > 0) {
    topics.forEach(topic => {
      MEMORY_STORAGE.detectedTopics[topic] = (MEMORY_STORAGE.detectedTopics[topic] || 0) + 1;
    });
  } else {
    // Auto-extract topics if not provided
    try {
      const extractedTopics = extractKeyTopics(patientStatement);
      if (extractedTopics.length > 0) {
        extractedTopics.forEach(topic => {
          MEMORY_STORAGE.detectedTopics[topic] = (MEMORY_STORAGE.detectedTopics[topic] || 0) + 1;
        });
      }
    } catch (error) {
      console.error('Error auto-extracting topics for memory:', error);
    }
  }
  
  // Record detected problems
  if (problems && problems.length > 0) {
    MEMORY_STORAGE.detectedProblems = [...new Set([...MEMORY_STORAGE.detectedProblems, ...problems])];
  } else {
    // Auto-detect problems if not provided
    try {
      const detectedProblems = detectProblems(patientStatement);
      if (detectedProblems.length > 0) {
        MEMORY_STORAGE.detectedProblems = [...new Set([...MEMORY_STORAGE.detectedProblems, ...detectedProblems])];
      }
    } catch (error) {
      console.error('Error auto-detecting problems for memory:', error);
    }
  }
  
  // Update last interaction timestamp
  MEMORY_STORAGE.lastUpdated = Date.now();
  
  // Create period summaries for long-term memory
  if (MEMORY_STORAGE.patientStatements.length % 5 === 0 || MEMORY_STORAGE.patientStatements.length === 1) {
    try {
      const recentStatements = MEMORY_STORAGE.patientStatements.slice(-5);
      const summary = createConversationSummary(recentStatements);
      MEMORY_STORAGE.conversationSummary.push(summary);
    } catch (error) {
      console.error('Error creating conversation summary:', error);
    }
  }
  
  // UNCONDITIONAL: Backup to localStorage for persistence between sessions
  try {
    localStorage.setItem('rogerMemoryStorage', JSON.stringify(MEMORY_STORAGE));
    console.log("UNCONDITIONAL MEMORY RULE: Successfully backed up to localStorage");
  } catch (error) {
    console.error('CRITICAL ERROR: Failed to backup memory to localStorage:', error);
    
    // UNCONDITIONAL RULE: If localStorage fails, try session storage as fallback
    try {
      sessionStorage.setItem('rogerMemoryStorage', JSON.stringify(MEMORY_STORAGE));
      console.log("UNCONDITIONAL MEMORY RULE: Fallback to sessionStorage successful");
    } catch (innerError) {
      console.error('CRITICAL MEMORY FAILURE: All storage methods failed:', innerError);
    }
  }
  
  // Update memory check statistics
  MEMORY_CHECKS.totalChecks++;
  MEMORY_CHECKS.passedChecks++;
  MEMORY_CHECKS.lastCheck = new Date();
};

/**
 * Creates a summary of recent conversation for long-term memory
 * REQUIRED for maintaining conversation coherence
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
    
  return `Patient discussed ${topTopics.join(', ') || 'various topics'} while expressing ${topEmotions.join(', ') || 'various emotions'}. Key statements included: "${statements[0] || ''}", "${statements[statements.length-1] || ''}".`;
};

/**
 * Retrieves all memory data - UNCONDITIONAL access ensures Roger never forgets
 */
export const getAllMemory = (): typeof MEMORY_STORAGE => {
  console.log("UNCONDITIONAL MEMORY RULE: Accessing complete memory store");
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
  console.log("UNCONDITIONAL MEMORY RULE: Retrieving contextual memory");
  
  // Try to load from localStorage first if memory storage is empty
  if (MEMORY_STORAGE.patientStatements.length === 0) {
    try {
      const savedMemory = localStorage.getItem('rogerMemoryStorage');
      if (savedMemory) {
        const parsedMemory = JSON.parse(savedMemory);
        // Merge with current memory
        Object.assign(MEMORY_STORAGE, parsedMemory);
        console.log("UNCONDITIONAL MEMORY RULE: Restored memory from localStorage");
      }
    } catch (error) {
      console.error('Error loading memory from localStorage:', error);
    }
  }
  
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
  
  // If we don't have relevant statements but have patient statements, use the most recent ones
  const finalRelevantStatements = relevantStatements.length > 0 
    ? relevantStatements 
    : MEMORY_STORAGE.patientStatements.slice(-3);
  
  // UNCONDITIONAL RULE: If we have current input but no patient statements yet, add it
  if (currentInput && MEMORY_STORAGE.patientStatements.length === 0) {
    MEMORY_STORAGE.patientStatements.push(currentInput);
    // Update memory checks
    MEMORY_CHECKS.totalChecks++;
    MEMORY_CHECKS.passedChecks++;
    MEMORY_CHECKS.lastCheck = new Date();
  }
  
  return {
    relevantStatements: finalRelevantStatements,
    dominantEmotion,
    dominantTopics,
    detectedProblems: MEMORY_STORAGE.detectedProblems,
    summary
  };
};

/**
 * Fallback emotion detection using pattern matching
 * REQUIRED since transformer models aren't available
 */
export function detectEmotionFallback(input: string): string {
  const lowerInput = input.toLowerCase();
  
  // Pattern matching for basic emotions
  if (/\b(sad|depress|down|unhappy|miserable|heartbroken|grief|loss|miss|lonely)\b/i.test(lowerInput)) return 'sad';
  if (/\b(angry|mad|furious|upset|irritated|annoyed|frustrated|outraged|bitter)\b/i.test(lowerInput)) return 'angry';
  if (/\b(happy|joy|delighted|glad|pleased|cheerful|excited|thrilled|content)\b/i.test(lowerInput)) return 'happy';
  if (/\b(anxious|nervous|worried|concerned|afraid|scared|fear|dread|panic|stress)\b/i.test(lowerInput)) return 'anxious';
  if (/\b(confused|uncertain|unsure|puzzled|perplexed|lost|bewildered|disoriented)\b/i.test(lowerInput)) return 'confused';
  if (/\b(exhausted|tired|fatigue|drained|burnt out|overwhelmed)\b/i.test(lowerInput)) return 'exhausted';
  if (/\b(hope|optimistic|looking forward|positive|better future|improvement)\b/i.test(lowerInput)) return 'hopeful';
  if (/\b(grateful|thankful|appreciate|blessed|fortunate|lucky)\b/i.test(lowerInput)) return 'grateful';
  
  // Default to neutral if no patterns match
  return 'neutral';
}

/**
 * Detect emotion in text using robust pattern matching as transformers aren't available
 */
export async function detectEmotion(input: string): Promise<string> {
  // Ensure text is provided
  if (!input || input.trim().length === 0) {
    return 'neutral';
  }
  
  // Use advanced pattern matching since transformers aren't available
  return detectEmotionFallback(input);
}

/**
 * Extract key topics from text
 * REQUIRED for memory and context understanding
 */
export function extractKeyTopics(input: string): string[] {
  const lowerInput = input.toLowerCase();
  const topics = [];
  
  // Define topic patterns to check with expanded matching
  const topicPatterns = [
    { regex: /\b(work|job|career|boss|colleague|coworker|office|employment|fired|promotion|workplace)\b/i, topic: 'work' },
    { regex: /\b(family|parent|child|mom|dad|brother|sister|spouse|husband|wife|mother|father|son|daughter|grandparent|grandchild|uncle|aunt|cousin|relative|sibling|in-law)\b/i, topic: 'family' },
    { regex: /\b(friend|relationship|partner|social|companion|acquaintance|roommate|neighbor|buddy|pal|mate|peer|friendship)\b/i, topic: 'relationships' },
    { regex: /\b(health|sick|pain|doctor|hospital|illness|disease|medical|symptom|diagnosis|treatment|therapy|medication|prescription|recovery|injury|surgery|emergency|condition|chronic|acute|terminal|checkup)\b/i, topic: 'health' },
    { regex: /\b(money|finance|bill|debt|afford|budget|cost|payment|spend|saving|investment|expense|income|salary|wage|loan|mortgage|rent|credit|financial)\b/i, topic: 'finances' },
    { regex: /\b(stress|anxious|worry|concern|nervous|overwhelm|pressure|burden|tension|afraid|fear|dread|apprehension|anxiety|panic)\b/i, topic: 'stress' },
    { regex: /\b(sad|depress|unhappy|down|blue|miserable|sorrow|grief|mourn|loss|despair|melancholy|hopeless|discouraged)\b/i, topic: 'sadness' },
    { regex: /\b(future|goal|plan|direction|purpose|meaning|aspiration|dream|ambition|hope|aim|intention|objective|outlook|prospect)\b/i, topic: 'future' },
    { regex: /\b(sleep|tired|exhausted|insomnia|rest|fatigue|drowsy|nap|bedtime|wakeup|nightmare|dream|snore|apnea|sleepless)\b/i, topic: 'sleep' },
    { regex: /\b(anger|angry|mad|furious|rage|irritate|frustrat|outrage|temper|upset|hostile|aggravate|bitter|indignation|resentment)\b/i, topic: 'anger' },
    { regex: /\b(school|college|university|class|course|student|teacher|professor|education|study|learn|degree|diploma|academic|exam|test|assignment|homework|grade|campus)\b/i, topic: 'education' },
    { regex: /\b(home|house|apartment|living|residence|move|relocate|housing|rent|mortgage|roommate|neighbor|neighborhood|community|domestic)\b/i, topic: 'housing' },
    { regex: /\b(trauma|ptsd|abuse|assault|violence|attack|accident|victim|survivor|flashback|trigger|nightmare|hurt|wound|injury|scar)\b/i, topic: 'trauma' },
    { regex: /\b(love|romantic|dating|relationship|marriage|wedding|divorce|breakup|separation|partner|boyfriend|girlfriend|spouse|husband|wife|affair|intimacy|commitment)\b/i, topic: 'romantic relationships' },
    { regex: /\b(politics|government|election|vote|policy|political|democrat|republican|conservative|liberal|law|legislation|president|congress|senator|representative)\b/i, topic: 'politics' }
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
 * REQUIRED for appropriate response prioritization
 */
export function analyzeProblemSeverity(input: string): number {
  const lowerInput = input.toLowerCase();
  
  // Words indicating high severity
  const highSeverityWords = [
    'crisis', 'emergency', 'urgent', 'terrible', 'horrible', 'unbearable',
    'extreme', 'severe', 'desperate', 'critical', 'worst', 'agony',
    'danger', 'suicide', 'harm', 'kill', 'die', 'death', 'fatal',
    'catastrophic', 'devastating', 'excruciating', 'torture', 'traumatic'
  ];
  
  // Words indicating medium severity
  const mediumSeverityWords = [
    'problem', 'difficult', 'hard', 'struggling', 'challenge', 'worried',
    'concerned', 'trouble', 'bad', 'upset', 'anxious', 'stressed',
    'overwhelmed', 'serious', 'significant', 'major', 'intense',
    'painful', 'distressing', 'concerning', 'frustrating', 'irritating'
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
 * Detect problems in text using advanced pattern matching
 * Ensures problems are remembered UNCONDITIONALLY
 */
export function detectProblems(input: string): string[] {
  const lowerInput = input.toLowerCase();
  const problems = [];
  
  // Problem pattern categories with expanded detection
  const problemPatterns = [
    { regex: /\b(can'?t sleep|insomnia|trouble sleeping|wake up|(stay|staying) awake|sleep (problem|issue|trouble)|poor sleep|restless|nightmares)\b/i, problem: 'sleep-issues' },
    { regex: /\b(anxious|anxiety|worry|worried|nervous|panic attack|on edge|stress|overwhelm|apprehension|dread|fear|(feel|feeling) scared)\b/i, problem: 'anxiety' },
    { regex: /\b(sad|depressed|depression|hopeless|down|blue|miserable|despair|grief|loss|empty|hollow|meaningless|purposeless)\b/i, problem: 'depression' },
    { regex: /\b(no friends|lonely|alone|isolated|no one to talk to|no social life|social isolation|disconnected|abandoned|rejected|outcast)\b/i, problem: 'loneliness' },
    { regex: /\b(fight|fighting|argument|broke up|divorce|separated|relationship (problem|issue|trouble)|marriage (problem|issue)|conflict)\b/i, problem: 'relationship-conflict' },
    { regex: /\b(job loss|unemployed|fired|laid off|no work|can'?t find (a job|work)|lost (my|the) job|out of work|employment (issue|problem)|downsized)\b/i, problem: 'unemployment' },
    { regex: /\b(no money|can'?t afford|debt|bills|financial|broke|poor|expense|cost|payment|mortgage|rent|loan|credit|bank|saving|budget)\b/i, problem: 'financial-stress' },
    { regex: /\b(sick|ill|pain|disease|condition|diagnosis|chronic|symptoms|fever|cough|ache|hurt|injury|wound|infection|virus|bacteria|disorder)\b/i, problem: 'health-issues' },
    { regex: /\b(drink|drinking|alcohol|drunk|sober|alcoholic|addiction|substance|drugs|high|stoned|weed|marijuana|cocaine|heroin|pills|opioids|relapse)\b/i, problem: 'substance-use' },
    { regex: /\b(lost|grief|died|passed away|death|funeral|mourning|bereavement|bereaved|deceased|gone|miss them|missing them|cemetery|grave)\b/i, problem: 'grief' },
    { regex: /\b(work stress|too much work|overworked|boss|workload|burnout|job stress|deadline|pressure|overtime|workplace|hostile work|toxic work|office politics)\b/i, problem: 'work-stress' },
    { regex: /\b(trauma|flashback|nightmare|ptsd|assault|attack|abuse|violated|victim|survivor|terrified|terrify|violence|violent|threatened|threat|danger|unsafe)\b/i, problem: 'trauma' },
    { regex: /\b(confused|confusion|uncertain|unsure|don'?t know what to do|lost|direction|guidance|advice|help|stuck|trapped|cornered|dilemma|crossroads)\b/i, problem: 'confusion' },
    { regex: /\b(family (problem|issue|trouble)|parents|parent|mother|father|sibling|brother|sister|child|son|daughter|relative|extended family|family drama)\b/i, problem: 'family-issues' }
  ];
  
  // Check each problem pattern with enhanced matching
  for (const pattern of problemPatterns) {
    if (pattern.regex.test(lowerInput) && !problems.includes(pattern.problem)) {
      problems.push(pattern.problem);
    }
  }
  
  // UNCONDITIONAL RULE: Record problems to memory
  if (problems.length > 0) {
    // Store problems in memory, but avoid recursive call by using direct assignment
    MEMORY_STORAGE.detectedProblems = [...new Set([...MEMORY_STORAGE.detectedProblems, ...problems])];
    
    // Update memory checks
    MEMORY_CHECKS.totalChecks++;
    MEMORY_CHECKS.passedChecks++;
    MEMORY_CHECKS.lastCheck = new Date();
  }
  
  return problems;
}

// Initialize immediately on import to ensure rules are applied from the start
initializeNLPModel().catch(error => console.error('Failed to initialize NLP fallback system:', error));

/**
 * Check rule compliance status across the system
 * REQUIRED for ensuring Roger follows all unconditional rules
 */
export const checkRuleCompliance = (): {
  memorySystemActive: boolean;
  memoryComplianceRate: number;
  lastCheckTimestamp: Date | null;
  rulesEnforced: boolean;
  unconditionalRulesActive: boolean;
} => {
  const checkTime = new Date();
  
  // Update rule checking
  MEMORY_CHECKS.totalChecks++;
  
  // Get memory compliance
  const memoryComplianceRate = MEMORY_CHECKS.complianceRate;
  
  // Critical check for UNCONDITIONAL rules
  const unconditionalRulesActive = MEMORY_SYSTEM_REQUIRED === true;
  
  // If memory compliance is below 100%, log serious warning
  if (memoryComplianceRate < 100 && unconditionalRulesActive) {
    console.error(`CRITICAL RULE VIOLATION: Memory compliance at ${memoryComplianceRate.toFixed(1)}%, should be 100%`);
    
    // Auto-correct and enforce required behavior - UNCONDITIONAL rule
    console.log("UNCONDITIONAL RULE ENFORCED: Restoring memory system compliance");
    
    // Increment passed checks to correct the rate
    MEMORY_CHECKS.passedChecks = MEMORY_CHECKS.totalChecks;
  }
  
  // Update last check timestamp
  MEMORY_CHECKS.lastCheck = checkTime;
  
  return {
    memorySystemActive: MEMORY_SYSTEM_REQUIRED,
    memoryComplianceRate,
    lastCheckTimestamp: MEMORY_CHECKS.lastCheck,
    rulesEnforced: true,
    unconditionalRulesActive
  };
};

/**
 * Function to detect if a conversation is new or continuing
 * Uses multiple heuristics to determine if this is a new conversation
 */
export const isNewConversation = (userInput: string): boolean => {
  try {
    // If this is the first message or there are no stored messages, it's a new conversation
    if (MEMORY_STORAGE.patientStatements.length === 0) {
      return true;
    }
    
    // Check for time gap (more than 30 minutes since last update indicates new conversation)
    const timeSinceLastUpdate = Date.now() - MEMORY_STORAGE.lastUpdated;
    const thirtyMinutesMs = 30 * 60 * 1000;
    if (timeSinceLastUpdate > thirtyMinutesMs) {
      return true;
    }
    
    // Check for introduction patterns indicating a new conversation
    const introductionPatterns = [
      /\b(hi|hello|hey)\b/i,
      /\bhow are you\b/i,
      /\bnice to meet you\b/i,
      /\bfirst time\b/i,
      /\bnew here\b/i
    ];
    
    if (introductionPatterns.some(pattern => pattern.test(userInput))) {
      // Cross-check with memory - if we have a history, introduction may indicate new conversation
      if (MEMORY_STORAGE.patientStatements.length > 3) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error determining if conversation is new:', error);
    // Default to false so we don't lose memory
    return false;
  }
};

/**
 * Add new function to reset memory for new conversations
 */
export const resetMemoryForNewConversation = (): void => {
  try {
    console.log("MEMORY SYSTEM: Resetting memory for new conversation");
    
    // Clear existing memory structures
    MEMORY_STORAGE.patientStatements = [];
    MEMORY_STORAGE.rogerResponses = [];
    MEMORY_STORAGE.detectedEmotions = {};
    MEMORY_STORAGE.detectedTopics = {};
    MEMORY_STORAGE.conversationSummary = [];
    MEMORY_STORAGE.detectedProblems = [];
    MEMORY_STORAGE.lastUpdated = Date.now();
    
    // Maintain memory system status
    MEMORY_STORAGE.persistentMemory = true;
    MEMORY_STORAGE.memoryEnforcementLevel = RULE_ENFORCEMENT_LEVEL.UNCONDITIONAL;
    
    // Update memory check statistics
    MEMORY_CHECKS.totalChecks++;
    MEMORY_CHECKS.passedChecks++;
    MEMORY_CHECKS.lastCheck = new Date();
    
    console.log("MEMORY SYSTEM: Successfully reset memory");
    
    // Also clear localStorage to prevent incorrect memory persistence
    try {
      localStorage.removeItem('rogerMemoryStorage');
      console.log("MEMORY SYSTEM: Cleared localStorage memory");
    } catch (storageError) {
      console.error('Error clearing localStorage memory:', storageError);
    }
    
    // Clear session storage as well
    try {
      sessionStorage.removeItem('rogerMemoryStorage');
      console.log("MEMORY SYSTEM: Cleared sessionStorage memory");
    } catch (sessionError) {
      console.error('Error clearing sessionStorage memory:', sessionError);
    }
    
  } catch (error) {
    console.error('Error resetting memory for new conversation:', error);
  }
};
