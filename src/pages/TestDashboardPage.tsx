import React from 'react';
import ComprehensiveTestDashboard from '../components/ComprehensiveTestDashboard';
import StaticFileDebugger from '../components/StaticFileDebugger';
import BugTestDashboard from '../components/BugTestDashboard';

const TestDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Development Testing Dashboard</h1>
        
        {/* Bug Testing Dashboard - NEW */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🐛 Bug Testing & System Health</h2>
          <BugTestDashboard />
        </div>
        
        {/* Static File Debugger */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">📁 Static File Testing</h2>
          <StaticFileDebugger />
        </div>
        
        {/* Existing Comprehensive Test Dashboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">🌐 Sitemap & SEO Testing</h2>
          <ComprehensiveTestDashboard />
        </div>
      </div>
    </div>
  );
};

export default TestDashboardPage;
