

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { MessageType } from './Message';
import { useChatLogic } from '../hooks/chat/useChatLogic';
import ProfileBubble from './ProfileBubble';

const ChatInterface = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [processingContext, setProcessingContext] = useState<string | null>(null);
  const [showCrisisWarning, setShowCrisisWarning] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { 
    messages: hookMessages,
    isTyping: hookIsTyping,
    isProcessing,
    handleSendMessage,
    handleFeedback,
    showCrisisResources,
    processingContext: hookProcessingContext
  } = useChatLogic();

  // Use hook values
  useEffect(() => {
    setMessages(hookMessages);
  }, [hookMessages]);

  useEffect(() => {
    setIsTyping(hookIsTyping);
  }, [hookIsTyping]);

  useEffect(() => {
    setProcessingContext(hookProcessingContext);
  }, [hookProcessingContext]);

  useEffect(() => {
    setShowCrisisWarning(showCrisisResources);
  }, [showCrisisResources]);

  const handleSendMessageWrapper = async (text: string) => {
    await handleSendMessage(text);
    if (inputRef.current) {
      inputRef.current.style.height = 'inherit';
    }
  };

  const handleFeedbackWrapper = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };

  return (
    <Card className="shadow-md border-cvmhw-blue border h-[600px] flex flex-col">
      <CardHeader className="pb-2 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <ProfileBubble>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cvmhw-blue to-cvmhw-purple flex items-center justify-center shadow-md border border-white/30 cursor-pointer hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">R</span>
            </div>
          </ProfileBubble>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <ProfileBubble>
                <h3 className="text-lg font-semibold text-cvmhw-blue cursor-pointer hover:text-cvmhw-purple transition-colors">Hi, I'm Roger, your peer support companion.</h3>
              </ProfileBubble>
              {processingContext && (
                <div className="flex items-center gap-1 text-xs text-cvmhw-purple bg-cvmhw-light/50 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-cvmhw-purple rounded-full animate-pulse"></div>
                  <span>{processingContext}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">How can I help you today?</p>
          </div>
        </div>
        
        {/* Security Status Bar */}
        <div className="mt-3 p-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-md border border-green-200/50">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-700">
                Welcome to Roger's Secure Environment
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span>🔒 HIPAA Protected</span>
              <span>🛡️ Crisis Support Ready</span>
              <span>⚡ Real-time Processing</span>
            </div>
          </div>
        </div>
        
        {/* Crisis Warning Banner */}
        {showCrisisWarning && (
          <div className="mt-2 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800 mb-1">Crisis Support Available 24/7</h4>
                <p className="text-sm text-red-700 mb-2">
                  If you're experiencing thoughts of self-harm or suicide, please reach out immediately:
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-red-800">Emergency:</span>
                    <a href="tel:911" className="text-red-600 hover:text-red-800 font-medium">911</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-red-800">Crisis Lifeline:</span>
                    <a href="tel:988" className="text-red-600 hover:text-red-800 font-medium">988</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-red-800">Crisis Text:</span>
                    <span className="text-red-600 font-medium">Text HOME to 741741</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowCrisisWarning(false)}
                className="text-red-400 hover:text-red-600 text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <MessageList 
            messages={messages} 
            isTyping={isTyping}
            onFeedback={handleFeedbackWrapper}
          />
          {isTyping && <TypingIndicator />}
        </div>
        
        <div className="border-t border-gray-100 p-4 bg-white">
          <MessageInput 
            onSendMessage={handleSendMessageWrapper}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;

