
import React from 'react';
import { GameModeSelector } from './GameModeSelector';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 animate-slide-in">
            <h1 className="logo-text">
              MCBE TIERS
            </h1>
          </div>

          {/* Center - Game Mode Selector */}
          <div className="hidden md:block flex-grow px-6 mx-6 overflow-hidden">
            <GameModeSelector />
          </div>

          {/* Right - Future Links */}
          <div className="flex items-center space-x-5 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <a className="text-white/40 hover:text-white/60 transition-colors duration-300 cursor-not-allowed text-sm md:text-base">
              About Us
            </a>
            <a className="text-white/40 hover:text-white/60 transition-colors duration-300 cursor-not-allowed text-sm md:text-base">
              Discord
            </a>
          </div>
        </div>

        {/* Mobile Game Mode Selector */}
        <div className="md:hidden px-2 py-2 border-t border-white/10 overflow-x-auto">
          <GameModeSelector />
        </div>
      </div>
    </nav>
  );
}
