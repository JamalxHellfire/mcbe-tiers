
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Gamemodes = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode="overall" 
        onSelectMode={(mode) => navigate(`/${mode.toLowerCase()}`)}
        navigate={navigate} 
      />
      
      <main className="flex-grow">
        <div className="content-container py-4 md:py-6">
          <h1 className="section-heading mb-6">Game Modes</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Game mode cards would go here */}
            <div className="bg-card rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">Crystal</h2>
              <p>Crystal combat information and description.</p>
            </div>
            <div className="bg-card rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">Sword</h2>
              <p>Sword combat information and description.</p>
            </div>
            <div className="bg-card rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">Axe</h2>
              <p>Axe combat information and description.</p>
            </div>
            <div className="bg-card rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">Mace</h2>
              <p>Mace combat information and description.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gamemodes;
