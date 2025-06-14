
import React from 'react';
import { Navbar } from '../components/Navbar';
import { TierGrid } from '../components/TierGrid';
import { Footer } from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMode } from '@/services/playerService';
import { toDatabaseGameMode } from '@/utils/gamemodeCasing';
import { useRankBadgeSystem } from '@/hooks/useRankBadgeSystem';
import { RankPopup } from '@/components/RankBadgeSystem';

const SubcategoryPage = () => {
  const { gameMode: gameModeParam } = useParams<{ gameMode: string }>();
  const gameMode = toDatabaseGameMode(gameModeParam || 'Crystal');
  const navigate = useNavigate();
  const { showPopup: showRankPopup, hideRankPopup, currentRank, playerName, points } = useRankBadgeSystem();
  
  const handleModeChange = (mode: string) => {
    if (mode === 'overall') {
      navigate('/');
    } else {
      navigate(`/${mode.toLowerCase()}`);
    }
  };
  
  const handlePlayerClick = (player: any) => {
    // Player clicks will be handled by TierResultButton which uses the popup context
    console.log('Player clicked:', player);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode={gameModeParam?.toLowerCase() || 'crystal'} 
        onSelectMode={handleModeChange} 
        navigate={navigate}
      />
      
      <main className="flex-grow">
        <div className="content-container py-4 md:py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={gameMode.toLowerCase()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TierGrid selectedMode={gameMode} onPlayerClick={handlePlayerClick} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
      
      {/* Rank Popup System */}
      {currentRank && (
        <RankPopup
          rank={currentRank}
          playerName={playerName}
          points={points}
          isOpen={showRankPopup}
          onClose={hideRankPopup}
        />
      )}
    </div>
  );
};

export default SubcategoryPage;
