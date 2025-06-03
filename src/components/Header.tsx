
import React from 'react';
import { BookOpen, Phone } from 'lucide-react';
import BetaBadge from './BetaBadge';
import ExternalCrisisLink from './ExternalCrisisLink';
import CrisisResources from './CrisisResources';

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
            </div>
          </div>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl font-semibold gradient-text">Cuyahoga Valley Mindful Health and Wellness</h1>
            <div className="flex items-center justify-center text-gray-600">
              <BookOpen className="h-4 w-4 mr-1" />
              <p className="text-sm">Comprehensive mental health services for all ages - children to adults</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors">
              <Phone size={16} className="text-red-600" />
              <span className="text-sm font-medium text-red-700">Crisis Help</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cvmhw-purple via-cvmhw-blue to-cvmhw-pink flex items-center justify-center">
                <span className="text-white font-medium text-lg">R</span>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-cvmhw-blue">Roger.AI</span>
                  <BetaBadge />
                </div>
                <span className="text-xs text-gray-500">Peer Support Beta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
