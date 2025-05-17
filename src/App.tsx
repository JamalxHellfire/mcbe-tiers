
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import AdminPanel from './pages/AdminPanel';
import Crystal from './pages/Crystal';
import Sword from './pages/Sword';
import Axe from './pages/Axe';
import Smp from './pages/Smp';
import Bedwars from './pages/Bedwars';
import Mace from './pages/Mace';
import Uhc from './pages/Uhc';
import NethPot from './pages/NethPot';
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/crystal" element={<Crystal />} />
        <Route path="/sword" element={<Sword />} />
        <Route path="/axe" element={<Axe />} />
        <Route path="/smp" element={<Smp />} />
        <Route path="/bedwars" element={<Bedwars />} />
        <Route path="/mace" element={<Mace />} />
        <Route path="/uhc" element={<Uhc />} />
        <Route path="/nethpot" element={<NethPot />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
