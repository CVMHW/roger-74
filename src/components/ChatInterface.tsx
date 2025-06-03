
import React from 'react';
import ChatContainer from './chat/ChatContainer';
import ProfileBubble from './ProfileBubble';

// Import needed utilities to make ChatInterface work properly 
import { 
  getCrisisMessage,
  getMedicalConcernMessage,
  getMentalHealthConcernMessage,
  getEatingDisorderMessage,
  getSubstanceUseMessage,
  getTentativeHarmMessage
} from '../utils/responseUtils';
import { generateConversationalResponse } from '../utils/conversationalUtils';

// Primary Chat Interface component (now simplified as a wrapper)
const ChatInterface: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Roger's Introduction */}
      <div className="bg-gradient-to-r from-roger-light to-mindful-light p-4 border-b border-roger/20">
        <div className="flex items-center gap-2 mb-2">
          <ProfileBubble>
            <div className="w-8 h-8 bg-roger text-white rounded-full flex items-center justify-center font-semibold cursor-pointer hover:bg-roger-dark transition-colors">
              R
            </div>
          </ProfileBubble>
          <div>
            <h2 className="text-lg font-semibold text-roger-dark">
              Hi, I'm Roger, your peer support companion. How can I help you today?
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              03:55 PM
            </p>
          </div>
        </div>
      </div>
      
      {/* Chat Container */}
      <div className="flex-1">
        <ChatContainer />
      </div>
    </div>
  );
};

export default ChatInterface;
