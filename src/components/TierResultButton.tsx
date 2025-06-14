
import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePopup } from '@/contexts/PopupContext';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';
import { RankBadge, getRankByPoints } from '@/components/RankBadgeSystem';
import { useRankBadgeSystem } from '@/hooks/useRankBadgeSystem';

interface TierResultButtonProps {
  player: Player;
  onClick?: (player: Player) => void;
}

export function TierResultButton({ player, onClick }: TierResultButtonProps) {
  const { openPopup } = usePopup();
  const { showRankPopup } = useRankBadgeSystem();
  const playerPoints = player.global_points || 0;
  const playerRank = getRankByPoints(playerPoints);

  const handleClick = () => {
    if (onClick) {
      onClick(player);
    }
    
    // Show rank popup effect
    showRankPopup(player.ign, playerPoints);
    
    // Convert tierAssignments to match expected interface
    const tierAssignments = (player.tierAssignments || []).map(assignment => ({
      gamemode: assignment.gamemode,
      tier: assignment.tier,
      score: assignment.score
    }));
    
    // Small delay before showing main popup to let rank popup show first
    setTimeout(() => {
      openPopup({
        player,
        tierAssignments,
        combatRank: {
          title: playerRank.title,
          points: playerPoints,
          color: 'text-white',
          effectType: 'general',
          rankNumber: player.overall_rank || 1,
          borderColor: 'border-white'
        },
        timestamp: new Date().toISOString()
      });
    }, 1500);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="w-full group relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 hover:from-slate-700/90 hover:via-slate-600/90 hover:to-slate-700/90 border-2 border-slate-600/50 rounded-xl px-6 py-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] backdrop-blur-sm"
      style={{
        borderColor: `${playerRank.glowColor}50`,
        boxShadow: `0 4px 20px ${playerRank.shadowColor}30`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
           style={{
             background: `linear-gradient(135deg, ${playerRank.gradient})20`
           }} />
      
      <div className="relative flex items-center gap-4 z-10">
        {/* Avatar with rank badge */}
        <div className="relative">
          <Avatar className="w-12 h-12 border-2 border-slate-500/50 transition-all duration-300 shadow-md group-hover:border-white/50">
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
        
        {/* Player info */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-bold text-lg group-hover:text-blue-200 transition-colors duration-300">
              {player.ign}
            </span>
            <motion.span 
              className="text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm text-white border border-white/30"
              style={{
                background: `linear-gradient(135deg, ${playerRank.gradient})50`
              }}
              whileHover={{ scale: 1.05 }}
            >
              {playerRank.title.replace('Combat ', '')}
            </motion.span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              <span className="font-semibold">{playerPoints} pts</span>
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
        
        {/* Arrow indicator */}
        <motion.div 
          className="text-slate-400 group-hover:text-blue-400 transition-colors duration-300"
          whileHover={{ x: 3 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </div>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    </motion.button>
  );
}
