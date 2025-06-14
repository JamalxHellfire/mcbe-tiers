
import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePopup } from '@/contexts/PopupContext';
import { getPlayerRank } from '@/utils/rankUtils';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';
import { UltraRankBadge } from './UltraRankBadge';

interface TierResultButtonProps {
  player: Player;
  onClick?: (player: Player) => void;
}

export function TierResultButton({ player, onClick }: TierResultButtonProps) {
  const { openPopup } = usePopup();
  
  const getRankInfo = (points: number) => {
    const rank = getPlayerRank(points);
    let color = 'text-gray-300';
    let bg = 'bg-gradient-to-r from-gray-500/20 to-slate-500/20';
    let borderColor = 'border-gray-400/50';
    
    switch (rank.title) {
      case 'Combat Grandmaster':
        color = 'text-purple-300';
        bg = 'bg-gradient-to-r from-purple-500/20 to-violet-500/20';
        borderColor = 'border-purple-400/50';
        break;
      case 'Combat Master':
        color = 'text-yellow-300';
        bg = 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20';
        borderColor = 'border-yellow-400/50';
        break;
      case 'Combat Ace':
        color = 'text-blue-300';
        bg = 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20';
        borderColor = 'border-blue-400/50';
        break;
      case 'Combat Specialist':
        color = 'text-green-300';
        bg = 'bg-gradient-to-r from-green-500/20 to-emerald-500/20';
        borderColor = 'border-green-400/50';
        break;
      case 'Combat Cadet':
        color = 'text-orange-300';
        bg = 'bg-gradient-to-r from-orange-500/20 to-amber-500/20';
        borderColor = 'border-orange-400/50';
        break;
      case 'Combat Novice':
        color = 'text-slate-300';
        bg = 'bg-gradient-to-r from-slate-500/20 to-gray-500/20';
        borderColor = 'border-slate-400/50';
        break;
    }
    
    return { title: rank.title, color, bg, borderColor };
  };

  const rankInfo = getRankInfo(player.global_points || 0);

  const handleClick = () => {
    if (onClick) {
      onClick(player);
    }
    
    const tierAssignments = (player.tierAssignments || []).map(assignment => ({
      gamemode: assignment.gamemode,
      tier: assignment.tier,
      score: assignment.score
    }));
    
    openPopup({
      player,
      tierAssignments,
      combatRank: {
        title: rankInfo.title,
        points: player.global_points || 0,
        color: rankInfo.color,
        effectType: 'general',
        rankNumber: player.overall_rank || 1,
        borderColor: rankInfo.borderColor
      },
      timestamp: new Date().toISOString()
    });
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`w-full group relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 hover:from-slate-700/90 hover:via-slate-600/90 hover:to-slate-700/90 border-2 border-slate-600/50 hover:${rankInfo.borderColor} rounded-xl px-6 py-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 ${rankInfo.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative flex items-center gap-4 z-10">
        {/* Avatar */}
        <div className="relative">
          <Avatar className={`w-12 h-12 border-2 border-slate-500/50 group-hover:${rankInfo.borderColor} transition-all duration-300 shadow-md`}>
            <AvatarImage 
              src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
              alt={player.ign}
              className="object-cover object-center scale-110"
              onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
            />
            <AvatarFallback className="bg-slate-700 text-white text-sm font-bold">
              {player.ign.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Player info */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-white font-bold text-lg group-hover:text-blue-200 transition-colors duration-300">
              {player.ign}
            </span>
            {/* Ultra Rank Badge (small) */}
            <div className="scale-75">
              <UltraRankBadge 
                rank={rankInfo.title} 
                size="small"
                className="opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              <span className="font-semibold">{player.global_points || 0} pts</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-500" />
            <span className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                player.region === 'NA' ? 'bg-red-500' :
                player.region === 'EU' ? 'bg-green-500' :
                player.region === 'ASIA' ? 'bg-blue-500' :
                'bg-gray-500'
              }`} />
              {player.region || 'NA'}
            </span>
          </div>
        </div>
        
        {/* Arrow indicator with enhanced animation */}
        <motion.div 
          className="text-slate-400 group-hover:text-blue-400 transition-colors duration-300"
          whileHover={{ x: 3, scale: 1.1 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </div>
      
      {/* Ultra shine effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      
      {/* Additional glow effect for higher ranks */}
      {(rankInfo.title.includes('Grandmaster') || rankInfo.title.includes('Master')) && (
        <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${rankInfo.bg} blur-sm`} />
      )}
    </motion.button>
  );
}
