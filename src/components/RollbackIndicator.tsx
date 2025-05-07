
import React, { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { RefreshCw, Clock, AlertCircle } from 'lucide-react';

type RollbackLevel = 'low' | 'medium' | 'high';

interface RollbackIndicatorProps {
  isActive: boolean;
  level?: RollbackLevel;
  message?: string;
}

const RollbackIndicator: React.FC<RollbackIndicatorProps> = ({ 
  isActive, 
  level = 'medium',
  message 
}) => {
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [pulseState, setPulseState] = useState<number>(0);
  
  // Reset timer when indicator becomes active
  useEffect(() => {
    if (isActive) {
      setTimeElapsed(0);
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isActive]);
  
  // Pulse animation effect
  useEffect(() => {
    if (isActive) {
      const pulseTimer = setInterval(() => {
        setPulseState(prev => (prev + 1) % 3);
      }, 800);
      
      return () => clearInterval(pulseTimer);
    }
  }, [isActive]);
  
  if (!isActive) return null;
  
  const getLevelColor = () => {
    switch (level) {
      case 'high': return 'bg-amber-200 border-amber-500 text-amber-700';
      case 'medium': return 'bg-blue-100 border-blue-500 text-blue-700';
      case 'low': return 'bg-gray-100 border-gray-400 text-gray-700';
      default: return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };
  
  // Get the appropriate icon based on level
  const getIcon = () => {
    switch (level) {
      case 'high': return <AlertCircle className="mr-2" size={18} />;
      case 'medium': return <RefreshCw className={`mr-2 ${pulseState === 1 ? 'animate-spin' : ''}`} size={18} />;
      case 'low': return <Clock className="mr-2" size={18} />;
      default: return <RefreshCw className="mr-2" size={18} />;
    }
  };
  
  return (
    <div className={`rounded-lg border p-4 mb-4 animate-fade-in ${getLevelColor()}`}>
      <div className="flex items-center">
        {getIcon()}
        <div className="font-medium flex-1">
          Roger is carefully reviewing this response
        </div>
        <div className="text-sm opacity-70">
          {timeElapsed}s
        </div>
      </div>
      
      <div className="mt-3 text-sm">
        {message || "I'm taking extra time to verify this information for accuracy and relevance to your situation."}
      </div>
      
      <div className="mt-4 flex gap-2">
        <Skeleton className={`h-2 w-full bg-blue-200 ${pulseState === 0 ? 'animate-pulse' : ''}`} />
        <Skeleton className={`h-2 w-full bg-blue-300 ${pulseState === 1 ? 'animate-pulse' : ''}`} />
        <Skeleton className={`h-2 w-full bg-blue-400 ${pulseState === 2 ? 'animate-pulse' : ''}`} />
      </div>
    </div>
  );
};

export default RollbackIndicator;
