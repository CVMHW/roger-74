
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FlowchartPage from "./pages/FlowchartPage";
import UnifiedFlowchartPage from "./pages/UnifiedFlowchartPage";
import ConversationProcessingPage from "./pages/ConversationProcessingPage";
import WrappingHellAnalysisPage from "./pages/WrappingHellAnalysisPage";
import MobileDesktopAnalysisPage from "./pages/MobileDesktopAnalysisPage";

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <BrowserRouter>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/flowchart" element={<FlowchartPage />} />
        <Route path="/unified-flowchart" element={<UnifiedFlowchartPage />} />
        <Route path="/conversation-processing" element={<ConversationProcessingPage />} />
        <Route path="/wrapping-hell-analysis" element={<WrappingHellAnalysisPage />} />
        <Route path="/mobile-desktop-analysis" element={<MobileDesktopAnalysisPage />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
