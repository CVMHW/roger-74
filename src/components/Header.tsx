
import React from 'react';
import { BookOpen } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

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
            <div>
              <h1 className="text-2xl font-semibold gradient-text">Cuyahoga Valley Mindful Health and Wellness</h1>
              <div className="flex items-center text-gray-600">
                <BookOpen className="h-4 w-4 mr-1" />
                <p className="text-sm">Comprehensive mental health services for all ages - children to adults</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
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
