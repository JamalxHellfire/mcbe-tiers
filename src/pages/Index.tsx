
import React from 'react';
import { Navbar } from '../components/Navbar';
import { TierGrid } from '../components/TierGrid';
import { Footer } from '../components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <div className="py-12">
          <h1 className="section-heading animate-fade-in">
            Minecraft Bedrock Edition Player Rankings
          </h1>
          
          {/* Tier Grid */}
          <TierGrid />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
