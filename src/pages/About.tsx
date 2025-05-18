
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Trophy, Shield, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
  const navigate = useNavigate();
  
  // Page is created but disabled - redirect to home
  React.useEffect(() => {
    navigate('/');
  }, [navigate]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode="overall"
        onSelectMode={() => {}}
        navigate={navigate}
      />
      
      <main className="flex-grow">
        <div className="content-container py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="section-heading mb-8 text-center">About MCBE TIERS</h1>
            
            <div className="bg-dark-surface/40 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/5">
              <div className="prose prose-invert max-w-none">
                <p className="text-xl font-medium mb-6">
                  Welcome to <span className="text-primary font-bold">MCBE TIERS</span>, the official Minecraft Bedrock PvP Tier List — curated and managed by <span className="text-primary font-bold">Rat Labs</span>, a visionary tech collective founded by passionate individuals who live and breathe competitive gaming. 🧠⚔️
                </p>
                
                <p className="mb-6">
                  This project is personally owned and led by <span className="text-primary font-bold">me</span>. Whether you're a casual player or an elite competitor, our mission is to provide a fair, structured, and constantly evolving tier system that recognizes skill across multiple PvP formats. 🎯
                </p>
                
                <div className="my-8">
                  <h3 className="text-xl font-bold mb-4">Currently Tested Gamemodes:</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="flex items-center">
                      <span className="mr-2">✴️</span> Crystal PvP
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🗡️</span> Sword PvP
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🪓</span> Axe PvP
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🌍</span> SMP PvP
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">❤️‍🔥</span> UHC
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🛏️</span> Bedwars
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">⚗️</span> Nethpot PvP
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🧪</span> Custom/Hybrid Modes
                    </li>
                  </ul>
                  <p className="mt-2 text-white/60 italic">Note: Mace PvP is not being tested at this time.</p>
                </div>
                
                <div className="my-8 p-5 border border-white/10 rounded-lg bg-white/5">
                  <h3 className="text-xl font-bold mb-3">Need Help? DM Me Anytime!</h3>
                  <p>
                    I take <span className="font-bold">community matters seriously</span> — your concerns will never be ignored. Whether I'm at a funeral or out with family, my laptop and phone stay close.<br />
                    <span className="font-bold">Expect a response within 24 hours.</span> ⏱️
                  </p>
                </div>
                
                <p className="mb-6">
                  I prioritize helping people over tradition, because building a transparent and supportive environment is what truly matters.<br />
                  Thank you for being part of this movement. 🫱🏼‍🫲🏼
                </p>
                
                <p className="text-right font-bold">
                  — Founder of MCBE TIERS | Owner of Rat Labs
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
