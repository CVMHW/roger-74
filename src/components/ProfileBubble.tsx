
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import RogerBio from './RogerBio';

interface ProfileBubbleProps {
  children: React.ReactNode;
  className?: string;
}

const ProfileBubble = ({ children, className = "" }: ProfileBubbleProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`cursor-pointer transition-all duration-200 hover:opacity-80 ${className}`}>
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white border-2 border-cvmhw-blue rounded-xl shadow-2xl">
        <div className="relative">
          {/* Header with CVMHW branding */}
          <div className="bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <img 
                    src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                    alt="CVMHW Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Roger's Profile</h2>
                  <p className="text-blue-100 text-sm">Peer Support Specialist at CVMHW</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bio Content */}
          <div className="p-6">
            <RogerBio />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileBubble;
