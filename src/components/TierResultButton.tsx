
import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, Trophy, Star, Sword, Shield, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePopup } from '@/contexts/PopupContext';
import { getPlayerRank } from '@/utils/rankUtils';

interface TierResultButtonProps {
  player: Player;
  onClick?: (player: Player) => void;
}

export function TierResultButton({ player, onClick }: TierResultButtonProps) {
  const { openPopup } = usePopup();
  
  const getRankInfo = (points: number) => {
    const rank = getPlayerRank(points);
    let icon = Shield;
    let color = 'text-gray-300';
    let bg = 'bg-gradient-to-r from-gray-500/20 to-slate-500/20';
    let borderColor = 'border-gray-400/50';
    let glowColor = 'shadow-gray-500/25';
    
    switch (rank.title) {
      case 'Combat General':
        icon = Crown;
        color = 'text-yellow-300';
        bg = 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20';
        borderColor = 'border-yellow-400/50';
        glowColor = 'shadow-yellow-500/25';
        break;
      case 'Combat Marshal':
        icon = Sword;
        color = 'text-red-300';
        bg = 'bg-gradient-to-r from-red-500/20 to-pink-500/20';
        borderColor = 'border-red-400/50';
        glowColor = 'shadow-red-500/25';
        break;
      case 'Combat Ace':
        icon = Star;
        color = 'text-blue-300';
        bg = 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20';
        borderColor = 'border-blue-400/50';
        glowColor = 'shadow-blue-500/25';
        break;
      case 'Combat Sargent':
        icon = Trophy;
        color = 'text-orange-300';
        bg = 'bg-gradient-to-r from-orange-500/20 to-amber-500/20';
        borderColor = 'border-orange-400/50';
        glowColor = 'shadow-orange-500/25';
        break;
    }
    
    return { title: rank.title, color, bg, icon, borderColor, glowColor };
  };

  const rankInfo = getRankInfo(player.global_points || 0);
  const IconComponent = rankInfo.icon;

  const handleClick = () => {
    if (onClick) {
      onClick(player);
    }
    
    // Open enhanced popup
    openPopup({
      player,
      tierAssignments: [], // Will be loaded from database
      combatRank: {
        title: rankInfo.title,
        points: player.global_points || 0,
        color: rankInfo.color,
        effectType: 'default',
        rankNumber: player.overall_rank || 1,
        borderColor: rankInfo.borderColor
      },
      timestamp: new Date().toISOString()
    });
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`w-full group relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 hover:from-slate-700/90 hover:via-slate-600/90 hover:to-slate-700/90 border-2 border-slate-600/50 hover:${rankInfo.borderColor} rounded-2xl px-6 py-4 transition-all duration-500 shadow-xl hover:shadow-2xl hover:${rankInfo.glowColor} hover:scale-[1.02] backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 ${rankInfo.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Subtle particle effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${rankInfo.color} rounded-full opacity-0 group-hover:opacity-60`}
            initial={{ x: Math.random() * 100 + '%', y: '100%' }}
            animate={{ 
              y: ['-10%', '-20%'],
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
      
      <div className="relative flex items-center gap-5 z-10">
        {/* Enhanced Avatar with glow effect */}
        <div className="relative">
          {/* Glow ring */}
          <div className={`absolute inset-0 w-14 h-14 rounded-full ${rankInfo.bg} blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse`} />
          
          <Avatar className={`w-14 h-14 border-3 border-slate-500/50 group-hover:${rankInfo.borderColor} transition-all duration-300 shadow-lg relative z-10`}>
            <AvatarImage 
              src={`https://visage.surgeplay.com/bust/64/${player.ign}`}
              alt={player.ign}
              className="object-cover object-center scale-110"
            />
            <AvatarFallback className="bg-slate-700 text-white text-sm font-bold">
              {player.ign.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          {/* Enhanced rank indicator */}
          <motion.div 
            className={`absolute -bottom-1 -right-1 ${rankInfo.bg} ${rankInfo.color} rounded-full p-2 border-2 ${rankInfo.borderColor} shadow-lg backdrop-blur-sm`}
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            <IconComponent className="w-4 h-4" />
          </motion.div>
        </div>
        
        {/* Enhanced player info */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-white font-bold text-lg group-hover:text-blue-200 transition-colors duration-300">
              {player.ign}
            </span>
            <motion.span 
              className={`text-xs px-3 py-1 rounded-full ${rankInfo.bg} ${rankInfo.color} border ${rankInfo.borderColor} font-bold backdrop-blur-sm`}
              whileHover={{ scale: 1.05 }}
            >
              {rankInfo.title.replace('Combat ', '')}
            </motion.span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="font-semibold">{player.global_points || 0} pts</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-500" />
            <span className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                player.region === 'NA' ? 'bg-red-500' :
                player.region === 'EU' ? 'bg-green-500' :
                player.region === 'ASIA' ? 'bg-blue-500' :
                'bg-gray-500'
              }`} />
              {player.region || 'NA'}
            </span>
          </div>
        </div>
        
        {/* Enhanced arrow indicator with lightning effect */}
        <div className="flex flex-col items-center gap-1">
          <motion.div 
            className="text-slate-400 group-hover:text-blue-400 transition-colors duration-300"
            whileHover={{ x: 5 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.div>
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
          >
            <Zap className="w-3 h-3 text-yellow-400" />
          </motion.div>
        </div>
      </div>
      
      {/* Enhanced animated border effect */}
      <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:${rankInfo.borderColor} transition-all duration-300`} />
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </motion.button>
  );
}
