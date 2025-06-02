
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Index from './pages/Index';
import FlowchartPage from './pages/FlowchartPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/flowchart" element={<FlowchartPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
