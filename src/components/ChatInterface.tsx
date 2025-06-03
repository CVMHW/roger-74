
import React from 'react';
import ChatContainer from './chat/ChatContainer';

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
  return <ChatContainer />;
};

export default ChatInterface;
