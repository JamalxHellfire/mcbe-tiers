
import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GameModeIcon } from './GameModeIcon';
import { Monitor, Smartphone, Gamepad } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPlayerRank } from '@/utils/rankUtils';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MinecraftLeaderboardTableProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

// Helper to get device icon with enhanced styling
const getDeviceIcon = (device: string = 'PC') => {
  const iconProps = "w-4 h-4 drop-shadow-lg";
  switch(device?.toLowerCase()) {
    case 'mobile':
    case 'bedrock':
      return <Smartphone className={`${iconProps} text-blue-400`} />;
    case 'console':
      return <Gamepad className={`${iconProps} text-green-400`} />;
    case 'pc':
    case 'java':
    default:
      return <Monitor className={`${iconProps} text-white/90`} />;
  }
};

// Enhanced region styling with improved gradients and effects
const getRegionStyling = (regionCode: string = 'NA') => {
  const regions: Record<string, { 
    bgGradient: string;
    textColor: string;
    shadowColor: string;
    borderGlow: string;
  }> = {
    'NA': { 
      bgGradient: 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700',
      textColor: 'text-white',
      shadowColor: 'shadow-emerald-500/30',
      borderGlow: 'ring-2 ring-emerald-400/20'
    },
    'EU': { 
      bgGradient: 'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700',
      textColor: 'text-white',
      shadowColor: 'shadow-purple-500/30',
      borderGlow: 'ring-2 ring-purple-400/20'
    },
    'ASIA': { 
      bgGradient: 'bg-gradient-to-r from-red-500 via-red-600 to-red-700',
      textColor: 'text-white',
      shadowColor: 'shadow-red-500/30',
      borderGlow: 'ring-2 ring-red-400/20'
    },
    'SA': { 
      bgGradient: 'bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700',
      textColor: 'text-white',
      shadowColor: 'shadow-orange-500/30',
      borderGlow: 'ring-2 ring-orange-400/20'
    },
    'AF': { 
      bgGradient: 'bg-gradient-to-r from-fuchsia-500 via-fuchsia-600 to-fuchsia-700',
      textColor: 'text-white',
      shadowColor: 'shadow-fuchsia-500/30',
      borderGlow: 'ring-2 ring-fuchsia-400/20'
    },
    'OCE': { 
      bgGradient: 'bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700',
      textColor: 'text-white',
      shadowColor: 'shadow-teal-500/30',
      borderGlow: 'ring-2 ring-teal-400/20'
    }
  };
  
  return regions[regionCode] || regions['NA'];
};

// Enhanced rank badge styling
const getRankBadgeStyle = (position: number) => {
  if (position === 1) {
    return {
      gradient: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600',
      shadow: 'shadow-lg shadow-yellow-500/50',
      ring: 'ring-2 ring-yellow-400/30',
      glow: 'drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
    };
  } else if (position === 2) {
    return {
      gradient: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
      shadow: 'shadow-lg shadow-gray-400/50',
      ring: 'ring-2 ring-gray-300/30',
      glow: 'drop-shadow-[0_0_6px_rgba(156,163,175,0.8)]'
    };
  } else if (position === 3) {
    return {
      gradient: 'bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-700',
      shadow: 'shadow-lg shadow-amber-600/50',
      ring: 'ring-2 ring-amber-500/30',
      glow: 'drop-shadow-[0_0_6px_rgba(217,119,6,0.8)]'
    };
  } else {
    return {
      gradient: 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800',
      shadow: 'shadow-md shadow-gray-700/40',
      ring: 'ring-1 ring-gray-500/20',
      glow: ''
    };
  }
};

export const MinecraftLeaderboardTable: React.FC<MinecraftLeaderboardTableProps> = ({
  players,
  onPlayerClick,
}) => {
  const isMobile = useIsMobile();

  const getTierBadgeColor = (tier: string) => {
    const tierStyles = {
      'HT1': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-yellow-500/30',
      'HT2': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/30',
      'HT3': 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30',
      'LT1': 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30',
      'LT2': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30',
      'LT3': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-500/30'
    };
    
    for (const [key, style] of Object.entries(tierStyles)) {
      if (tier.includes(key)) return `${style} shadow-md`;
    }
    return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/30 shadow-md';
  };

  const getPlayerTierForGamemode = (player: Player, gamemode: string): string => {
    if (!player.tierAssignments) return 'Not Ranked';
    
    const assignment = player.tierAssignments.find(
      t => t.gamemode.toLowerCase() === gamemode.toLowerCase()
    );
    
    return assignment?.tier || 'Not Ranked';
  };

  const handlePlayerRowClick = (player: Player) => {
    onPlayerClick(player);
  };

  if (isMobile) {
    // Enhanced mobile card layout
    return (
      <div className="w-full space-y-4">
        {players.map((player, index) => {
          const playerPoints = player.global_points || 0;
          const rankInfo = getPlayerRank(playerPoints);
          const regionStyle = getRegionStyling(player.region);
          const rankBadge = getRankBadgeStyle(index + 1);
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.08, 
                type: "spring", 
                stiffness: 100,
                damping: 15 
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full bg-gradient-to-br from-dark-surface/80 via-dark-surface/60 to-dark-surface/40 backdrop-blur-xl rounded-2xl p-5 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer overflow-hidden shadow-xl hover:shadow-2xl"
              onClick={() => handlePlayerRowClick(player)}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              
              {/* Top row: Rank, Avatar, Name, Points */}
              <div className="relative flex items-center gap-4 mb-4">
                {/* Enhanced Rank Badge */}
                <motion.div 
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-xl text-sm font-bold
                    ${rankBadge.gradient} ${rankBadge.shadow} ${rankBadge.ring} ${rankBadge.glow}
                  `}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {index + 1}
                </motion.div>

                {/* Enhanced Avatar */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Avatar className="w-14 h-14 border-3 border-white/30 shadow-lg ring-2 ring-blue-400/20">
                    <AvatarImage 
                      src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                      alt={player.ign}
                      onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-white text-sm font-bold">
                      {player.ign.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                {/* Enhanced name and info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {getDeviceIcon(player.device)}
                    <span className="font-bold text-white text-lg truncate drop-shadow-md">
                      {player.ign}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`font-bold ${rankInfo.color} drop-shadow-md`}>
                      ◆ {rankInfo.title}
                    </span>
                    <span className="text-white/70 font-medium">({playerPoints} pts)</span>
                  </div>
                </div>

                {/* Enhanced Region Badge */}
                <motion.span 
                  className={`
                    px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
                    ${regionStyle.bgGradient} ${regionStyle.textColor} ${regionStyle.shadowColor} ${regionStyle.borderGlow}
                    shadow-lg
                  `}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  {player.region || 'NA'}
                </motion.span>
              </div>

              {/* Enhanced tier icons row */}
              <div className="relative flex items-center justify-center gap-3 pt-4 border-t border-white/20">
                {[
                  { mode: 'mace', gamemode: 'Mace' },
                  { mode: 'sword', gamemode: 'Sword' },
                  { mode: 'crystal', gamemode: 'Crystal' },
                  { mode: 'axe', gamemode: 'Axe' },
                  { mode: 'uhc', gamemode: 'UHC' },
                  { mode: 'smp', gamemode: 'SMP' },
                  { mode: 'nethpot', gamemode: 'NethPot' },
                  { mode: 'bedwars', gamemode: 'Bedwars' }
                ].map(({ mode, gamemode }, iconIndex) => {
                  const tier = getPlayerTierForGamemode(player, gamemode);
                  
                  return (
                    <motion.div 
                      key={mode} 
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 + iconIndex * 0.03 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-700/80 via-gray-800/80 to-gray-900/80 border border-gray-500/30 flex items-center justify-center mb-1.5 shadow-md backdrop-blur-sm">
                        <GameModeIcon mode={mode} className="w-4 h-4" />
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs font-bold ${getTierBadgeColor(tier)} min-w-[28px] text-center`}>
                        {tier === 'Not Ranked' ? 'NR' : tier}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Enhanced desktop table layout
  return (
    <div className="w-full bg-gradient-to-br from-dark-surface/60 via-dark-surface/40 to-dark-surface/20 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
      {/* Enhanced Header */}
      <div className="grid grid-cols-12 gap-6 px-8 py-6 text-sm font-bold text-white/80 border-b border-white/20 bg-gradient-to-r from-dark-surface/90 via-dark-surface/70 to-dark-surface/90 backdrop-blur-md">
        <div className="col-span-1"></div>
        <div className="col-span-4 drop-shadow-md">PLAYER</div>
        <div className="col-span-2 text-center drop-shadow-md">REGION</div>
        <div className="col-span-5 text-center drop-shadow-md">TIERS</div>
      </div>

      {/* Enhanced Player Rows */}
      <div className="divide-y divide-white/10">
        {players.map((player, index) => {
          const playerPoints = player.global_points || 0;
          const rankInfo = getPlayerRank(playerPoints);
          const regionStyle = getRegionStyling(player.region);
          const rankBadge = getRankBadgeStyle(index + 1);
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: index * 0.06,
                type: "spring",
                stiffness: 100 
              }}
              whileHover={{ 
                scale: 1.01, 
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                transition: { duration: 0.2 }
              }}
              className="grid grid-cols-12 gap-6 px-8 py-6 cursor-pointer transition-all group relative overflow-hidden"
              onClick={() => handlePlayerRowClick(player)}
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Enhanced Rank with styled background */}
              <div className="col-span-1 flex items-center relative z-10">
                <motion.div 
                  className={`
                    w-14 h-14 flex items-center justify-center rounded-2xl text-lg font-black
                    ${rankBadge.gradient} ${rankBadge.shadow} ${rankBadge.ring} ${rankBadge.glow}
                  `}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {index + 1}
                </motion.div>
              </div>

              {/* Enhanced Player Info */}
              <div className="col-span-4 flex items-center gap-5 relative z-10">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Avatar className="w-16 h-16 border-3 border-white/30 group-hover:border-white/50 transition-all duration-300 shadow-lg ring-2 ring-blue-400/20">
                    <AvatarImage 
                      src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                      alt={player.ign}
                      onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-white font-bold">
                      {player.ign.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    {getDeviceIcon(player.device)}
                    <span className="text-white font-bold text-xl group-hover:text-blue-200 transition-colors drop-shadow-md">
                      {player.ign}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${rankInfo.color} group-hover:brightness-110 transition-all drop-shadow-md`}>
                      ◆ {rankInfo.title}
                    </span>
                    <span className="text-white/70 text-sm font-medium">({playerPoints} points)</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Region */}
              <div className="col-span-2 flex items-center justify-center relative z-10">
                <motion.span 
                  className={`
                    px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                    ${regionStyle.bgGradient} ${regionStyle.textColor} ${regionStyle.shadowColor} ${regionStyle.borderGlow}
                    shadow-lg group-hover:shadow-xl
                  `}
                  whileHover={{ scale: 1.08, rotate: 1 }}
                >
                  {player.region || 'NA'}
                </motion.span>
              </div>

              {/* Enhanced Tier Icons with Badges */}
              <div className="col-span-5 flex items-center justify-center relative z-10">
                <div className="flex items-center gap-5">
                  {[
                    { mode: 'mace', gamemode: 'Mace' },
                    { mode: 'sword', gamemode: 'Sword' },
                    { mode: 'crystal', gamemode: 'Crystal' },
                    { mode: 'axe', gamemode: 'Axe' },
                    { mode: 'uhc', gamemode: 'UHC' },
                    { mode: 'smp', gamemode: 'SMP' },
                    { mode: 'nethpot', gamemode: 'NethPot' },
                    { mode: 'bedwars', gamemode: 'Bedwars' }
                  ].map(({ mode, gamemode }, iconIndex) => {
                    const tier = getPlayerTierForGamemode(player, gamemode);
                    
                    return (
                      <motion.div 
                        key={mode} 
                        className="relative flex flex-col items-center group/tier"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 + iconIndex * 0.02 }}
                        whileHover={{ scale: 1.15, y: -3 }}
                      >
                        {/* Enhanced game mode icon */}
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700/80 via-gray-800/80 to-gray-900/80 border border-gray-500/30 flex items-center justify-center hover:bg-gradient-to-br hover:from-gray-600/80 hover:via-gray-700/80 hover:to-gray-800/80 transition-all duration-300 group-hover/tier:border-white/40 mb-2 shadow-lg backdrop-blur-sm">
                          <GameModeIcon mode={mode} className="w-5 h-5 group-hover/tier:text-white transition-colors drop-shadow-sm" />
                        </div>
                        {/* Enhanced tier badge */}
                        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getTierBadgeColor(tier)} min-w-[36px] text-center transition-all duration-300 group-hover/tier:scale-105 group-hover/tier:shadow-lg`}>
                          {tier === 'Not Ranked' ? 'NR' : tier}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
