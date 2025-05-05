
import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { TierGrid } from '../components/TierGrid';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Footer } from '../components/Footer';
import { PlayerModal } from '../components/PlayerModal';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [selectedMode, setSelectedMode] = useState('overall');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };
  
  const handlePlayerClick = (player: any) => {
    setSelectedPlayer(player);
    setIsPlayerModalOpen(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode={selectedMode} 
        onSelectMode={handleModeChange} 
        navigate={navigate} 
      />
      
      <main className="flex-grow">
        <div className="content-container py-6 md:py-8">
          <h1 className="section-heading mb-6 md:mb-8">
            {selectedMode === 'overall' ? 'Overall Rankings' : `${selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} Rankings`}
          </h1>
          
          {/* Conditionally render layout based on selected mode */}
          {selectedMode === 'overall' ? (
            <LeaderboardTable onPlayerClick={handlePlayerClick} />
          ) : (
            <TierGrid selectedMode={selectedMode} onPlayerClick={handlePlayerClick} />
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Player Modal */}
      {selectedPlayer && (
        <PlayerModal
          isOpen={isPlayerModalOpen}
          onClose={() => setIsPlayerModalOpen(false)}
          player={selectedPlayer}
        />
      )}
    </div>
  );
};

export default Index;
