
import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

const LegalDisclaimer: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-cvmhw-blue/20 mt-2 p-3">
      <div className="container mx-auto px-4">
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <Shield size={14} className="text-cvmhw-blue mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-medium text-cvmhw-purple">
              <span className="inline-flex items-center gap-1">
                <AlertTriangle size={12} className="text-orange-500" />
                BETA SOFTWARE DISCLAIMER
              </span>
            </p>
            <p>
              This is experimental beta software. Roger AI is not FDA approved or clinically validated. 
              This system is for informational purposes only and does not provide medical advice, diagnosis, or treatment. 
              Always consult licensed healthcare professionals for medical concerns.
            </p>
            <p>
              <strong>Emergency Limitations:</strong> Roger cannot provide emergency services or assess crisis situations. 
              For immediate help, call 911 or the 988 Suicide & Crisis Lifeline. Roger's responses may contain errors and should not replace professional mental health care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimer;
