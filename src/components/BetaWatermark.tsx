
import React from 'react';

const BetaWatermark: React.FC = () => {
  return (
    <div className="fixed top-20 right-4 z-10 pointer-events-none select-none">
      <div className="transform rotate-12 opacity-10">
        <div className="bg-gradient-to-br from-cvmhw-purple via-cvmhw-blue to-cvmhw-pink bg-clip-text text-transparent text-6xl font-bold">
          BETA
        </div>
      </div>
    </div>
  );
};

export default BetaWatermark;
