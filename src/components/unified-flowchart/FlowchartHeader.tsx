
import React from 'react';

interface FlowchartHeaderProps {
  title: string;
  description: string;
  helpText: string;
}

export const FlowchartHeader: React.FC<FlowchartHeaderProps> = ({
  title,
  description,
  helpText
}) => {
  return (
    <div className="p-4 bg-white border-b shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-600 mt-1">{description}</p>
      <div className="mt-2 text-sm text-blue-600">{helpText}</div>
    </div>
  );
};
