
import React from 'react';
import { BookOpen } from 'lucide-react';
import BetaBadge from './BetaBadge';
import ExternalCrisisLink from './ExternalCrisisLink';

const Header = () => {
  return (
    <header className="relative bg-gradient-to-r from-white to-blue-50/40 shadow-sm border-b border-blue-100/30 py-3 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cvmhw-blue/3 via-transparent to-cvmhw-light/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 bg-white rounded-lg shadow-sm border border-blue-100/50 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                  alt="Cuyahoga Valley Mindful Health and Wellness Logo" 
                  className="h-7 w-7 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Center Title Section */}
          <div className="text-center flex-1 px-6">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-cvmhw-blue via-cvmhw-purple to-cvmhw-blue bg-clip-text text-transparent mb-1">
              Cuyahoga Valley Mindful Health and Wellness
            </h1>
            <div className="flex items-center justify-center text-slate-600">
              <div className="bg-white/70 rounded-md px-3 py-1 shadow-sm border border-blue-100/30">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-cvmhw-blue" />
                  <p className="text-xs font-medium">Comprehensive mental health services for all ages</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section - Crisis Resources & Roger */}
          <div className="flex items-center space-x-4">
            {/* Crisis Resources Button - Professional & Sleek */}
            <div className="relative">
              <ExternalCrisisLink variant="header" className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2.5 text-sm font-semibold rounded-lg backdrop-blur-sm" />
            </div>
            
            {/* Roger Profile Section */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cvmhw-blue to-cvmhw-purple flex items-center justify-center shadow-sm border border-white/30">
                  <span className="text-white font-semibold text-sm">R</span>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent">Roger.AI</span>
                  <BetaBadge />
                </div>
                <span className="text-xs text-slate-500 font-medium bg-white/50 px-1.5 py-0.5 rounded border border-blue-100/30">Peer Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
