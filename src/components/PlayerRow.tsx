
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerRowProps {
  player: {
    id: string;
    name: string;
    displayName: string;
    region: string;
    avatar: string;
    tier: number;
    points: number;
    badge: string;
  };
  onClick: () => void;
  delay?: number;
  compact?: boolean;
}

export function PlayerRow({ player, onClick, delay = 0, compact = false }: PlayerRowProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between py-3 hover:bg-white/5 transition-colors cursor-pointer",
        compact ? "px-2" : "px-4"
      )}
      onClick={onClick}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center">
        <Avatar className={cn("border-2 border-white/10", compact ? "h-8 w-8 mr-2" : "h-10 w-10 mr-3")}>
          <AvatarImage src={player.avatar} alt={player.name} />
          <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        
        <div>
          <div className={cn("font-medium", compact ? "text-sm" : "text-base")}>{player.displayName}</div>
          {!compact && (
            <div className="flex items-center mt-1">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded mr-2",
                player.region === 'NA' ? 'bg-red-900/30 text-red-400' : 
                player.region === 'EU' ? 'bg-green-900/30 text-green-400' :
                player.region === 'ASIA' ? 'bg-blue-900/30 text-blue-400' : 
                'bg-purple-900/30 text-purple-400'
              )}>
                {player.region}
              </span>
              <span className="text-xs text-white/50 flex items-center">
                <Trophy size={12} className="text-yellow-500 mr-1" />
                {player.points} pts
              </span>
            </div>
          )}
          {compact && (
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded inline-block mt-1",
              player.region === 'NA' ? 'bg-red-900/30 text-red-400' : 
              player.region === 'EU' ? 'bg-green-900/30 text-green-400' :
              player.region === 'ASIA' ? 'bg-blue-900/30 text-blue-400' : 
              'bg-purple-900/30 text-purple-400'
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
            {player.badge}
          </span>
        </div>
      )}
    </div>
  );
}
