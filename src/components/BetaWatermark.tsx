
import React from 'react';

const BetaWatermark: React.FC = () => {
  return (
    <div className="fixed top-20 right-4 z-10 pointer-events-none select-none">
      <div className="transform rotate-6 opacity-30">
        <div className="bg-gradient-to-br from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent text-4xl font-semibold tracking-wider">
          BETA
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center font-medium">
          Testing Phase
        </div>
      </div>
    </div>
  );
};

export default BetaWatermark;
