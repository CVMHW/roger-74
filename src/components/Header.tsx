
import React, { useState } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import MobileHeader from './header/MobileHeader';
import DesktopHeader from './header/DesktopHeader';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className={`${isMobile ? 'sticky' : 'fixed'} top-0 z-50 w-full bg-gradient-to-r from-white to-blue-50/40 shadow-sm border-b border-blue-100/30 py-2 overflow-hidden`}>
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-cvmhw-blue/3 via-transparent to-cvmhw-light/5" />
      
      <div className="container mx-auto px-3 sm:px-6 relative z-10">
        {isMobile ? <MobileHeader /> : <DesktopHeader />}
        
        {/* Mobile Menu Overlay */}
        <MobileMenu isOpen={isMobile && mobileMenuOpen} />
      </div>
    </header>
  );
};

export default Header;
