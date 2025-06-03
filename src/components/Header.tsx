import React, { useState } from 'react';
import { Heart, Brain, Menu, X } from 'lucide-react';
import BetaBadge from './BetaBadge';
import ExternalCrisisLink from './ExternalCrisisLink';
import ProfileBubble from './ProfileBubble';
import { useIsMobile } from '../hooks/use-mobile';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="relative bg-gradient-to-r from-white to-blue-50/40 shadow-sm border-b border-blue-100/30 py-2 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cvmhw-blue/3 via-transparent to-cvmhw-light/5" />
      
      <div className="container mx-auto px-3 sm:px-6 relative z-10">
        {isMobile ? (
          // Mobile Header Layout
          <div className="flex items-center justify-between">
            {/* Mobile Logo Section */}
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                alt="CVMHW Logo" 
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent">
                  CVMHW
                </span>
                <span className="text-xs text-slate-600">Roger.AI</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-cvmhw-blue text-white hover:bg-cvmhw-purple transition-colors mobile-button"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        ) : (
          // Desktop Header Layout (unchanged)
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                  alt="Cuyahoga Valley Mindful Health and Wellness Logo" 
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
            
            {/* Center Title Section */}
            <div className="flex-1 px-4 flex flex-col items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-cvmhw-blue via-cvmhw-purple to-cvmhw-blue bg-clip-text text-transparent mb-1.5 tracking-tight">
                Cuyahoga Valley Mindful Health and Wellness
              </h1>
              <div className="bg-white/80 rounded-lg px-5 py-2 shadow-sm border border-blue-100/40 backdrop-blur-sm max-w-3xl">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-1 mt-0.5 flex-shrink-0">
                    <Heart className="h-4 w-4 text-cvmhw-blue" />
                    <Brain className="h-4 w-4 text-cvmhw-purple" />
                  </div>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed text-center break-words">
                    Comprehensive Mental Health Services Ages 4+ specializing in Family Psychotherapy, PTSD Treatment, Veteran's Issues, and Boy's and Men's Issues
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <ExternalCrisisLink variant="header" className="bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple hover:from-cvmhw-purple hover:to-cvmhw-blue text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-3 py-2 text-xs font-semibold rounded-lg backdrop-blur-sm" />
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <ProfileBubble className="block">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cvmhw-blue to-cvmhw-purple flex items-center justify-center shadow-md border border-white/30 hover:scale-105 transition-transform">
                      <span className="text-white font-bold text-sm">R</span>
                    </div>
                  </ProfileBubble>
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent">Roger.AI</span>
                    <BetaBadge />
                  </div>
                  <span className="text-xs text-slate-600 font-semibold bg-white/60 px-1.5 py-0.5 rounded-md border border-blue-100/40">Peer Support</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobile && mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-blue-100 shadow-lg z-50">
            <div className="p-4 space-y-4">
              {/* Title Section for Mobile */}
              <div className="text-center border-b border-blue-100 pb-3">
                <h2 className="text-sm font-bold bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent">
                  Cuyahoga Valley Mindful Health & Wellness
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Mental Health Services Ages 4+ • Family Therapy • PTSD Treatment
                </p>
              </div>

              {/* Crisis Resources - Mobile Optimized */}
              <div className="flex flex-col space-y-3">
                <ExternalCrisisLink 
                  variant="header" 
                  className="w-full bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple text-white rounded-lg py-3 text-sm font-semibold mobile-button shadow-md"
                />
                
                {/* Roger Profile - Mobile */}
                <div className="flex items-center justify-center space-x-3 bg-blue-50 rounded-lg p-3">
                  <ProfileBubble className="block">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cvmhw-blue to-cvmhw-purple flex items-center justify-center shadow-md border border-white/30 mobile-button">
                      <span className="text-white font-bold">R</span>
                    </div>
                  </ProfileBubble>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent">Roger.AI</span>
                      <BetaBadge />
                    </div>
                    <span className="text-xs text-slate-600 font-semibold">Peer Support Specialist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
