
import React from 'react';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';
import CrisisResources from '../components/CrisisResources';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Image, Users, Award, BookOpen, Heart } from 'lucide-react';

const Index = () => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
    e.currentTarget.classList.remove('logo-pulse');
  };

  return (
    <div className="min-h-screen bg-cvmhw-light flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-md border-cvmhw-blue border">
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
                <CardTitle className="text-xl font-semibold text-cvmhw-purple">Welcome to Roger.AI</CardTitle>
              </div>
              <CardDescription>Your teen PTSD treatment companion</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                I'm Roger, your peer support companion at Cuyahoga Valley Mindful Health and Wellness. 
                I'm here to chat with you while you wait for your therapist. I'm not a licensed professional, 
                but I can provide a listening ear and supportive perspective.
              </p>
              <div className="flex items-center mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                <div className="rounded-full bg-gradient-to-br from-cvmhw-purple via-cvmhw-blue to-cvmhw-pink h-10 w-10 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">R</span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Remember:</span> Our conversation is meant to provide peer support only. 
                  If you need immediate assistance, please use the crisis resources below.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <ChatInterface />
          
          <CrisisResources />
          
          <Card className="shadow-md border-cvmhw-blue border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold gradient-text">About Cuyahoga Valley Mindful Health and Wellness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative w-16 h-16">
                  <img 
                    src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                    alt="CVMHW Logo" 
                    className="w-full h-full object-contain logo-pulse"
                    onError={handleImageError}
                  />
                </div>
                <div>
                  <p className="text-gray-600">
                    We are dedicated to supporting teen PTSD treatment through mindful, 
                    evidence-based approaches. Our team of licensed professionals works 
                    together to provide personalized care and guidance.
                  </p>
                  <p className="text-gray-600 mt-2">
                    While Roger.AI is here to provide additional support, your relationship with 
                    your therapist remains at the center of your care.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start space-x-3">
                  <BookOpen className="text-cvmhw-purple h-6 w-6 mt-1" />
                  <div>
                    <h3 className="font-medium text-cvmhw-blue">Evidence-Based Approaches</h3>
                    <p className="text-sm text-gray-600">Our therapists use cognitive-processing therapy, mindfulness techniques, and play therapy to address PTSD and related concerns.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Heart className="text-cvmhw-pink h-6 w-6 mt-1" />
                  <div>
                    <h3 className="font-medium text-cvmhw-blue">Compassionate Care</h3>
                    <p className="text-sm text-gray-600">Creating a safe, supportive environment where teens can feel heard and understood during their healing journey.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="text-cvmhw-blue h-6 w-6 mt-1" />
                  <div>
                    <h3 className="font-medium text-cvmhw-blue">Specialized Focus</h3>
                    <p className="text-sm text-gray-600">Expert care for anxiety, depression, family dynamics, school issues, and trauma-related concerns.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Award className="text-cvmhw-orange h-6 w-6 mt-1" />
                  <div>
                    <h3 className="font-medium text-cvmhw-blue">Insurance Accepted</h3>
                    <p className="text-sm text-gray-600">We work with most major insurance providers including Aetna, Anthem, Blue Cross, Medicaid, and more.</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 text-sm text-gray-500">
              <p>For appointments or questions, please contact your provider directly.</p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <footer className="bg-white shadow-md mt-8 border-t border-cvmhw-blue">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3 mb-3">
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
            <p className="mt-1">Roger.AI is a peer support companion and is not a substitute for professional mental health services.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
