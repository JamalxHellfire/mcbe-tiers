
import React from 'react';
import { motion } from 'framer-motion';
import { GameModeSelector } from './GameModeSelector';
import { ModeToggle } from './mode-toggle';

interface NavbarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  navigate?: any;
}

export function Navbar({ selectedMode, onSelectMode, navigate }: NavbarProps) {
  // Use motion animations for the banner and logo
  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.5 } }
  };
  
  return (
    <header className="bg-dark-surface/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="animate"
          className="flex items-center"
        >
          <button 
            onClick={() => navigate && navigate('/')}
            className="text-xl md:text-2xl font-bold text-white hover:text-tier-1 transition-colors"
          >
            MCBE Tiers
          </button>
        </motion.div>
        
        <div className="hidden md:flex items-center space-x-6">
          <GameModeSelector selectedMode={selectedMode} onSelectMode={onSelectMode} />
        </div>
        
        <div className="flex items-center space-x-3">
          {navigate && (
            <button 
              onClick={() => navigate('/admin')}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Admin
            </button>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
