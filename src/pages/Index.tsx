
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EnhancedLeaderboardTable } from '../components/EnhancedLeaderboardTable';
import { useGamemodeTiers } from '../hooks/useGamemodeTiers';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { TierGrid } from '../components/TierGrid';
import { EnhancedPlayerModal } from '../components/EnhancedPlayerModal';
import { ResultPopup } from '../components/ResultPopup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GameMode, Player } from '../services/playerService';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<GameMode | 'overall'>('overall');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  const { tierData, loading: tierLoading, error: tierError } = useGamemodeTiers(
    selectedMode !== 'overall' ? selectedMode : 'Crystal'
  );
  const { players, loading: leaderboardLoading, error: leaderboardError } = useLeaderboard();

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
  };

  const handleSelectMode = (mode: string) => {
    setSelectedMode(mode as GameMode | 'overall');
  };

  const loading = selectedMode === 'overall' ? leaderboardLoading : tierLoading;
  const error = selectedMode === 'overall' ? leaderboardError : tierError;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode={selectedMode} 
        onSelectMode={handleSelectMode} 
        navigate={navigate} 
      />
      
      <main className="flex-grow">
        <div className="content-container py-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-white">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">
              Error: {error}
            </div>
          ) : selectedMode === 'overall' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <EnhancedLeaderboardTable 
                players={players}
                onPlayerClick={handlePlayerClick} 
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <TierGrid 
                selectedMode={selectedMode as GameMode}
                onPlayerClick={handlePlayerClick} 
              />
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {selectedPlayer && (
        <EnhancedPlayerModal 
          player={selectedPlayer} 
          isOpen={true}
          onClose={closeModal} 
        />
      )}
      
      <ResultPopup />
    </div>
  );
};

export default Index;
