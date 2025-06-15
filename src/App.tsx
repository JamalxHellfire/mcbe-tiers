
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { PopupProvider } from '@/contexts/PopupContext';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import Index from './pages/Index';
import AdminPanel from './pages/AdminPanel';
import { FloatingChatButton } from './components/FloatingChatButton';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function AppContent() {
  useErrorHandler();
  useVisitorTracking();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
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
