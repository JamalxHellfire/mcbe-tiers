
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const News = () => {
  const [selectedMode, setSelectedMode] = useState('overall');
  const navigate = useNavigate();
  
  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <div className="pt-4 px-4 md:px-8">
        <Navbar selectedMode={selectedMode} onSelectMode={handleModeChange} navigate={navigate} activePage="news" />
      </div>
      
      <main className="flex-grow">
        <div className="content-container py-8 md:py-12">
          <h1 className="section-heading mb-8 md:mb-10">News & Updates</h1>
          
          <div className="max-w-4xl mx-auto grid gap-6">
            <Card className="glass p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
              <p className="text-white/70">
                The News section is currently under development. Stay tuned for announcements, updates, and event information!
              </p>
            </Card>
            
            <div className="text-center text-white/50 text-sm italic mt-6">
              Future updates will include tournament announcements, ranking updates, and community events.
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
