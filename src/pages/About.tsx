
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TeamMemberCard } from '../components/TeamMemberCard';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const [selectedMode, setSelectedMode] = useState('overall');
  const navigate = useNavigate();
  
  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    navigate('/');
  };
  
  const founders = [
    { name: "Ace Jamal", role: "Main Founder", avatar: "https://crafthead.net/avatar/Steve" },
    { name: "Nednoxx", role: "2nd Main Founder", avatar: "https://crafthead.net/avatar/Steve" },
    { name: "Ziya", role: "Co-Founder", avatar: "https://crafthead.net/avatar/Steve" }
  ];
  
  const ceos = [
    { name: "Sabuj", role: "CEO", avatar: "https://crafthead.net/avatar/Steve" },
    { name: "Zyric", role: "CEO", avatar: "https://crafthead.net/avatar/Steve" }
  ];
  
  const directors = [
    { name: "Lightning Gamer", role: "Head Director", avatar: "https://crafthead.net/avatar/Steve" },
    { name: "Alpha Hade", role: "Managing Director", avatar: "https://crafthead.net/avatar/Steve" },
    { name: "Donkischan", role: "Security Director", avatar: "https://crafthead.net/avatar/Steve" },
    { name: "Shinobu", role: "Events Director", avatar: "https://crafthead.net/avatar/Steve" },
    { name: "Ghost2Freaky", role: "Partnership Director", avatar: "https://crafthead.net/avatar/Steve" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <div className="pt-4 px-4 md:px-8">
        <Navbar selectedMode={selectedMode} onSelectMode={handleModeChange} navigate={navigate} activePage="about" />
      </div>
      
      <main className="flex-grow">
        <div className="content-container py-8 md:py-12">
          <h1 className="section-heading mb-8 md:mb-10">About MCBE TIERS</h1>
          
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-white/80 text-lg mb-6">
              MCBE TIERS is the premier competitive ranking platform for Minecraft Bedrock Edition players.
              Our mission is to recognize and showcase the best talent across all game modes.
            </p>
            <p className="text-white/60">
              Founded in 2025, we've grown to become the standard for competitive rankings in the MCBE community.
            </p>
          </div>
          
          <div className="space-y-16">
            {/* Founders Section */}
            <section>
              <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Founders</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {founders.map((member, index) => (
                  <TeamMemberCard key={index} member={member} />
                ))}
              </div>
            </section>
            
            {/* CEOs Section */}
            <section>
              <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">CEOs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {ceos.map((member, index) => (
                  <TeamMemberCard key={index} member={member} />
                ))}
              </div>
            </section>
            
            {/* Directors Section */}
            <section>
              <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Directors</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {directors.map((member, index) => (
                  <TeamMemberCard key={index} member={member} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
