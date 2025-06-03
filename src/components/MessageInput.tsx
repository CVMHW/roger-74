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
  
  const REQUIRED_PASSWORD = 'TeddyLLC';
  
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
    // Prevent any input changes when access is not granted
    if (!hasAccess) {
      e.preventDefault();
      return;
    }
    
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
      <div className="border-t bg-gradient-to-b from-cvmhw-light/30 via-blue-50/60 to-cyan-50/40 p-6">
        {/* Main Password Protection Zone */}
        <div className="bg-gradient-to-br from-white/90 via-blue-50/80 to-cvmhw-light/60 border-2 border-cvmhw-blue/30 rounded-xl p-6 mb-6 shadow-lg backdrop-blur-sm relative overflow-hidden">
          {/* Gentle animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cvmhw-blue/5 via-cyan-100/20 to-cvmhw-light/10 animate-pulse opacity-60" />
          
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="bg-gradient-to-br from-cvmhw-blue to-cvmhw-purple p-3 rounded-xl shadow-md">
              <div className="relative w-8 h-8">
                <img 
                  src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                  alt="CVMHW Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent">
                Welcome to Roger's Secure Environment
              </h3>
              <p className="text-sm text-cvmhw-blue/80">
                Authorized access required for investor demonstration
              </p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-4 border border-cvmhw-light/50 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="text-cvmhw-blue" size={16} />
              <span className="text-sm font-medium text-cvmhw-blue">Secure Access Portal</span>
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center ml-2">
                🧸
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              This demonstration environment requires authentication for investor and authorized personnel access.
            </p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                onKeyDown={handleKeyPress}
                placeholder="Enter demonstration access password..."
                className={`bg-white/90 backdrop-blur-sm border-cvmhw-light focus:border-cvmhw-blue focus:ring-cvmhw-blue/20 transition-all duration-200 ${passwordError ? 'border-red-400 focus:border-red-400 focus:ring-red-200/50' : ''}`}
              />
              {passwordError && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertTriangle size={12} />
                  <span>Incorrect access password</span>
                </div>
              )}
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple hover:from-cvmhw-purple hover:to-cvmhw-blue text-white shadow-md transition-all duration-300"
              >
                <Lock size={16} className="mr-2" />
                Access Roger Chat
              </Button>
            </form>
          </div>
        </div>

        {/* Locked Chat Interface Preview */}
        <div className="relative mb-6">
          <div className="bg-gradient-to-r from-gray-100/90 via-blue-50/70 to-cvmhw-light/60 border-2 border-cvmhw-light/50 rounded-lg p-4 backdrop-blur-sm">
            <Textarea
              value=""
              placeholder="Type your message here..."
              className="resize-none bg-white/50 border-cvmhw-light/40 text-gray-400 cursor-not-allowed"
              rows={2}
              disabled={true}
              readOnly={true}
            />
            
            {/* Lock Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cvmhw-light/20 via-blue-50/30 to-cvmhw-light/20 rounded-lg backdrop-blur-[2px] border-2 border-cvmhw-light/40 flex items-center justify-center">
              <div className="flex items-center gap-3 text-cvmhw-blue bg-white/90 px-4 py-2 rounded-lg shadow-sm border border-cvmhw-light/50">
                <Lock size={18} className="animate-pulse" />
                <span className="font-medium">Chat interface locked - please authenticate above</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2 text-xs text-gray-500 px-2">
            <span>0/2000 characters</span>
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-gray-400" />
              <span className="text-gray-400">Messages remaining: --</span>
            </div>
          </div>
        </div>

        {/* Patient Safety Notice */}
        <div className="p-4 bg-gradient-to-r from-red-50/80 via-orange-50/60 to-red-50/80 border border-red-200/60 rounded-lg shadow-sm backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-red-600 mt-0.5 flex-shrink-0" size={16} />
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

  // Authenticated interface
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
