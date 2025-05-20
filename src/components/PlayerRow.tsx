
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GameModeIcon } from './GameModeIcon';
import { GameMode } from '@/services/playerService';
import { displayToGameMode } from '@/utils/gamemodeUtils';

interface PlayerRowProps {
  player: {
    id?: string;
    position?: number;
    displayName: string;
    avatar?: string;
    gameMode?: string;
    tier?: number | string;
    badge?: string;
    points?: number;
    country?: string;
    device?: string;
  };
  compact?: boolean;
  onClick?: () => void;
  delay?: number;
}

export function PlayerRow({ player, compact = false, onClick, delay = 0 }: PlayerRowProps) {
  // Convert gameMode string to proper GameMode type
  const gameMode = player.gameMode ? displayToGameMode(player.gameMode) : undefined;
  
  return (
    <motion.div
      className={cn(
        "flex items-center justify-between gap-2 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors",
        compact ? "" : "px-5 py-4"
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
    >
      <div className="flex items-center gap-3">
        {player.position && (
          <span className="text-white/40 text-sm font-mono min-w-[20px]">
            {player.position}
          </span>
        )}
        
        <Avatar className={cn("border-2 border-white/10", compact ? "h-8 w-8" : "h-10 w-10")}>
          <AvatarImage src={player.avatar} alt={player.displayName} />
          <AvatarFallback>
            {player.displayName ? player.displayName.charAt(0) : "?"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={cn("font-medium", compact ? "text-sm" : "text-base")}>
              {player.displayName}
            </span>
            
            {gameMode && (
              <span className="text-xs text-white/60 bg-white/10 px-1.5 py-0.5 rounded flex items-center">
                <GameModeIcon mode={gameMode} size="sm" className="h-3 w-3 mr-1" />
                {player.gameMode}
              </span>
            )}
          </div>
          
          {player.badge && (
            <div className="flex items-center text-xs">
              <span className={cn(
                player.tier === 1 || player.badge.includes('T1') ? "text-tier-1" :
                player.tier === 2 || player.badge.includes('T2') ? "text-tier-2" :
                player.tier === 3 || player.badge.includes('T3') ? "text-tier-3" :
                player.tier === 4 || player.badge.includes('T4') ? "text-tier-4" :
                player.tier === 5 || player.badge.includes('T5') ? "text-tier-5" :
                "text-white/50"
              )}>
                {player.badge}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        {player.points !== undefined && (
          <div className={cn(
            "flex items-center",
            compact ? "text-xs" : "text-sm"
          )}>
            <Trophy size={compact ? 12 : 14} className="mr-1 text-yellow-400" />
            <span>{player.points}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
