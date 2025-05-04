
import React from 'react';
import { Navbar } from '../components/Navbar';
import { TierGrid } from '../components/TierGrid';
import { Footer } from '../components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-background">
      <Navbar />
      <main className="flex-grow">
        <div className="py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 animate-fade-in">
            Minecraft Bedrock Edition Player Rankings
          </h1>
          <TierGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
