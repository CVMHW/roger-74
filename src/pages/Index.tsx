
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';
import CrisisResources from '../components/CrisisResources';
import BetaWatermark from '../components/BetaWatermark';
import LegalDisclaimer from '../components/LegalDisclaimer';
import ExternalCrisisLink from '../components/ExternalCrisisLink';
import UserConsentDialog from '../components/UserConsentDialog';
import FloatingCrisisButton from '../components/FloatingCrisisButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Image, Users, Award, BookOpen, Heart, Shield, Star, Calendar, Info, CreditCard } from 'lucide-react';
import PatientRightsTab from '../components/PatientRightsTab';

const Index = () => {
  const [showConsentDialog, setShowConsentDialog] = useState(true); // Always start with dialog shown
  const [hasConsented, setHasConsented] = useState(false);

  // Remove the useEffect that was checking localStorage - we want consent dialog every session
  
  const handleConsent = () => {
    setHasConsented(true);
    setShowConsentDialog(false);
    
    // Still store consent with session timestamp for tracking purposes
    const consentData = {
      timestamp: new Date().toISOString(),
      sessionId: sessionStorage.getItem('roger_session_id') || 'unknown',
      acknowledgedLimitations: true,
      acknowledgedEmergency: true,
      acknowledgedBeta: true,
      version: '1.0'
    };
    localStorage.setItem('roger_user_consent', JSON.stringify(consentData));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
    e.currentTarget.classList.remove('logo-pulse');
  };

  const insuranceProviders = [
    'Aetna',
    'Amerihealth Caritas', 
    'Anthem Ohio',
    'Anthem BCBS',
    'Beacon Health',
    'Buckeye',
    'Buckeye Ambetter',
    'Carelon',
    'Caresource',
    'Cigna',
    'Frontpath',
    'Medical Mutual',
    'Medicaid',
    'Medicare',
    'Molina',
    'OptumHealth',
    'Paramount',
    'UHC Choice',
    'UHC Corporate',
    'UHC Medicaid'
  ];

  const InsuranceButton = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-gradient-to-r from-cvmhw-blue to-cvmhw-light text-white border-0 hover:from-cvmhw-light hover:to-cvmhw-blue hover:text-cvmhw-blue transition-all duration-300 shadow-md">
          <CreditCard size={16} />
          <span className="font-medium">Insurance Accepted</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-gradient-to-b from-cvmhw-light/50 to-white border border-cvmhw-light shadow-lg">
        <h3 className="font-semibold text-cvmhw-blue mb-3 flex items-center gap-2">
          <Heart size={16} className="text-cvmhw-pink fill-cvmhw-pink" />
          Insurance Providers Accepted
        </h3>
        <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
          {insuranceProviders.map((provider, index) => (
            <div key={index} className="text-sm text-gray-700 py-1.5 px-2 rounded hover:bg-cvmhw-light/60 transition-colors border-b border-cvmhw-light/50 last:border-b-0">
              {provider}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3 p-2 bg-cvmhw-light/40 rounded-md">
          💙 Contact us to verify coverage and benefits for your specific plan.
        </p>
      </PopoverContent>
    </Popover>
  );

  const CVMHWButton = () => (
    <a 
      href="https://cvmhw.com" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple text-white text-sm font-medium rounded-md hover:from-cvmhw-blue hover:to-cvmhw-blue transition-all duration-200 shadow-sm"
    >
      <div className="relative w-5 h-5">
        <img 
          src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
          alt="CVMHW Logo" 
          className="w-full h-full object-contain"
          onError={handleImageError}
        />
      </div>
      <span>Visit CVMHW</span>
    </a>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-cvmhw-light to-white relative">
      <Header />
      
      {/* User Consent Dialog - now shows every session */}
      <UserConsentDialog 
        isOpen={showConsentDialog}
        onConsent={handleConsent}
      />
      
      {/* Floating Crisis Button - always visible when consented */}
      {hasConsented && <FloatingCrisisButton />}
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card - More compact */}
          <Card className="shadow-md border-cvmhw-blue border mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10">
                    <img 
                      src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                      alt="CVMHW Logo" 
                      className="w-full h-full object-contain"
                      onError={handleImageError}
                    />
                  </div>
                  <CardTitle className="text-xl font-semibold bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent">Welcome from Roger at Cuyahoga Valley Mindful Health & Wellness</CardTitle>
                </div>
                <BetaWatermark />
              </div>
              <CardDescription>Your Peer Mental Health Support Companion</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                I'm Roger, your Peer Support companion at Cuyahoga Valley Mindful Health and Wellness. 
                I'm here to chat with you while you wait for your therapist. I'm not a licensed professional, 
                but I can provide a listening ear and supportive perspective as I continue my training under professional guidance.
              </p>
              
              {/* External Crisis Resources Link */}
              <div className="mb-4">
                <ExternalCrisisLink />
              </div>
              
              <div className="flex items-center mt-2 p-2 bg-gradient-to-r from-blue-50 to-cvmhw-light/30 rounded-md border border-cvmhw-light">
                <div className="rounded-full bg-gradient-to-br from-cvmhw-blue via-cvmhw-purple to-cvmhw-pink h-8 w-8 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">R</span>
                </div>
                <p className="text-sm text-gray-600 flex-1">
                  <span className="font-medium">Remember:</span> Roger is a peer support companion, not a licensed therapist. 
                  For immediate crisis support, please use the resources below.
                </p>
                <div className="ml-3 flex items-center gap-2">
                  <CVMHWButton />
                  <InsuranceButton />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crisis Resources - Always visible but collapsed by default */}
          <div className="mb-6">
            <CrisisResources forceOpen={false} />
          </div>
          
          {/* Patient Rights Section - Softer, more compassionate design */}
          {hasConsented && (
            <div className="mb-6">
              <details className="group">
                <summary className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-slate-50/90 via-blue-50/60 to-cyan-50/70 rounded-lg border border-blue-200/50 cursor-pointer hover:from-blue-50/80 hover:via-cyan-50/70 hover:to-slate-50/80 transition-all duration-200 shadow-md backdrop-blur-sm relative overflow-hidden">
                  {/* Gentle shimmer effect - much softer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent transform -skew-x-12 animate-pulse opacity-30" />
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-2 rounded-lg shadow-sm">
                      <Shield size={18} className="text-white drop-shadow-sm" />
                    </div>
                    <span className="text-base font-medium bg-gradient-to-r from-slate-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">About CVMHW Services & Your Rights</span>
                  </div>
                  <span className="text-blue-500 group-open:rotate-180 transition-transform duration-200 relative z-10 bg-white/70 p-1.5 rounded-full shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </span>
                </summary>
                <div className="mt-3">
                  <PatientRightsTab />
                </div>
              </details>
            </div>
          )}
          
          {/* Tabbed Content for Chat and About - Only show if user has consented */}
          {hasConsented && (
            <Tabs defaultValue="chat" className="mb-6">
              <TabsList className="w-full mb-2">
                <TabsTrigger className="w-1/2" value="chat">
                  <div className="flex items-center">
                    <Heart size={18} className="mr-2 text-cvmhw-pink fill-cvmhw-pink" />
                    <span>Chat with Roger</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger className="w-1/2" value="about">
                  <div className="flex items-center">
                    <Info size={18} className="mr-2 text-cvmhw-blue" />
                    <span>About CVMHW</span>
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="focus:outline-none">
                <ChatInterface />
              </TabsContent>
              
              <TabsContent value="about" className="focus:outline-none">
                <Card className="shadow-md border-cvmhw-blue border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="relative w-10 h-10">
                        <img 
                          src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                          alt="CVMHW Logo" 
                          className="w-full h-full object-contain logo-pulse"
                          onError={handleImageError}
                        />
                      </div>
                      <CardTitle className="text-xl font-semibold bg-gradient-to-r from-cvmhw-blue via-cvmhw-purple to-cvmhw-pink bg-clip-text text-transparent">About Cuyahoga Valley Mindful Health and Wellness</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      We are dedicated to supporting mental health and wellness for clients of all ages, from children as young as 4 
                      to adults and veterans. Our team of licensed professionals works together to provide personalized care 
                      and evidence-based treatment.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-start space-x-3">
                        <BookOpen className="text-cvmhw-blue h-6 w-6 mt-1" />
                        <div>
                          <h3 className="font-medium text-cvmhw-blue">Evidence-Based Approaches</h3>
                          <p className="text-sm text-gray-600">Our therapists use cognitive-processing therapy, mindfulness techniques, and play therapy.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Heart className="text-cvmhw-pink fill-cvmhw-pink h-6 w-6 mt-1" />
                        <div>
                          <h3 className="font-medium text-cvmhw-blue">Compassionate Care</h3>
                          <p className="text-sm text-gray-600">Creating a safe, supportive environment where clients of all ages can feel heard.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Users className="text-cvmhw-blue h-6 w-6 mt-1" />
                        <div>
                          <h3 className="font-medium text-cvmhw-blue">Diverse Specializations</h3>
                          <p className="text-sm text-gray-600">Expert care for anxiety, depression, PTSD, family dynamics, and trauma-related concerns.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Shield className="text-cvmhw-orange fill-cvmhw-orange h-6 w-6 mt-1" />
                        <div>
                          <h3 className="font-medium text-cvmhw-blue">Veteran Services</h3>
                          <p className="text-sm text-gray-600">Specialized support for veterans dealing with military adjustment and PTSD.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Star className="text-cvmhw-blue h-6 w-6 mt-1" />
                        <div>
                          <h3 className="font-medium text-cvmhw-blue">Child & Family Services</h3>
                          <p className="text-sm text-gray-600">Play therapy and family counseling for children as young as 4 years old.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Award className="text-cvmhw-blue h-6 w-6 mt-1" />
                        <div>
                          <h3 className="font-medium text-cvmhw-blue">Insurance Accepted</h3>
                          <p className="text-sm text-gray-600">We work with most major insurance providers including Medicaid.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 text-sm text-gray-500">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <a 
                          href="https://calendly.com/ericmriesterer/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 text-cvmhw-blue hover:text-cvmhw-purple transition-colors"
                        >
                          <Calendar size={16} />
                          <span>Schedule an appointment online</span>
                        </a>
                        <CVMHWButton />
                      </div>
                      <InsuranceButton />
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          {/* Show message if not consented */}
          {!hasConsented && (
            <Card className="shadow-md border-gray-300 border mb-6">
              <CardContent className="p-6 text-center">
                <Shield size={48} className="mx-auto text-cvmhw-orange fill-cvmhw-orange mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Please Review Important Information
                </h3>
                <p className="text-gray-600">
                  Before chatting with Roger, please review and acknowledge the important safety information and limitations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <footer className="bg-white shadow-md mt-4 border-t border-cvmhw-blue">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative w-8 h-8">
              <img 
                src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                alt="CVMHW Logo" 
                className="w-full h-full object-contain"
                onError={handleImageError}
              />
            </div>
            <span className="font-medium bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent">Cuyahoga Valley Mindful Health and Wellness</span>
          </div>
          
          {/* External Crisis Link in Footer */}
          <div className="flex justify-center mb-3">
            <ExternalCrisisLink variant="footer" />
          </div>
          
          <div className="text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} Cuyahoga Valley Mindful Health and Wellness</p>
            <p className="mt-1">Roger is a Peer Support companion in-training. He is not a substitute for professional mental health services. Click our Crisis Resources & Support tab for immediate assistance.</p>
          </div>
        </div>
        <LegalDisclaimer />
      </footer>
    </div>
  );
};

export default Index;
