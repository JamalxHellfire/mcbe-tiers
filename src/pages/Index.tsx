
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ImprovedTierGrid } from '../components/ImprovedTierGrid';
import { PlayerModal } from '../components/PlayerModal';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [selectedMode, setSelectedMode] = useState('SMP');
  const [selectedPlayer, setSelectedPlayer] = useState<{id: string, gamemode?: string} | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };

  const handlePlayerClick = (player: {id: string, gamemode?: string}) => {
    setSelectedPlayer(player);
    setIsPlayerModalOpen(true);
  };

  const handleClosePlayerModal = () => {
    setIsPlayerModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode={selectedMode}
        onSelectMode={handleModeChange}
        navigate={navigate}
        activePage="home"
      />

      <main className="flex-grow p-4 md:p-8">
        <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-0' : 'px-4'}`}>
          <ImprovedTierGrid selectedMode={selectedMode} onPlayerClick={handlePlayerClick} />
        </div>
      </main>

      <Footer />

      {selectedPlayer && (
        <PlayerModal 
          isOpen={isPlayerModalOpen}
          onClose={handleClosePlayerModal}
          player={selectedPlayer}
        />
      )}
    </div>
  );
};

export default Index;
