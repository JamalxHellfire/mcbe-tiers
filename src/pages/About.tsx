
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
  const navigate = useNavigate();
  
  const handleModeChange = (mode: string) => {
    if (mode === 'overall') {
      navigate('/');
    } else {
      navigate(`/${mode.toLowerCase()}`);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode="overall" 
        onSelectMode={handleModeChange} 
        navigate={navigate}
        activePage="about"
      />
      
      <main className="flex-grow">
        <div className="content-container py-6 md:py-8">
          <motion.h1 
            className="section-heading mb-6 md:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About MCBE TIERS
          </motion.h1>
          
          <motion.div
            className="bg-dark-surface/40 backdrop-blur-md rounded-xl p-6 border border-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="space-y-6 text-white/80">
              <p>
                MCBE TIERS is the official Minecraft Bedrock PvP Tier List, providing rankings for players across different game modes and communities.
              </p>
              <p>
                Our mission is to recognize skilled players and promote competitive gameplay within the Minecraft Bedrock community.
              </p>
              <p>
                The tier list is maintained by a team of experienced players and admins who carefully evaluate player performance across various gameplay styles.
              </p>
              <h2 className="text-xl font-semibold mt-8 mb-4 text-white">Ranking System</h2>
              <p>
                Players are ranked across 5 tiers, with each tier having a High (HT) and Low (LT) subdivision. Rankings are determined by player performance, tournament results, and consistent gameplay quality.
              </p>
              <p>
                The MCBE TIERS system covers multiple game modes including Crystal, Sword, SMP, UHC, Axe, NethPot, Bedwars, and Mace combat styles.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
