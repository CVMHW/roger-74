import React from 'react';
import ComprehensiveTestDashboard from '../components/ComprehensiveTestDashboard';
import StaticFileDebugger from '../components/StaticFileDebugger';

const TestDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Sitemap Test Dashboard</h1>
        
        {/* Static File Debugger - NEW */}
        <StaticFileDebugger />
        
        {/* Existing Comprehensive Test Dashboard */}
        <ComprehensiveTestDashboard />
      </div>
    </div>
  );
};

export default TestDashboardPage;
