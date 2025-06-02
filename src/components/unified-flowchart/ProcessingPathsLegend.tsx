
import React from 'react';

export const ProcessingPathsLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md text-xs">
      <h4 className="font-bold mb-2">Processing Paths</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-red-600"></div>
          <span>Crisis (Emergency)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-green-600"></div>
          <span>Fast (Greetings)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-purple-600"></div>
          <span>Standard (Emotional)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-blue-600"></div>
          <span>Complex (Full Processing)</span>
        </div>
      </div>
    </div>
  );
};
