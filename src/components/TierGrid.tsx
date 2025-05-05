
import React from 'react';
import { Trophy, Shield } from 'lucide-react';
import { PlayerRow } from './PlayerRow';

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
      points: Math.floor(300 - ((tier - 1) * 50) - (i * 10)),
      badge: i < 2 ? 'Elite' : 'Pro'
    }));
  };
  
  // All 5 tiers
  const tiers = [1, 2, 3, 4, 5];
  
  return (
    <div className="space-y-8 md:space-y-12 pb-8">
      {/* Horizontal tier tabs */}
      <div className="flex flex-wrap gap-2 md:gap-3 justify-between mb-6">
        {tiers.map(tier => (
          <button 
            key={tier}
            className={`tier-tab tier-${tier} px-4 py-2 md:px-6 md:py-3 flex-1 flex items-center justify-center gap-2 bg-dark-surface/80 rounded-lg border border-white/5 hover:border-white/20 transition-all`}
          >
            <Trophy className={`text-tier-${tier} mr-1`} size={18} />
            <span className={`text-tier-${tier} font-bold`}>TIER {tier}</span>
          </button>
        ))}
      </div>
      
      {/* Tier content - display all tiers horizontally */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
        {tiers.map((tier) => {
          const players = getPlaceholderPlayers(tier);
          
          return (
            <div
              key={tier}
              className={`tier-column tier-${tier} animate-fade-in`}
            >
              <div className="bg-dark-surface/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/5">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
