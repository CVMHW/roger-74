/**
 * Roger's Comprehensive Nervous System Integrator
 * 
 * Connects all systems: RAG, memory, hallucination detection, crisis management,
 * personality, master rules, developmental stages, logotherapy, and scholarly materials
 * into a unified decision-making framework
 */

import { enhanceResponseWithRAG } from '../hallucinationPrevention/ragEnhancement';
import { processResponse } from '../response/processor';
import { integratedAnalysis } from '../masterRules/integration';
import { getRogerPersonalityInsight } from '../reflection/rogerPersonality';
import { identifyEnhancedFeelings } from '../reflection/feelingDetection';
import { extractEmotionsFromInput } from '../response/processor/emotions';
import { DevelopmentalStage, SeverityLevel, ConcernType } from '../reflection/reflectionTypes';
import { enhanceWithMeaningPerspective } from '../logotherapy/logotherapyIntegration';
import { masterMemory } from '../memory';
import { handleRefinedCrisisDetection } from '../../hooks/rogerianResponse/utils/messageProcessing/refinedCrisisDetection';

/**
 * Comprehensive context for Roger's nervous system
 */
export interface RogerNervousSystemContext {
  userInput: string;
  conversationHistory: string[];
  messageCount: number;
  developmentalStage?: DevelopmentalStage;
  concernType?: ConcernType;
  severityLevel?: SeverityLevel;
  emotionalContext: {
    hasDetectedEmotion: boolean;
    primaryEmotion?: string;
    isDepressionMentioned: boolean;
    emotionalIntensity?: string;
  };
  personalityInsights: {
    shouldIncludeInsight: boolean;
    insight?: string;
  };
  memoryContext: {
    relevantMemories: any[];
    isNewConversation: boolean;
    conversationThemes: string[];
  };
  crisisContext: {
    isCrisisDetected: boolean;
    crisisType?: string;
    severity?: SeverityLevel;
  };
  ragContext: {
    shouldApplyRAG: boolean;
    queryAugmentation?: string;
    retrievedKnowledge?: string[];
  };
}

/**
 * Master processor that coordinates all of Roger's systems
 */
export const processRogerianNervousSystem = async (
  originalResponse: string,
  userInput: string,
  conversationHistory: string[] = [],
  messageCount: number = 0,
  updateStage?: () => void
): Promise<{
  enhancedResponse: string;
  context: RogerNervousSystemContext;
  systemsEngaged: string[];
}> => {
  console.log("NERVOUS SYSTEM: Initializing comprehensive integration");
  
  const systemsEngaged: string[] = [];
  
  // PHASE 1: CRISIS DETECTION (HIGHEST PRIORITY)
  let crisisResponse = null;
  let crisisContext = { 
    isCrisisDetected: false,
    crisisType: undefined as string | undefined,
    severity: undefined as SeverityLevel | undefined
  };
  
  if (updateStage) {
    try {
      crisisResponse = await handleRefinedCrisisDetection(userInput, updateStage);
      if (crisisResponse) {
        crisisContext = {
          isCrisisDetected: true,
          crisisType: crisisResponse.concernType as string,
          severity: 'critical' as SeverityLevel
        };
        systemsEngaged.push('crisis-detection');
        console.log("NERVOUS SYSTEM: Crisis detected, returning crisis response");
        
        // Record in memory with highest priority
        masterMemory.addMemory(userInput, 'patient', { 
          crisis: true, 
          crisisType: crisisResponse.concernType 
        }, 1.0);
        
        return {
          enhancedResponse: crisisResponse.text,
          context: {
            userInput,
            conversationHistory,
            messageCount,
            emotionalContext: { hasDetectedEmotion: true, isDepressionMentioned: true, primaryEmotion: 'crisis' },
            personalityInsights: { shouldIncludeInsight: false },
            memoryContext: { relevantMemories: [], isNewConversation: false, conversationThemes: ['crisis'] },
            crisisContext,
            ragContext: { shouldApplyRAG: false }
          },
          systemsEngaged
        };
      }
    } catch (error) {
      console.error("NERVOUS SYSTEM: Error in crisis detection:", error);
    }
  }

  // PHASE 2: EMOTIONAL ANALYSIS
  const emotionInfo = extractEmotionsFromInput(userInput);
  const enhancedFeelings = identifyEnhancedFeelings(userInput);
  systemsEngaged.push('emotion-analysis');
  
  const emotionalContext = {
    hasDetectedEmotion: emotionInfo.hasDetectedEmotion || enhancedFeelings.length > 0,
    primaryEmotion: emotionInfo.explicitEmotion || 
                   (enhancedFeelings.length > 0 ? enhancedFeelings[0].detectedWord : undefined),
    isDepressionMentioned: /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb)\b/i.test(userInput.toLowerCase()),
    emotionalIntensity: emotionInfo.emotionalContent?.intensity
  };

  console.log("NERVOUS SYSTEM: Emotional analysis complete", emotionalContext);

  // PHASE 3: MEMORY INTEGRATION
  const isNewConversation = masterMemory.isNewConversation(userInput);
  if (isNewConversation) {
    console.log("NERVOUS SYSTEM: New conversation detected, resetting memory");
    masterMemory.resetMemory();
    systemsEngaged.push('memory-reset');
  }

  // Store current interaction
  masterMemory.addMemory(userInput, 'patient', {
    emotions: emotionalContext.primaryEmotion ? [emotionalContext.primaryEmotion] : undefined,
    isDepressionMentioned: emotionalContext.isDepressionMentioned
  }, 0.8);
  systemsEngaged.push('memory-storage');

  const relevantMemories = masterMemory.searchMemory(userInput, 5);
  const conversationThemes = extractConversationThemes(conversationHistory);
  
  const memoryContext = {
    relevantMemories,
    isNewConversation,
    conversationThemes
  };

  // PHASE 4: INTEGRATED ANALYSIS (Master Rules + Personality + Topics)
  const integrated = integratedAnalysis(userInput, conversationHistory, messageCount > 30);
  systemsEngaged.push('integrated-analysis');

  // PHASE 5: PERSONALITY INSIGHTS
  const personalityInsight = getRogerPersonalityInsight(userInput);
  
  const personalityInsights = {
    shouldIncludeInsight: !!personalityInsight && Math.random() > 0.6,
    insight: personalityInsight
  };
  
  if (personalityInsights.shouldIncludeInsight) {
    systemsEngaged.push('personality-insights');
  }

  // PHASE 6: RAG DECISION MAKING
  const shouldApplyRAG = 
    emotionalContext.isDepressionMentioned ||
    emotionalContext.hasDetectedEmotion ||
    userInput.length > 20 ||
    integrated.conversationalContext.isPersonalSharing;

  let queryAugmentation = userInput;
  if (emotionalContext.isDepressionMentioned) {
    queryAugmentation = `depression ${userInput}`;
  } else if (emotionalContext.primaryEmotion) {
    queryAugmentation = `${emotionalContext.primaryEmotion} feeling ${userInput}`;
  }

  const ragContext = {
    shouldApplyRAG,
    queryAugmentation: shouldApplyRAG ? queryAugmentation : undefined,
    retrievedKnowledge: []
  };

  // PHASE 7: RESPONSE PROCESSING PIPELINE
  let enhancedResponse = originalResponse;

  // Apply core processing (emotions, hallucination prevention)
  enhancedResponse = await processResponse(
    enhancedResponse,
    userInput,
    conversationHistory,
    emotionalContext
  );
  systemsEngaged.push('core-processing');

  // Apply RAG if needed
  if (shouldApplyRAG) {
    try {
      enhancedResponse = await enhanceResponseWithRAG(
        enhancedResponse,
        userInput,
        conversationHistory,
        emotionalContext
      );
      systemsEngaged.push('rag-enhancement');
    } catch (ragError) {
      console.error("NERVOUS SYSTEM: RAG enhancement error:", ragError);
    }
  }

  // Apply logotherapy if emotional distress is detected
  if (emotionalContext.hasDetectedEmotion || emotionalContext.isDepressionMentioned) {
    try {
      enhancedResponse = enhanceWithMeaningPerspective(
        enhancedResponse,
        userInput
      );
      systemsEngaged.push('logotherapy');
    } catch (logoError) {
      console.error("NERVOUS SYSTEM: Logotherapy enhancement error:", logoError);
    }
  }

  // PHASE 8: PERSONALITY INTEGRATION
  if (personalityInsights.shouldIncludeInsight && personalityInsights.insight) {
    enhancedResponse = integratePersonalityInsight(enhancedResponse, personalityInsights.insight);
    systemsEngaged.push('personality-integration');
  }

  // PHASE 9: FINAL DEPRESSION CHECK
  if (emotionalContext.isDepressionMentioned && 
      !/\b(depress(ed|ing|ion)?|difficult|hard time|sorry to hear)\b/i.test(enhancedResponse.toLowerCase())) {
    console.log("NERVOUS SYSTEM: CRITICAL - Adding depression acknowledgment");
    enhancedResponse = "I'm really sorry to hear you're feeling depressed. " + enhancedResponse;
    systemsEngaged.push('depression-safety-net');
  }

  // PHASE 10: MEMORY FINALIZATION
  masterMemory.addMemory(enhancedResponse, 'roger', {
    inResponseTo: userInput,
    userEmotions: emotionalContext.primaryEmotion ? [emotionalContext.primaryEmotion] : undefined,
    systemsUsed: systemsEngaged
  });

  const context: RogerNervousSystemContext = {
    userInput,
    conversationHistory,
    messageCount,
    emotionalContext,
    personalityInsights,
    memoryContext,
    crisisContext,
    ragContext
  };

  console.log("NERVOUS SYSTEM: Processing complete", { systemsEngaged: systemsEngaged.length });

  return {
    enhancedResponse,
    context,
    systemsEngaged
  };
};

/**
 * Extract conversation themes from history
 */
const extractConversationThemes = (history: string[]): string[] => {
  const themes: string[] = [];
  const recentHistory = history.slice(-10);
  
  const themePatterns = {
    'depression': /\b(depress(ed|ing|ion)?|sad|down|low|hopeless)\b/i,
    'anxiety': /\b(anxious|anxiety|worry|worried|stress|panic)\b/i,
    'relationships': /\b(relationship|partner|spouse|family|friend)\b/i,
    'work': /\b(work|job|career|boss|colleague)\b/i,
    'health': /\b(health|medical|doctor|hospital|illness)\b/i
  };
  
  for (const [theme, pattern] of Object.entries(themePatterns)) {
    if (recentHistory.some(msg => pattern.test(msg))) {
      themes.push(theme);
    }
  }
  
  return themes;
};

/**
 * Integrate personality insight into response
 */
const integratePersonalityInsight = (response: string, insight: string): string => {
  const sentences = response.split(/(?<=[.!?])\s+/);
  
  if (sentences.length > 2) {
    // Insert after the first or second sentence
    const insertionPoint = Math.min(2, sentences.length - 1);
    const firstPart = sentences.slice(0, insertionPoint).join(' ');
    const secondPart = sentences.slice(insertionPoint).join(' ');
    
    return `${firstPart} ${insight} ${secondPart}`;
  } else {
    // Append at the end
    return `${response} ${insight}`;
  }
};
