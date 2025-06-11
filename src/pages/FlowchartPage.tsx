
import React from 'react';
import Header from '../components/Header';
import RogerFlowchart from '../components/RogerFlowchart';
import MainFooter from '../components/MainFooter';
import { useTechnicalSEO } from '../hooks/useSEO';

const FlowchartPage = () => {
  useTechnicalSEO(
    'Healthcare System Architecture Flowchart',
    'Comprehensive technical flowchart demonstrating healthcare system architecture, clinical data flow, and medical programming workflows for IT professionals.',
    [
      'healthcare system flowchart',
      'clinical workflow architecture',
      'medical data flow diagram',
      'healthcare process automation',
      'clinical decision tree',
      'medical system integration'
    ]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="pt-20">
        <RogerFlowchart />
      </main>
      <MainFooter />
    </div>
  );
};

export default FlowchartPage;
