
import React from 'react';
import { Badge } from '@/components/ui/badge';

const BetaWatermark: React.FC = () => {
  return (
    <div className="fixed top-20 right-4 z-10 pointer-events-none select-none">
      <div className="flex flex-col items-end gap-2">
        {/* Main Beta Badge */}
        <div className="relative">
          <Badge 
            variant="outline" 
            className="bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple text-white border-white/30 shadow-lg backdrop-blur-sm px-3 py-1.5 text-sm font-bold tracking-wider"
          >
            <span className="relative flex items-center gap-2">
              BETA
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </span>
          </Badge>
        </div>
        
        {/* Professional Subtitle */}
        <div className="text-xs text-gray-500 font-medium bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-gray-200">
          Development Phase
        </div>
      </div>
    </div>
  );
};

export default BetaWatermark;
