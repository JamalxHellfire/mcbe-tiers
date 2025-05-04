
import React from 'react';
import { GameModeSelector } from './GameModeSelector';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-10 bg-dark-background/95 backdrop-blur-sm border-b border-dark-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0 animate-slide-in">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            MCBE TIERS
          </h1>
        </div>

        {/* Center - Game Mode Selector */}
        <div className="hidden md:block flex-grow px-4 mx-4 overflow-hidden">
          <GameModeSelector />
        </div>

        {/* Right - Future Links */}
        <div className="flex items-center space-x-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <a className="text-white/40 cursor-not-allowed text-sm md:text-base">
            About Us
          </a>
          <a className="text-white/40 cursor-not-allowed text-sm md:text-base">
            Discord
          </a>
        </div>
      </div>

      {/* Mobile Game Mode Selector */}
      <div className="md:hidden px-4 py-2 border-t border-dark-border overflow-x-auto">
        <GameModeSelector />
      </div>
    </nav>
  );
}
