
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import SubcategoryPage from "./pages/SubcategoryPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Game mode specific pages */}
          <Route path="/crystal" element={<SubcategoryPage gameMode="Crystal" />} />
          <Route path="/sword" element={<SubcategoryPage gameMode="Sword" />} />
          <Route path="/smp" element={<SubcategoryPage gameMode="SMP" />} />
          <Route path="/uhc" element={<SubcategoryPage gameMode="UHC" />} />
          <Route path="/axe" element={<SubcategoryPage gameMode="Axe" />} />
          <Route path="/nethpot" element={<SubcategoryPage gameMode="NethPot" />} />
          <Route path="/bedwars" element={<SubcategoryPage gameMode="Bedwars" />} />
          <Route path="/mace" element={<SubcategoryPage gameMode="Mace" />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
