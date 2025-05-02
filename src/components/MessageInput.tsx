
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    onSendMessage(userInput);
    setUserInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
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
        <Button 
          type="button"
          onClick={handleSendMessage} 
          className="bg-roger hover:bg-roger-dark"
        >
          <Send size={18} />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Roger is a peer support companion, not a licensed therapist. For immediate crisis support, please use the resources below.
      </p>
    </div>
  );
};

export default MessageInput;
