
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { TierGrid } from '../components/TierGrid';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Footer } from '../components/Footer';

const Index = () => {
  const [selectedMode, setSelectedMode] = useState('overall');

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar selectedMode={selectedMode} onSelectMode={handleModeChange} />
      
      <main className="flex-grow">
        <div className="content-container py-8">
          <h1 className="section-heading mb-6">
            {selectedMode === 'overall' ? 'Player Rankings' : `${selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} Tier Ranks`}
          </h1>
          
          {/* Conditionally render layout based on selected mode */}
          {selectedMode === 'overall' ? (
            <LeaderboardTable />
          ) : (
            <TierGrid />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
