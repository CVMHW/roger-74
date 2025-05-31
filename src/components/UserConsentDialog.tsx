
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
          <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100">
            <TabsTrigger 
              value="consent" 
              className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 data-[state=active]:from-blue-500 data-[state=active]:via-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white border-0 shadow-md transition-all duration-300"
            >
              Roger Information
            </TabsTrigger>
            <TabsTrigger 
              value="crisis" 
              className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white hover:from-red-600 hover:via-red-700 hover:to-red-800 data-[state=active]:from-red-600 data-[state=active]:via-red-700 data-[state=active]:to-red-800 data-[state=active]:text-white border-0 shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <AlertTriangle size={16} />
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
                          Click to view local mobile crisis lines and emergency contacts
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
                          <span className="font-medium text-gray-800">National Suicide Prevention Lifeline</span>
                          <a href="tel:988" className="flex items-center gap-1 text-red-700 hover:text-red-900 font-semibold">
                            <Phone size={14} />
                            <span>988</span>
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Emergency Services</span>
                          <a href="tel:911" className="flex items-center gap-1 text-red-700 hover:text-red-900 font-semibold">
                            <Phone size={14} />
                            <span>911</span>
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Local Mobile Crisis Lines</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Summit County Mobile Crisis</span>
                          <a href="tel:3304349144" className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium">
                            <Phone size={14} />
                            <span>330-434-9144</span>
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Stark County Mobile Crisis</span>
                          <a href="tel:3304526000" className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium">
                            <Phone size={14} />
                            <span>330-452-6000</span>
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Cuyahoga County Mobile Crisis</span>
                          <a href="tel:2166236555" className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium">
                            <Phone size={14} />
                            <span>216-623-6555</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Ohio/National Crisis Support</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">National Suicide Prevention Hotline</span>
                          <a href="tel:18002738255" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                            <Phone size={14} />
                            <span>1-800-273-8255</span>
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Ohio Crisis Text-Line</span>
                          <span className="text-teal-700 font-medium">Text 241-241</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Ohio Veteran Crisis-Line</span>
                          <a href="tel:18002738255" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                            <Phone size={14} />
                            <span>1-800-273-8255</span>
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Trevor Project LGBTQ+ Crisis</span>
                          <a href="tel:8664887386" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                            <Phone size={14} />
                            <span>866-488-7386</span>
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Ohio Trans-Lifeline</span>
                          <a href="tel:8775658860" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                            <Phone size={14} />
                            <span>877-565-8860</span>
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Domestic Violence Lifeline</span>
                          <a href="tel:3304537233" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                            <Phone size={14} />
                            <span>330-453-7233</span>
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Opiate Hotline</span>
                          <a href="tel:3304534357" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                            <Phone size={14} />
                            <span>330-453-4357</span>
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">Ohio Gambling Hotline</span>
                          <a href="tel:18884263500" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                            <Phone size={14} />
                            <span>1-888-532-3500</span>
                          </a>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">United Way of Ohio</span>
                          <a href="tel:211" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                            <Phone size={14} />
                            <span>211</span>
                          </a>
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
              {/* Ohio/National Crisis Support */}
              <div className="p-4 bg-white border border-teal-200 rounded-lg">
                <h4 className="font-semibold text-teal-800 mb-3">Ohio/National Crisis Support</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 hover:bg-teal-50 rounded">
                    <span className="font-medium text-gray-800">National Suicide Prevention Hotline</span>
                    <a href="tel:18002738255" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                      <Phone size={14} />
                      <span>1-800-273-8255</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-teal-50 rounded">
                    <span className="font-medium text-gray-800">Ohio Crisis Text-Line</span>
                    <span className="text-teal-700 font-medium">Text 241-241</span>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-teal-50 rounded">
                    <span className="font-medium text-gray-800">Ohio Veteran Crisis-Line</span>
                    <a href="tel:18002738255" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                      <Phone size={14} />
                      <span>1-800-273-8255</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-teal-50 rounded">
                    <span className="font-medium text-gray-800">Trevor Project LGBTQ+ Crisis</span>
                    <a href="tel:8664887386" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                      <Phone size={14} />
                      <span>866-488-7386</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-teal-50 rounded">
                    <span className="font-medium text-gray-800">Ohio Trans-Lifeline</span>
                    <a href="tel:8775658860" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                      <Phone size={14} />
                      <span>877-565-8860</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-teal-50 rounded">
                    <span className="font-medium text-gray-800">Domestic Violence Lifeline</span>
                    <a href="tel:3304537233" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                      <Phone size={14} />
                      <span>330-453-7233</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-teal-50 rounded">
                    <span className="font-medium text-gray-800">Opiate Hotline</span>
                    <a href="tel:3304534357" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                      <Phone size={14} />
                      <span>330-453-4357</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-teal-50 rounded">
                    <span className="font-medium text-gray-800">Ohio Gambling Hotline</span>
                    <a href="tel:18884263500" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                      <Phone size={14} />
                      <span>1-888-532-3500</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-teal-50 rounded">
                    <span className="font-medium text-gray-800">United Way of Ohio</span>
                    <a href="tel:211" className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium">
                      <Phone size={14} />
                      <span>211</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Akron/Canton Crisis Support */}
              <div className="p-4 bg-white border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Akron/Canton Crisis Support</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 hover:bg-blue-50 rounded">
                    <span className="font-medium text-gray-800">Summit County Mobile Crisis</span>
                    <a href="tel:3304349144" className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium">
                      <Phone size={14} />
                      <span>330-434-9144</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-blue-50 rounded">
                    <span className="font-medium text-gray-800">Akron Children's Crisis Line</span>
                    <a href="tel:3305437472" className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium">
                      <Phone size={14} />
                      <span>330-543-7472</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-blue-50 rounded">
                    <span className="font-medium text-gray-800">Stark County Mobile Crisis</span>
                    <a href="tel:3304526000" className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium">
                      <Phone size={14} />
                      <span>330-452-6000</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-blue-50 rounded">
                    <span className="font-medium text-gray-800">Homeless Hotline: Stark County</span>
                    <a href="tel:3304524363" className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium">
                      <Phone size={14} />
                      <span>330-452-4363</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-blue-50 rounded">
                    <span className="font-medium text-gray-800">Homeless Hotline: Summit County</span>
                    <a href="tel:3306150577" className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium">
                      <Phone size={14} />
                      <span>330-615-0577</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Ashtabula/Jefferson Crisis Support */}
              <div className="p-4 bg-white border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3">Ashtabula/Jefferson Crisis Support</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 hover:bg-green-50 rounded">
                    <span className="font-medium text-gray-800">Ashtabula County 24/7 Substance Use Disorder Crisis</span>
                    <a href="tel:18005777849" className="flex items-center gap-1 text-green-700 hover:text-green-900 font-medium">
                      <Phone size={14} />
                      <span>1-800-577-7849</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-green-50 rounded">
                    <span className="font-medium text-gray-800">Ashtabula Rape Crisis Center</span>
                    <a href="tel:14403547364" className="flex items-center gap-1 text-green-700 hover:text-green-900 font-medium">
                      <Phone size={14} />
                      <span>1-440-354-7364</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-green-50 rounded">
                    <span className="font-medium text-gray-800">Ashtabula County Children Services 24/7</span>
                    <a href="tel:18889981811" className="flex items-center gap-1 text-green-700 hover:text-green-900 font-medium">
                      <Phone size={14} />
                      <span>1-888-998-1811</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-green-50 rounded">
                    <span className="font-medium text-gray-800">Ashtabula Homesafe Domestic Violence</span>
                    <a href="tel:18009522873" className="flex items-center gap-1 text-green-700 hover:text-green-900 font-medium">
                      <Phone size={14} />
                      <span>1-800-952-2873</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-green-50 rounded">
                    <span className="font-medium text-gray-800">Ashtabula Frontline Services</span>
                    <a href="tel:14403818347" className="flex items-center gap-1 text-green-700 hover:text-green-900 font-medium">
                      <Phone size={14} />
                      <span>1-440-381-8347</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-green-50 rounded">
                    <span className="font-medium text-gray-800">Ashtabula Catholic Charities</span>
                    <a href="tel:14409922121" className="flex items-center gap-1 text-green-700 hover:text-green-900 font-medium">
                      <Phone size={14} />
                      <span>1-440-992-2121</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-green-50 rounded">
                    <span className="font-medium text-gray-800">Ashtabula Samaritan House</span>
                    <a href="tel:14409923178" className="flex items-center gap-1 text-green-700 hover:text-green-900 font-medium">
                      <Phone size={14} />
                      <span>1-440-992-3178</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-green-50 rounded">
                    <span className="font-medium text-gray-800">Rock Creek Glenbeigh Substance Abuse Hospital</span>
                    <a href="tel:18774875126" className="flex items-center gap-1 text-green-700 hover:text-green-900 font-medium">
                      <Phone size={14} />
                      <span>1-877-487-5126</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-green-50 rounded">
                    <span className="font-medium text-gray-800">Ashtabula County Regional Medical Center</span>
                    <a href="tel:14409972262" className="flex items-center gap-1 text-green-700 hover:text-green-900 font-medium">
                      <Phone size={14} />
                      <span>1-440-997-2262</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-green-50 rounded">
                    <span className="font-medium text-gray-800">Chardon Ravenwood Psychiatric Hospital</span>
                    <a href="tel:14402854552" className="flex items-center gap-1 text-green-700 hover:text-green-900 font-medium">
                      <Phone size={14} />
                      <span>1-440-285-4552</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Cleveland/Mentor/Chardon Crisis Support */}
              <div className="p-4 bg-white border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-3">Cleveland/Mentor/Chardon Crisis Support</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Cuyahoga County Mobile Crisis (Emergency)</span>
                    <a href="tel:2166236555" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-216-623-6555</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Cleveland Frontline Services</span>
                    <a href="tel:2166236555" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-216-623-6555</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Lake County Frontline Services</span>
                    <a href="tel:14403818347" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-440-381-8347</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Cuyahoga County Catholic Charities</span>
                    <a href="tel:12163342900" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-216-334-2900</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Homeless Hotline: Cuyahoga County</span>
                    <a href="tel:12166746700" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-216-674-6700</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Cleveland Project DAWN Expanded Mobile Unit</span>
                    <a href="tel:12163876290" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-216-387-6290</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Cleveland Emergency Medical Services</span>
                    <a href="tel:12166642555" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-216-664-2555</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Cleveland Emily Program Eating Disorders</span>
                    <a href="tel:18882720836" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-888-272-0836</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Cleveland Windsor-Laurelwood Hospital</span>
                    <a href="tel:14409533000" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-440-953-3000</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Cleveland Highland Springs Hospital</span>
                    <a href="tel:12163023070" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-216-302-3070</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Cleveland Bluestone Pediatric Psychiatric Hospital</span>
                    <a href="tel:12162005030" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-216-200-5030</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Cleveland Veteran's Affairs Mental Healthcare</span>
                    <a href="tel:12167913800" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-216-791-3800 x61035</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-purple-50 rounded">
                    <span className="font-medium text-gray-800">Chardon Ravenwood Psychiatric Hospital</span>
                    <a href="tel:14402854552" className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium">
                      <Phone size={14} />
                      <span>1-440-285-4552</span>
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
