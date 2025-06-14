
import React, { useState } from 'react';
import { Trophy, Shield, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamemodeTiers } from '@/hooks/useGamemodeTiers';
import { GameMode } from '@/services/playerService';
import { Button } from '@/components/ui/button';
import { toDatabaseGameMode } from '@/utils/gamemodeCasing';
import { RankBadge, getRankByPoints } from '@/components/RankBadge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';

interface TierGridProps {
  selectedMode: string;
  onPlayerClick: (player: any) => void;
}

export function TierGrid({ selectedMode, onPlayerClick }: TierGridProps) {
  // Convert the selectedMode to the correct database format
  const databaseGameMode = toDatabaseGameMode(selectedMode);
  const { tierData, loading, error } = useGamemodeTiers(databaseGameMode);
  
  // Pagination state
  const [tierVisibility, setTierVisibility] = useState({
    1: { count: 10, loadMore: true },
    2: { count: 10, loadMore: true },
    3: { count: 10, loadMore: true },
    4: { count: 10, loadMore: true },
    5: { count: 10, loadMore: true },
    retired: { count: 10, loadMore: true }
  });
  
  const [showRetired, setShowRetired] = useState(false);
  
  // Load more players for a specific tier
  const loadMoreForTier = (tier: number | 'retired') => {
    setTierVisibility(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        count: prev[tier].count + 10,
      }
    }));
  };
  
  // All 5 tiers
  const tiers = [1, 2, 3, 4, 5];
  
  // Container variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="space-y-4 md:space-y-6 pb-8">
      {/* Toggle for Retired Players */}
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRetired(!showRetired)}
          className="text-sm"
        >
          {showRetired ? "Hide Retired Players" : "Show Retired Players"}
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse">Loading tier data...</div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-400">
          Error loading tier data: {error}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedMode}-grid`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6"
          >
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
                .sort((a, b) => {
                  // Ensure we're comparing numbers by converting if needed
                  const pointsA = typeof a.global_points === 'string' 
                    ? parseFloat(a.global_points) 
                    : (a.global_points || 0);
                  const pointsB = typeof b.global_points === 'string' 
                    ? parseFloat(b.global_points) 
                    : (b.global_points || 0);
                  return pointsB - pointsA;
                });
                
              const visibleCount = tierVisibility[tier].count;
              const visiblePlayers = sortedPlayers.slice(0, visibleCount);
              const hasMore = sortedPlayers.length > visibleCount;
              
              return (
                <motion.div
                  key={tier}
                  variants={itemVariants}
                  className={`tier-column tier-${tier}`}
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
                    
                    {visiblePlayers.length > 0 ? (
                      <div className="space-y-0">
                        <div className="grid grid-cols-1 divide-y divide-white/5">
                          <AnimatePresence>
                            {visiblePlayers.map((player, playerIndex) => {
                              const playerPoints = typeof player.global_points === 'string' 
                                ? Number(player.global_points) || 0 
                                : player.global_points || 0;
                              const playerRank = getRankByPoints(playerPoints);
                              
                              return (
                                <motion.div
                                  key={player.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.3, delay: playerIndex * 0.03 }}
                                >
                                  <div className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors" onClick={() => onPlayerClick(player)}>
                                    <div className="flex items-center gap-3">
                                      {/* Fixed skin rendering with proper avatar handling */}
                                      <div className="relative">
                                        <Avatar className="w-8 h-8 border border-white/20">
                                          <AvatarImage 
                                            src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                                            alt={player.ign}
                                            className="object-cover object-center scale-110"
                                            onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                                          />
                                          <AvatarFallback className="bg-gray-700 text-white text-xs font-bold">
                                            {player.ign?.charAt(0) || "?"}
                                          </AvatarFallback>
                                        </Avatar>
                                        
                                        {/* Rank badge overlay */}
                                        <div className="absolute -bottom-1 -right-1">
                                          <RankBadge 
                                            rank={playerRank} 
                                            size="sm" 
                                            showGlow={false}
                                            animated={false}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium">{player.ign}</span>
                                        <span className={`text-xs ${
                                          player.subtier === 'High' ? `text-tier-${tier}` : 'text-white/50'
                                        }`}>
                                          {player.subtier === 'High' ? `HT${tier} Player` : `LT${tier} Player`}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center text-xs">
                                      <Trophy size={12} className="mr-1 text-yellow-400" />
                                      <span>{playerPoints}</span>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                          
                          {hasMore && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="py-3 text-center"
                            >
                              <Button 
                                variant="ghost" 
                                onClick={() => loadMoreForTier(tier)}
                                size="sm"
                                className="text-xs flex items-center gap-1"
                              >
                                Load More <ChevronDown size={14} />
                              </Button>
                            </motion.div>
                          )}
                        </div>
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
          </motion.div>
          
          {/* Retired Players Section */}
          {showRetired && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 pt-6 border-t border-white/10"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-400">Retired Players</h2>
              
              <div className="bg-dark-surface/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/5">
                <div className="tier-header bg-dark-surface/70 border-b border-white/5 py-3 px-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-400 font-bold flex items-center">
                      <Trophy className="mr-2" size={18} />
                      RETIRED
                    </h3>
                    <div className="flex items-center text-xs text-white/40">
                      <Shield size={14} className="mr-1" />
                      {(tierData["Retired"] || []).length}
                    </div>
                  </div>
                </div>
                
                {tierData["Retired"] && tierData["Retired"].length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-white/5">
                    <AnimatePresence>
                      {tierData["Retired"]
                        .slice(0, tierVisibility.retired.count)
                        .map((player, playerIndex) => {
                          const playerPoints = typeof player.global_points === 'string' 
                            ? parseFloat(player.global_points) || 0 
                            : player.global_points || 0;
                          const playerRank = getRankByPoints(playerPoints);
                          
                          return (
                            <motion.div
                              key={player.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3, delay: playerIndex * 0.03 }}
                            >
                              <div className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors" onClick={() => onPlayerClick(player)}>
                                <div className="flex items-center gap-3">
                                  {/* Fixed skin rendering for retired players */}
                                  <div className="relative">
                                    <Avatar className="w-8 h-8 border border-white/20">
                                      <AvatarImage 
                                        src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                                        alt={player.ign}
                                        className="object-cover object-center scale-110"
                                        onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                                      />
                                      <AvatarFallback className="bg-gray-700 text-white text-xs font-bold">
                                        {player.ign?.charAt(0) || "?"}
                                      </AvatarFallback>
                                    </Avatar>
                                    
                                    {/* Rank badge overlay */}
                                    <div className="absolute -bottom-1 -right-1">
                                      <RankBadge 
                                        rank={playerRank} 
                                        size="sm" 
                                        showGlow={false}
                                        animated={false}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">{player.ign}</span>
                                    <span className="text-xs text-gray-400">Retired Player</span>
                                  </div>
                                </div>
                                <div className="flex items-center text-xs">
                                  <Trophy size={12} className="mr-1 text-yellow-400" />
                                  <span>{playerPoints}</span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                    </AnimatePresence>
                    
                    {tierData["Retired"] && 
                     tierData["Retired"].length > tierVisibility.retired.count && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-3 text-center col-span-3"
                      >
                        <Button 
                          variant="ghost" 
                          onClick={() => loadMoreForTier('retired')}
                          size="sm"
                          className="text-xs flex items-center gap-1"
                        >
                          Load More <ChevronDown size={14} />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-white/20 text-sm">
                    No retired players in this gamemode
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
