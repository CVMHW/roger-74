
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import RogerBio from './RogerBio';
import { useIsMobile } from '../hooks/use-mobile';

interface ProfileBubbleProps {
  children: React.ReactNode;
  className?: string;
}

const ProfileBubble = ({ children, className = "" }: ProfileBubbleProps) => {
  const isMobile = useIsMobile();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`cursor-pointer transition-all duration-200 hover:opacity-80 ${className}`}>
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[95vh] m-2' : 'max-w-[96vw] sm:max-w-2xl lg:max-w-4xl max-h-[92vh] sm:max-h-[90vh] sm:m-0'} overflow-y-auto p-0 bg-white border-2 border-cvmhw-blue rounded-xl shadow-2xl`}>
        <div className="relative">
          {/* Mobile-optimized close button */}
          {isMobile && (
            <button
              className="absolute top-2 right-2 z-50 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200 hover:bg-white transition-all duration-200"
              aria-label="Close Roger's Profile"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <X size={20} className="text-gray-600" />
            </button>
          )}

          {/* Header with CVMHW branding - Mobile Optimized */}
          <div className="bg-cvmhw-blue p-2 sm:p-3 lg:p-6 rounded-t-xl relative overflow-hidden">
            {/* Enhanced shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                <div className="relative w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0">
                  <img 
                    src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                    alt="CVMHW Logo" 
                    className="w-full h-full object-contain drop-shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm sm:text-lg lg:text-2xl font-bold text-white mb-1 drop-shadow-lg leading-tight">Roger's Profile</h2>
                  <p className="text-white/90 text-xs sm:text-sm drop-shadow-md leading-tight">Peer Support Specialist at Cuyahoga Valley Mindful Health and Wellness</p>
                </div>
              </div>
              
              {/* Desktop close button */}
              {!isMobile && (
                <button
                  className="text-white/80 hover:text-white transition-colors p-1"
                  aria-label="Close Roger's Profile"
                >
                  <X size={24} />
                </button>
              )}
            </div>
          </div>
          
          {/* Bio Content - Mobile Optimized */}
          <div className="p-2 sm:p-3 lg:p-6">
            <RogerBio />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileBubble;
