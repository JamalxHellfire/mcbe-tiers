
import React, { useState, useEffect } from 'react';
import { GameModeSelector } from './GameModeSelector';
import { Trophy, Home, Info, Newspaper, Youtube, MessageCircle, Search, Menu, X, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fetchPlayers } from '@/api/supabase';
import { Player } from '@/types';

interface NavbarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  navigate: (path: string) => void;
  activePage?: string;
}

export function Navbar({ selectedMode, onSelectMode, navigate, activePage }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const data = await fetchPlayers();
        setPlayers(data);
      } catch (error) {
        console.error('Error loading players for search:', error);
      }
    };
    
    loadPlayers();
  }, []);
  
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = players.filter(player => 
        player.ign.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, players]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setShowSearchResults(false);
    // In a real implementation, this would navigate to search results page
  };
  
  const handlePlayerClick = (player: Player) => {
    setSearchQuery('');
    setShowSearchResults(false);
    // In a real implementation, this would open the player modal
    console.log('Clicked on player:', player);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="pt-8 pb-2">
      <motion.nav 
        className={cn(
          "navbar rounded-xl bg-dark-surface/40 backdrop-blur-lg border border-white/10",
          scrolled ? "shadow-xl" : "shadow-lg"
        )}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          transition: "all 0.3s ease-in-out",
          padding: scrolled ? "0.5rem 1rem" : "1rem",
        }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Trophy size={22} className="mr-2 text-yellow-400" />
                <motion.h1 
                  className="logo-text font-bold text-lg md:text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  MCBE TIERS
                </motion.h1>
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
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/staff" 
                  className={cn(
                    "flex items-center text-white/80 hover:text-white transition-colors duration-200",
                    activePage === "staff" && "text-white font-medium"
                  )}
                >
                  <Users size={18} className="mr-2" />
                  <span>Our Team</span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                <motion.div
                  animate={{
                    width: isSearchFocused ? '240px' : '200px', 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Input
                    type="text"
                    placeholder="Search player..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      setIsSearchFocused(false);
                      // Delay hiding results to allow for clicks
                      setTimeout(() => setShowSearchResults(false), 200);
                    }}
                    className="pl-9 pr-3 py-2 bg-dark-surface/60 border-white/10 focus:border-white/30 rounded-lg text-white/80 placeholder:text-white/40 h-9"
                  />
                </motion.div>
                <Search size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                
                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showSearchResults && searchResults.length > 0 && (
                    <motion.div 
                      className="absolute top-full left-0 right-0 mt-1 bg-dark-surface/90 backdrop-blur-md border border-white/10 rounded-md overflow-hidden shadow-lg z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ul className="divide-y divide-white/5">
                        {searchResults.map(player => (
                          <li 
                            key={player.id}
                            className="px-4 py-2 hover:bg-white/5 cursor-pointer"
                            onClick={() => handlePlayerClick(player)}
                          >
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gray-700 mr-2 overflow-hidden">
                                <img 
                                  src={player.avatar_url || `https://crafthead.net/avatar/${player.ign}`} 
                                  alt={player.ign}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{player.ign}</p>
                                <p className="text-white/50 text-xs">
                                  {player.region || 'Unknown'} • {player.global_points || 0} pts
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
              
              <motion.a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-red-500 transition-colors duration-200"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <Youtube size={20} />
              </motion.a>
              
              <motion.a 
                href="https://discord.gg" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/70 hover:text-indigo-400 transition-colors duration-200"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle size={20} />
              </motion.a>
              
              <Link to="/admin">
                <Button 
                  size="sm" 
                  variant="outline"
                  className={cn(
                    "border-white/10 hover:border-white/30 bg-transparent hover:bg-transparent",
                    activePage === "admin" && "border-blue-400/50 text-blue-400"
                  )}
                >
                  Admin
                </Button>
              </Link>
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
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  setIsSearchFocused(false);
                  // Delay hiding results to allow for clicks
                  setTimeout(() => setShowSearchResults(false), 200);
                }}
                className="pl-9 pr-3 py-2 bg-dark-surface/60 border-white/10 focus:border-white/30 rounded-lg text-white/80 placeholder:text-white/40 w-full h-9"
              />
              <Search size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
              
              {/* Mobile Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div 
                    className="absolute top-full left-0 right-0 mt-1 bg-dark-surface/90 backdrop-blur-md border border-white/10 rounded-md overflow-hidden shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ul className="divide-y divide-white/5">
                      {searchResults.map(player => (
                        <li 
                          key={player.id}
                          className="px-4 py-2 hover:bg-white/5 cursor-pointer"
                          onClick={() => handlePlayerClick(player)}
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-gray-700 mr-2 overflow-hidden">
                              <img 
                                src={player.avatar_url || `https://crafthead.net/avatar/${player.ign}`}
                                alt={player.ign}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{player.ign}</p>
                              <p className="text-white/50 text-xs">
                                {player.region || 'Unknown'} • {player.global_points || 0} pts
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Game Mode Selector */}
          <div className="py-2 border-t border-white/10 overflow-x-auto">
            <GameModeSelector selectedMode={selectedMode} onSelectMode={onSelectMode} />
          </div>
          
          {/* Mobile Navigation Menu */}
          <AnimatePresence>
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
                  
                  <Link 
                    to="/staff" 
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white",
                      activePage === "staff" && "text-white bg-white/5"
                    )}
                  >
                    <Users size={18} className="mr-3" />
                    <span>Our Team</span>
                  </Link>
                  
                  <Link 
                    to="/about" 
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white",
                      activePage === "about" && "text-white bg-white/5"
                    )}
                  >
                    <Info size={18} className="mr-3" />
                    <span>About</span>
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
                  
                  <Link 
                    to="/admin" 
                    className={cn(
                      "flex items-center p-2 rounded-md hover:bg-white/10 text-white/80 hover:text-white",
                      activePage === "admin" && "text-white bg-white/5"
                    )}
                  >
                    <span>Admin</span>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </div>
  );
}
