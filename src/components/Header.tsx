
import React from 'react';
import { BookOpen } from 'lucide-react';
import BetaBadge from './BetaBadge';
import ExternalCrisisLink from './ExternalCrisisLink';

const Header = () => {
  return (
    <header className="relative bg-gradient-to-r from-white via-blue-50/30 to-cyan-50/20 shadow-xl border-b border-blue-100/50 py-6 overflow-hidden">
      {/* Modern background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cvmhw-blue/5 via-transparent to-cvmhw-light/10 opacity-60" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cvmhw-blue/10 to-cvmhw-purple/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-bl from-cvmhw-pink/8 to-cvmhw-orange/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cvmhw-blue/20 to-cvmhw-purple/20 rounded-xl blur-lg" />
              <div className="relative h-14 w-14 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                  alt="Cuyahoga Valley Mindful Health and Wellness Logo" 
                  className="h-10 w-10 object-contain logo-pulse"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                    e.currentTarget.classList.remove('logo-pulse');
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Center Title Section */}
          <div className="text-center flex-1 px-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cvmhw-blue via-cvmhw-purple to-cvmhw-pink bg-clip-text text-transparent mb-2 tracking-tight">
              Cuyahoga Valley Mindful Health and Wellness
            </h1>
            <div className="flex items-center justify-center text-slate-600">
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-white/50">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-cvmhw-blue" />
                  <p className="text-sm font-medium">Comprehensive mental health services for all ages - children to adults</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section - Crisis Resources & Roger */}
          <div className="flex items-center space-x-4">
            {/* Modern Crisis Resources Button */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-xl blur-lg" />
              <div className="relative">
                <ExternalCrisisLink variant="header" className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 hover:from-red-600 hover:via-red-700 hover:to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-xl font-semibold" />
              </div>
            </div>
            
            {/* Roger Profile Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cvmhw-blue/30 to-cvmhw-purple/30 rounded-full blur-md" />
                <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-cvmhw-purple via-cvmhw-blue to-cvmhw-pink flex items-center justify-center shadow-xl border-2 border-white/50">
                  <span className="text-white font-bold text-lg drop-shadow-sm">R</span>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent">Roger.AI</span>
                  <BetaBadge />
                </div>
                <span className="text-xs text-slate-500 font-medium bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/50">Peer Support Beta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
