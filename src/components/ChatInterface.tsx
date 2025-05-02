import React, { useState } from 'react';
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

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>(getInitialMessages());
  const { isTyping, processUserMessage, simulateTypingResponse } = useRogerianResponse();
  const { toast } = useToast();

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
      // Add the empty response message first (will be updated during typing simulation)
      setMessages(prevMessages => [...prevMessages, rogerResponse]);
      
      // Generate appropriate response text based on the message context
      let responseText = '';
      
      if (rogerResponse.concernType === 'crisis') {
        responseText = getCrisisMessage();
      } 
      else if (rogerResponse.concernType === 'medical') {
        responseText = getMedicalConcernMessage();
      }
      else if (rogerResponse.concernType === 'mental-health') {
        responseText = getMentalHealthConcernMessage();
      }
      else if (rogerResponse.concernType === 'eating-disorder') {
        responseText = getEatingDisorderMessage();
      }
      else if (rogerResponse.concernType === 'substance-use') {
        responseText = getSubstanceUseMessage();
      } 
      else {
        // Generate a conversational, human-like response
        responseText = generateConversationalResponse(userInput);
      }
      
      // Simulate typing with a callback to update the message text
      simulateTypingResponse(responseText, (text) => {
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
  getSubstanceUseMessage
} from '../utils/responseUtils';
import { generateConversationalResponse } from '../utils/conversationalUtils';

export default ChatInterface;
