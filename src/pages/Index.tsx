
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MinecraftLeaderboardTable } from '../components/MinecraftLeaderboardTable';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { TierGrid } from '../components/TierGrid';
import { MinecraftPlayerModal } from '../components/MinecraftPlayerModal';
import { usePopup } from '../contexts/PopupContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GameMode, Player } from '../services/playerService';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<GameMode | 'overall'>('overall');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  const { players, loading: leaderboardLoading, error: leaderboardError } = useLeaderboard();
  const { openPopup } = usePopup();

  const handlePlayerClick = (player: Player) => {
    // Use the popup context instead of the modal for overall leaderboard
    if (selectedMode === 'overall') {
      openPopup({
        player,
        tierAssignments: [
          { gamemode: 'Crystal' as GameMode, tier: 'HT1', points: 100 },
          { gamemode: 'Sword' as GameMode, tier: 'HT1', points: 95 },
          { gamemode: 'Bedwars' as GameMode, tier: 'HT1', points: 90 },
          { gamemode: 'Mace' as GameMode, tier: 'LT1', points: 85 },
          { gamemode: 'SMP' as GameMode, tier: 'LT1', points: 80 },
          { gamemode: 'UHC' as GameMode, tier: 'LT1', points: 75 },
          { gamemode: 'NethPot' as GameMode, tier: 'HT2', points: 70 },
          { gamemode: 'Axe' as GameMode, tier: 'LT1', points: 65 }
        ],
        combatRank: {
          title: 'Combat Master',
          points: player.global_points,
          color: 'text-yellow-400',
          effectType: 'general',
          rankNumber: player.overall_rank,
          borderColor: 'border-yellow-400'
        },
        timestamp: new Date().toISOString()
      });
    } else {
      setSelectedPlayer(player);
    }
  };

  const closeModal = () => {
    setSelectedPlayer(null);
  };

  const handleSelectMode = (mode: string) => {
    setSelectedMode(mode as GameMode | 'overall');
  };

  const loading = leaderboardLoading;
  const error = leaderboardError;

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
              <MinecraftLeaderboardTable 
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
        <MinecraftPlayerModal 
          player={selectedPlayer} 
          isOpen={true}
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default Index;
