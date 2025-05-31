
/**
 * DEPRECATED - Use useSimplifiedCrisisDetection instead
 * This file is kept for backward compatibility but should not be used
 */

import { useState, useCallback } from 'react';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';

export const useCrisisDetection = () => {
  console.warn("⚠️ useCrisisDetection is DEPRECATED - Use useSimplifiedCrisisDetection instead");
  
  const [recentCrisisMessage, setRecentCrisisMessage] = useState<string | null>(null);
  const [consecutiveCrisisCount, setConsecutiveCrisisCount] = useState(0);

  const handleCrisisMessage = useCallback(async (userInput: string): Promise<MessageType | null> => {
    console.log("⚠️ DEPRECATED: This crisis detection is no longer reliable");
    return null;
  }, []);

  const checkDeception = useCallback(() => false, []);
  const handlePersistentCrisis = useCallback(() => null, []);
  const detectCrisisLevel = useCallback(() => 'low', []);

  return {
    recentCrisisMessage,
    consecutiveCrisisCount,
    handleCrisisMessage,
    checkDeception,
    handlePersistentCrisis,
    detectCrisisLevel
  };
};
