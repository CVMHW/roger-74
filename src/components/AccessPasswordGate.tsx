
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, AlertTriangle } from 'lucide-react';

interface AccessPasswordGateProps {
  onAccessGranted: () => void;
}

const AccessPasswordGate: React.FC<AccessPasswordGateProps> = ({ onAccessGranted }) => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  
  const REQUIRED_PASSWORD = 'Jefferson00!!';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === REQUIRED_PASSWORD) {
      setPasswordError(false);
      onAccessGranted();
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="max-w-md w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="text-slate-600" size={24} />
            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
              🧸
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            System Access Required
          </h2>
          <p className="text-sm text-gray-600">
            This is a testing environment for investors and authorized personnel only.
          </p>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-red-600 mt-0.5" size={16} />
            <div>
              <p className="text-xs text-red-700 font-medium mb-1">
                Patient Safety Notice
              </p>
              <p className="text-xs text-red-600">
                If you are experiencing a mental health crisis, please call 911 or 988 immediately. 
                This system is not for emergency use.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="access-password" className="block text-sm font-medium text-gray-700 mb-2">
              Access Password
            </label>
            <Input
              id="access-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
              placeholder="Enter access password"
              className={passwordError ? 'border-red-500' : ''}
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">Incorrect password</p>
            )}
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-cvmhw-blue hover:bg-cvmhw-purple"
          >
            Access System
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://cvmhw.com', '_blank', 'noopener,noreferrer')}
            className="text-xs"
          >
            Visit CVMHW Website
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessPasswordGate;
