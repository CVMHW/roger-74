
import React from 'react';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';
import CrisisResources from '../components/CrisisResources';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Users, Award, BookOpen, Heart, Shield, Star, Calendar, Info } from 'lucide-react';

const Index = () => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
    e.currentTarget.classList.remove('logo-pulse');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cvmhw-light to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card - More compact */}
          <Card className="shadow-md border-cvmhw-blue border mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <img 
                    src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                    alt="CVMHW Logo" 
                    className="w-full h-full object-contain"
                    onError={handleImageError}
                  />
                </div>
                <CardTitle className="text-xl font-semibold text-cvmhw-purple">Welcome from Roger at Cuyahoga Valley Mindful Health & Wellness</CardTitle>
              </div>
              <CardDescription>Your Peer Mental Health Support Companion</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                I'm Roger, your Peer Support companion at Cuyahoga Valley Mindful Health and Wellness. 
                I'm here to chat with you while you wait for your therapist. I'm not a licensed professional, 
                but I can provide a listening ear and supportive perspective as I continue my training under professional guidance.
              </p>
              <div className="flex items-center mt-2 p-2 bg-blue-50 rounded-md border border-blue-100">
                <div className="rounded-full bg-gradient-to-br from-cvmhw-purple via-cvmhw-blue to-cvmhw-pink h-8 w-8 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">R</span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Remember:</span> Our conversation is meant to provide Peer Support only. 
                  If you need immediate assistance, please use the crisis resources below.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Crisis Resources - Always visible but collapsed by default */}
          <div className="mb-6">
            <CrisisResources forceOpen={false} />
          </div>
          
          {/* Tabbed Content for Chat and About */}
          <Tabs defaultValue="chat" className="mb-6">
            <TabsList className="w-full mb-2">
              <TabsTrigger className="w-1/2" value="chat">
                <div className="flex items-center">
                  <Heart size={18} className="mr-2 text-cvmhw-pink" />
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
                    <CardTitle className="text-xl font-semibold gradient-text">About Cuyahoga Valley Mindful Health and Wellness</CardTitle>
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
                      <BookOpen className="text-cvmhw-purple h-6 w-6 mt-1" />
                      <div>
                        <h3 className="font-medium text-cvmhw-blue">Evidence-Based Approaches</h3>
                        <p className="text-sm text-gray-600">Our therapists use cognitive-processing therapy, mindfulness techniques, and play therapy.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Heart className="text-cvmhw-pink h-6 w-6 mt-1" />
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
                      <Shield className="text-cvmhw-orange h-6 w-6 mt-1" />
                      <div>
                        <h3 className="font-medium text-cvmhw-blue">Veteran Services</h3>
                        <p className="text-sm text-gray-600">Specialized support for veterans dealing with military adjustment and PTSD.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Star className="text-cvmhw-purple h-6 w-6 mt-1" />
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
                  <a 
                    href="https://calendly.com/ericmriesterer/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-cvmhw-blue hover:text-cvmhw-purple transition-colors"
                  >
                    <Calendar size={16} />
                    <span>Schedule an appointment online</span>
                  </a>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
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
            <span className="font-medium text-cvmhw-purple">Cuyahoga Valley Mindful Health and Wellness</span>
          </div>
          <div className="text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} Cuyahoga Valley Mindful Health and Wellness</p>
            <p className="mt-1">Roger is a Peer Support companion trained by professionals. He is not a substitute for professional mental health services.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
