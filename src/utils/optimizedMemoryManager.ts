
/**
 * Optimized Memory Manager
 * 
 * Patient-focused memory selection based on interaction type
 * Target: 50ms for greetings, 150ms for returning patients, 300ms for complex
 */

interface OptimizedMemoryConfig {
  useWorking: boolean;
  useShortTerm: boolean;
  useLongTerm: boolean;
  useVector: boolean;
  maxProcessingTime: number;
}

/**
 * Get memory configuration based on interaction type
 */
export const getMemoryConfig = (routeType: string, isNewPatient: boolean): OptimizedMemoryConfig => {
  switch (routeType) {
    case 'greeting':
      return {
        useWorking: true,
        useShortTerm: false,
        useLongTerm: false,
        useVector: false,
        maxProcessingTime: 50
      };
      
    case 'crisis':
      return {
        useWorking: true,
        useShortTerm: true,
        useLongTerm: !isNewPatient,
        useVector: false,
        maxProcessingTime: 150
      };
      
    case 'emotional':
      return {
        useWorking: true,
        useShortTerm: true,
        useLongTerm: !isNewPatient,
        useVector: false,
        maxProcessingTime: 200
      };
      
    case 'complex':
    default:
      return {
        useWorking: true,
        useShortTerm: true,
        useLongTerm: true,
        useVector: !isNewPatient,
        maxProcessingTime: 300
      };
  }
};

/**
 * Process memory with optimized configuration
 */
export const processOptimizedMemory = async (
  userInput: string,
  routeType: string,
  conversationHistory: string[] = []
): Promise<{
  relevantMemories: any[];
  processingTime: number;
  systemsUsed: string[];
}> => {
  const startTime = Date.now();
  const isNewPatient = conversationHistory.length <= 3;
  const config = getMemoryConfig(routeType, isNewPatient);
  const systemsUsed: string[] = [];
  let relevantMemories: any[] = [];

  try {
    // Only use working memory for all interactions
    if (config.useWorking) {
      const { masterMemory } = await import('./memory');
      masterMemory.addMemory(userInput, 'patient');
      systemsUsed.push('working-memory');
    }

    // Add short-term only for non-greeting interactions
    if (config.useShortTerm && routeType !== 'greeting') {
      relevantMemories = await getShortTermMemories(userInput);
      systemsUsed.push('short-term-memory');
    }

    // Add long-term only for returning patients with complex needs
    if (config.useLongTerm && !isNewPatient) {
      const longTermMemories = await getLongTermMemories(userInput);
      relevantMemories = [...relevantMemories, ...longTermMemories];
      systemsUsed.push('long-term-memory');
    }

    const processingTime = Date.now() - startTime;
    
    // Ensure we don't exceed time limits
    if (processingTime > config.maxProcessingTime) {
      console.warn(`Memory processing exceeded ${config.maxProcessingTime}ms: ${processingTime}ms`);
    }

    return { relevantMemories, processingTime, systemsUsed };

  } catch (error) {
    console.error('Optimized memory processing error:', error);
    return { 
      relevantMemories: [], 
      processingTime: Date.now() - startTime, 
      systemsUsed: ['error-fallback'] 
    };
  }
};

const getShortTermMemories = async (userInput: string): Promise<any[]> => {
  // Simplified short-term memory retrieval
  return [];
};

const getLongTermMemories = async (userInput: string): Promise<any[]> => {
  // Simplified long-term memory retrieval
  return [];
};
