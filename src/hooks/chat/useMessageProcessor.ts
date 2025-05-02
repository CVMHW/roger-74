
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
  
  // Function to check if Roger is being non-responsive or repetitive
  const isUserPointingOutNonResponsiveness = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    return /already told you|just said that|weren't listening|not listening|didn't hear|didn't read|ignoring|pay attention|listen to me|read what i wrote|i just told you|i said|i mentioned|you asked|you're repeating|you just asked|you already asked/.test(lowerText);
  };
  
  // Function to determine appropriate processing context based on user input
  const determineProcessingContext = (userInput: string): string => {
    if (containsCriticalKeywords(userInput)) {
      return "Roger is carefully considering your message about self-harm...";
    } else if (isPetLossContent(userInput)) {
      return "Roger is reflecting on what you shared about your pet...";
    } else if (isUserPointingOutNonResponsiveness(userInput)) {
      return "Roger is reviewing your previous messages...";
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
    
    // Check if user is pointing out that Roger didn't listen/is repeating
    const isPointingOutNonResponsiveness = isUserPointingOutNonResponsiveness(userInput);
    
    // Check if this is a potentially critical message
    const isCritical = containsCriticalKeywords(userInput);
    const isPetLoss = isPetLossContent(userInput);
    
    // Set an appropriate processing context to show Roger is "thinking"
    const processingContext = determineProcessingContext(userInput);
    setProcessingContext(processingContext);
    
    // Calculate appropriate delay time based on message content
    const responseDelay = getResponseDelay(userInput);
    
    // If user is pointing out that Roger didn't listen, prioritize addressing this
    if (isPointingOutNonResponsiveness && conversationHistory.length >= 3) {
      setTimeout(() => {
        // Generate a special acknowledgment response
        const acknowledgmentResponse = createMessage(
          "I apologize for not properly acknowledging what you've already shared. Looking back at our conversation, I see that you mentioned " + 
          extractTopicsFromHistory(conversationHistory.slice(-3)) + 
          ". Could you help me understand which aspects of this are most important for us to focus on right now?",
          'roger'
        );
        
        // Add the response
        setMessages(prevMessages => [...prevMessages, acknowledgmentResponse]);
        
        // Add response to conversation history
        conversationHistory.push(acknowledgmentResponse.text);
        
        // Update the response history to prevent future repetition
        updateRogerResponseHistory(acknowledgmentResponse.text);
        
        // Simulate typing with a callback to update the message text
        simulateTypingResponse(acknowledgmentResponse.text, (text) => {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === acknowledgmentResponse.id ? { ...msg, text } : msg
            )
          );
          
          // Clear the processing context once response is complete
          setProcessingContext(null);
        });
      }, Math.min(responseDelay, 1000)); // Respond faster to acknowledgment requests
      
      return;
    }
    
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
            
            // Make sure Roger isn't asking "what's going on" if the user already explained
            const responseWithHistoryCheck = preventRedundantQuestions(
              enhancedResponse, 
              conversationHistory.slice(-5)
            );
            
            // Update the response with enhanced text that has contextual awareness
            const updatedResponse = {
              ...rogerResponse,
              text: responseWithHistoryCheck
            };
            
            // Add the response to history to prevent future repetition
            updateRogerResponseHistory(responseWithHistoryCheck);
            
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
            conversationHistory.push(responseWithHistoryCheck);
            
            // Simulate typing with a callback to update the message text
            simulateTypingResponse(responseWithHistoryCheck, (text) => {
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
                : "I hear what you've shared. What would be most helpful for us to talk about right now?",
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
              : "I'm hearing that you're dealing with a frustrating situation. What would be most helpful to focus on right now?",
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

  // Helper function to extract key topics from conversation history
  const extractTopicsFromHistory = (history: string[]): string => {
    if (!history || history.length === 0) return "your concerns";
    
    const lastUserMessage = history.filter(msg => 
      !msg.includes("Roger is") && 
      !msg.includes("I apologize for not") &&
      !msg.includes("I'm here to listen")
    )[0] || "";
    
    // Extract key nouns and topics from the message
    const topics = [];
    const topicPatterns = [
      { regex: /storm|electricity|power|outage/i, topic: "the power outage" },
      { regex: /presentation|work|job|boss|meeting|deadline/i, topic: "your work presentation" },
      { regex: /laptop|computer|device|phone|mobile/i, topic: "technology issues" },
      { regex: /frustrat(ed|ing)|upset|angry|mad|stress(ed|ful)/i, topic: "your frustration" },
      { regex: /anxious|anxiety|worry|concern/i, topic: "your anxiety" },
      { regex: /sad|down|depress(ed|ing)|unhappy/i, topic: "your feelings" },
      { regex: /family|relationship|partner|spouse|marriage/i, topic: "your relationships" },
      { regex: /sleep|tired|exhausted|fatigue/i, topic: "your sleep concerns" }
    ];
    
    for (const pattern of topicPatterns) {
      if (pattern.regex.test(lastUserMessage)) {
        topics.push(pattern.topic);
      }
    }
    
    return topics.length > 0 ? topics.join(" and ") : "your concerns";
  };

  // Helper function to prevent redundant questions
  const preventRedundantQuestions = (response: string, history: string[]): string => {
    // Check if Roger is asking what's going on after user already explained
    if (history.length >= 2 && 
        (response.includes("What's been going on?") || 
         response.includes("What's going on?") ||
         response.includes("What's been happening?"))) {
      
      // Replace the redundant question with acknowledgment
      return response.replace(
        /(What's been going on\?|What's going on\?|What's been happening\?)/,
        "I'd like to understand more about how this is affecting you."
      );
    }
    
    return response;
  };

  return { processResponse };
};
