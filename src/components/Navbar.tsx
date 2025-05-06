
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { SUPPORTED_GAMEMODES } from '@/types';

interface NavbarProps {
  selectedMode: string;
  onSelectMode: (mode: string) => void;
  navigate: any;
  activePage?: string;
  children?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  selectedMode, 
  onSelectMode, 
  navigate, 
  activePage, 
  children 
}) => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);
  
  const isActive = (page: string) => activePage === page;
  
  return (
    <header className="navbar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Trophy size={24} className="mr-2 text-yellow-500" />
            <a onClick={() => navigate('/')} className="logo-text cursor-pointer">
              MCBE TIERS
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              className={`px-3 py-2 rounded-md ${isActive('admin') ? 'bg-white/10' : ''}`}
              onClick={() => navigate('/admin')}
            >
              Admin
            </Button>
          </div>
          
          {/* Search bar (positioned center in desktop, moved to mobile menu on small screens) */}
          {!isMobile && children && (
            <div className="hidden md:flex items-center ml-auto mr-4">
              {children}
            </div>
          )}
          
          {/* Mobile Navigation Icon */}
          <div className="md:hidden flex items-center">
            {children && (
              <div className="mr-2">
                {children}
              </div>
            )}
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobile && mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-2 space-y-1"
          >
            <Button
              variant="ghost"
              className={`w-full text-left px-3 py-2 rounded-md ${isActive('admin') ? 'bg-white/10' : ''}`}
              onClick={() => {
                navigate('/admin');
                setMobileMenuOpen(false);
              }}
            >
              Admin
            </Button>
          </motion.div>
        )}
        
        {/* Game mode selector */}
        <div className={`pb-3 ${isMobile ? 'overflow-x-auto' : ''}`}>
          <div className="flex space-x-1 mt-3" style={{ minWidth: isMobile ? 'max-content' : 'auto' }}>
            {SUPPORTED_GAMEMODES.map((mode) => (
              <button
                key={mode}
                className={`game-mode-button ${mode === selectedMode ? 'active' : ''}`}
                onClick={() => onSelectMode(mode)}
              >
                {mode === 'overall' ? 'Overall' : mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
