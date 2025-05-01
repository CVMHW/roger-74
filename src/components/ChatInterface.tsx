import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from 'lucide-react';
import Message, { MessageType } from './Message';
import { 
  detectCrisisKeywords, 
  createMessage, 
  getInitialMessages, 
  getCrisisMessage,
  generateConversationalResponse
} from '../utils/conversationUtils';
import { useToast } from "@/components/ui/use-toast";

const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>(getInitialMessages());
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [shouldShowCrisisAlert, setShouldShowCrisisAlert] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    const complexTopics = ['died', 'death', 'grief', 'suicide', 'depression', 'anxiety', 'trauma'];
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

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    const newUserMessage = createMessage(userInput, 'user');
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // Check for crisis keywords
    const containsCrisisKeywords = detectCrisisKeywords(userInput);
    if (containsCrisisKeywords && !shouldShowCrisisAlert) {
      setShouldShowCrisisAlert(true);
      toast({
        title: "Important Notice",
        description: "This appears to be a sensitive topic. Crisis resources are available below.",
        duration: 6000,
      });
    }

    // Clear input and show typing indicator
    setUserInput('');
    setIsTyping(true);

    // Store the current message to use in the response
    const currentMessage = userInput;

    // Calculate response time based on message complexity
    const responseTime = calculateResponseTime(currentMessage);

    // Generate Roger's response after a delay to simulate thinking
    setTimeout(() => {
      let responseText;
      
      if (containsCrisisKeywords) {
        responseText = getCrisisMessage();
      } else {
        // Generate a conversational, human-like response
        responseText = generateConversationalResponse(currentMessage);
      }
      
      // Create temporary message object to update during typing simulation
      const rogerResponse = createMessage('', 'roger');
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="chat-container" id="chat-container">
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-center space-x-2 ml-2">
            <div className="h-8 w-8 rounded-full bg-roger flex items-center justify-center">
              <span className="text-white font-medium text-sm">R</span>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message here..."
            className="resize-none"
            rows={2}
          />
          <Button onClick={handleSendMessage} className="bg-roger hover:bg-roger-dark">
            <Send size={18} />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Roger is a peer support companion, not a licensed therapist. For immediate crisis support, please use the resources below.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
