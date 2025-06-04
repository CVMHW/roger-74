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
    <header className={`${isMobile ? 'sticky' : 'fixed'} top-0 z-50 w-full bg-gradient-to-r from-white to-blue-50/40 shadow-sm border-b border-blue-100/30 py-2 overflow-hidden`}>
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cvmhw-blue/3 via-transparent to-cvmhw-light/5" />
      
      <div className="container mx-auto px-3 sm:px-6 relative z-10">
        {isMobile ? (
          // Mobile Header Layout - Enhanced with service description
          <div className="flex flex-col w-full min-h-[60px]">
            {/* Top row with logo and Roger's Bio button */}
            <div className="flex items-center justify-between w-full">
              {/* Mobile Logo Section - Simplified without box */}
              <div className="flex items-center space-x-2 flex-shrink-0 min-w-0 max-w-[70%]">
                <a 
                  href="https://cvmhw.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('https://cvmhw.com', '_blank', 'noopener,noreferrer');
                  }}
                >
                  <img 
                    src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                    alt="CVMHW Logo" 
                    className="h-8 w-8 object-contain flex-shrink-0 cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </a>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-bold bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent truncate leading-tight">
                    CVMHW
                  </span>
                  <span className="text-xs text-slate-600 truncate">Roger.AI Peer Support</span>
                </div>
              </div>

              {/* Mobile Roger's Bio Button */}
              <ProfileBubble className="flex-shrink-0">
                <button
                  className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple text-white hover:from-cvmhw-purple hover:to-cvmhw-blue transition-all duration-200 shadow-md flex items-center gap-2"
                  style={{ minWidth: '48px', minHeight: '48px' }}
                  aria-label="View Roger's Profile"
                >
                  <div className="rounded-full bg-white/20 h-6 w-6 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">R</span>
                  </div>
                  <span className="text-xs font-medium">Roger's Bio</span>
                </button>
              </ProfileBubble>
            </div>

            {/* Mobile Service Description - Always Visible */}
            <div className="mt-2 px-1">
              <div className="bg-white/80 rounded-lg px-3 py-2 shadow-sm border border-blue-100/40 backdrop-blur-sm">
                <div className="flex items-start gap-2">
                  <div className="flex items-center gap-1 mt-0.5 flex-shrink-0">
                    <Heart className="h-3 w-3 text-cvmhw-blue" />
                    <Brain className="h-3 w-3 text-cvmhw-purple" />
                  </div>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">
                    Comprehensive Mental Health Services Ages 4+ • Family Therapy • PTSD Treatment • Veterans • Men's Issues
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Desktop Header Layout - Fixed positioning with proper spacing
          <div className="flex items-center justify-between min-h-[80px]">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <a 
                  href="https://cvmhw.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('https://cvmhw.com', '_blank', 'noopener,noreferrer');
                  }}
                >
                  <img 
                    src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                    alt="Cuyahoga Valley Mindful Health and Wellness Logo" 
                    className="h-10 w-10 object-contain cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </a>
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
          <div className="absolute top-full left-0 right-0 bg-white border-t-2 border-blue-200 shadow-xl z-50 max-w-full animate-fadeInUp">
            <div className="p-4 space-y-4 max-w-full">
              {/* Enhanced Title Section for Mobile */}
              <div className="text-center border-b border-blue-100 pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="bg-gradient-to-br from-cvmhw-blue to-cvmhw-purple rounded-lg p-2 shadow-sm">
                    <a 
                      href="https://cvmhw.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open('https://cvmhw.com', '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <img 
                        src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                        alt="CVMHW Logo" 
                        className="h-6 w-6 object-contain cursor-pointer"
                      />
                    </a>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent leading-tight">
                      CVMHW
                    </h2>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  Cuyahoga Valley Mindful Health & Wellness
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed break-words">
                  Mental Health Services Ages 4+ • Family Therapy • PTSD Treatment • Veteran's Issues
                </p>
              </div>

              {/* Crisis Resources - Enhanced mobile layout */}
              <div className="flex flex-col space-y-3">
                <div className="w-full max-w-full">
                  <ExternalCrisisLink 
                    variant="header" 
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg py-4 text-sm font-bold shadow-lg flex items-center justify-center min-h-[52px] transition-all duration-300"
                  />
                </div>
                
                {/* Roger Profile - Enhanced mobile design */}
                <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 max-w-full border border-blue-100">
                  <ProfileBubble className="block flex-shrink-0">
                    <div 
                      className="rounded-full bg-gradient-to-br from-cvmhw-blue to-cvmhw-purple flex items-center justify-center shadow-lg border-2 border-white"
                      style={{ width: '48px', height: '48px' }}
                    >
                      <span className="text-white font-bold text-lg">R</span>
                    </div>
                  </ProfileBubble>
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <div className="flex items-center gap-2 max-w-full">
                      <span className="font-bold text-base bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent truncate">Roger.AI</span>
                      <BetaBadge />
                    </div>
                    <span className="text-sm text-slate-600 font-semibold truncate">Peer Support Specialist</span>
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
