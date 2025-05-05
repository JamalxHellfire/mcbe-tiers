
import React, { useState } from 'react';
import { GameModeSelector } from './GameModeSelector';
import { Trophy, Home, Info, Newspaper, Youtube, MessageCircle, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  navigate: (path: string) => void;
  activePage?: string;
}

export function Navbar({ selectedMode, onSelectMode, navigate, activePage }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Future implementation will search for players
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="pt-6 pb-2">
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
                <span>Rankings</span>
              </Link>
              <Link 
                to="/about" 
                className={cn(
                  "flex items-center text-white/80 hover:text-white transition-colors duration-200",
                  activePage === "about" && "text-white font-medium"
                )}
              >
                <Info size={18} className="mr-2" />
                <span>About Us</span>
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

            {/* Right - Search & External Links */}
            <div className="hidden md:flex items-center space-x-5 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search player..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-dark-surface/60 border-white/10 focus:border-white/30 rounded-lg text-white/80 placeholder:text-white/40 w-40 lg:w-48 h-9"
                />
                <Search size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              </form>
              
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
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleMobileMenu} 
                className="text-white/70 hover:text-white"
              >
                {mobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>

          {/* Search bar for mobile */}
          <div className="md:hidden py-2 border-t border-white/10">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search player..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-dark-surface/60 border-white/10 focus:border-white/30 rounded-lg text-white/80 placeholder:text-white/40 w-full h-9"
              />
              <Search size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            </form>
          </div>

          {/* Game Mode Selector */}
          <div className="py-2 border-t border-white/10 overflow-x-auto">
            <GameModeSelector selectedMode={selectedMode} onSelectMode={onSelectMode} />
          </div>
          
          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 px-2 border-t border-white/10 animate-fade-in">
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className={cn(
                    "flex items-center p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white",
                    !activePage && "text-white bg-white/5"
                  )}
                >
                  <Home size={18} className="mr-3" />
                  <span>Rankings</span>
                </Link>
                <Link 
                  to="/about" 
                  className={cn(
                    "flex items-center p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white",
                    activePage === "about" && "text-white bg-white/5"
                  )}
                >
                  <Info size={18} className="mr-3" />
                  <span>About Us</span>
                </Link>
                <Link 
                  to="/news" 
                  className={cn(
                    "flex items-center p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white",
                    activePage === "news" && "text-white bg-white/5"
                  )}
                >
                  <Newspaper size={18} className="mr-3" />
                  <span>News</span>
                </Link>
                <div className="flex space-x-4 p-2 mt-2">
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/70 hover:text-red-500 transition-colors duration-200"
                  >
                    <Youtube size={22} />
                  </a>
                  <a 
                    href="https://discord.gg" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/70 hover:text-indigo-400 transition-colors duration-200"
                  >
                    <MessageCircle size={22} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
