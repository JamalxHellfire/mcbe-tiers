
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Diamond, 
  Sword, 
  Axe, 
  Hammer, 
  Bed, 
  Globe, 
  Flame, 
  Target 
} from 'lucide-react';

export interface GameMode {
  id: string;
  name: string;
  icon: React.ElementType;
}

interface GameModeSelectorProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
}

export function GameModeSelector({ selectedMode, onSelectMode }: GameModeSelectorProps) {
  // Game modes list
  const gameModes: GameMode[] = [
    { id: 'overall', name: 'Overall', icon: CheckCircle2 },
    { id: 'crystal', name: 'Crystal', icon: Diamond },
    { id: 'sword', name: 'Sword', icon: Sword },
    { id: 'axe', name: 'Axe', icon: Axe },
    { id: 'mace', name: 'Mace', icon: Hammer },
    { id: 'bedwars', name: 'Bed', icon: Bed },
    { id: 'smp', name: 'SMP', icon: Globe },
    { id: 'netherpot', name: 'Nether', icon: Flame },
    { id: 'uhc', name: 'UHC', icon: Target },
  ];

  return (
    <div className="flex justify-center space-x-1 md:space-x-2 overflow-x-auto pb-1 no-scrollbar">
      <div className="flex animate-fade-in">
        {gameModes.map((mode, index) => {
          const isSelected = selectedMode === mode.id;
          const tierColor = index % 5 + 1;
          const borderColor = isSelected 
            ? mode.id === 'overall' 
              ? 'border-white' 
              : `border-tier-${tierColor}`
            : 'border-transparent';
          
          return (
            <button
              key={mode.id}
              className={`game-mode-button text-xs md:text-sm px-2 py-1 md:px-3 md:py-2 whitespace-nowrap flex items-center gap-1 rounded-xl transition hover:bg-[#1d1d1d] hover:scale-105 ${
                isSelected ? 'active font-semibold' : 'text-white/70'
              } ${borderColor} ${
                isSelected ? 'bg-white/10' : ''
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => onSelectMode(mode.id)}
            >
              {mode.icon !== null && <mode.icon className="w-3 h-3 md:w-4 md:h-4" />}
              <span className="hidden xs:inline">{mode.name}</span>
              {isSelected && (
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 w-full ${
                    mode.id === 'overall' ? 'bg-white' : `bg-tier-${tierColor}`
                  } animate-scale-in`}
                ></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
