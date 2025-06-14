
import React, { useState, useEffect } from 'react';
import { GameModeSelector } from './GameModeSelector';
import { MobileNavMenu } from './MobileNavMenu';
import { Trophy, Home, Youtube, MessageCircle, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  navigate: (path: string) => void;
  activePage?: string;
}

export function Navbar({ selectedMode, onSelectMode, navigate }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  
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
    <div className={`pt-4 pb-2 ${isMobile ? 'px-2' : 'pt-8'}`}>
      <motion.nav 
        className={cn(
          "navbar rounded-xl",
          scrolled ? "shadow-xl" : "shadow-lg"
        )}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`container mx-auto ${isMobile ? 'px-3' : 'px-4 lg:px-8'}`}>
          <div className={`flex items-center justify-between ${isMobile ? 'h-14' : 'h-16'}`}>
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/3bad17d6-7347-46e0-8f33-35534094962f.png" 
                  alt="MCBE TIERS" 
                  className={`w-auto mr-2 ${isMobile ? 'h-8' : 'h-10'}`} 
                />
                <h1 className={`font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent hover:from-white hover:to-white/80 transition-all ${
                  isMobile ? 'text-lg' : 'text-xl md:text-2xl'
                }`}>
                  MCBE TIERS
                </h1>
              </Link>
            </div>

            {/* Center - Main Navigation (Desktop only) */}
            {!isMobile && (
              <div className="hidden lg:flex items-center space-x-8">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/" 
                    className="flex items-center text-white/80 hover:text-white transition-colors duration-200 text-lg"
                  >
                    <Home size={20} className="mr-2" />
                    <span>Rankings</span>
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Right - Search & External Links (Desktop) / Menu Button (Mobile) */}
            {isMobile ? (
              <div className="flex items-center gap-2">
                <motion.button 
                  onClick={toggleMobileMenu} 
                  className="text-white/70 hover:text-white p-2"
                  whileTap={{ scale: 0.9 }}
                >
                  {mobileMenuOpen ? (
                    <X size={24} />
                  ) : (
                    <Menu size={24} />
                  )}
                </motion.button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-6">
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
                    className="pl-9 pr-3 py-2 bg-dark-surface/60 border-white/10 focus:border-white/30 rounded-lg text-white/80 placeholder:text-white/40 w-48 lg:w-56 h-10"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                </motion.form>
                
                <motion.a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/70 hover:text-red-500 transition-colors duration-200"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Youtube size={24} />
                </motion.a>
                
                <motion.a 
                  href="https://discord.gg" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/70 hover:text-indigo-400 transition-colors duration-200"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MessageCircle size={24} />
                </motion.a>
              </div>
            )}
          </div>

          {/* Search bar for mobile */}
          {isMobile && (
            <div className="py-2 border-t border-white/10">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search player..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-dark-surface/60 border-white/10 focus:border-white/30 rounded-lg text-white/80 placeholder:text-white/40 w-full h-10"
                />
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              </form>
            </div>
          )}

          {/* Game Mode Selector - Different for mobile */}
          <div className="py-2 border-t border-white/10 overflow-x-auto">
            {isMobile ? (
              <MobileNavMenu currentMode={selectedMode || 'overall'} />
            ) : (
              <GameModeSelector selectedMode={selectedMode || 'overall'} onSelectMode={onSelectMode} />
            )}
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobile && mobileMenuOpen && (
            <motion.div 
              className="py-3 px-2 border-t border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className="flex items-center p-3 rounded-md hover:bg-white/10 text-white/80 hover:text-white text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home size={22} className="mr-3" />
                  <span>Rankings</span>
                </Link>
                <div className="flex space-x-4 p-3 mt-2 justify-center">
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/70 hover:text-red-500 transition-colors duration-200"
                  >
                    <Youtube size={28} />
                  </a>
                  <a 
                    href="https://discord.gg" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/70 hover:text-indigo-400 transition-colors duration-200"
                  >
                    <MessageCircle size={28} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </div>
  );
}
