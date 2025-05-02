
import { useCallback } from 'react';
import { MessageType } from '../../components/Message';
import { storeFeedback } from '../../utils/messageUtils';

/**
 * Hook for handling message feedback
 */
export const useFeedbackHandler = (
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  toast: any
) => {
  // Handle feedback for Roger's messages
  const handleFeedback = useCallback((messageId: string, feedback: 'positive' | 'negative') => {
    // Update the message with feedback
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
    
    // Store feedback for learning
    storeFeedback(messageId, feedback);
    
    // Show toast notification
    toast({
      title: feedback === 'positive' ? "Thank you for your feedback" : "We'll improve our responses",
      description: feedback === 'positive' 
        ? "We're glad this response was helpful." 
        : "Thank you for helping us improve Roger's responses.",
      duration: 3000,
    });
  }, [setMessages, toast]);

  return { handleFeedback };
};
