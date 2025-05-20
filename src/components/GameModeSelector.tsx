
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { GameModeIcon } from './GameModeIcon';

interface GameModeSelectorProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
}

export function GameModeSelector({ selectedMode, onSelectMode }: GameModeSelectorProps) {
  // Define all game modes
  const gameModes = [
    { id: 'overall', label: 'Overall' },
    { id: 'crystal', label: 'Crystal' },
    { id: 'sword', label: 'Sword' },
    { id: 'axe', label: 'Axe' },
    { id: 'mace', label: 'Mace' },
    { id: 'smp', label: 'SMP' },
    { id: 'nethpot', label: 'NethPot' },
    { id: 'bedwars', label: 'Bedwars' },
    { id: 'uhc', label: 'UHC' }
  ];
  
  return (
    <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
      {gameModes.map(mode => (
        <motion.button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          className={cn(
            "flex items-center justify-center px-5 py-2.5 text-base font-medium rounded-full whitespace-nowrap",
            mode.id === 'overall' ? "text-lg px-6 py-3" : "text-base",
            selectedMode === mode.id 
              ? "bg-white/10 border-white/20 text-white" 
              : "bg-white/5 border-transparent text-white/60 hover:bg-white/10 hover:text-white/80"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {mode.id !== 'overall' && (
            <GameModeIcon mode={mode.id} className="h-5 w-5 mr-2" />
          )}
          {mode.label}
        </motion.button>
      ))}
    </div>
  );
}
