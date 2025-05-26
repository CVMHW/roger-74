
import { useState } from 'react';
import { ConversationStage } from '../../utils/reflection/reflectionTypes';

interface UseConversationStageParams {
  initialStage?: ConversationStage;
  earlyThreshold?: number;
}

export const useConversationStage = ({
  initialStage = 'opening',
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
    if (conversationStage === 'opening') {
      setConversationStage('exploration');
      // Mark that an introduction has been made after the first message
      setIntroductionMade(true);
    } else if (conversationStage === 'exploration' && newMessageCount >= earlyThreshold) {
      setConversationStage('deepening');
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
