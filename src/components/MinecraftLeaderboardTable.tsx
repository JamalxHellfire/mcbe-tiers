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

const getDeviceIcon = (device: string = 'PC') => {
  const iconProps = "w-3 h-3 drop-shadow-sm";
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

const getRegionStyling = (regionCode: string = 'NA') => {
  const regions: Record<string, { 
    bgGradient: string;
    textColor: string;
    shadowColor: string;
    borderGlow: string;
  }> = {
    'NA': { 
      bgGradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      textColor: 'text-white',
      shadowColor: 'shadow-emerald-500/20',
      borderGlow: 'ring-1 ring-emerald-400/20'
    },
    'EU': { 
      bgGradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
      textColor: 'text-white',
      shadowColor: 'shadow-purple-500/20',
      borderGlow: 'ring-1 ring-purple-400/20'
    },
    'ASIA': { 
      bgGradient: 'bg-gradient-to-r from-red-500 to-red-600',
      textColor: 'text-white',
      shadowColor: 'shadow-red-500/20',
      borderGlow: 'ring-1 ring-red-400/20'
    },
    'SA': { 
      bgGradient: 'bg-gradient-to-r from-orange-500 to-orange-600',
      textColor: 'text-white',
      shadowColor: 'shadow-orange-500/20',
      borderGlow: 'ring-1 ring-orange-400/20'
    },
    'AF': { 
      bgGradient: 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-600',
      textColor: 'text-white',
      shadowColor: 'shadow-fuchsia-500/20',
      borderGlow: 'ring-1 ring-fuchsia-400/20'
    },
    'OCE': { 
      bgGradient: 'bg-gradient-to-r from-teal-500 to-teal-600',
      textColor: 'text-white',
      shadowColor: 'shadow-teal-500/20',
      borderGlow: 'ring-1 ring-teal-400/20'
    }
  };
  
  return regions[regionCode] || regions['NA'];
};

const getRankBadgeStyle = (position: number) => {
  if (position === 1) {
    return {
      gradient: 'bg-gradient-to-br from-yellow-400 to-amber-500',
      shadow: 'shadow-md shadow-yellow-500/30',
      ring: 'ring-1 ring-yellow-400/20',
      glow: 'drop-shadow-sm'
    };
  } else if (position === 2) {
    return {
      gradient: 'bg-gradient-to-br from-gray-300 to-gray-400',
      shadow: 'shadow-md shadow-gray-400/30',
      ring: 'ring-1 ring-gray-300/20',
      glow: 'drop-shadow-sm'
    };
  } else if (position === 3) {
    return {
      gradient: 'bg-gradient-to-br from-amber-600 to-orange-600',
      shadow: 'shadow-md shadow-amber-600/30',
      ring: 'ring-1 ring-amber-500/20',
      glow: 'drop-shadow-sm'
    };
  } else {
    return {
      gradient: 'bg-gradient-to-br from-gray-600 to-gray-700',
      shadow: 'shadow-sm shadow-gray-700/20',
      ring: 'ring-1 ring-gray-500/10',
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
      'HT1': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-yellow-500/20',
      'HT2': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/20',
      'HT3': 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/20',
      'LT1': 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/20',
      'LT2': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/20',
      'LT3': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-500/20'
    };
    
    for (const [key, style] of Object.entries(tierStyles)) {
      if (tier.includes(key)) return `${style} shadow-sm`;
    }
    return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/20 shadow-sm';
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
    return (
      <div className="w-full space-y-3">
        {players.map((player, index) => {
          const playerPoints = player.global_points || 0;
          const rankInfo = getPlayerRank(playerPoints);
          const regionStyle = getRegionStyling(player.region);
          const rankBadge = getRankBadgeStyle(index + 1);
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.05, 
                duration: 0.2
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="relative w-full bg-gradient-to-br from-dark-surface/70 to-dark-surface/50 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all duration-200 cursor-pointer overflow-hidden shadow-lg hover:shadow-xl"
              onClick={() => handlePlayerRowClick(player)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-purple-500/3 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-center gap-3 mb-3">
                <div className={`
                  w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold
                  ${rankBadge.gradient} ${rankBadge.shadow} ${rankBadge.ring}
                `}>
                  {index + 1}
                </div>

                <Avatar className="w-12 h-12 border-2 border-white/20 shadow-md">
                  <AvatarImage 
                    src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                    alt={player.ign}
                    onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-white text-sm font-bold">
                    {player.ign.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getDeviceIcon(player.device)}
                    <span className="font-bold text-white text-base truncate">
                      {player.ign}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`font-bold ${rankInfo.color}`}>
                      ◆ {rankInfo.title}
                    </span>
                    <span className="text-white/60 font-medium">({playerPoints} pts)</span>
                  </div>
                </div>

                <span className={`
                  px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200
                  ${regionStyle.bgGradient} ${regionStyle.textColor} ${regionStyle.shadowColor}
                  shadow-sm
                `}>
                  {player.region || 'NA'}
                </span>
              </div>

              <div className="relative flex items-center justify-center gap-2 pt-3 border-t border-white/10">
                {[
                  { mode: 'mace', gamemode: 'Mace' },
                  { mode: 'sword', gamemode: 'Sword' },
                  { mode: 'crystal', gamemode: 'Crystal' },
                  { mode: 'axe', gamemode: 'Axe' },
                  { mode: 'uhc', gamemode: 'UHC' },
                  { mode: 'smp', gamemode: 'SMP' },
                  { mode: 'nethpot', gamemode: 'NethPot' },
                  { mode: 'bedwars', gamemode: 'Bedwars' }
                ].map(({ mode, gamemode }) => {
                  const tier = getPlayerTierForGamemode(player, gamemode);
                  
                  return (
                    <div 
                      key={mode} 
                      className="flex flex-col items-center"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-700/70 to-gray-800/70 border border-gray-500/20 flex items-center justify-center mb-1 shadow-sm backdrop-blur-sm">
                        <GameModeIcon mode={mode} className="w-3.5 h-3.5" />
                      </div>
                      <div className={`px-1.5 py-0.5 rounded text-xs font-bold ${getTierBadgeColor(tier)} min-w-[24px] text-center`}>
                        {tier === 'Not Ranked' ? 'NR' : tier}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-dark-surface/50 to-dark-surface/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-xl">
      <div className="grid grid-cols-12 gap-6 px-6 py-4 text-sm font-bold text-white/80 border-b border-white/10 bg-gradient-to-r from-dark-surface/80 to-dark-surface/60 backdrop-blur-sm">
        <div className="col-span-1"></div>
        <div className="col-span-4">PLAYER</div>
        <div className="col-span-2 text-center">REGION</div>
        <div className="col-span-5 text-center">TIERS</div>
      </div>

      <div className="divide-y divide-white/5">
        {players.map((player, index) => {
          const playerPoints = player.global_points || 0;
          const rankInfo = getPlayerRank(playerPoints);
          const regionStyle = getRegionStyling(player.region);
          const rankBadge = getRankBadgeStyle(index + 1);
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: index * 0.03,
                duration: 0.15
              }}
              whileHover={{ 
                scale: 1.005, 
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                transition: { duration: 0.15 }
              }}
              className="grid grid-cols-12 gap-6 px-6 py-4 cursor-pointer transition-all group relative overflow-hidden"
              onClick={() => handlePlayerRowClick(player)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              <div className="col-span-1 flex items-center relative z-10">
                <div className={`
                  w-12 h-12 flex items-center justify-center rounded-xl text-base font-bold
                  ${rankBadge.gradient} ${rankBadge.shadow} ${rankBadge.ring}
                `}>
                  {index + 1}
                </div>
              </div>

              <div className="col-span-4 flex items-center gap-4 relative z-10">
                <Avatar className="w-14 h-14 border-2 border-white/20 group-hover:border-white/40 transition-all duration-200 shadow-md">
                  <AvatarImage 
                    src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                    alt={player.ign}
                    onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-white font-bold">
                    {player.ign.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-1">
                    {getDeviceIcon(player.device)}
                    <span className="text-white font-bold text-lg group-hover:text-blue-200 transition-colors">
                      {player.ign}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${rankInfo.color} group-hover:brightness-110 transition-all`}>
                      ◆ {rankInfo.title}
                    </span>
                    <span className="text-white/60 text-sm font-medium">({playerPoints} points)</span>
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-center relative z-10">
                <span className={`
                  px-4 py-2 rounded-full text-sm font-bold transition-all duration-200
                  ${regionStyle.bgGradient} ${regionStyle.textColor} ${regionStyle.shadowColor}
                  shadow-md group-hover:shadow-lg
                `}>
                  {player.region || 'NA'}
                </span>
              </div>

              <div className="col-span-5 flex items-center justify-center relative z-10">
                <div className="flex items-center gap-4">
                  {[
                    { mode: 'mace', gamemode: 'Mace' },
                    { mode: 'sword', gamemode: 'Sword' },
                    { mode: 'crystal', gamemode: 'Crystal' },
                    { mode: 'axe', gamemode: 'Axe' },
                    { mode: 'uhc', gamemode: 'UHC' },
                    { mode: 'smp', gamemode: 'SMP' },
                    { mode: 'nethpot', gamemode: 'NethPot' },
                    { mode: 'bedwars', gamemode: 'Bedwars' }
                  ].map(({ mode, gamemode }) => {
                    const tier = getPlayerTierForGamemode(player, gamemode);
                    
                    return (
                      <div 
                        key={mode} 
                        className="relative flex flex-col items-center group/tier"
                      >
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-700/70 to-gray-800/70 border border-gray-500/20 flex items-center justify-center hover:bg-gradient-to-br hover:from-gray-600/70 hover:via-gray-700/70 hover:to-gray-800/70 transition-all duration-200 group-hover/tier:border-white/30 mb-1.5 shadow-sm backdrop-blur-sm">
                          <GameModeIcon mode={mode} className="w-4 h-4 group-hover/tier:text-white transition-colors" />
                        </div>
                        <div className={`px-2 py-0.5 rounded text-xs font-bold ${getTierBadgeColor(tier)} min-w-[32px] text-center transition-all duration-200 group-hover/tier:scale-105`}>
                          {tier === 'Not Ranked' ? 'NR' : tier}
                        </div>
                      </div>
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
