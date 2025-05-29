
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import UnifiedRogerDashboard from './components/UnifiedRogerDashboard';

function App() {
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
