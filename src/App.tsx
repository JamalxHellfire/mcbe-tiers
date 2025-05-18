
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import News from "./pages/News";
import NotFound from "./pages/NotFound";
import SubcategoryPage from "./pages/SubcategoryPage";
import AdminPanel from "./pages/AdminPanel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { GameMode } from "./services/playerService";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Game mode routes */}
          <Route path="/crystal" element={<SubcategoryPage gameMode="Crystal" />} />
          <Route path="/sword" element={<SubcategoryPage gameMode="Sword" />} />
          <Route path="/axe" element={<SubcategoryPage gameMode="Axe" />} />
          <Route path="/mace" element={<SubcategoryPage gameMode="Mace" />} />
          <Route path="/smp" element={<SubcategoryPage gameMode="SMP" />} />
          <Route path="/nethpot" element={<SubcategoryPage gameMode="NethPot" />} />
          <Route path="/bedwars" element={<SubcategoryPage gameMode="Bedwars" />} />
          <Route path="/uhc" element={<SubcategoryPage gameMode="UHC" />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
