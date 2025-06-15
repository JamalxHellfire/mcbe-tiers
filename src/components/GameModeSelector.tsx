
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
    <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
      {gameModes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          className={cn(
            "flex items-center justify-center px-7 py-4 text-xl font-bold rounded-2xl whitespace-nowrap border-2 transition-colors duration-150 shadow-md gap-3",
            mode.id === 'overall' ? "text-xl px-9 py-5" : "text-xl",
            currentMode === mode.id 
              ? "bg-white/15 border-white/30 text-white"
              : "bg-white/10 border-white/10 text-white/70 hover:bg-white/15 hover:text-white"
          )}
          style={{ minWidth: 92, minHeight: 60 }}
        >
          {mode.id !== 'overall' && (
            <GameModeIcon mode={mode.id} className="h-9 w-9 mr-3" />
          )}
          {mode.label}
        </button>
      ))}
    </div>
  );
}
