
import React from 'react';
import { cn } from '@/lib/utils';
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
    <div className="flex space-x-1 overflow-x-auto pb-1 no-scrollbar">
      {gameModes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          className={cn(
            "flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap border transition-colors duration-150",
            mode.id === 'overall' ? "text-sm px-4 py-2" : "text-sm",
            currentMode === mode.id 
              ? "bg-white/10 border-white/20 text-white" 
              : "bg-white/5 border-white/5 text-white/60 hover:bg-white/8 hover:text-white/80"
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
