
import React from 'react';
import { Trophy, Shield } from 'lucide-react';
import { PlayerRow } from './PlayerRow';
import { motion } from 'framer-motion';

interface TierGridProps {
  selectedMode: string;
  onPlayerClick: (player: any) => void;
}

export function TierGrid({ selectedMode, onPlayerClick }: TierGridProps) {
  // Placeholder data for players in each tier
  const getPlaceholderPlayers = (tier: number) => {
    const playerCount = 3 + Math.floor(Math.random() * 2); // 3-4 players per tier for demo
    return Array.from({ length: playerCount }, (_, i) => ({
      id: `player-${tier}-${i}`,
      name: `Player_T${tier}_${i+1}`,
      displayName: `Player T${tier} ${i+1}`,
      region: ['NA', 'EU', 'ASIA', 'OCE'][Math.floor(Math.random() * 4)],
      avatar: `https://crafthead.net/avatar/MHF_Steve${i}`,
      tier: tier,
      subtier: i < 2 ? 'High' : 'Low', // Internal subtier logic
      points: Math.floor(300 - ((tier - 1) * 50) - (i * 10)),
      badge: i < 2 ? 'Elite' : 'Pro'
    }));
  };
  
  // All 5 tiers
  const tiers = [1, 2, 3, 4, 5];
  
  return (
    <div className="space-y-8 md:space-y-12 pb-8">
      {/* Horizontal tier row display */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
        {tiers.map((tier) => {
          const players = getPlaceholderPlayers(tier);
          
          return (
            <motion.div
              key={tier}
              className={`tier-column tier-${tier}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: tier * 0.1 }}
            >
              <div className="bg-dark-surface/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/5 h-full">
                <div className="tier-header bg-dark-surface/70 border-b border-white/5 py-3 px-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-tier-${tier} font-bold flex items-center`}>
                      <Trophy className="mr-2" size={18} />
                      TIER {tier}
                    </h3>
                    <div className="flex items-center text-xs text-white/40">
                      <Shield size={14} className="mr-1" />
                      {players.length}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 divide-y divide-white/5">
                  {players.map((player, playerIndex) => (
                    <PlayerRow 
                      key={player.id} 
                      player={player} 
                      onClick={() => onPlayerClick(player)} 
                      delay={playerIndex * 0.05}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
