
import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

const LegalDisclaimer: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-cvmhw-blue/20 mt-2 py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <Shield size={12} className="text-cvmhw-blue mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-medium text-cvmhw-purple text-xs">
              <span className="inline-flex items-center gap-1">
                <AlertTriangle size={10} className="text-orange-500" />
                LEGAL NOTICE
              </span>
            </p>
            <p className="text-xs leading-tight">
              Experimental beta software • Not FDA approved or clinically validated as a medical device • Informational only • Always consult healthcare professionals • 
              Emergency: <a href="tel:911" className="text-cvmhw-blue hover:underline font-medium">911</a> or <a href="tel:988" className="text-cvmhw-blue hover:underline font-medium">988 Crisis Lifeline</a> • Responses may contain errors • Not a substitute for professional care
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimer;
