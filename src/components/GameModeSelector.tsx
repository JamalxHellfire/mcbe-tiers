
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
            // Slightly smaller than before, but still larger than the original
            "flex items-center justify-center rounded-lg whitespace-nowrap border transition-colors duration-150",
            "text-[0.85rem] px-2.5 py-1", // mobile: 13.6px font, 10px x 4px padding
            "md:text-[1rem] md:px-3 md:py-1.5", // tablet: 16px font, 12px x 6px padding
            "lg:text-[1.12rem] lg:px-4 lg:py-2", // desktop: 18px font, 16px x 8px padding
            "font-semibold",
            mode.id === 'overall' ? "" : "",
            currentMode === mode.id 
              ? "bg-white/10 border-white/20 text-white" 
              : "bg-white/5 border-white/5 text-white/60 hover:bg-white/8 hover:text-white/80"
          )}
        >
          {mode.id !== 'overall' && (
            <GameModeIcon 
              mode={mode.id} 
              // Slightly smaller icons than before
              className="h-3.5 w-3.5 mr-1 md:h-6 md:w-6 md:mr-2 lg:h-7 lg:w-7 lg:mr-2" 
            />
          )}
          {mode.label}
        </button>
      ))}
    </div>
  );
}
