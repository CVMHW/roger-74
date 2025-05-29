
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import UnifiedRogerDashboard from './components/UnifiedRogerDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedRogerDashboard />
      <Toaster />
    </div>
  );
}

export default App;
