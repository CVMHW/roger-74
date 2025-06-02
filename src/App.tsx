
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Index from './pages/Index';
import FlowchartPage from './pages/FlowchartPage';
import ConversationProcessingPage from './pages/ConversationProcessingPage';
import UnifiedFlowchartPage from './pages/UnifiedFlowchartPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/flowchart" element={<FlowchartPage />} />
          <Route path="/conversation-processing" element={<ConversationProcessingPage />} />
          <Route path="/unified-flowchart" element={<UnifiedFlowchartPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
