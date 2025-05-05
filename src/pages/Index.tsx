
import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { TierGrid } from '../components/TierGrid';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Footer } from '../components/Footer';
import { PlayerModal } from '../components/PlayerModal';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [selectedMode, setSelectedMode] = useState('overall');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };
  
  const handlePlayerClick = (player: any) => {
    setSelectedPlayer(player);
    setIsPlayerModalOpen(true);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Future implementation will search for players
  };
  
  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <div className="pt-4 px-4 md:px-8">
        <Navbar selectedMode={selectedMode} onSelectMode={handleModeChange} navigate={navigate} />
        
        <div className="w-full max-w-md mx-auto mt-4 md:mt-2 md:absolute md:right-8 md:top-6 z-10">
          <form onSubmit={handleSearch} className="relative">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search player ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-2 bg-dark-surface/60 border-white/10 focus:border-white/30 rounded-lg text-white/80 placeholder:text-white/40"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className="text-white/40" />
            </div>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <kbd className="text-xs bg-black/20 px-1.5 py-0.5 rounded text-white/40 font-mono">/</kbd>
            </div>
          </form>
        </div>
      </div>
      
      <main className="flex-grow">
        <div className="content-container py-8 md:py-12">
          <h1 className="section-heading mb-8 md:mb-10">
            {selectedMode === 'overall' ? 'Player Rankings' : `${selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} Tier Rankings`}
          </h1>
          
          {/* Conditionally render layout based on selected mode */}
          {selectedMode === 'overall' ? (
            <LeaderboardTable onPlayerClick={handlePlayerClick} />
          ) : (
            <TierGrid selectedMode={selectedMode} onPlayerClick={handlePlayerClick} />
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Player Modal */}
      {selectedPlayer && (
        <PlayerModal
          isOpen={isPlayerModalOpen}
          onClose={() => setIsPlayerModalOpen(false)}
          player={selectedPlayer}
        />
      )}
    </div>
  );
};

export default Index;
