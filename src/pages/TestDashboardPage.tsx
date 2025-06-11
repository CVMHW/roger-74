
import React from 'react';
import ComprehensiveTestDashboard from '../components/ComprehensiveTestDashboard';
import StaticFileDebugger from '../components/StaticFileDebugger';
import { useTechnicalSEO } from '../hooks/useSEO';

const TestDashboardPage: React.FC = () => {
  useTechnicalSEO(
    'Healthcare IT Testing & Quality Assurance Dashboard',
    'Advanced testing dashboard for healthcare IT systems, demonstrating comprehensive quality assurance, automated testing, and system monitoring for medical programming applications.',
    [
      'healthcare IT testing',
      'medical software QA',
      'clinical system testing',
      'healthcare quality assurance',
      'medical programming testing',
      'healthcare system monitoring',
      'clinical software validation'
    ]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Healthcare IT Testing & Quality Assurance Dashboard</h1>
        
        {/* Static File Debugger - SEO Critical */}
        <StaticFileDebugger />
        
        {/* Comprehensive Test Dashboard */}
        <ComprehensiveTestDashboard />
      </div>
    </div>
  );
};

export default TestDashboardPage;
