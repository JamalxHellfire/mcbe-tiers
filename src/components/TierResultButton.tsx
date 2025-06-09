
import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronUp } from 'lucide-react';

interface TierResultButtonProps {
  player: Player;
  onClick: (player: Player) => void;
}

export function TierResultButton({ player, onClick }: TierResultButtonProps) {
  return (
    <button
      onClick={() => onClick(player)}
      className="w-full bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded px-3 py-2 flex items-center gap-3 transition-colors"
    >
      <Avatar className="w-6 h-6">
        <AvatarImage 
          src={`https://visage.surgeplay.com/bust/32/${player.ign}`}
          alt={player.ign}
        />
        <AvatarFallback className="bg-gray-700 text-xs">
          {player.ign.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <span className="text-white text-sm font-medium flex-1 text-left">
        {player.ign}
      </span>
      
      <ChevronUp className="w-4 h-4 text-gray-400" />
    </button>
  );
}
