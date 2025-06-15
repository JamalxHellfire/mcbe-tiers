
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MinecraftLeaderboardTable } from '../components/MinecraftLeaderboardTable';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { TierGrid } from '../components/TierGrid';
import { usePopup } from '../contexts/PopupContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GameMode, Player } from '../services/playerService';
import { motion } from 'framer-motion';
import { toDatabaseGameMode } from '@/utils/gamemodeCasing';
import { getPlayerRank } from '@/utils/rankUtils';
import { usePointsCalculation } from '@/hooks/usePointsCalculation';
import { FloatingChatButton } from '../components/FloatingChatButton';

const Index = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<GameMode | 'overall'>('overall');
  
  const { players, loading: leaderboardLoading, error: leaderboardError } = useLeaderboard();
  const { openPopup } = usePopup();
  
  // Enable automatic points calculation
  usePointsCalculation();

  const handlePlayerClick = (player: Player) => {
    const rankInfo = getPlayerRank(player.global_points || 0);
    
    const tierAssignments = (player.tierAssignments || []).map(assignment => ({
      gamemode: assignment.gamemode,
      tier: assignment.tier,
      score: assignment.score
    }));
    
    openPopup({
      player,
      tierAssignments,
      combatRank: {
        title: rankInfo.title,
        points: player.global_points || 0,
        color: rankInfo.color,
        effectType: 'general',
        rankNumber: player.overall_rank || 1,
        borderColor: rankInfo.borderColor
      },
      timestamp: new Date().toISOString()
    });
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
      
      <main className="flex-grow w-full">
        <div className="w-full px-4 py-6">
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
              className="w-full"
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
              className="w-full"
            >
              <TierGrid 
                selectedMode={toDatabaseGameMode(selectedMode)}
                onPlayerClick={handlePlayerClick} 
              />
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
};

export default Index;
