
import React from 'react';
import { DrillDownState } from './types';

interface DrillDownPanelProps {
  activeDetails: string | null;
  onClose: () => void;
}

export const DrillDownPanel: React.FC<DrillDownPanelProps> = ({
  activeDetails,
  onClose
}) => {
  if (!activeDetails) return null;

  return (
    <div className="absolute top-20 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border-2 border-pink-400 max-w-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800">System Details</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{activeDetails}</p>
    </div>
  );
};
