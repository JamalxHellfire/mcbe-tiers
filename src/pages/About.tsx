
import React from 'react';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar />
      
      <main className="flex-grow">
        <div className="content-container py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="section-heading mb-6">About MCBE TIERS</h1>
            
            <div className="space-y-8 text-white/80">
              <section>
                <h2 className="text-xl font-bold mb-3 text-white">Our Mission</h2>
                <p>
                  MCBE TIERS aims to create a standardized, transparent ranking system for Minecraft Bedrock Edition PvP players. Our goal is to provide a fair and comprehensive tiering system that accurately represents player skill across various gamemodes.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-3 text-white">How Rankings Work</h2>
                <p>
                  Players are ranked across 8 different gamemodes: Crystal, Sword, SMP, UHC, Axe, NethPot, Bedwars, and Mace. Each player is assigned a tier in each gamemode, from Tier 5 (beginner) to Tier 1 (elite). Each tier is further divided into High and Low subdivisions.
                </p>
                <p className="mt-3">
                  Points are awarded based on tier placement:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><span className="text-tier-1 font-medium">HT1</span>: 50 points</li>
                  <li><span className="text-tier-1 font-medium">LT1</span>: 45 points</li>
                  <li><span className="text-tier-2 font-medium">HT2</span>: 40 points</li>
                  <li><span className="text-tier-2 font-medium">LT2</span>: 35 points</li>
                  <li><span className="text-tier-3 font-medium">HT3</span>: 30 points</li>
                  <li><span className="text-tier-3 font-medium">LT3</span>: 25 points</li>
                  <li><span className="text-tier-4 font-medium">HT4</span>: 20 points</li>
                  <li><span className="text-tier-4 font-medium">LT4</span>: 15 points</li>
                  <li><span className="text-tier-5 font-medium">HT5</span>: 10 points</li>
                  <li><span className="text-tier-5 font-medium">LT5</span>: 5 points</li>
                  <li><span className="text-gray-400 font-medium">Retired</span>: 0 points</li>
                </ul>
                <p className="mt-3">
                  The overall ranking is calculated by summing the points earned across all gamemodes, with a maximum possible score of 400 points.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-3 text-white">Development</h2>
                <div className="bg-dark-surface/30 p-6 rounded-xl border border-white/10">
                  <p className="text-center italic">
                    This project is being developed by Azreal Jamal — a solo developer, researcher, and young entrepreneur.
                  </p>
                </div>
              </section>
              
              <section>
                <h2 className="text-xl font-bold mb-3 text-white">Contact</h2>
                <p>
                  For questions, suggestions, or tier submissions, please reach out to us via:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Discord: MCBETiers#0001</li>
                  <li>Email: contact@mcbetiers.com</li>
                  <li>Twitter: @MCBETiers</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
