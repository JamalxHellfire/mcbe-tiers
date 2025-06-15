
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SubcategoryPage from "./pages/SubcategoryPage";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import { PopupProvider } from "./contexts/PopupContext";
import { ModernResultPopup } from "./components/ModernResultPopup";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { useErrorHandler } from "./hooks/useErrorHandler";

// Optimized QueryClient configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1, // Reduce retry attempts for faster error handling
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
});

function AppContent() {
  useErrorHandler();

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminPanel />
              </AdminProtectedRoute>
            } 
          />
          <Route path="/:category" element={<SubcategoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ModernResultPopup />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PopupProvider>
          <AppContent />
        </PopupProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
