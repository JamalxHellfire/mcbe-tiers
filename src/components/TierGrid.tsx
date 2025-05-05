
import React, { useState, useEffect } from 'react';
import { Trophy, Shield } from 'lucide-react';
import { PlayerRow } from './PlayerRow';
import { motion } from 'framer-motion';
import { fetchGamemodeScoresByGamemode } from '@/api/supabase';
import { GamemodeScore, Player } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TierGridProps {
  selectedMode: string;
  onPlayerClick: (player: any) => void;
}

export function TierGrid({ selectedMode, onPlayerClick }: TierGridProps) {
  const [scores, setScores] = useState<GamemodeScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Tier levels to display in order (most skilled first)
  const tiers = ["TIER 1", "TIER 2", "TIER 3", "TIER 4", "TIER 5"];
  
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
  
  // Group scores by tier
  const getPlayersForTier = (tier: string) => {
    return scores.filter(score => score.display_tier === tier);
  };
  
  return (
    <div className="space-y-8 md:space-y-12 pb-8">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          {tiers.map((tier) => (
            <div key={tier} className="bg-dark-surface/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/5 h-full">
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
          {tiers.map((tier) => {
            const tierScores = getPlayersForTier(tier);
            
            return (
              <motion.div
                key={tier}
                className={`tier-column tier-${tier}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: tiers.indexOf(tier) * 0.1 }}
              >
                <div className="bg-dark-surface/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/5 h-full">
                  <div className="tier-header bg-dark-surface/70 border-b border-white/5 py-3 px-4">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-tier-${tier.split(' ')[1]} font-bold flex items-center`}>
                        <Trophy className="mr-2" size={18} />
                        {tier}
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
      )}
    </div>
  );
}
