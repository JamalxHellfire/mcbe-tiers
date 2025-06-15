
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
    <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
      {gameModes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          className={cn(
            "flex items-center justify-center px-3 py-2 text-sm font-semibold rounded-lg whitespace-nowrap border transition-colors duration-150 shadow gap-1.5",
            mode.id === 'overall' ? "text-base px-5 py-3" : "text-sm",
            currentMode === mode.id 
              ? "bg-white/15 border-white/30 text-white"
              : "bg-white/10 border-white/10 text-white/70 hover:bg-white/15 hover:text-white"
          )}
          style={{ minWidth: 56, minHeight: 36 }}
        >
          {mode.id !== 'overall' && (
            <GameModeIcon mode={mode.id} className="h-5 w-5 mr-2" />
          )}
          {mode.label}
        </button>
      ))}
    </div>
  );
}
