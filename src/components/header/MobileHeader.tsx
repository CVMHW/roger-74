
import React from 'react';
import BetaBadge from '../BetaBadge';
import ProfileBubble from '../ProfileBubble';
import LogoSection from './LogoSection';
import MobileServiceDescription from './MobileServiceDescription';

const MobileHeader = () => {
  return (
    <div className="flex flex-col w-full min-h-[60px]">
      {/* Top row with logo and Roger's Bio button */}
      <div className="flex items-center justify-between w-full">
        {/* Mobile Logo Section - No background, seamless blend */}
        <div className="flex items-center space-x-2 flex-shrink-0 min-w-0 max-w-[70%]">
          <LogoSection className="h-8 w-8" />
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
      <MobileServiceDescription />
    </div>
  );
};

export default MobileHeader;
