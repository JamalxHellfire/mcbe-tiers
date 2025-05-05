
import React from 'react';
import { Trophy, Shield } from 'lucide-react';
import { PlayerRow } from './PlayerRow';

interface TierGridProps {
  selectedMode: string;
  onPlayerClick: (player: any) => void;
}

export function TierGrid({ selectedMode, onPlayerClick }: TierGridProps) {
  // Array of 5 tiers
  const tiers = [1, 2, 3, 4, 5];
  
  // Placeholder data for players
  const getPlaceholderPlayers = (tier: number) => {
    const playerCount = 5 + Math.floor(Math.random() * 3);
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
  
  // Animation class for staggered tier appearance
  const getStaggeredAnimationClass = (index: number) => {
    return `animate-staggered-fade-${Math.min(index + 1, 5)}`;
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-8">
      {tiers.map((tier, index) => {
        const players = getPlaceholderPlayers(tier);
        
        return (
          <div
            key={tier}
            className={`tier-row tier-${tier} ${getStaggeredAnimationClass(index)}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="tier-header text-2xl md:text-3xl flex items-center">
                <Trophy className={`text-tier-${tier} mr-2`} size={24} />
                Tier {tier}
                <div className={`ml-3 px-3 py-1 rounded text-xs font-medium bg-tier-${tier}/20 text-tier-${tier}`}>
                  {players.length} Players
                </div>
              </h2>

              <div className="hidden md:flex items-center space-x-1">
                <span className="text-white/40 text-sm">{selectedMode} Mode</span>
                <Shield size={16} className="text-white/30" />
              </div>
            </div>

            <div className="bg-dark-surface/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/5">
              <div className="grid grid-cols-1 divide-y divide-white/5">
                {players.map((player, playerIndex) => (
                  <PlayerRow 
                    key={player.id} 
                    player={player} 
                    onClick={() => onPlayerClick(player)} 
                    delay={playerIndex * 0.05}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
