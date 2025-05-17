
import React from 'react';
import { Navbar } from '../components/Navbar';
import { TierGrid } from '../components/TierGrid';
import { Footer } from '../components/Footer';
import { PlayerModal } from '../components/PlayerModal';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GameMode } from '@/services/playerService';
import { MobileNavMenu } from '../components/MobileNavMenu';

interface SubcategoryPageProps {
  gameMode: GameMode;
}

const SubcategoryPage = ({ gameMode }: SubcategoryPageProps) => {
  const [selectedPlayer, setSelectedPlayer] = React.useState(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const handleModeChange = (mode: string) => {
    if (mode === 'overall') {
      navigate('/');
    } else {
      navigate(`/${mode.toLowerCase()}`);
    }
  };
  
  const handlePlayerClick = (player: any) => {
    setSelectedPlayer(player);
    setIsPlayerModalOpen(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode={gameMode.toLowerCase()} 
        onSelectMode={handleModeChange} 
        navigate={navigate} 
      />
      
      <main className="flex-grow">
        <div className="content-container py-6 md:py-8">
          <motion.h1 
            className="section-heading mb-6 md:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {gameMode} Rankings
          </motion.h1>
          
          {/* Mobile navigation menu */}
          <MobileNavMenu currentMode={gameMode} />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <TierGrid selectedMode={gameMode} onPlayerClick={handlePlayerClick} />
          </motion.div>
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

export default SubcategoryPage;
