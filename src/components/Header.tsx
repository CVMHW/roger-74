
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Cuyahoga Valley Mindful Health and Wellness Logo" 
              className="h-12 w-12 logo-pulse"
            />
            <div>
              <h1 className="text-2xl font-semibold gradient-text">Cuyahoga Valley Mindful Health and Wellness</h1>
              <p className="text-gray-600">Peer Support Companion for Teen PTSD Treatment</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cvmhw-purple via-cvmhw-blue to-cvmhw-pink flex items-center justify-center">
              <span className="text-white font-medium text-lg">R</span>
            </div>
            <span className="font-medium text-cvmhw-blue">Roger.AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
