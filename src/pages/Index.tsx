
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { TierGrid } from '../components/TierGrid';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Footer } from '../components/Footer';
import { PlayerModal } from '../components/PlayerModal';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMode } from '@/services/playerService';
import { MobileNavMenu } from '../components/MobileNavMenu';

const Index = () => {
  const [selectedMode, setSelectedMode] = useState<string>('overall');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleModeChange = (mode: string) => {
    if (mode === 'overall') {
      setSelectedMode('overall');
    } else {
      // Navigate to the specific gamemode page
      navigate(`/${mode.toLowerCase()}`);
    }
  };
  
  const handlePlayerClick = (player: any) => {
    setSelectedPlayer(player);
    setIsPlayerModalOpen(true);
  };
  
  const gamemodes: GameMode[] = [
    'crystal', 'sword', 'smp', 'uhc', 'axe', 'nethpot', 'bedwars', 'mace'
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode={selectedMode} 
        onSelectMode={handleModeChange} 
        navigate={navigate} 
      />
      
      <main className="flex-grow">
        <div className="content-container py-4 md:py-6">
          <motion.h1 
            className="section-heading mb-4 md:mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Overall Rankings
          </motion.h1>
          
          {/* Mobile navigation menu */}
          <MobileNavMenu currentMode={selectedMode} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LeaderboardTable onPlayerClick={handlePlayerClick} />
            </motion.div>
          </AnimatePresence>
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
