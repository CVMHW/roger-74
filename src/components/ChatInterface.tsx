
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from 'lucide-react';
import Message, { MessageType } from './Message';
import { 
  detectCrisisKeywords, 
  createMessage, 
  getInitialMessages, 
  getCrisisMessage
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

    // Simulate Roger's response after a delay
    setTimeout(() => {
      let rogerResponse;
      
      if (containsCrisisKeywords) {
        rogerResponse = createMessage(getCrisisMessage(), 'roger');
      } else {
        // This would be integrated with an AI response in the future
        // For now, we'll use a placeholder response
        rogerResponse = createMessage(
          "I appreciate you sharing that with me. While I'm here to listen and support you, remember I'm not a clinical professional. Would you like to explore this topic a bit more while you wait for your therapist?",
          'roger'
        );
      }
      
      setMessages(prevMessages => [...prevMessages, rogerResponse]);
      setIsTyping(false);
    }, 1500);
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
