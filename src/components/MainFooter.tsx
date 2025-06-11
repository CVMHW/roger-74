
import React from 'react';
import ExternalCrisisLink from './ExternalCrisisLink';
import LegalDisclaimer from './LegalDisclaimer';
import ProfileBubble from './ProfileBubble';

interface MainFooterProps {
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const MainFooter: React.FC<MainFooterProps> = ({ onImageError }) => {
  return (
    <footer className="bg-white shadow-md mt-4 border-t border-cvmhw-blue">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="relative w-8 h-8">
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
          <span className="font-medium bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent">Cuyahoga Valley Mindful Health and Wellness</span>
        </div>
        
        <div className="flex justify-center mb-3">
          <ProfileBubble>
            <button className="text-cvmhw-blue hover:text-cvmhw-purple transition-colors text-sm font-medium underline decoration-cvmhw-blue/30 hover:decoration-cvmhw-purple/50">
              Learn More About Roger - Your AI Peer Support Companion
            </button>
          </ProfileBubble>
        </div>
        
        <div className="flex justify-center mb-3">
          <ExternalCrisisLink variant="footer" />
        </div>
        
        <div className="text-center text-gray-600 text-xs space-y-2 max-w-4xl mx-auto">
          <p>© {new Date().getFullYear()} Cuyahoga Valley Mindful Health and Wellness</p>
          <p className="font-medium">Roger is a Peer Support companion in-training. He is not a substitute for professional mental health services.</p>
          <div className="bg-gray-50 rounded-md p-3 text-xs">
            <p className="font-semibold text-orange-600 mb-1">⚠️ BETA SOFTWARE DISCLAIMER</p>
            <p className="mb-2">This is experimental beta software. Roger AI is not FDA approved or clinically validated as a medical device. For informational purposes only - not medical advice, diagnosis, or treatment. Always consult licensed healthcare professionals.</p>
            <p><span className="font-medium">Emergency Limitations:</span> Roger cannot provide emergency services or crisis coordination efforts comparable to trained professionals. For immediate help: <a href="tel:911" className="text-cvmhw-blue hover:underline font-medium">911</a> or <a href="tel:988" className="text-cvmhw-blue hover:underline font-medium">988 Suicide & Crisis Lifeline</a>. Roger's responses may contain errors.</p>
          </div>
        </div>
      </div>
      <LegalDisclaimer />
    </footer>
  );
};

export default MainFooter;
