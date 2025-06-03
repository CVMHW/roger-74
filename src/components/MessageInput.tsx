
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Shield, AlertTriangle, Lock } from 'lucide-react';
import { useSecureInput } from '../hooks/useSecureInput';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [userInput, setUserInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  
  const REQUIRED_PASSWORD = 'Jefferson00!!';
  
  // Check if access was previously granted in this session
  useEffect(() => {
    const sessionAccess = sessionStorage.getItem('roger_system_access');
    if (sessionAccess === 'granted') {
      setHasAccess(true);
    }
  }, []);
  
  const { 
    validateAndSanitize, 
    isRateLimited, 
    rateLimitStatus, 
    checkRateLimit 
  } = useSecureInput({
    maxLength: 2000,
    minLength: 1,
    strictMode: true,
    enableRateLimit: true
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === REQUIRED_PASSWORD) {
      setPasswordError(false);
      setHasAccess(true);
      sessionStorage.setItem('roger_system_access', 'granted');
    } else {
      setPasswordError(true);
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || isRateLimited || !hasAccess) return;

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
      if (hasAccess) {
        handleSendMessage();
      } else {
        handlePasswordSubmit(e);
      }
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

  // Show password gate if no access
  if (!hasAccess) {
    return (
      <div className="border-t p-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="text-amber-600" size={16} />
            <span className="text-sm font-medium text-amber-700">Testing Mode - Access Required</span>
          </div>
          <p className="text-xs text-amber-600 mb-3">
            This is a demonstration environment for investors and authorized personnel only.
          </p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-2">
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              onKeyDown={handleKeyPress}
              placeholder="Enter access password to chat..."
              className={`text-sm ${passwordError ? 'border-red-500' : ''}`}
            />
            {passwordError && (
              <p className="text-red-500 text-xs">Incorrect password</p>
            )}
            <Button 
              type="submit"
              size="sm"
              className="w-full bg-cvmhw-blue hover:bg-cvmhw-purple"
            >
              Access Chat
            </Button>
          </form>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-red-600 mt-0.5" size={16} />
            <div>
              <p className="text-xs text-red-700 font-medium mb-1">
                Patient Safety Notice
              </p>
              <p className="text-xs text-red-600">
                If you are experiencing a mental health crisis, please call 911 or 988 immediately. 
                This system is not for emergency use.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            disabled={isRateLimited}
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
          disabled={isRateLimited || !userInput.trim() || !!validationError}
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

export default MessageInput;
