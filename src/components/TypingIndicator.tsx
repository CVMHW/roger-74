
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 ml-2">
      <div className="h-8 w-8 rounded-full bg-roger flex items-center justify-center">
        <span className="text-white font-medium text-sm">R</span>
      </div>
      <div className="bg-gray-100 px-4 py-2 rounded-lg">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
