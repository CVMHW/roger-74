
import React from 'react';

const BetaBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-cvmhw-purple to-cvmhw-pink text-white text-xs font-bold shadow-sm border border-white/20">
      <span className="relative">
        BETA
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      </span>
    </div>
  );
};

export default BetaBadge;
