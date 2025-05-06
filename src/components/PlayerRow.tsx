
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Player, GamemodeScore } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface PlayerRowProps {
  playerScore: GamemodeScore;
  onClick: () => void;
  delay?: number;
  compact?: boolean;
  showGlobalRank?: boolean;
}

export function PlayerRow({ playerScore, onClick, delay = 0, compact = false, showGlobalRank = true }: PlayerRowProps) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarError, setAvatarError] = useState(false);
  
  useEffect(() => {
    const fetchPlayerDetails = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('id', playerScore.player_id)
          .single();
          
        if (error) throw error;
        setPlayer(data);
      } catch (err) {
        console.error('Error fetching player details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlayerDetails();
  }, [playerScore.player_id]);
  
  if (isLoading || !player) {
    return (
      <div className="py-3 px-4">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 rounded-full mr-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    );
  }
  
  const getRegionColor = (region: string) => {
    switch(region) {
      case 'NA': return 'border-red-400/30';
      case 'EU': return 'border-green-400/30';
      case 'ASIA': return 'border-blue-400/30';
      case 'OCE': return 'border-purple-400/30';
      case 'AF': return 'border-yellow-400/30';
      default: return 'border-white/20';
    }
  };
  
  // Get badge based on global rank or points
  const getBadge = () => {
    const points = player.global_points || 0;
    
    if (points > 300) return { name: 'Master', color: 'text-yellow-400' };
    if (points > 200) return { name: 'Ace', color: 'text-orange-400' };
    if (points > 100) return { name: 'Cadet', color: 'text-purple-400' };
    return { name: 'Rookie', color: 'text-blue-400' };
  };
  
  const badge = getBadge();
  
  const globalRank = player.global_points ? 
    Math.floor(1000 / (player.global_points + 10)) : // Mock calculation
    999;
  
  const handleAvatarError = () => {
    setAvatarError(true);
  };
  
  return (
    <motion.div 
      className={cn(
        "flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer",
        compact ? "py-3 px-2" : "py-4 px-4"
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className={cn(
                "border-2", 
                getRegionColor(player.region || ''),
                compact ? "h-8 w-8 mr-2" : "h-10 w-10 mr-3"
              )}>
                <AvatarImage 
                  src={avatarError ? '/default-avatar.png' : (player.avatar_url || `https://crafthead.net/avatar/${player.ign}`)} 
                  alt={player.ign} 
                  onError={handleAvatarError}
                />
                <AvatarFallback>{player.ign.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>Region: {player.region || 'Unknown'}</p>
              {player.device && <p>Device: {player.device}</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div>
          <div className={cn("font-medium flex items-center gap-1", compact ? "text-sm" : "text-base")}>
            {player.ign}
            {showGlobalRank && player.global_points && player.global_points > 0 && (
              <motion.span
                className="text-xs bg-yellow-600/20 text-yellow-400 px-1.5 rounded-sm flex items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: delay + 0.2, type: "spring" }}
              >
                <Trophy size={10} className="mr-0.5" />
                #{globalRank}
              </motion.span>
            )}
          </div>
          
          {!compact && (
            <div className="flex items-center mt-1">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded mr-2",
                player.region === 'NA' ? 'bg-red-900/30 text-red-400' : 
                player.region === 'EU' ? 'bg-green-900/30 text-green-400' :
                player.region === 'ASIA' ? 'bg-blue-900/30 text-blue-400' : 
                player.region === 'OCE' ? 'bg-purple-900/30 text-purple-400' :
                player.region === 'AF' ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-gray-900/30 text-gray-400'
              )}>
                {player.region || 'Unknown'}
              </span>
              <span className="text-xs text-white/50 flex items-center">
                <Trophy size={12} className="text-yellow-500 mr-1" />
                {playerScore.score} pts
              </span>
            </div>
          )}
          
          {!compact && (
            <span className={cn(
              "text-xs flex items-center mt-1",
              badge.color
            )}>
              <Award size={12} className="mr-1" />
              {badge.name}
            </span>
          )}
          
          {compact && (
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded inline-block mt-1",
              player.region === 'NA' ? 'bg-red-900/30 text-red-400' : 
              player.region === 'EU' ? 'bg-green-900/30 text-green-400' :
              player.region === 'ASIA' ? 'bg-blue-900/30 text-blue-400' : 
              player.region === 'OCE' ? 'bg-purple-900/30 text-purple-400' :
              player.region === 'AF' ? 'bg-yellow-900/30 text-yellow-400' :
              'bg-gray-900/30 text-gray-400'
            )}>
              {player.region || 'Unknown'}
            </span>
          )}
        </div>
      </div>
      
      {compact ? (
        <span className="text-xs text-white/50">
          {playerScore.score}
        </span>
      ) : (
        <div className="flex items-center">
          <span className={cn(
            "text-xs font-medium",
            `text-tier-${playerScore.display_tier.split(' ')[1]}`
          )}>
            {playerScore.internal_tier} {playerScore.display_tier}
          </span>
        </div>
      )}
    </motion.div>
  );
}
