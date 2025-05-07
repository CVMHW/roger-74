
import React, { useEffect, useState } from 'react';

interface TypingIndicatorProps {
  isSlowMode?: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isSlowMode = false }) => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    // Speed up or slow down the animation based on mode
    const interval = setInterval(() => {
      setDotCount(prev => prev >= 3 ? 1 : prev + 1);
    }, isSlowMode ? 800 : 400);

    return () => clearInterval(interval);
  }, [isSlowMode]);

  return (
    <div className="flex items-center">
      <div className={`typing-indicator ${isSlowMode ? 'slow-mode' : ''}`}>
        <div 
          className={`dot ${dotCount >= 1 ? 'active' : ''} ${isSlowMode ? 'bg-blue-500' : 'bg-gray-500'}`}
        />
        <div 
          className={`dot ${dotCount >= 2 ? 'active' : ''} ${isSlowMode ? 'bg-blue-600' : 'bg-gray-500'}`}
        />
        <div 
          className={`dot ${dotCount >= 3 ? 'active' : ''} ${isSlowMode ? 'bg-blue-700' : 'bg-gray-500'}`}
        />
      </div>

      <span className={`ml-2 text-sm ${isSlowMode ? 'text-blue-700' : 'text-gray-500'}`}>
        {isSlowMode ? 'thinking carefully...' : 'typing...'}
      </span>
    </div>
  );
};

export default TypingIndicator;
