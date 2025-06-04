
import React from 'react';
import { Heart, Brain } from 'lucide-react';

const MobileServiceDescription = () => {
  return (
    <div className="mt-2 px-1">
      <div className="bg-white/80 rounded-lg px-3 py-2 shadow-sm border border-blue-100/40 backdrop-blur-sm">
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-1 mt-0.5 flex-shrink-0">
            <Heart className="h-3 w-3 text-cvmhw-blue" />
            <Brain className="h-3 w-3 text-cvmhw-purple" />
          </div>
          <p className="text-xs font-medium text-slate-700 leading-relaxed">
            Comprehensive Mental Health Services Ages 4+ • Family Therapy • PTSD Treatment • Veterans • Men's Issues
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileServiceDescription;
