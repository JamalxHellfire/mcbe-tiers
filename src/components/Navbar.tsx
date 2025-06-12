
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { GameModeSelector } from './GameModeSelector';
import { MobileNavMenu } from './MobileNavMenu';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  navigate: (path: string) => void;
}

export function Navbar({ selectedMode, onSelectMode, navigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGameModeOpen, setIsGameModeOpen] = useState(false);

  // Helper function to handle mode selection
  const handleModeSelect = (mode: string) => {
    onSelectMode(mode);
    if (mode === 'overall') {
      navigate('/');
    } else {
      navigate(`/${mode}`);
    }
  };

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">MC</span>
            </div>
            <span className="text-white font-bold text-xl group-hover:text-blue-400 transition-colors">
              MCLeaderboards
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Game Modes Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsGameModeOpen(!isGameModeOpen)}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 group"
              >
                Game Modes
                <ChevronDown className={`w-4 h-4 transition-transform ${isGameModeOpen ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              
              <AnimatePresence>
                {isGameModeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 shadow-xl border border-slate-700 z-50"
                  >
                    <GameModeSelector
                      selectedMode={selectedMode}
                      onSelectMode={(mode) => {
                        handleModeSelect(mode);
                        setIsGameModeOpen(false);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/admin"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors relative group"
            >
              Admin Panel
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        selectedMode={selectedMode}
        onSelectMode={onSelectMode}
        navigate={navigate}
      />

      {/* Click outside to close dropdown */}
      {isGameModeOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsGameModeOpen(false)}
        />
      )}
    </nav>
  );
}
