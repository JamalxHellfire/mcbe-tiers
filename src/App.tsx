
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SubcategoryPage from "./pages/SubcategoryPage";
import AdminPanel from "./pages/AdminPanel";
import About from "./pages/About";
import News from "./pages/News";
import NotFound from "./pages/NotFound";
import { PopupProvider } from "./contexts/PopupContext";
import { ResultPopup } from "./components/ResultPopup";
import { useErrorHandler } from "./hooks/useErrorHandler";

const queryClient = new QueryClient();

function App() {
  useErrorHandler(); // Initialize global error handling

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PopupProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/news" element={<News />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/:category" element={<SubcategoryPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <ResultPopup />
        </PopupProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
