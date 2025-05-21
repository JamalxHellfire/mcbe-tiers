
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import SubcategoryPage from "./pages/SubcategoryPage";
import About from "./pages/About";
import News from "./pages/News";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme-provider";
import "./App.css";
import { PopupProvider } from "./contexts/PopupContext";
import { ResultPopup } from "./components/ResultPopup";
import "./components/ResultPopup.css";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PopupProvider>
        <BrowserRouter>
          <div className="app">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/news" element={<News />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route 
                path="/:gameMode" 
                element={<SubcategoryPage />} 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-center" />
            <ResultPopup />
          </div>
        </BrowserRouter>
      </PopupProvider>
    </ThemeProvider>
  );
}

export default App;
