import React, { useState, useEffect } from 'react';
import { MessageType } from './Message';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { 
  useToast 
} from '@/components/ui/use-toast';
import {
  getInitialMessages,
  createMessage,
  storeFeedback
} from '../utils/messageUtils';
import useRogerianResponse from '../hooks/useRogerianResponse';
import { 
  MASTER_RULES, 
  isIntroduction, 
  generateIntroductionResponse,
  isSmallTalk,
  generateSmallTalkResponse,
  isPersonalSharing,
  generatePersonalSharingResponse
} from '../utils/masterRules';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>(getInitialMessages());
  const { isTyping, processUserMessage, simulateTypingResponse, currentApproach } = useRogerianResponse();
  const { toast } = useToast();
  
  // Track all Roger responses to prevent repetition (in accordance with master rules)
  const [rogerResponseHistory, setRogerResponseHistory] = useState<string[]>([]);
  
  // On component mount, extract existing Roger responses for the history
  useEffect(() => {
    const initialRogerMessages = messages
      .filter(msg => msg.sender === 'roger')
      .map(msg => msg.text);
    
    if (initialRogerMessages.length > 0) {
      setRogerResponseHistory(initialRogerMessages);
    }
  }, []);

  // Handle feedback for Roger's messages
  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
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
  };

  const handleSendMessage = (userInput: string) => {
    if (!userInput.trim()) return;

    // Add user message
    const newUserMessage = createMessage(userInput, 'user');
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // Process user input to generate Roger's response
    processUserMessage(userInput).then(rogerResponse => {
      // Add the response to history to prevent future repetition
      setRogerResponseHistory(prev => [...prev, rogerResponse.text]);
      
      // Add the empty response message first (will be updated during typing simulation)
      setMessages(prevMessages => [...prevMessages, rogerResponse]);
      
      // Simulate typing with a callback to update the message text
      simulateTypingResponse(rogerResponse.text, (text) => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === rogerResponse.id ? { ...msg, text } : msg
          )
        );
      });
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <MessageList 
        messages={messages} 
        isTyping={isTyping} 
        onFeedback={handleFeedback}
      />
      
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

// Import needed utilities to make ChatInterface work properly 
// (since we've moved them out of this file)
import { 
  getCrisisMessage,
  getMedicalConcernMessage,
  getMentalHealthConcernMessage,
  getEatingDisorderMessage,
  getSubstanceUseMessage,
  getTentativeHarmMessage
} from '../utils/responseUtils';
import { generateConversationalResponse } from '../utils/conversationalUtils';

export default ChatInterface;
