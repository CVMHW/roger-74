
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import FlowchartPage from "./pages/FlowchartPage";
import UnifiedFlowchartPage from "./pages/UnifiedFlowchartPage";
import ConversationProcessingPage from "./pages/ConversationProcessingPage";
import WrappingHellAnalysisPage from "./pages/WrappingHellAnalysisPage";
import MobileDesktopAnalysisPage from "./pages/MobileDesktopAnalysisPage";
import TestDashboardPage from "./pages/TestDashboardPage";

// Create a stable QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const [isReactReady, setIsReactReady] = useState(false);

  useEffect(() => {
    // Comprehensive React readiness check
    const checkReactReadiness = () => {
      const isReady = React && 
                     typeof React.useState === 'function' && 
                     typeof React.useEffect === 'function' &&
                     typeof React.useContext === 'function' &&
                     typeof React.useRef === 'function' &&
                     typeof React.useMemo === 'function' &&
                     React.useState !== null &&
                     React.useEffect !== null &&
                     React.useContext !== null;
      
      if (isReady) {
        console.log('React hooks confirmed fully available');
        setIsReactReady(true);
      } else {
        console.log('React hooks not yet available, checking again...');
        setTimeout(checkReactReadiness, 10);
      }
    };

    checkReactReadiness();
  }, []);

  // Don't render anything until React is confirmed ready
  if (!isReactReady) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}>🔄</div>
          <div>Initializing application...</div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/flowchart" element={<FlowchartPage />} />
            <Route path="/unified-flowchart" element={<UnifiedFlowchartPage />} />
            <Route path="/conversation-processing" element={<ConversationProcessingPage />} />
            <Route path="/wrapping-hell-analysis" element={<WrappingHellAnalysisPage />} />
            <Route path="/mobile-desktop-analysis" element={<MobileDesktopAnalysisPage />} />
            <Route path="/test-dashboard" element={<TestDashboardPage />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
