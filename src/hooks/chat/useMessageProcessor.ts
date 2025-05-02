
import { useCallback } from 'react';
import { MessageType } from '../../components/Message';
import { isLocationDataNeeded } from '../../utils/messageUtils';
import { createMessage } from '../../utils/messageUtils';
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { enhanceResponseWithContext } from '../../utils/conversation/contextAware';

interface MessageProcessorProps {
  processUserMessage: (userInput: string) => Promise<MessageType>;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  handleCrisisMessage: (userInput: string, rogerResponse: MessageType) => void;
  activeLocationConcern: any | null;
  setActiveLocationConcern: React.Dispatch<React.SetStateAction<any | null>>;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
  updateRogerResponseHistory: (response: string) => void;
  shouldThrottleResponse: () => boolean;
  getResponseDelay: (content: string) => number;
  setProcessingContext: (context: string | null) => void;
}

/**
 * Hook for processing messages and generating responses
 * UNCONDITIONAL RULE: Roger listens first, then responds with pinpoint accuracy
 */
export const useMessageProcessor = ({
  processUserMessage,
  setMessages,
  handleCrisisMessage,
  activeLocationConcern,
  setActiveLocationConcern,
  simulateTypingResponse,
  updateRogerResponseHistory,
  shouldThrottleResponse,
  getResponseDelay,
  setProcessingContext
}: MessageProcessorProps) => {
  
  // Function to check for critical keywords in user input
  const containsCriticalKeywords = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    return /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)|don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide|fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill|crisis|emergency|urgent|need help now|immediate danger/.test(lowerText);
  };
  
  // Function to check if user input is about pet death or loss
  const isPetLossContent = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    return /pet|dog|cat|animal|died|passed away|molly|death|lost|grave|euthan/.test(lowerText);
  };
  
  // Function to determine appropriate processing context based on user input
  const determineProcessingContext = (userInput: string): string => {
    if (containsCriticalKeywords(userInput)) {
      return "Roger is carefully considering your message about self-harm...";
    } else if (isPetLossContent(userInput)) {
      return "Roger is reflecting on what you shared about your pet...";
    } else {
      // Choose from various "thinking" contexts
      const contexts = [
        "Roger is carefully listening...",
        "Roger is considering how to respond...",
        "Roger is reflecting on your message...",
        "Roger is thoughtfully processing..."
      ];
      return contexts[Math.floor(Math.random() * contexts.length)];
    }
  };
  
  // Track conversation history for context enhancement
  const conversationHistory: string[] = [];
  
  const processResponse = useCallback((userInput: string) => {
    // Add user input to conversation history
    conversationHistory.push(userInput);
    
    // Check if this is a potentially critical message
    const isCritical = containsCriticalKeywords(userInput);
    const isPetLoss = isPetLossContent(userInput);
    
    // Set an appropriate processing context to show Roger is "thinking"
    const processingContext = determineProcessingContext(userInput);
    setProcessingContext(processingContext);
    
    // Calculate appropriate delay time based on message content
    const responseDelay = getResponseDelay(userInput);
    
    // Double-check throttling for non-critical messages
    if (shouldThrottleResponse() && !isCritical) {
      console.log("Response throttled to ensure quality listening");
      // Add an additional 700-1200ms delay for more natural conversation
      const extraDelay = Math.floor(Math.random() * 500) + 700;
      setTimeout(() => {
        setProcessingContext("Roger is taking time to understand your message...");
      }, 800);
    }
    
    // Process user input to generate Roger's response after appropriate delay
    setTimeout(() => {
      processUserMessage(userInput)
        .then(rogerResponse => {
          try {
            // Enhance the response with contextual awareness before showing it
            const enhancedResponse = enhanceResponseWithContext(
              rogerResponse.text,
              userInput,
              conversationHistory.slice(-5)
            );
            
            // Update the response with enhanced text that has contextual awareness
            const updatedResponse = {
              ...rogerResponse,
              text: enhancedResponse
            };
            
            // Add the response to history to prevent future repetition
            updateRogerResponseHistory(enhancedResponse);
            
            // Check if this is a crisis-related response and store it for deception detection
            handleCrisisMessage(userInput, updatedResponse);
            
            // Add the empty response message first (will be updated during typing simulation)
            setMessages(prevMessages => [...prevMessages, updatedResponse]);
            
            // Set up to request location after this message if needed
            if (updatedResponse.concernType && 
                isLocationDataNeeded(updatedResponse.concernType) && 
                !activeLocationConcern) {
              
              setActiveLocationConcern({
                concernType: updatedResponse.concernType,
                messageId: updatedResponse.id,
                askedForLocation: false
              });
            }
            
            // Add response to conversation history for better context
            conversationHistory.push(enhancedResponse);
            
            // Simulate typing with a callback to update the message text
            simulateTypingResponse(enhancedResponse, (text) => {
              setMessages(prevMessages => 
                prevMessages.map(msg => 
                  msg.id === updatedResponse.id ? { ...msg, text } : msg
                )
              );
              
              // Clear the processing context once response is complete
              setProcessingContext(null);
            });
          } catch (innerError) {
            console.error("Error processing Roger's response:", innerError);
            
            // Critical fallback for error cases
            const fallbackResponse = createMessage(
              isCritical 
                ? "I'm concerned about what you're sharing. If you're in crisis or having thoughts about harming yourself, please reach out to a crisis hotline or emergency services immediately." 
                : "I'm here to listen. What would you like to talk about?",
              'roger',
              isCritical ? ('crisis' as ConcernType) : null
            );
            
            setMessages(prevMessages => [...prevMessages, fallbackResponse]);
            
            // Simulate typing for the error response
            simulateTypingResponse(fallbackResponse.text, (text) => {
              setMessages(prevMessages => 
                prevMessages.map(msg => 
                  msg.id === fallbackResponse.id ? { ...msg, text } : msg
                )
              );
              
              // Clear the processing context once response is complete
              setProcessingContext(null);
            });
          }
        })
        .catch(error => {
          console.error("Error generating response:", error);
          
          // Add a fallback response in case of error - more urgent for critical messages
          const errorResponse = createMessage(
            isCritical 
              ? "I notice you may be in crisis. If you're having thoughts of harming yourself, please reach out to a crisis hotline or emergency services immediately. I'm here to support you." 
              : "I'm sorry, I'm having trouble responding right now. I'm here to listen when you're ready to continue.",
            'roger',
            isCritical ? ('crisis' as ConcernType) : null
          );
          
          setMessages(prevMessages => [...prevMessages, errorResponse]);
          
          // Simulate typing for the error response - faster for critical messages
          simulateTypingResponse(errorResponse.text, (text) => {
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === errorResponse.id ? { ...msg, text } : msg
              )
            );
            
            // Clear the processing context once response is complete
            setProcessingContext(null);
          });
        });
    }, responseDelay);
  }, [
    processUserMessage, 
    setMessages, 
    handleCrisisMessage,
    activeLocationConcern,
    setActiveLocationConcern,
    simulateTypingResponse,
    updateRogerResponseHistory,
    shouldThrottleResponse,
    getResponseDelay,
    setProcessingContext
  ]);

  return { processResponse };
};
