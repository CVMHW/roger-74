
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { MessageType } from './Message';
import useRogerianResponse from '../hooks/useRogerianResponse';
import { useCrisisDetection } from '../hooks/chat/useCrisisDetection';
import { useToast } from "@/hooks/use-toast";
import ProfileBubble from './ProfileBubble';

const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { processUserMessage } = useRogerianResponse();
  const crisisDetection = useCrisisDetection();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      text: content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Check for crisis first if method exists
      if (crisisDetection.handleCrisisMessage) {
        const crisisResponse = await crisisDetection.handleCrisisMessage(content);
        if (crisisResponse) {
          setMessages(prev => [...prev, crisisResponse]);
          setIsTyping(false);
          return;
        }
      }

      // Process the message normally
      const response = await processUserMessage(content);
      
      const rogerMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: response.text || "I'm here to listen. Could you tell me more?",
        sender: 'roger',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, rogerMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: "I'm having some technical difficulties right now. Please try again, or if this is urgent, please contact CVMHW directly or use the crisis resources below.",
        sender: 'roger',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Issue",
        description: "There was a problem processing your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    toast({
      title: "New Conversation Started",
      description: "Your chat history has been cleared for a fresh start.",
    });
  };

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: MessageType = {
        id: 'welcome',
        text: "Hi, I'm Roger, your peer support companion. How can I help you today?",
        sender: 'roger',
        timestamp: new Date(),
        isWelcome: true
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  return (
    <Card className="shadow-md border-cvmhw-blue border h-[600px] flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-white/20 h-10 w-10 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <ProfileBubble>
                  <h3 className="text-white font-semibold cursor-pointer hover:opacity-80 transition-opacity">
                    Welcome to Roger's Secure Environment
                  </h3>
                </ProfileBubble>
                <p className="text-blue-100 text-sm">Peer Support Chat</p>
              </div>
            </div>
            <ProfileBubble>
              <div className="text-2xl cursor-pointer hover:scale-110 transition-transform" role="img" aria-label="Teddy Bear">
                🧸
              </div>
            </ProfileBubble>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-blue-50/30 to-white">
          <MessageList 
            messages={messages} 
            isTyping={isTyping}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-cvmhw-light/30 p-4 bg-white">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
