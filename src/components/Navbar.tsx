
import React, { useState, useEffect } from 'react';
import { GameModeSelector } from './GameModeSelector';
import { Trophy, Home, Menu, X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { ModeToggle } from './mode-toggle';

interface NavbarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  navigate: (path: string) => void;
  activePage?: string;
}

export function Navbar({ selectedMode, onSelectMode, navigate, activePage }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Future implementation will search for players
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="pt-8 pb-2">
      <motion.nav 
        className={cn(
          "navbar rounded-xl",
          scrolled ? "shadow-xl" : "shadow-lg"
        )}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Trophy size={22} className="mr-2 text-yellow-400" />
                <h1 className="logo-text">
                  MCBE TIERS
                </h1>
              </Link>
            </div>

            {/* Center - Main Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
              </motion.div>
            </div>

            {/* Right - Search & External Links */}
            <div className="hidden md:flex items-center space-x-5">
              <motion.form 
                onSubmit={handleSearch} 
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  type="text"
                  placeholder="Search player..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-dark-surface/60 border-white/10 focus:border-white/30 rounded-lg text-white/80 placeholder:text-white/40 w-48 lg:w-56 h-9"
                />
                <Search size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              </motion.form>
              
              <ModeToggle />
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <motion.button 
                onClick={toggleMobileMenu} 
                className="text-white/70 hover:text-white"
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </motion.button>
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
            <motion.div 
              className="md:hidden py-3 px-2 border-t border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                <div className="flex space-x-4 p-2 mt-2">
                  <div className="ml-auto">
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </div>
  );
}
