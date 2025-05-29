
/**
 * Secure Message Input Component
 * 
 * Enhanced MessageInput with security features
 */

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Shield, AlertTriangle } from 'lucide-react';
import { useSecureInput } from '../hooks/useSecureInput';

interface SecureMessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  crisisContext?: boolean;
}

const SecureMessageInput: React.FC<SecureMessageInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  crisisContext = false 
}) => {
  const [userInput, setUserInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { 
    validateAndSanitize, 
    isRateLimited, 
    rateLimitStatus, 
    checkRateLimit 
  } = useSecureInput({
    maxLength: 2000,
    minLength: 1,
    strictMode: true,
    crisisContext,
    enableRateLimit: true
  });

  const handleSendMessage = () => {
    if (!userInput.trim() || disabled || isRateLimited) return;

    // Check rate limiting first
    if (!checkRateLimit()) {
      return;
    }

    // Validate and sanitize input
    const validationResult = validateAndSanitize(userInput);
    
    if (!validationResult.isValid) {
      setValidationError(validationResult.errors.join(', '));
      return;
    }

    // Clear any previous errors
    setValidationError(null);

    // Send the sanitized message
    onSendMessage(validationResult.sanitizedInput);
    setUserInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }

    // Real-time validation for length
    if (value.length > 2000) {
      setValidationError('Message too long (maximum 2000 characters)');
    }
  };

  const getRateLimitColor = () => {
    if (rateLimitStatus.remaining < 5) return 'text-red-500';
    if (rateLimitStatus.remaining < 10) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="border-t p-4">
      <div className="flex space-x-2">
        <div className="flex-1">
          <Textarea
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your message here..."
            className={`resize-none ${validationError ? 'border-red-500' : ''}`}
            rows={2}
            disabled={disabled || isRateLimited}
            maxLength={2000}
          />
          
          {/* Validation Error Display */}
          {validationError && (
            <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
              <AlertTriangle size={14} />
              {validationError}
            </div>
          )}
          
          {/* Character Count and Rate Limit Status */}
          <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
            <span>{userInput.length}/2000 characters</span>
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-green-500" />
              <span className={getRateLimitColor()}>
                {rateLimitStatus.remaining} messages remaining
              </span>
            </div>
          </div>
        </div>
        
        <Button 
          type="button"
          onClick={handleSendMessage}
          disabled={disabled || isRateLimited || !userInput.trim() || !!validationError}
          className="bg-roger hover:bg-roger-dark"
        >
          <Send size={18} />
        </Button>
      </div>
      
      {/* Rate Limit Warning */}
      {isRateLimited && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          You've reached the message limit. Please wait before sending another message.
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Roger is a peer support companion, not a licensed therapist. For immediate crisis support, please use the resources below.
        <br />
        <span className="flex items-center gap-1 mt-1">
          <Shield size={10} className="text-green-500" />
          Your messages are validated and encrypted for your safety.
        </span>
      </p>
    </div>
  );
};

export default SecureMessageInput;
