
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MobileNavMenu } from '../components/MobileNavMenu';

const Rankings = () => {
  const navigate = useNavigate();
  
  const handleModeChange = (mode: string) => {
    if (mode === 'overall') {
      // Stay on rankings page
    } else {
      // Navigate to the specific gamemode page
      navigate(`/${mode.toLowerCase()}`);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode="overall" 
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
          <MobileNavMenu currentMode="overall" />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LeaderboardTable onPlayerClick={() => {}} />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Rankings;
