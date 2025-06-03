
import React from 'react';
import { BookOpen } from 'lucide-react';
import BetaBadge from './BetaBadge';
import ExternalCrisisLink from './ExternalCrisisLink';

const Header = () => {
  return (
    <header className="relative bg-gradient-to-r from-white to-blue-50/40 shadow-sm border-b border-blue-100/30 py-4 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cvmhw-blue/3 via-transparent to-cvmhw-light/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo Section - Larger and more prominent */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-14 w-14 bg-white rounded-xl shadow-md border border-blue-100/50 flex items-center justify-center">
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
          </div>
          
          {/* Center Title Section - More professional styling */}
          <div className="text-center flex-1 px-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cvmhw-blue via-cvmhw-purple to-cvmhw-blue bg-clip-text text-transparent mb-2 tracking-tight">
              Cuyahoga Valley Mindful Health and Wellness
            </h1>
            <div className="flex items-center justify-center">
              <div className="bg-white/80 rounded-lg px-4 py-2 shadow-sm border border-blue-100/40 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-cvmhw-blue" />
                  <p className="text-sm font-medium text-slate-700">Comprehensive mental health services for all ages</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section - Crisis Resources & Roger */}
          <div className="flex items-center space-x-4">
            {/* Crisis Resources Button - Cool professional blue tones */}
            <div className="relative">
              <ExternalCrisisLink variant="header" className="bg-gradient-to-r from-cvmhw-blue to-blue-600 hover:from-blue-600 hover:to-cvmhw-blue text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2.5 text-sm font-semibold rounded-lg backdrop-blur-sm" />
            </div>
            
            {/* Roger Profile Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cvmhw-blue to-cvmhw-purple flex items-center justify-center shadow-md border border-white/30">
                  <span className="text-white font-bold text-base">R</span>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent">Roger.AI</span>
                  <BetaBadge />
                </div>
                <span className="text-sm text-slate-600 font-semibold bg-white/60 px-2 py-0.5 rounded-md border border-blue-100/40">Peer Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
