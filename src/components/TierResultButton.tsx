
import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, Trophy, Monitor, Smartphone, Gamepad } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePopup } from '@/contexts/PopupContext';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';

interface TierResultButtonProps {
  player: Player;
  onClick?: (player: Player) => void;
}

// Helper to get device icon
const getDeviceIcon = (device: string = 'PC') => {
  switch(device?.toLowerCase()) {
    case 'mobile':
    case 'bedrock':
      return <Smartphone className="w-3 h-3 text-blue-400" />;
    case 'console':
      return <Gamepad className="w-3 h-3 text-green-400" />;
    case 'pc':
    case 'java':
    default:
      return <Monitor className="w-3 h-3 text-white/80" />;
  }
};

export function TierResultButton({ player, onClick }: TierResultButtonProps) {
  const { openPopup } = usePopup();
  const playerPoints = player.global_points || 0;

  const handleClick = () => {
    if (onClick) {
      onClick(player);
    }
    
    // Convert tierAssignments to match expected interface
    const tierAssignments = (player.tierAssignments || []).map(assignment => ({
      gamemode: assignment.gamemode,
      tier: assignment.tier,
      score: assignment.score
    }));
    
    openPopup({
      player,
      tierAssignments,
      combatRank: {
        title: 'Combat Rank',
        points: playerPoints,
        color: 'text-white',
        effectType: 'general',
        rankNumber: player.overall_rank || 1,
        borderColor: 'border-white'
      },
      timestamp: new Date().toISOString()
    });
  };

  return (
    <motion.button
      onClick={handleClick}
      className="w-full group relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 hover:from-slate-700/90 hover:via-slate-600/90 hover:to-slate-700/90 border border-slate-600/50 rounded-lg px-3 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.01] backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative flex items-center gap-3 z-10">
        {/* Smaller Avatar */}
        <div className="relative">
          <Avatar className="w-8 h-8 border border-slate-500/50 transition-all duration-200 shadow-sm group-hover:border-white/50">
            <AvatarImage 
              src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
              alt={player.ign}
              className="object-cover object-center scale-110"
              onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
            />
            <AvatarFallback className="bg-slate-700 text-white text-xs font-bold">
              {player.ign.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Compact Player info */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {getDeviceIcon(player.device)}
            <span className="text-white font-semibold text-sm group-hover:text-blue-200 transition-colors duration-200 truncate">
              {player.ign}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Trophy className="w-2.5 h-2.5" />
              <span className="font-medium">{playerPoints}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-500" />
            <span className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${
                player.region === 'NA' ? 'bg-red-500' :
                player.region === 'EU' ? 'bg-green-500' :
                player.region === 'ASIA' ? 'bg-blue-500' :
                'bg-gray-500'
              }`} />
              {player.region || 'NA'}
            </span>
          </div>
        </div>
        
        {/* Smaller Arrow indicator */}
        <motion.div 
          className="text-slate-400 group-hover:text-blue-400 transition-colors duration-200"
          whileHover={{ x: 2 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </div>
      
      {/* Reduced shine effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/3 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
    </motion.button>
  );
}
