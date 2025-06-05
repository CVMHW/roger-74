
import React, { useState } from 'react';
import { Shield, Lock, Users, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '../hooks/use-mobile';

interface AccessPasswordGateProps {
  onPasswordSubmit: (password: string) => void;
  isValidating?: boolean;
  error?: string;
}

const AccessPasswordGate = ({ onPasswordSubmit, isValidating = false, error }: AccessPasswordGateProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onPasswordSubmit(password.trim());
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-transparent to-indigo-100/20" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl" />
      
      <Card className={`w-full max-w-md mx-auto shadow-2xl border-blue-200/50 bg-white/95 backdrop-blur-sm relative z-10 ${isMobile ? 'mx-4' : ''}`}>
        <CardHeader className="text-center space-y-4 pb-6">
          {/* Logo and Title Section */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl blur-sm opacity-30"></div>
              <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-3 rounded-xl shadow-lg border border-white/20">
                <a 
                  href="https://cvmhw.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('https://cvmhw.com', '_blank', 'noopener,noreferrer');
                  }}
                >
                  <img 
                    src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
                    alt="CVMHW Logo" 
                    className="w-8 h-8 object-contain filter brightness-0 invert cursor-pointer"
                    onError={handleImageError}
                  />
                </a>
              </div>
            </div>
            <div className="text-left">
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                Welcome to Roger's Secure Environment
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 font-medium">
                Authorized access required for investor demonstration
              </CardDescription>
            </div>
          </div>
          
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Secure Access Portal</span>
            <a 
              href="https://www.teddyholdings.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg cursor-pointer"
            >
              🧸
            </a>
          </div>
          
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 rounded-lg p-3 border border-slate-200">
            This demonstration environment requires authentication for investor and authorized personnel access.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter demonstration access password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 bg-white/90 border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                  disabled={isValidating}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {error && (
                <p className="text-red-600 text-xs flex items-center gap-1 bg-red-50 p-2 rounded border border-red-200">
                  <span className="text-red-500">⚠️</span>
                  {error}
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={!password.trim() || isValidating}
            >
              {isValidating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Validating Access...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Access Roger Chat</span>
                </div>
              )}
            </Button>
          </form>
          
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="w-3 h-3" />
              <span>Chat interface locked - please authenticate above</span>
            </div>
            
            <div className="mt-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-orange-500 text-sm">🏥</span>
                <div className="text-xs text-slate-700">
                  <p className="font-semibold text-orange-700 mb-1">📋 Patient Safety Notice</p>
                  <p className="leading-relaxed">
                    Roger is a peer support companion in training under professional supervision. 
                    For medical emergencies, contact 911 immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessPasswordGate;
