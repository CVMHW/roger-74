
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Heart, Users, Shield, Star, Award, Calendar } from 'lucide-react';
import CVMHWButton from './CVMHWButton';
import InsuranceProviderButton from './InsuranceProviderButton';

interface AboutCVMHWTabProps {
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const AboutCVMHWTab: React.FC<AboutCVMHWTabProps> = ({ onImageError }) => {
  return (
    <Card className="shadow-md border-cvmhw-blue border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <a 
              href="https://cvmhw.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full h-full cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                window.open('https://cvmhw.com', '_blank', 'noopener,noreferrer');
              }}
            >
              <img 
                src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                alt="CVMHW Logo" 
                className="w-full h-full object-contain logo-pulse cursor-pointer"
                onError={onImageError}
              />
            </a>
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
            <CVMHWButton onImageError={onImageError} />
          </div>
          <InsuranceProviderButton />
        </div>
      </CardFooter>
    </Card>
  );
};

export default AboutCVMHWTab;
