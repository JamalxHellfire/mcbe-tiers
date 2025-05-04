
import React from 'react';
import { GameModeSelector } from './GameModeSelector';

interface NavbarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
}

export function Navbar({ selectedMode, onSelectMode }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex-shrink-0 animate-slide-in">
            <h1 className="logo-text">
              MCBE TIERS
            </h1>
          </div>

          {/* Center - Game Mode Selector */}
          <div className="hidden md:block flex-grow px-2 mx-2 overflow-hidden">
            <GameModeSelector selectedMode={selectedMode} onSelectMode={onSelectMode} />
          </div>

          {/* Right - Future Links */}
          <div className="flex items-center space-x-3 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <a className="text-white/40 hover:text-white/60 transition-colors duration-300 cursor-not-allowed text-xs md:text-sm">
              About
            </a>
            <a className="text-white/40 hover:text-white/60 transition-colors duration-300 cursor-not-allowed text-xs md:text-sm">
              Discord
            </a>
          </div>
        </div>

        {/* Mobile Game Mode Selector */}
        <div className="md:hidden px-1 py-1 border-t border-white/10 overflow-x-auto">
          <GameModeSelector selectedMode={selectedMode} onSelectMode={onSelectMode} />
        </div>
      </div>
    </nav>
  );
}
