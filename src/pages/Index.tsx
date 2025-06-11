import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';
import LazyUserConsentDialog from '../components/LazyUserConsentDialog';
import FloatingCrisisButton from '../components/FloatingCrisisButton';
import CrisisResources from '../components/CrisisResources';
import WelcomeCard from '../components/WelcomeCard';
import AboutCVMHWTab from '../components/AboutCVMHWTab';
import MainFooter from '../components/MainFooter';
import SitemapTester from '../components/SitemapTester';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Info, Shield, Globe } from 'lucide-react';
import PatientRightsTab from '../components/PatientRightsTab';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [showSitemapTester, setShowSitemapTester] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log('Index component: Initializing...');
    setShowConsentDialog(true);
    
    // Show sitemap tester in development mode or when URL contains sitemap-test
    const shouldShowTester = window.location.search.includes('sitemap-test') || 
                           window.location.hostname === 'localhost';
    setShowSitemapTester(shouldShowTester);
  }, []);

  const handleConsent = () => {
    console.log('User consented');
    setHasConsented(true);
    setShowConsentDialog(false);
    
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-cvmhw-light to-white relative">
      <Header />
      
      <LazyUserConsentDialog 
        isOpen={showConsentDialog}
        onConsent={handleConsent}
      />
      
      {hasConsented && <FloatingCrisisButton />}
      
      <main className={`container mx-auto px-4 py-6 ${!isMobile ? 'pt-24' : ''}`}>
        <div className="max-w-4xl mx-auto">
          <WelcomeCard onImageError={handleImageError} />
          
          {/* Comprehensive Test Dashboard - Development/Testing Only */}
          {showSitemapTester && (
            <div className="mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-yellow-800 mb-2">🔧 Developer Testing Mode</h3>
                <p className="text-yellow-700 text-sm mb-3">
                  Comprehensive sitemap testing suite with 100 automated tests and rated solutions.
                </p>
                <a 
                  href="/test-dashboard" 
                  className="inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                >
                  Open Test Dashboard
                </a>
              </div>
              <SitemapTester />
            </div>
          )}
          
          {/* Crisis Resources Section */}
          {hasConsented && (
            <div className="mb-6">
              <CrisisResources />
            </div>
          )}
          
          {/* Patient Rights Section */}
          {hasConsented && (
            <div className="mb-6">
              <details className="group">
                <summary className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-slate-50/90 via-blue-50/60 to-cyan-50/70 rounded-lg border border-blue-200/50 cursor-pointer hover:from-blue-50/80 hover:via-cyan-50/70 hover:to-slate-50/80 transition-all duration-200 shadow-md backdrop-blur-sm relative overflow-hidden">
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
          
          {/* Tabbed Content */}
          {hasConsented && (
            <Tabs defaultValue="chat" className="mb-6">
              <TabsList className="w-full mb-2">
                <TabsTrigger className="w-1/3" value="chat">
                  <div className="flex items-center">
                    <Heart size={18} className="mr-2 text-cvmhw-pink fill-cvmhw-pink" />
                    <span>Chat with Roger</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger className="w-1/3" value="about">
                  <div className="flex items-center">
                    <Info size={18} className="mr-2 text-cvmhw-blue" />
                    <span>About CVMHW</span>
                  </div>
                </TabsTrigger>
                {showSitemapTester && (
                  <TabsTrigger className="w-1/3" value="sitemap">
                    <div className="flex items-center">
                      <Globe size={18} className="mr-2 text-green-600" />
                      <span>SEO Test</span>
                    </div>
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="chat" className="focus:outline-none">
                <ChatInterface />
              </TabsContent>
              
              <TabsContent value="about" className="focus:outline-none">
                <AboutCVMHWTab onImageError={handleImageError} />
              </TabsContent>
              
              {showSitemapTester && (
                <TabsContent value="sitemap" className="focus:outline-none">
                  <SitemapTester />
                </TabsContent>
              )}
            </Tabs>
          )}
          
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
      
      <MainFooter onImageError={handleImageError} />
    </div>
  );
};

export default Index;
