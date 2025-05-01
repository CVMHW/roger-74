
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
  getResponseBasedOnEmotion,
  getVariedResponse
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

  // Calculate dynamic response time based on message length
  const calculateResponseTime = (message: string): number => {
    // Base time for processing (milliseconds)
    const baseTime = 1000;
    
    // Additional time based on message length (50ms per character)
    // This creates a more natural response time that varies with message complexity
    const lengthFactor = Math.min(message.length * 50, 3000); // Cap at 3 seconds for very long messages
    
    // Add some randomness (±20% variation)
    const randomFactor = (Math.random() * 0.4 + 0.8) * (baseTime + lengthFactor);
    
    return Math.round(randomFactor);
  };

  // Simulate realistic typing with variable speed
  const simulateTypingResponse = (response: string, callback: (text: string) => void) => {
    let currentIndex = 0;
    let fullResponse = '';
    
    // Function to add next character with variable speed
    const addNextChar = () => {
      if (currentIndex < response.length) {
        fullResponse += response[currentIndex];
        currentIndex++;
        
        // Variable typing speed
        // - Faster for short words and common punctuation
        // - Slower for long complex words
        // - Pauses at punctuation marks
        let delay = 25 + Math.random() * 40; // Base typing speed
        
        const currentChar = response[currentIndex - 1];
        if (['.', '!', '?'].includes(currentChar)) {
          delay += 400; // Longer pause at end of sentences
        } else if ([',', ';', ':'].includes(currentChar)) {
          delay += 200; // Medium pause at punctuation
        }
        
        callback(fullResponse);
        setTimeout(addNextChar, delay);
      } else {
        setIsTyping(false);
      }
    };
    
    // Start typing simulation
    setTimeout(addNextChar, 300);
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
        // Create a more natural and varied response
        const emotionResponse = getResponseBasedOnEmotion(currentMessage);
        const acknowledgment = getVariedResponse('acknowledgment');
        const supportStatement = getVariedResponse('support');
        const exploration = getVariedResponse('exploration');
        
        // Combine different elements for a more natural, varied response
        responseText = `${acknowledgment} ${emotionResponse} ${supportStatement} ${exploration}`;
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
