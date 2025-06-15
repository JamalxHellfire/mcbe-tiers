
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { GameModeIcon } from './GameModeIcon';

interface GameModeSelectorProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
}

export function GameModeSelector({ selectedMode = 'overall', onSelectMode }: GameModeSelectorProps) {
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
  
  const currentMode = selectedMode?.toLowerCase() || 'overall';
  
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
      {gameModes.map(mode => (
        <motion.button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          className={cn(
            "flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap border transition-all duration-150",
            mode.id === 'overall' ? "text-sm px-4 py-2" : "text-xs",
            currentMode === mode.id 
              ? "bg-white/10 border-white/20 text-white shadow-sm" 
              : "bg-white/5 border-white/5 text-white/60 hover:bg-white/8 hover:text-white/80 hover:border-white/10"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {mode.id !== 'overall' && (
            <GameModeIcon mode={mode.id} className="h-3 w-3 mr-1.5" />
          )}
          {mode.label}
        </motion.button>
      ))}
    </div>
  );
}
