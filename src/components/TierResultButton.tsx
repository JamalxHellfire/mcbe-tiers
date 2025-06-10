
import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, Trophy, Star } from 'lucide-react';

interface TierResultButtonProps {
  player: Player;
  onClick: (player: Player) => void;
}

export function TierResultButton({ player, onClick }: TierResultButtonProps) {
  const getRankInfo = (points: number) => {
    if (points >= 300) return { title: 'Combat Master', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Star };
    if (points >= 200) return { title: 'Combat Marshal', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: Trophy };
    if (points >= 100) return { title: 'Combat Ace', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Trophy };
    return { title: 'Combat Cadet', color: 'text-gray-400', bg: 'bg-gray-500/20', icon: Trophy };
  };

  const rankInfo = getRankInfo(player.global_points || 0);
  const IconComponent = rankInfo.icon;

  return (
    <button
      onClick={() => onClick(player)}
      className="w-full group relative overflow-hidden bg-gradient-to-r from-slate-800/90 to-slate-700/90 hover:from-slate-700/90 hover:to-slate-600/90 border border-slate-600/50 hover:border-slate-500/70 rounded-xl px-4 py-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center gap-4">
        {/* Avatar with glow effect */}
        <div className="relative">
          <Avatar className="w-10 h-10 border-2 border-slate-500/50 group-hover:border-blue-400/50 transition-colors duration-300">
            <AvatarImage 
              src={`https://visage.surgeplay.com/bust/64/${player.ign}`}
              alt={player.ign}
            />
            <AvatarFallback className="bg-slate-700 text-white text-sm font-medium">
              {player.ign.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {/* Rank indicator */}
          <div className={`absolute -bottom-1 -right-1 ${rankInfo.bg} ${rankInfo.color} rounded-full p-1 border border-current/30`}>
            <IconComponent className="w-3 h-3" />
          </div>
        </div>
        
        {/* Player info */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-semibold group-hover:text-blue-200 transition-colors duration-300">
              {player.ign}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${rankInfo.bg} ${rankInfo.color} border border-current/20`}>
              {rankInfo.title.replace('Combat ', '')}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {player.global_points || 0} pts
            </span>
            <span>•</span>
            <span>{player.region || 'NA'}</span>
          </div>
        </div>
        
        {/* Arrow indicator */}
        <div className="text-slate-400 group-hover:text-blue-400 transition-colors duration-300">
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
      
      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-xl border border-blue-400/0 group-hover:border-blue-400/30 transition-colors duration-300" />
    </button>
  );
}
