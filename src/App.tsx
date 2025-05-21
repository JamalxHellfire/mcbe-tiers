import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Rankings from './pages/Rankings';
import Gamemodes from './pages/Gamemodes';
import News from './pages/News';
import AdminPanel from './pages/AdminPanel';
import { PopupProvider } from './contexts/PopupContext';
import { ToastContainer } from 'sonner';
import { useVisitTracker } from '@/hooks/useVisitTracker';

function App() {
  useVisitTracker();

  return (
    <PopupProvider>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Rankings />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/gamemodes" element={<Gamemodes />} />
          <Route path="/news" element={<News />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </PopupProvider>
  );
}

export default App;
