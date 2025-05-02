
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
  storeFeedback,
  isLocationDataNeeded,
  generateLocationRequestMessage,
  extractPossibleLocation,
  updateMessageWithLocation
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
import { detectPotentialDeception } from '../utils/detectionUtils/deceptionDetection';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>(getInitialMessages());
  const { isTyping, processUserMessage, simulateTypingResponse, currentApproach } = useRogerianResponse();
  const { toast } = useToast();
  
  // Track all Roger responses to prevent repetition (in accordance with master rules)
  const [rogerResponseHistory, setRogerResponseHistory] = useState<string[]>([]);
  
  // Track active concerns that need location data
  const [activeLocationConcern, setActiveLocationConcern] = useState<{
    concernType: string | null;
    messageId: string;
    askedForLocation: boolean;
  } | null>(null);
  
  // Track potential crisis messaging for deception detection
  const [recentCrisisMessage, setRecentCrisisMessage] = useState<{
    message: string;
    timestamp: Date;
    concernType: string;
  } | null>(null);
  
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
    
    // Check if this message might contain location data if we're currently asking for it
    if (activeLocationConcern && activeLocationConcern.askedForLocation) {
      const possibleLocation = extractPossibleLocation(userInput);
      
      if (possibleLocation) {
        // Update the message that triggered the location request with the discovered location
        setMessages(prevMessages => 
          updateMessageWithLocation(prevMessages, activeLocationConcern.messageId, possibleLocation)
        );
        
        // Clear the active location concern since we got the data
        setActiveLocationConcern(null);
        
        // Process the user's message normally since they've provided location data
        processResponse(userInput);
        return;
      }
    }
    
    // Check for deception if we have a recent crisis message
    if (recentCrisisMessage && 
        (new Date().getTime() - recentCrisisMessage.timestamp.getTime() < 5 * 60 * 1000)) {
      // Analyze for potential deception/backtracking on crisis statements
      const deceptionAnalysis = detectPotentialDeception(recentCrisisMessage.message, userInput);
      
      if (deceptionAnalysis.isPotentialDeception && deceptionAnalysis.confidence !== 'low') {
        // We've detected potential deception - handle according to the unconditional law
        // Import and use the response generator for deception
        import('../utils/detectionUtils/deceptionDetection').then(module => {
          const deceptionResponse = module.generateDeceptionResponseMessage(deceptionAnalysis);
          
          // Create Roger's response to the potential deception
          const rogerResponse = createMessage(deceptionResponse, 'roger', recentCrisisMessage.concernType as any);
          
          // Add the response
          setMessages(prevMessages => [...prevMessages, rogerResponse]);
          
          // Simulate typing
          simulateTypingResponse(deceptionResponse, (text) => {
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === rogerResponse.id ? { ...msg, text } : msg
              )
            );
          });
          
          // Clear the crisis tracking since we've addressed it
          setRecentCrisisMessage(null);
        });
        return;
      }
    }
    
    // Process user input normally
    processResponse(userInput);
  };
  
  const processResponse = (userInput: string) => {
    // Process user input to generate Roger's response
    processUserMessage(userInput).then(rogerResponse => {
      // Add the response to history to prevent future repetition
      setRogerResponseHistory(prev => [...prev, rogerResponse.text]);
      
      // Check if this is a crisis-related response and store it for deception detection
      const crisisConcernTypes = ['crisis', 'tentative-harm', 'suicide', 'self-harm'];
      if (rogerResponse.concernType && crisisConcernTypes.includes(rogerResponse.concernType)) {
        setRecentCrisisMessage({
          message: userInput,
          timestamp: new Date(),
          concernType: rogerResponse.concernType
        });
      }
      
      // Add the empty response message first (will be updated during typing simulation)
      setMessages(prevMessages => [...prevMessages, rogerResponse]);
      
      // Check if this response has a concern that needs location data
      if (rogerResponse.concernType && 
          isLocationDataNeeded(rogerResponse.concernType) && 
          !activeLocationConcern) {
        
        // Set up to request location after this message
        setActiveLocationConcern({
          concernType: rogerResponse.concernType,
          messageId: rogerResponse.id,
          askedForLocation: false
        });
      }
      
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
  
  // Effect to ask for location when needed after the previous message is fully typed
  useEffect(() => {
    // If we have an active concern that needs location data and we haven't asked yet
    if (activeLocationConcern && !activeLocationConcern.askedForLocation && !isTyping) {
      // Mark that we've asked
      setActiveLocationConcern(prev => prev ? { ...prev, askedForLocation: true } : null);
      
      // Generate a location request message
      const locationRequestText = generateLocationRequestMessage(activeLocationConcern.concernType as any);
      const locationRequestMessage = createMessage(locationRequestText, 'roger');
      
      // Add the location request message
      setMessages(prevMessages => [...prevMessages, locationRequestMessage]);
      
      // Simulate typing for the location request
      simulateTypingResponse(locationRequestText, (text) => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === locationRequestMessage.id ? { ...msg, text } : msg
          )
        );
      });
    }
  }, [activeLocationConcern, isTyping]);

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
