
import { useState } from 'react';
import { ConversationStage as ReflectionConversationStage } from '../../utils/reflection/reflectionTypes';

// Using the extended ConversationStage type from reflectionTypes
export type ConversationStage = ReflectionConversationStage;

interface UseConversationStageParams {
  initialStage?: ConversationStage;
  earlyThreshold?: number;
}

export const useConversationStage = ({
  initialStage = 'initial',
  earlyThreshold = 10
}: UseConversationStageParams = {}) => {
  const [conversationStage, setConversationStage] = useState<ConversationStage>(initialStage);
  const [messageCount, setMessageCount] = useState(0);
  const [introductionMade, setIntroductionMade] = useState(false);

  const updateStage = () => {
    // Increment message count to track conversation progression
    const newMessageCount = messageCount + 1;
    setMessageCount(newMessageCount);
    
    // Update conversation stage based on message count
    if (conversationStage === 'initial') {
      setConversationStage('early');
      // Mark that an introduction has been made after the first message
      setIntroductionMade(true);
    } else if (conversationStage === 'early' && newMessageCount >= earlyThreshold) {
      setConversationStage('established');
    }
  };

  return {
    conversationStage,
    messageCount,
    introductionMade,
    updateStage,
    setIntroductionMade
  };
};
