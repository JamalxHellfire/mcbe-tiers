
import React from 'react';
import { Trophy, Shield } from 'lucide-react';
import { PlayerRow } from './PlayerRow';
import { motion } from 'framer-motion';
import { useGamemodeTiers } from '@/hooks/useGamemodeTiers';
import { GameMode } from '@/services/playerService';

interface TierGridProps {
  selectedMode: string;
  onPlayerClick: (player: any) => void;
}

export function TierGrid({ selectedMode, onPlayerClick }: TierGridProps) {
  const { tierData, loading, error } = useGamemodeTiers(selectedMode as GameMode);
  
  // All 5 tiers
  const tiers = [1, 2, 3, 4, 5];
  
  return (
    <div className="space-y-8 md:space-y-12 pb-8">
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse">Loading tier data...</div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-400">
          Error loading tier data: {error}
        </div>
      ) : (
        /* Horizontal tier row display */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          {tiers.map((tier) => {
            // Combine high and low tier players for display
            const highTierKey = `HT${tier}` as keyof typeof tierData;
            const lowTierKey = `LT${tier}` as keyof typeof tierData;
            const highTierPlayers = tierData[highTierKey] || [];
            const lowTierPlayers = tierData[lowTierKey] || [];
            
            // Sort players by points within each tier
            const sortedPlayers = [...highTierPlayers, ...lowTierPlayers]
              .map(player => ({
                ...player,
                subtier: highTierPlayers.some(p => p.id === player.id) ? 'High' : 'Low',
              }))
              .sort((a, b) => (b.global_points || 0) - (a.global_points || 0));
            
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
                        {sortedPlayers.length}
                      </div>
                    </div>
                  </div>
                  
                  {sortedPlayers.length > 0 ? (
                    <div className="grid grid-cols-1 divide-y divide-white/5">
                      {sortedPlayers.map((player, playerIndex) => (
                        <PlayerRow 
                          key={player.id} 
                          player={{
                            ...player,
                            tier: tier,
                            points: player.global_points || 0,
                            badge: player.subtier === 'High' ? `HT${tier} Player` : `LT${tier} Player`,
                            displayName: player.ign,
                            avatar: player.avatar_url || `https://crafthead.net/avatar/MHF_Steve${playerIndex}`
                          }} 
                          onClick={() => onPlayerClick(player)} 
                          delay={playerIndex * 0.05}
                          compact={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-white/20 text-sm">
                      No players in this tier
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
