
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Shield, Heart, Lock, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface UserConsentDialogProps {
  isOpen: boolean;
  onConsent: () => void;
}

const UserConsentDialog: React.FC<UserConsentDialogProps> = ({ isOpen, onConsent }) => {
  const [acknowledgedLimitations, setAcknowledgedLimitations] = useState(false);
  const [acknowledgedEmergency, setAcknowledgedEmergency] = useState(false);
  const [acknowledgedBeta, setAcknowledgedBeta] = useState(false);
  const [password, setPassword] = useState('');
  const [canProceed, setCanProceed] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [crisisResourcesOpen, setCrisisResourcesOpen] = useState(false);

  const REQUIRED_PASSWORD = 'Jefferson00!!';

  useEffect(() => {
    setCanProceed(acknowledgedLimitations && acknowledgedEmergency && acknowledgedBeta && password === REQUIRED_PASSWORD);
    setPasswordError(password.length > 0 && password !== REQUIRED_PASSWORD);
  }, [acknowledgedLimitations, acknowledgedEmergency, acknowledgedBeta, password]);

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="text-cvmhw-orange fill-cvmhw-orange" size={24} />
            Important Information About Roger AI
          </DialogTitle>
          <DialogDescription className="text-base">
            Before you begin chatting with Roger, please read and acknowledge the following important information.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="consent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="consent">Roger Information</TabsTrigger>
            <TabsTrigger value="crisis" className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600" />
              Crisis Resources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="consent" className="space-y-6 py-4">
            {/* Testing Notice */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="text-red-600 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">System Testing Mode</h3>
                  <p className="text-sm text-red-700 mb-3">
                    Roger is currently in testing mode. Access is restricted to authorized personnel only.
                  </p>
                </div>
              </div>
            </div>

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

            {/* Crisis Resources Section Above Password */}
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <Collapsible open={crisisResourcesOpen} onOpenChange={setCrisisResourcesOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full flex justify-between items-center p-0 hover:bg-transparent">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="text-red-600" size={24} />
                      <div className="text-left">
                        <h3 className="font-bold text-red-800 text-lg">Need Help Now? Crisis Resources Available 24/7</h3>
                        <p className="text-sm text-red-700">
                          Click to view emergency contacts and crisis support numbers
                        </p>
                      </div>
                    </div>
                    {crisisResourcesOpen ? (
                      <ChevronUp className="text-red-600" size={20} />
                    ) : (
                      <ChevronDown className="text-red-600" size={20} />
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-4 space-y-3">
                  <div className="grid gap-2">
                    <div className="p-3 bg-white border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">Emergency Support</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">National Suicide Prevention Lifeline</span>
                          <a href="tel:988" className="flex items-center gap-1 text-red-600 hover:text-red-800">
                            <Phone size={14} />
                            <span className="font-bold">988</span>
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Emergency Services</span>
                          <a href="tel:911" className="flex items-center gap-1 text-red-600 hover:text-red-800">
                            <Phone size={14} />
                            <span className="font-bold">911</span>
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Crisis Text Line</span>
                          <span className="text-red-600 font-bold">Text 741741</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4">
              <div className="flex-1">
                <label htmlFor="access-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Access Password (Testing Mode)
                </label>
                <Input
                  id="access-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access password"
                  className={passwordError ? 'border-red-500' : ''}
                />
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">Incorrect password</p>
                )}
              </div>
              <Button 
                onClick={handleConsent}
                disabled={!canProceed}
                className={`px-6 py-2 ${canProceed ? 'bg-cvmhw-blue hover:bg-cvmhw-purple' : 'bg-gray-300'}`}
              >
                I Understand and Agree to Proceed
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="crisis" className="space-y-4 py-4">
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg mb-4">
              <h3 className="text-red-700 font-bold flex items-center gap-2 mb-2">
                <AlertTriangle size={20} />
                <span>Immediate Help Available</span>
              </h3>
              <p className="text-red-700">
                If you or someone you know is in immediate danger, please call 911 or your local emergency services immediately.
                You can also call or text 988 to reach the Suicide and Crisis Lifeline, available 24/7.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-3">Emergency Crisis Support</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 hover:bg-red-50 rounded">
                    <span className="font-medium">National Suicide Prevention Lifeline</span>
                    <a href="tel:988" className="flex items-center gap-1 text-red-600 hover:text-red-800">
                      <Phone size={14} />
                      <span className="font-bold">988</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-red-50 rounded">
                    <span className="font-medium">Crisis Text Line</span>
                    <span className="text-red-600 font-bold">Text 741741</span>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-red-50 rounded">
                    <span className="font-medium">Emergency Services</span>
                    <a href="tel:911" className="flex items-center gap-1 text-red-600 hover:text-red-800">
                      <Phone size={14} />
                      <span className="font-bold">911</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-3">Cleveland/Ohio Crisis Support</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 hover:bg-blue-50 rounded">
                    <span className="font-medium">Cuyahoga County Mobile Crisis</span>
                    <a href="tel:2166236555" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                      <Phone size={14} />
                      <span className="font-bold">216-623-6555</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-blue-50 rounded">
                    <span className="font-medium">Highland Springs Hospital</span>
                    <a href="tel:2163023070" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                      <Phone size={14} />
                      <span className="font-bold">216-302-3070</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-blue-50 rounded">
                    <span className="font-medium">Windsor-Laurelwood Hospital</span>
                    <a href="tel:4409533000" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                      <Phone size={14} />
                      <span className="font-bold">440-953-3000</span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Additional Support</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 hover:bg-blue-50 rounded">
                    <span className="font-medium">Trevor Project (LGBTQ+ Crisis)</span>
                    <a href="tel:8664887386" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                      <Phone size={14} />
                      <span className="font-bold">866-488-7386</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-blue-50 rounded">
                    <span className="font-medium">Domestic Violence Hotline</span>
                    <a href="tel:3304537233" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                      <Phone size={14} />
                      <span className="font-bold">330-453-7233</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserConsentDialog;
