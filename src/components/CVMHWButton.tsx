
import React from 'react';
import { useIsMobile } from '../hooks/use-mobile';

interface CVMHWButtonProps {
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const CVMHWButton: React.FC<CVMHWButtonProps> = ({ onImageError }) => {
  const isMobile = useIsMobile();

  return (
    <a 
      href="https://cvmhw.com" 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`inline-flex items-center gap-2 bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple text-white font-medium rounded-md hover:from-cvmhw-blue hover:to-cvmhw-blue transition-all duration-200 shadow-sm touch-manipulation cursor-pointer ${
        isMobile 
          ? 'text-sm px-4 py-3 min-h-[48px] min-w-[48px] w-full justify-center leading-tight' 
          : 'text-sm px-3 py-2'
      }`}
      onClick={(e) => {
        e.preventDefault();
        window.open('https://cvmhw.com', '_blank', 'noopener,noreferrer');
      }}
    >
      <div className={`relative ${isMobile ? 'w-5 h-5 flex-shrink-0' : 'w-5 h-5'}`}>
        <img 
          src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
          alt="CVMHW Logo" 
          className="w-full h-full object-contain cursor-pointer"
          onError={onImageError}
        />
      </div>
      <span className="font-medium">Visit CVMHW</span>
    </a>
  );
};

export default CVMHWButton;
