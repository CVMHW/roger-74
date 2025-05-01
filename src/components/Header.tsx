
import React from 'react';
import { Image } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative h-12 w-12">
              <img 
                src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                alt="Cuyahoga Valley Mindful Health and Wellness Logo" 
                className="h-full w-full object-contain logo-pulse"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                  e.currentTarget.classList.remove('logo-pulse');
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Image className="h-6 w-6 text-gray-400" />
              </div>
            </div>
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
