
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
    <div className="bg-slate-800 rounded-lg p-2 space-y-1">
      {gameModes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          className={cn(
            "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
            (selectedMode || 'overall') === mode.id 
              ? "bg-blue-600 text-white" 
              : "text-gray-300 hover:text-white hover:bg-slate-700"
          )}
        >
          {mode.id !== 'overall' && (
            <GameModeIcon mode={mode.id} className="h-4 w-4 mr-2" />
          )}
          {mode.label}
        </button>
      ))}
    </div>
  );
}
