import React from 'react';
import { GameMode, Player } from '@/services/playerService';
import { useGamemodeTiers } from '@/hooks/useGamemodeTiers';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPlayerRank } from '@/utils/rankUtils';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';

interface TierGridProps {
  selectedMode: GameMode;
  onPlayerClick: (player: any) => void;
}

export function TierGrid({ selectedMode, onPlayerClick }: TierGridProps) {
  const { tierData, loading, error } = useGamemodeTiers(selectedMode);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-24 text-red-400">
        Error loading tier data: {error}
      </div>
    );
  }
  
  const tiers = [
    { name: 'Tier 1', high: 'HT1', low: 'LT1', color: 'text-tier-1' },
    { name: 'Tier 2', high: 'HT2', low: 'LT2', color: 'text-tier-2' },
    { name: 'Tier 3', high: 'HT3', low: 'LT3', color: 'text-tier-3' },
    { name: 'Tier 4', high: 'HT4', low: 'LT4', color: 'text-tier-4' },
    { name: 'Tier 5', high: 'HT5', low: 'LT5', color: 'text-tier-5' },
    { name: 'Retired', high: 'Retired', low: 'Retired', color: 'text-gray-400' },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tiers.map((tier, index) => (
        <div key={index} className="bg-dark-surface/40 backdrop-blur-md rounded-xl p-4 border border-white/5">
          <h2 className={`text-xl font-bold mb-3 ${tier.color} text-center`}>{tier.name}</h2>
          
          {/* High Tier */}
          {tierData[tier.high] && tierData[tier.high].length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-md mb-2 text-white/80">High</h3>
              <div className="space-y-2">
                {tierData[tier.high].map((player: Player) => {
                  // The issue is on line 238, where player.global_points is being passed as a string to a function expecting a number
                  // We need to convert it to a number if it exists
                  const playerPoints = player && player.global_points ? 
                    Number(player.global_points) : // Convert string to number
                    0; // Default to 0 if not available
                  
                  const rankInfo = getPlayerRank(playerPoints);
                  
                  return (
                    <motion.div
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-md bg-black/20 hover:bg-black/40 cursor-pointer"
                      onClick={() => onPlayerClick(player)}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={getAvatarUrl(player.avatar_url, player.java_username)}
                            alt={player.ign}
                            onError={handleAvatarError}
                          />
                          <AvatarFallback>{player.ign.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium">{player.ign}</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">{rankInfo.title}</Badge>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Low Tier */}
          {tierData[tier.low] && tierData[tier.low].length > 0 && tier.high !== tier.low && (
            <div>
              <h3 className="font-semibold text-md mb-2 text-white/80">Low</h3>
              <div className="space-y-2">
                {tierData[tier.low].map((player: Player) => {
                  // The issue is on line 238, where player.global_points is being passed as a string to a function expecting a number
                  // We need to convert it to a number if it exists
                  const playerPoints = player && player.global_points ? 
                    Number(player.global_points) : // Convert string to number
                    0; // Default to 0 if not available
                    
                  const rankInfo = getPlayerRank(playerPoints);
                  
                  return (
                    <motion.div
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-md bg-black/20 hover:bg-black/40 cursor-pointer"
                      onClick={() => onPlayerClick(player)}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={getAvatarUrl(player.avatar_url, player.java_username)}
                            alt={player.ign}
                            onError={handleAvatarError}
                          />
                          <AvatarFallback>{player.ign.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium">{player.ign}</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">{rankInfo.title}</Badge>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Retired Tier */}
          {tier.name === 'Retired' && tierData[tier.high] && tierData[tier.high].length > 0 && (
            <div>
              <div className="space-y-2">
                {tierData[tier.high].map((player: Player) => {
                  // The issue is on line 238, where player.global_points is being passed as a string to a function expecting a number
                  // We need to convert it to a number if it exists
                  const playerPoints = player && player.global_points ? 
                    Number(player.global_points) : // Convert string to number
                    0; // Default to 0 if not available
                    
                  const rankInfo = getPlayerRank(playerPoints);
                  
                  return (
                    <motion.div
                      key={player.id}
                      className="flex items-center justify-between p-3 rounded-md bg-black/20 hover:bg-black/40 cursor-pointer"
                      onClick={() => onPlayerClick(player)}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={getAvatarUrl(player.avatar_url, player.java_username)}
                            alt={player.ign}
                            onError={handleAvatarError}
                          />
                          <AvatarFallback>{player.ign.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium">{player.ign}</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">{rankInfo.title}</Badge>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* No Players Message */}
          {(!tierData[tier.high] || tierData[tier.high].length === 0) && (!tierData[tier.low] || tierData[tier.low].length === 0) && (
            <div className="text-center text-white/60 py-4">
              No players in {tier.name} yet.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
