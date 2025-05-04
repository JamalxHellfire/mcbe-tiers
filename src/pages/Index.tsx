
import React from 'react';
import { Navbar } from '../components/Navbar';
import { TierGrid } from '../components/TierGrid';
import { Footer } from '../components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar />
      
      <main className="flex-grow">
        {/* Main content area */}
        <div className="py-6">
          <TierGrid />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
