
import React from 'react';
import { Heart, Brain } from 'lucide-react';
import BetaBadge from '../BetaBadge';
import ExternalCrisisLink from '../ExternalCrisisLink';
import ProfileBubble from '../ProfileBubble';
import LogoSection from './LogoSection';

const DesktopHeader = () => {
  return (
    <div className="flex items-center justify-between min-h-[80px]">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <LogoSection className="h-10 w-10" />
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
  );
};

export default DesktopHeader;
