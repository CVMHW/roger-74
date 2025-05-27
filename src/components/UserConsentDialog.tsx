
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Shield, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserConsentDialogProps {
  isOpen: boolean;
  onConsent: () => void;
}

const UserConsentDialog: React.FC<UserConsentDialogProps> = ({ isOpen, onConsent }) => {
  const [acknowledgedLimitations, setAcknowledgedLimitations] = useState(false);
  const [acknowledgedEmergency, setAcknowledgedEmergency] = useState(false);
  const [acknowledgedBeta, setAcknowledgedBeta] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    setCanProceed(acknowledgedLimitations && acknowledgedEmergency && acknowledgedBeta);
  }, [acknowledgedLimitations, acknowledgedEmergency, acknowledgedBeta]);

  const handleConsent = () => {
    if (canProceed) {
      // Store consent in localStorage with timestamp
      const consentData = {
        timestamp: new Date().toISOString(),
        acknowledgedLimitations,
        acknowledgedEmergency,
        acknowledgedBeta,
        version: '1.0'
      };
      localStorage.setItem('roger_user_consent', JSON.stringify(consentData));
      onConsent();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="text-cvmhw-orange fill-cvmhw-orange" size={24} />
            Important Information About Roger AI
          </DialogTitle>
          <DialogDescription className="text-base">
            Before you begin chatting with Roger, please read and acknowledge the following important information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Beta Software Warning */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-orange-600 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Beta Software Notice</h3>
                <p className="text-sm text-orange-700 mb-3">
                  Roger AI is experimental beta software that is not FDA approved or clinically validated. 
                  This system is for informational and peer support purposes only.
                </p>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="beta-acknowledge"
                    checked={acknowledgedBeta}
                    onCheckedChange={(checked) => setAcknowledgedBeta(checked as boolean)}
                  />
                  <label htmlFor="beta-acknowledge" className="text-sm text-orange-800 cursor-pointer">
                    I understand that Roger AI is experimental beta software and not clinically validated
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Limitations */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Emergency Limitations</h3>
                <p className="text-sm text-red-700 mb-3">
                  <strong>Roger cannot provide emergency services or assess crisis situations comparable to crisis professionals.</strong>
                  <br />
                  For immediate help, call 911 or text/call 988 (Suicide & Crisis Lifeline).
                </p>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="emergency-acknowledge"
                    checked={acknowledgedEmergency}
                    onCheckedChange={(checked) => setAcknowledgedEmergency(checked as boolean)}
                  />
                  <label htmlFor="emergency-acknowledge" className="text-sm text-red-800 cursor-pointer">
                    I understand Roger's emergency limitations and will call 911 or 988 for crisis situations
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Limitations */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Heart className="text-cvmhw-pink fill-cvmhw-pink mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">What Roger Is and Isn't</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Roger is a peer support companion in training, not a licensed therapist or medical professional. 
                  Roger does not provide medical advice, diagnosis, or treatment and should not replace professional mental health care.
                </p>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="limitations-acknowledge"
                    checked={acknowledgedLimitations}
                    onCheckedChange={(checked) => setAcknowledgedLimitations(checked as boolean)}
                  />
                  <label htmlFor="limitations-acknowledge" className="text-sm text-blue-800 cursor-pointer">
                    I understand that Roger is not a therapist and does not replace professional mental health care
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Additional Important Information</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Your conversations help train Roger under professional supervision</li>
              <li>• Crisis situations are logged and may be reviewed by licensed professionals</li>
              <li>• Always consult licensed healthcare professionals for medical concerns</li>
              <li>• Roger's responses may contain errors and should be used as peer support only</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleConsent}
            disabled={!canProceed}
            className={`px-6 py-2 ${canProceed ? 'bg-cvmhw-blue hover:bg-cvmhw-purple' : 'bg-gray-300'}`}
          >
            I Understand and Agree to Proceed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserConsentDialog;
