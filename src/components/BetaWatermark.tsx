
import React from 'react';
import { Badge } from '@/components/ui/badge';

const BetaWatermark: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      {/* Compact Beta Badge */}
      <Badge 
        variant="outline" 
        className="bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple text-white border-white/30 shadow-sm backdrop-blur-sm px-2 py-1 text-xs font-bold tracking-wider"
      >
        <span className="relative flex items-center gap-1">
          BETA
          <span className="flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
          </span>
        </span>
      </Badge>
      
      {/* Compact Development Phase Text */}
      <div className="text-xs text-gray-500 font-medium bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm border border-gray-200">
        Dev Phase
      </div>
    </div>
  );
};

export default BetaWatermark;
