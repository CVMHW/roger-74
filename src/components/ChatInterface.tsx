
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { MessageType } from './Message';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { 
  detectCrisisKeywords, 
  detectMedicalConcerns,
  detectMentalHealthConcerns,
  detectEatingDisorderConcerns,
  detectSubstanceUseConcerns,
  createMessage, 
  getInitialMessages, 
  getCrisisMessage,
  getMedicalConcernMessage,
  getMentalHealthConcernMessage,
  getEatingDisorderMessage,
  getSubstanceUseMessage,
  generateConversationalResponse,
  storeFeedback
} from '../utils/conversationUtils';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>(getInitialMessages());
  const [isTyping, setIsTyping] = useState(false);
  const [shouldShowCrisisAlert, setShouldShowCrisisAlert] = useState(false);
  const [shouldShowMedicalAlert, setShouldShowMedicalAlert] = useState(false);
  const [shouldShowMentalHealthAlert, setShouldShowMentalHealthAlert] = useState(false);
  const [shouldShowEatingDisorderAlert, setShouldShowEatingDisorderAlert] = useState(false);
  const [shouldShowSubstanceUseAlert, setShouldShowSubstanceUseAlert] = useState(false);
  const { toast } = useToast();

  // Calculate dynamic response time based on message length and complexity
  const calculateResponseTime = (message: string): number => {
    // Base time (milliseconds)
    const baseTime = 1500;
    
    // Factor in message length (30ms per character with a cap)
    const lengthFactor = Math.min(message.length * 30, 5000);
    
    // Add randomness for more human-like timing (±30% variation)
    const randomVariation = (Math.random() * 0.6 + 0.7);
    
    // Add extra time if it's an emotional or complex topic
    let complexityFactor = 0;
    const complexTopics = ['died', 'death', 'grief', 'suicide', 'depression', 'anxiety', 'trauma', 'refugee', 'immigrant'];
    if (complexTopics.some(topic => message.toLowerCase().includes(topic))) {
      complexityFactor = 2000; // Add extra "thinking time" for sensitive topics
    }
    
    return Math.round((baseTime + lengthFactor + complexityFactor) * randomVariation);
  };

  // Simulate realistic typing with variable speed and pauses
  const simulateTypingResponse = (response: string, callback: (text: string) => void) => {
    let currentIndex = 0;
    let fullResponse = '';
    
    // Function to add next character with variable speed
    const addNextChar = () => {
      if (currentIndex < response.length) {
        fullResponse += response[currentIndex];
        currentIndex++;
        
        // Variable typing speed with more human-like patterns
        let delay = 35 + Math.random() * 70; // Base variable typing speed
        
        const currentChar = response[currentIndex - 1];
        
        // Add natural typing rhythm and pauses
        if (['.', '!', '?'].includes(currentChar)) {
          delay += 500 + Math.random() * 300; // Longer varied pause at end of sentences
        } else if ([',', ';', ':'].includes(currentChar)) {
          delay += 250 + Math.random() * 150; // Medium varied pause at punctuation
        } else if (currentChar === ' ') {
          // Occasionally add a longer pause between words (like thinking)
          if (Math.random() < 0.08) {
            delay += 400 + Math.random() * 300;
          }
        }
        
        // Sometimes add "typing errors" and corrections for realism
        if (Math.random() < 0.005 && currentChar !== ' ' && currentIndex < response.length - 2) {
          const wrongChar = String.fromCharCode(currentChar.charCodeAt(0) + 1);
          fullResponse += wrongChar;
          
          // Show the error briefly, then remove it
          callback(fullResponse);
          
          setTimeout(() => {
            fullResponse = fullResponse.slice(0, -1); // Remove the wrong character
            callback(fullResponse);
            setTimeout(addNextChar, 80 + Math.random() * 120); // Continue after a short delay
          }, 200 + Math.random() * 300);
          return;
        }
        
        callback(fullResponse);
        setTimeout(addNextChar, delay);
      } else {
        setIsTyping(false);
      }
    };
    
    // Simulate "thinking" before typing begins
    setTimeout(addNextChar, 500 + Math.random() * 800);
  };

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

  const showConcernToast = (concernType: string) => {
    let title = "Important Notice";
    let description = "";
    
    switch(concernType) {
      case 'crisis':
        description = "This appears to be a sensitive topic. Crisis resources are available below.";
        break;
      case 'medical':
        description = "I notice you mentioned physical health concerns. Please consult a medical professional.";
        break;
      case 'mental-health':
        description = "For bipolar symptoms or severe mental health concerns, please contact a professional.";
        break;
      case 'eating-disorder':
        description = "For concerns about eating or body image, the Emily Program has specialists who can help.";
        break;
      case 'substance-use':
        description = "For substance use concerns, specialized support is available in the resources below.";
        break;
      default:
        description = "Please see the resources below for support with your concerns.";
    }
    
    toast({
      title,
      description,
      duration: 6000,
    });
  };

  const handleSendMessage = (userInput: string) => {
    if (!userInput.trim()) return;

    // Add user message
    const newUserMessage = createMessage(userInput, 'user');
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // Check for various concern keywords
    const containsCrisisKeywords = detectCrisisKeywords(userInput);
    const containsMedicalConcerns = detectMedicalConcerns(userInput);
    const containsMentalHealthConcerns = detectMentalHealthConcerns(userInput);
    const containsEatingDisorderConcerns = detectEatingDisorderConcerns(userInput);
    const containsSubstanceUseConcerns = detectSubstanceUseConcerns(userInput);
    
    // Show appropriate alerts based on detected concerns
    if (containsCrisisKeywords && !shouldShowCrisisAlert) {
      setShouldShowCrisisAlert(true);
      showConcernToast('crisis');
    }
    else if (containsMedicalConcerns && !shouldShowMedicalAlert) {
      setShouldShowMedicalAlert(true);
      showConcernToast('medical');
    }
    else if (containsMentalHealthConcerns && !shouldShowMentalHealthAlert) {
      setShouldShowMentalHealthAlert(true);
      showConcernToast('mental-health');
    }
    else if (containsEatingDisorderConcerns && !shouldShowEatingDisorderAlert) {
      setShouldShowEatingDisorderAlert(true);
      showConcernToast('eating-disorder');
    }
    else if (containsSubstanceUseConcerns && !shouldShowSubstanceUseAlert) {
      setShouldShowSubstanceUseAlert(true);
      showConcernToast('substance-use');
    }

    // Show typing indicator
    setIsTyping(true);

    // Store the current message to use in the response
    const currentMessage = userInput;

    // Calculate response time based on message complexity
    const responseTime = calculateResponseTime(currentMessage);

    // Generate Roger's response after a delay to simulate thinking
    setTimeout(() => {
      let responseText;
      let concernType = null;
      
      // Determine which response to use based on detected concerns
      if (containsCrisisKeywords) {
        responseText = getCrisisMessage();
        concernType = 'crisis';
      } 
      else if (containsMedicalConcerns) {
        responseText = getMedicalConcernMessage();
        concernType = 'medical';
      }
      else if (containsMentalHealthConcerns) {
        responseText = getMentalHealthConcernMessage();
        concernType = 'mental-health';
      }
      else if (containsEatingDisorderConcerns) {
        responseText = getEatingDisorderMessage();
        concernType = 'eating-disorder';
      }
      else if (containsSubstanceUseConcerns) {
        responseText = getSubstanceUseMessage();
        concernType = 'substance-use';
      } 
      else {
        // Generate a conversational, human-like response
        responseText = generateConversationalResponse(currentMessage);
      }
      
      // Create temporary message object to update during typing simulation
      const rogerResponse = createMessage('', 'roger', concernType);
      setMessages(prevMessages => [...prevMessages, rogerResponse]);
      
      // Simulate typing with a callback to update the message text
      simulateTypingResponse(responseText, (text) => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === rogerResponse.id ? { ...msg, text } : msg
          )
        );
      });
    }, responseTime);
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

export default ChatInterface;
