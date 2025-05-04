
import React from 'react';
import { Trophy, Sword, Axe } from 'lucide-react';

interface GameModeSelectorProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
}

export function GameModeSelector({ selectedMode, onSelectMode }: GameModeSelectorProps) {
  // Game modes including labels and icon components
  const modes = [
    { id: 'overall', label: 'Overall', icon: <Trophy size={18} className="mr-1" /> },
    { id: 'crystal', label: 'Crystal', icon: <span className="mode-icon">🟣</span> },
    { id: 'sword', label: 'Sword', icon: <Sword size={18} className="mr-1" /> },
    { id: 'axe', label: 'Axe', icon: <Axe size={18} className="mr-1" /> },
    { id: 'mace', label: 'Mace', icon: <span className="mode-icon">🔨</span> },
    { id: 'bedwars', label: 'Bedwars', icon: <span className="mode-icon">🛏️</span> },
    { id: 'smp', label: 'SMP', icon: <span className="mode-icon">🌍</span> },
    { id: 'netherpot', label: 'NetherPot', icon: <span className="mode-icon">⚗️</span> },
    { id: 'uhc', label: 'UHC', icon: <span className="mode-icon">❤️</span> }
  ];

  return (
    <div className="game-mode-selector flex items-center space-x-1 overflow-x-auto pb-1 px-1">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelectMode(mode.id)}
          className={`game-mode-button whitespace-nowrap flex items-center ${
            selectedMode === mode.id ? 'active' : ''
          }`}
        >
          <span className="flex items-center">
            {mode.icon}
            <span>{mode.label}</span>
          </span>
          
          {selectedMode === mode.id && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></div>
          )}
        </button>
      ))}
    </div>
  );
}
