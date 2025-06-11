
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BetaWatermark from './BetaWatermark';
import ProfileBubble from './ProfileBubble';
import CVMHWButton from './CVMHWButton';
import InsuranceProviderButton from './InsuranceProviderButton';
import { useIsMobile } from '../hooks/use-mobile';

interface WelcomeCardProps {
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ onImageError }) => {
  const isMobile = useIsMobile();

  return (
    <Card className="shadow-md border-cvmhw-blue border mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
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
                  className="w-full h-full object-contain cursor-pointer"
                  onError={onImageError}
                />
              </a>
            </div>
            <ProfileBubble>
              <CardTitle className={`font-semibold bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity ${isMobile ? 'text-lg leading-tight' : 'text-xl'}`}>
                Welcome from Roger at Cuyahoga Valley Mindful Health & Wellness
              </CardTitle>
            </ProfileBubble>
          </div>
          <BetaWatermark />
        </div>
        <CardDescription className={isMobile ? 'text-sm' : ''}>Your Peer Mental Health Support Companion</CardDescription>
      </CardHeader>
      <CardContent>
        <p className={`text-gray-600 mb-4 ${isMobile ? 'text-sm leading-relaxed' : ''}`}>
          I'm Roger, your Peer Support companion at Cuyahoga Valley Mindful Health and Wellness. 
          I'm here to chat with you while you wait for your therapist. I'm not a licensed professional, 
          but I can provide a listening ear and supportive perspective as I continue my training under professional guidance.
        </p>
        
        {isMobile ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-cvmhw-light/30 rounded-md border border-cvmhw-light">
              <ProfileBubble className="flex-shrink-0">
                <div className="rounded-full bg-gradient-to-br from-cvmhw-blue via-cvmhw-purple to-cvmhw-pink h-8 w-8 flex items-center justify-center hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
              </ProfileBubble>
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-medium">Remember:</span> Roger is a peer support companion, not a licensed therapist. 
                For immediate crisis support, please use the resources below.
              </p>
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              <CVMHWButton onImageError={onImageError} />
              <InsuranceProviderButton />
            </div>
          </div>
        ) : (
          <div className="flex items-center mt-2 p-2 bg-gradient-to-r from-blue-50 to-cvmhw-light/30 rounded-md border border-cvmhw-light">
            <ProfileBubble className="mr-3">
              <div className="rounded-full bg-gradient-to-br from-cvmhw-blue via-cvmhw-purple to-cvmhw-pink h-8 w-8 flex items-center justify-center hover:scale-105 transition-transform">
                <span className="text-white font-bold">R</span>
              </div>
            </ProfileBubble>
            <p className="text-sm text-gray-600 flex-1">
              <span className="font-medium">Remember:</span> Roger is a peer support companion, not a licensed therapist. 
              For immediate crisis support, please use the resources below.
            </p>
            <div className="ml-3 flex items-center gap-2">
              <CVMHWButton onImageError={onImageError} />
              <InsuranceProviderButton />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
