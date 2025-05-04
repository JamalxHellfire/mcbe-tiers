
import React, { useState } from 'react';
import { 
  Crystal, 
  Sword, 
  Axe, 
  Mace, 
  Bedwars, 
  SMP, 
  Netherpot, 
  UHC 
} from 'lucide-react';

interface GameMode {
  id: string;
  name: string;
  icon: React.ElementType;
}

export function GameModeSelector() {
  // Game modes list
  const gameModes: GameMode[] = [
    { id: 'overall', name: 'Overall', icon: () => null },
    { id: 'crystal', name: 'Crystal', icon: Crystal },
    { id: 'sword', name: 'Sword', icon: Sword },
    { id: 'axe', name: 'Axe', icon: Axe },
    { id: 'mace', name: 'Mace', icon: Mace },
    { id: 'bedwars', name: 'Bedwars', icon: Bedwars },
    { id: 'smp', name: 'SMP', icon: SMP },
    { id: 'netherpot', name: 'Netherpot', icon: Netherpot },
    { id: 'uhc', name: 'UHC', icon: UHC },
  ];

  // Overall selected by default
  const [selectedMode, setSelectedMode] = useState('overall');

  return (
    <div className="flex space-x-1 md:space-x-2 overflow-x-auto pb-1 no-scrollbar">
      <div className="flex animate-fade-in">
        {gameModes.map((mode, index) => (
          <button
            key={mode.id}
            className={`game-mode-button whitespace-nowrap flex items-center ${
              selectedMode === mode.id ? 'active' : ''
            } ${
              selectedMode === mode.id ? 
                `border-b-2 ${mode.id === 'overall' ? 'border-white' : `border-tier-${index % 5 + 1}`}` : 
                ''
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => setSelectedMode(mode.id)}
          >
            {mode.icon !== null && <mode.icon className="w-4 h-4 mr-1" />}
            {mode.name}
            {selectedMode === mode.id && (
              <span 
                className={`absolute bottom-0 left-0 h-0.5 w-full transform ${
                  mode.id === 'overall' ? 'bg-white' : `bg-tier-${index % 5 + 1}`
                } animate-scale-in`}
              ></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
