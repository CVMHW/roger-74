
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary";
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
  return (
    <ErrorBoundary componentName="App Root">
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary componentName="Theme Provider">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ErrorBoundary componentName="Router">
              <BrowserRouter>
                <ErrorBoundary componentName="Toast System">
                  <Toaster />
                  <Sonner />
                </ErrorBoundary>
                <Routes>
                  <Route path="/" element={
                    <ErrorBoundary componentName="Index Page">
                      <Index />
                    </ErrorBoundary>
                  } />
                  <Route path="/flowchart" element={
                    <ErrorBoundary componentName="Flowchart Page">
                      <FlowchartPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/unified-flowchart" element={
                    <ErrorBoundary componentName="Unified Flowchart Page">
                      <UnifiedFlowchartPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/conversation-processing" element={
                    <ErrorBoundary componentName="Conversation Processing Page">
                      <ConversationProcessingPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/wrapping-hell-analysis" element={
                    <ErrorBoundary componentName="Wrapping Hell Analysis Page">
                      <WrappingHellAnalysisPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/mobile-desktop-analysis" element={
                    <ErrorBoundary componentName="Mobile Desktop Analysis Page">
                      <MobileDesktopAnalysisPage />
                    </ErrorBoundary>
                  } />
                  <Route path="/test-dashboard" element={
                    <ErrorBoundary componentName="Test Dashboard Page">
                      <TestDashboardPage />
                    </ErrorBoundary>
                  } />
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
          </ThemeProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
