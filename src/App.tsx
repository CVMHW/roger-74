
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import UnifiedRogerDashboard from './components/UnifiedRogerDashboard';

// Import security systems
import { SecurityHeaders } from './security/SecurityHeaders';

function App() {
  // Initialize security systems
  useEffect(() => {
    // Apply security headers
    SecurityHeaders.applySecurityHeaders();
    
    // Validate security configuration
    const securityValidation = SecurityHeaders.validateSecurity();
    if (!securityValidation.secure) {
      console.warn('🔒 Security issues detected:', securityValidation.issues);
    } else {
      console.log('🔒 Security validation passed');
    }
  }, []);

  // Check if we're in development mode by looking at URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const isDashboard = urlParams.get('dashboard') === 'true';

  // Show dashboard only when explicitly requested via ?dashboard=true
  if (isDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedRogerDashboard />
        <Toaster />
      </div>
    );
  }

  // Default patient-facing application
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-cvmhw-light to-white">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
