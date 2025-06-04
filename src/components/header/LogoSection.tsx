
import React from 'react';

interface LogoSectionProps {
  className?: string;
}

const LogoSection = ({ className = "" }: LogoSectionProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <a 
      href="https://cvmhw.com" 
      target="_blank" 
      rel="noopener noreferrer"
      className={`block cursor-pointer ${className}`}
      onClick={(e) => {
        e.preventDefault();
        window.open('https://cvmhw.com', '_blank', 'noopener,noreferrer');
      }}
    >
      <img 
        src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
        alt="CVMHW Logo" 
        className="object-contain cursor-pointer"
        onError={handleImageError}
      />
    </a>
  );
};

export default LogoSection;
