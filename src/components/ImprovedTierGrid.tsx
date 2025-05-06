
import React, { useState, useEffect } from 'react';
import { Trophy, Shield } from 'lucide-react';
import { PlayerRow } from './PlayerRow';
import { motion } from 'framer-motion';
import { fetchGamemodeScoresByGamemode } from '@/api/supabase';
import { GamemodeScore } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ImprovedTierGridProps {
  selectedMode: string;
  onPlayerClick: (player: any) => void;
}

export function ImprovedTierGrid({ selectedMode, onPlayerClick }: ImprovedTierGridProps) {
  const [scores, setScores] = useState<GamemodeScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Main tier levels (matching the reference image)
  const mainTiers = ["TIER 1", "TIER 2", "TIER 3", "TIER 4", "TIER 5"];
  
  // Group by internal tiers (HT1, LT1, etc)
  const internalTiers = [
    { display: "TIER 1", internals: ["HT1", "LT1"] },
    { display: "TIER 2", internals: ["HT2", "LT2"] },
    { display: "TIER 3", internals: ["HT3", "LT3"] },
    { display: "TIER 4", internals: ["HT4", "LT4"] },
    { display: "TIER 5", internals: ["HT5", "LT5"] }
  ];
  
  useEffect(() => {
    // Reset state when gamemode changes
    setIsLoading(true);
    setError(null);
    
    const loadData = async () => {
      try {
        // Get scores for the selected gamemode
        const gamemodeScores = await fetchGamemodeScoresByGamemode(selectedMode);
        setScores(gamemodeScores);
      } catch (err) {
        console.error("Error fetching tier data:", err);
        setError("Failed to load tier data. Please try again.");
        toast.error("Failed to load tier data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Subscribe to realtime changes for scores
    const scoresSubscription = supabase
      .channel('gamemode-scores-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'gamemode_scores',
        filter: `gamemode=eq.${selectedMode}`
      }, () => {
        loadData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(scoresSubscription);
    };
  }, [selectedMode]);
  
  // Group scores by tier level
  const getScoresForDisplayTier = (tier: string) => {
    return scores.filter(score => score.display_tier === tier);
  };
  
  // Group scores by internal tier (HT1, LT1, etc)
  const getScoresForInternalTier = (internalTier: string) => {
    return scores.filter(score => score.internal_tier === internalTier);
  };

  const renderTopTierHeaders = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 mb-6">
      {mainTiers.map((tier, i) => (
        <motion.div
          key={tier}
          className="bg-dark-surface/40 backdrop-blur-md rounded-lg overflow-hidden border border-white/5 py-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <div className="flex items-center justify-center">
            <Trophy className={`mr-2 text-tier-${tier.split(' ')[1]}`} size={18} />
            <h3 className={`text-tier-${tier.split(' ')[1]} font-bold`}>
              {tier}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
  
  return (
    <div className="space-y-8 md:space-y-12 pb-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        {selectedMode} Rankings
      </h2>
      
      {renderTopTierHeaders()}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          {internalTiers.map((tierGroup) => (
            <div key={tierGroup.display} className="space-y-4">
              {tierGroup.internals.map((internalTier) => (
                <div key={internalTier} className="bg-dark-surface/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/5 h-full">
                  <div className="bg-dark-surface/70 border-b border-white/5 p-3">
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="p-2 space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-8">
          <p className="text-red-400">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 rounded-md text-white"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          {internalTiers.map((tierGroup) => (
            <div key={tierGroup.display} className="space-y-4">
              {tierGroup.internals.map((internalTier) => {
                const tierScores = getScoresForInternalTier(internalTier);
                
                return (
                  <motion.div
                    key={internalTier}
                    className={`tier-column tier-${internalTier}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: internalTiers.indexOf(tierGroup) * 0.1 }}
                  >
                    <div className="bg-dark-surface/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/5 h-full">
                      <div className={cn(
                        "tier-header border-b border-white/5 py-3 px-4",
                        internalTier.startsWith('HT') ? "bg-dark-surface/90" : "bg-dark-surface/70"
                      )}>
                        <div className="flex items-center justify-between">
                          <h3 className={`text-tier-${tierGroup.display.split(' ')[1]} font-bold flex items-center`}>
                            <Trophy className="mr-2" size={18} />
                            {internalTier}
                          </h3>
                          <div className="flex items-center text-xs text-white/40">
                            <Shield size={14} className="mr-1" />
                            {tierScores.length}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 divide-y divide-white/5">
                        {tierScores.length === 0 ? (
                          <div className="p-4 text-center text-white/40 text-sm">
                            No players in this tier
                          </div>
                        ) : (
                          tierScores.map((score, playerIndex) => (
                            <PlayerRow 
                              key={score.id} 
                              playerScore={score}
                              onClick={() => onPlayerClick({ id: score.player_id, gamemode: selectedMode })} 
                              delay={playerIndex * 0.05}
                              compact={true}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
