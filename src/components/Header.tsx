
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-roger-dark">Cuyahoga Valley Mindful Health and Wellness</h1>
            <p className="text-gray-600">Peer Support Companion</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-roger flex items-center justify-center">
              <span className="text-white font-medium text-lg">R</span>
            </div>
            <span className="font-medium text-roger-dark">Roger.AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
