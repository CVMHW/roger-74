
import React from 'react';
import { ExternalLink, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExternalCrisisLinkProps {
  variant?: 'header' | 'card' | 'footer';
  className?: string;
}

const ExternalCrisisLink: React.FC<ExternalCrisisLinkProps> = ({ 
  variant = 'card', 
  className = '' 
}) => {
  const handleClick = () => {
    window.open('https://www.cvmhw.com/crisisresources', '_blank', 'noopener,noreferrer');
  };

  if (variant === 'header') {
    return (
      <Button
        onClick={handleClick}
        variant="outline"
        size="sm"
        className={`bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple text-white border-0 hover:shadow-lg transition-all duration-300 shadow-md ${className}`}
      >
        <Shield size={16} className="mr-2 text-cvmhw-pink" />
        <span className="font-medium">Crisis Resources</span>
        <ExternalLink size={14} className="ml-1" />
      </Button>
    );
  }

  if (variant === 'footer') {
    return (
      <Button
        onClick={handleClick}
        variant="outline"
        size="sm"
        className={`bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple text-white border-0 hover:shadow-lg transition-all duration-300 shadow-md ${className}`}
      >
        <Heart size={16} className="mr-2 text-cvmhw-pink" />
        <span className="font-medium">Full Crisis Resources & Videos</span>
        <ExternalLink size={14} className="ml-1" />
      </Button>
    );
  }

  // Default card variant
  return (
    <Button
      onClick={handleClick}
      className={`w-full bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple hover:from-cvmhw-purple hover:to-cvmhw-blue text-white transition-all duration-300 shadow-md hover:shadow-lg ${className}`}
    >
      <Heart size={18} className="mr-2" />
      <span className="font-medium">View Complete Crisis Resources & Therapeutic Videos</span>
      <ExternalLink size={16} className="ml-2" />
    </Button>
  );
};

export default ExternalCrisisLink;
