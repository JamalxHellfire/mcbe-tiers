
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PlayerRowProps {
  player: {
    id: string;
    name?: string;
    ign?: string;
    displayName?: string;
    region?: string;
    avatar?: string;
    avatar_url?: string;
    tier: number;
    subtier?: string;
    points: number;
    badge: string;
  };
  onClick: () => void;
  delay?: number;
  compact?: boolean;
}

export function PlayerRow({ player, onClick, delay = 0, compact = false }: PlayerRowProps) {
  const getRegionColor = (region?: string) => {
    switch(region) {
      case 'NA': return 'border-red-400/30';
      case 'EU': return 'border-green-400/30';
      case 'ASIA': return 'border-blue-400/30';
      case 'OCE': return 'border-purple-400/30';
      case 'SA': return 'border-yellow-400/30';
      case 'AF': return 'border-orange-400/30';
      default: return 'border-white/20';
    }
  };

  const getBadgeColor = (badge: string) => {
    if (badge.includes('Master')) return 'text-yellow-400';
    if (badge.includes('Ace')) return 'text-orange-400';
    if (badge.includes('Cadet')) return 'text-purple-400';
    return 'text-blue-400';
  };
  
  const displayName = player.displayName || player.ign || player.name || '';
  const avatarUrl = player.avatar_url || player.avatar;
  
  return (
    <motion.div 
      className={cn(
        "flex items-center justify-between py-3 hover:bg-white/5 transition-colors cursor-pointer",
        compact ? "px-2" : "px-4"
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
                getRegionColor(player.region),
                compact ? "h-8 w-8 mr-2" : "h-10 w-10 mr-3"
              )}>
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback>{displayName.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>Region: {player.region || 'Unknown'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div>
          <div className={cn("font-medium", compact ? "text-sm" : "text-base")}>
            {displayName}
          </div>
          {!compact && (
            <div className="flex items-center mt-1">
              {player.region && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded mr-2",
                  player.region === 'NA' ? 'bg-red-900/30 text-red-400' : 
                  player.region === 'EU' ? 'bg-green-900/30 text-green-400' :
                  player.region === 'ASIA' ? 'bg-blue-900/30 text-blue-400' : 
                  player.region === 'OCE' ? 'bg-purple-900/30 text-purple-400' :
                  player.region === 'SA' ? 'bg-yellow-900/30 text-yellow-400' :
                  player.region === 'AF' ? 'bg-orange-900/30 text-orange-400' :
                  'bg-gray-800/30 text-gray-400'
                )}>
                  {player.region}
                </span>
              )}
              <span className="text-xs text-white/50 flex items-center">
                <Trophy size={12} className="text-yellow-500 mr-1" />
                {player.points} pts
              </span>
            </div>
          )}
          {!compact && (
            <span className={cn(
              "text-xs flex items-center mt-1",
              getBadgeColor(player.badge)
            )}>
              <Award size={12} className="mr-1" />
              {player.badge}
            </span>
          )}
          {compact && player.region && (
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded inline-block mt-1",
              player.region === 'NA' ? 'bg-red-900/30 text-red-400' : 
              player.region === 'EU' ? 'bg-green-900/30 text-green-400' :
              player.region === 'ASIA' ? 'bg-blue-900/30 text-blue-400' : 
              player.region === 'OCE' ? 'bg-purple-900/30 text-purple-400' :
              player.region === 'SA' ? 'bg-yellow-900/30 text-yellow-400' :
              player.region === 'AF' ? 'bg-orange-900/30 text-orange-400' :
              'bg-gray-800/30 text-gray-400'
            )}>
              {player.region}
            </span>
          )}
        </div>
      </div>
      
      {compact ? (
        <span className="text-xs text-white/50">
          {player.points}
        </span>
      ) : (
        <div className="flex items-center">
          <span className={cn(
            "text-xs font-medium",
            `text-tier-${player.tier}`
          )}>
            {player.subtier || ''} T{player.tier}
          </span>
        </div>
      )}
    </motion.div>
  );
}
