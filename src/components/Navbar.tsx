
import React from 'react';
import { GameModeSelector } from './GameModeSelector';
import { Trophy, Home, Info, Newspaper, Youtube, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavbarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  navigate: (path: string) => void;
  activePage?: string;
}

export function Navbar({ selectedMode, onSelectMode, navigate, activePage }: NavbarProps) {
  return (
    <nav className="navbar rounded-xl">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 animate-slide-in flex items-center">
            <Link to="/" className="flex items-center">
              <Trophy size={22} className="mr-2 text-yellow-400" />
              <h1 className="logo-text">
                MCBE TIERS
              </h1>
            </Link>
          </div>

          {/* Center - Main Navigation */}
          <div className="hidden lg:flex items-center space-x-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <Link 
              to="/" 
              className={cn(
                "flex items-center text-white/80 hover:text-white transition-colors duration-200",
                !activePage && "text-white font-medium"
              )}
            >
              <Home size={18} className="mr-2" />
              <span>Home</span>
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "flex items-center text-white/80 hover:text-white transition-colors duration-200",
                activePage === "about" && "text-white font-medium"
              )}
            >
              <Info size={18} className="mr-2" />
              <span>About</span>
            </Link>
            <Link 
              to="/news" 
              className={cn(
                "flex items-center text-white/80 hover:text-white transition-colors duration-200",
                activePage === "news" && "text-white font-medium"
              )}
            >
              <Newspaper size={18} className="mr-2" />
              <span>News</span>
            </Link>
          </div>

          {/* Right - External Links */}
          <div className="flex items-center space-x-5 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/70 hover:text-red-500 transition-colors duration-200"
            >
              <Youtube size={20} />
            </a>
            <a 
              href="https://discord.gg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white/70 hover:text-indigo-400 transition-colors duration-200"
            >
              <MessageCircle size={20} />
            </a>
            
            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button className="text-white/70 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Game Mode Selector */}
        <div className="py-2 border-t border-white/10 overflow-x-auto">
          <GameModeSelector selectedMode={selectedMode} onSelectMode={onSelectMode} />
        </div>
        
        {/* Mobile Navigation */}
        <div className="lg:hidden py-2 border-t border-white/5 flex justify-center space-x-6">
          <Link 
            to="/" 
            className={cn(
              "text-white/70 hover:text-white transition-colors duration-200",
              !activePage && "text-white"
            )}
          >
            <Home size={20} />
          </Link>
          <Link 
            to="/about" 
            className={cn(
              "text-white/70 hover:text-white transition-colors duration-200",
              activePage === "about" && "text-white"
            )}
          >
            <Info size={20} />
          </Link>
          <Link 
            to="/news" 
            className={cn(
              "text-white/70 hover:text-white transition-colors duration-200",
              activePage === "news" && "text-white"
            )}
          >
            <Newspaper size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
