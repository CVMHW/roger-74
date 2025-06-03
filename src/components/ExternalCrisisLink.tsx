
import React from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

interface ExternalCrisisLinkProps {
  variant?: 'default' | 'header' | 'footer';
  className?: string;
}

const ExternalCrisisLink: React.FC<ExternalCrisisLinkProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  const isMobile = useIsMobile();
  
  const handleCrisisClick = () => {
    // Open external crisis resources in new tab
    window.open('https://988lifeline.org/', '_blank', 'noopener,noreferrer');
  };

  // Mobile-optimized text based on variant
  const getButtonText = () => {
    if (variant === 'header') {
      return isMobile ? "Crisis Help Available 24/7" : "Crisis Resources";
    }
    if (variant === 'footer') {
      return "Crisis Support Available 24/7";
    }
    // For default variant: show long text only on mobile, short text on desktop
    return isMobile ? "Crisis Help Available 24/7" : "Crisis Resources";
  };

  // Mobile-optimized styling
  const getButtonStyles = () => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl touch-manipulation";
    
    if (variant === 'header') {
      return `${baseStyles} ${isMobile 
        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs px-3 py-3 min-h-[44px] w-full leading-tight text-center break-words' 
        : 'bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple hover:from-cvmhw-purple hover:to-cvmhw-blue text-white border-0 px-3 py-2 text-xs'
      }`;
    }
    
    if (variant === 'footer') {
      return `${baseStyles} bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white ${
        isMobile ? 'text-xs px-3 py-3 min-h-[44px]' : 'text-sm px-4 py-2'
      }`;
    }
    
    return `${baseStyles} bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white ${
      isMobile 
        ? 'text-xs px-3 py-3 min-h-[44px] w-full leading-tight text-center break-words' 
        : 'text-sm px-6 py-3'
    }`;
  };

  const combinedClassName = `${getButtonStyles()} ${className}`;

  return (
    <button
      onClick={handleCrisisClick}
      className={combinedClassName}
      aria-label="Access crisis resources and mental health support"
      style={isMobile ? { 
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        hyphens: 'auto',
        lineHeight: '1.3'
      } : {}}
    >
      {variant === 'header' ? (
        <Phone size={isMobile ? 16 : 16} className="flex-shrink-0" />
      ) : (
        <AlertTriangle size={isMobile ? 18 : 18} className="flex-shrink-0" />
      )}
      <span className={`font-semibold ${isMobile ? 'text-center leading-tight' : ''}`}>
        {getButtonText()}
      </span>
    </button>
  );
};

export default ExternalCrisisLink;
