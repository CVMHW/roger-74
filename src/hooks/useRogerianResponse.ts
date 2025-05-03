
import { useState, useEffect, useCallback } from 'react';
import { MessageType } from '../components/Message';
import type { ConversationStage } from '../utils/reflection/reflectionTypes';
import { ConcernType } from '../utils/reflection/reflectionTypes';
import useTypingEffect from './useTypingEffect';
import useAdaptiveResponse from './useAdaptiveResponse';
import { useConcernDetection } from './response/concernDetection';
import { useConversationStage } from './response/conversationStageManager';
import { useResponseCompliance } from './response/responseCompliance';
import { useResponseGenerator } from './response/responseGenerator';
import { useResponseProcessing } from './response/responseProcessing';
import { createMessage } from '../utils/messageUtils';
import { useAlternativeResponseGenerator } from './response/alternativeResponseGenerator';
import { useFeedbackLoopHandler } from './response/feedbackLoopHandler';

// Import original hook content and re-export it
import originalUseRogerianResponse from './rogerianResponse';

// Re-export the hook
export default originalUseRogerianResponse;
