
import React from 'react';
import BetaBadge from '../BetaBadge';
import ExternalCrisisLink from '../ExternalCrisisLink';
import ProfileBubble from '../ProfileBubble';
import LogoSection from './LogoSection';

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border-t-2 border-blue-200 shadow-xl z-50 max-w-full animate-fadeInUp">
      <div className="p-4 space-y-4 max-w-full">
        {/* Enhanced Title Section for Mobile */}
        <div className="text-center border-b border-blue-100 pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-gradient-to-br from-cvmhw-blue to-cvmhw-purple rounded-lg p-2 shadow-sm">
              <LogoSection className="h-6 w-6" />
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
  );
};

export default MobileMenu;
