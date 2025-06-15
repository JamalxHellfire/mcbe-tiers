import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { PopupProvider } from '@/contexts/PopupContext';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Submit from './pages/Submit';
import Players from './pages/Players';
import AdminPanel from './pages/AdminPanel';
import Footer from './components/Footer';
import { FloatingChatButton } from './components/FloatingChatButton';
import NotFound from './pages/NotFound';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

const queryClient = new QueryClient();

function AppContent() {
  useErrorHandler();
  useVisitorTracking();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/players" element={<Players />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <FloatingChatButton />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <PopupProvider>
          <Router>
            <AppContent />
            <Toaster />
          </Router>
        </PopupProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
