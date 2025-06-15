
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

// Helper to get device icon
const getDeviceIcon = (device: string = 'PC') => {
  switch(device?.toLowerCase()) {
    case 'mobile':
    case 'bedrock':
      return <Smartphone className="w-4 h-4 text-blue-400" />;
    case 'console':
      return <Gamepad className="w-4 h-4 text-green-400" />;
    case 'pc':
    case 'java':
    default:
      return <Monitor className="w-4 h-4 text-white/80" />;
  }
};

export const MinecraftLeaderboardTable: React.FC<MinecraftLeaderboardTableProps> = ({
  players,
  onPlayerClick,
}) => {
  const isMobile = useIsMobile();

  const getTierBadgeColor = (tier: string) => {
    if (tier.includes('HT1')) return 'bg-yellow-600 text-black';
    if (tier.includes('HT2')) return 'bg-orange-600 text-white';
    if (tier.includes('HT3')) return 'bg-red-600 text-white';
    if (tier.includes('LT1')) return 'bg-green-600 text-white';
    if (tier.includes('LT2')) return 'bg-blue-600 text-white';
    if (tier.includes('LT3')) return 'bg-purple-600 text-white';
    return 'bg-gray-600 text-white';
  };

  const getPlayerTierForGamemode = (player: Player, gamemode: string): string => {
    if (!player.tierAssignments) return 'Not Ranked';
    
    const assignment = player.tierAssignments.find(
      t => t.gamemode.toLowerCase() === gamemode.toLowerCase()
    );
    
    return assignment?.tier || 'Not Ranked';
  };

  const handlePlayerRowClick = (player: Player, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Player clicked:', player.ign);
    onPlayerClick(player);
  };

  if (isMobile) {
    // Mobile card layout - full width
    return (
      <div className="w-full space-y-3">
        {players.map((player, index) => {
          const playerPoints = player.global_points || 0;
          const rankInfo = getPlayerRank(playerPoints);
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="w-full bg-dark-surface/60 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all cursor-pointer touch-manipulation"
              onClick={(e) => handlePlayerRowClick(player, e)}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                minHeight: '120px'
              }}
            >
              {/* Top row: Rank, Avatar, Name, Points */}
              <div className="flex items-center gap-4 mb-3">
                {/* Rank Badge */}
                <div className={`
                  w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-black' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-yellow-700 text-black' :
                    'bg-gray-700/80 text-white border border-gray-600'}
                `}>
                  {index + 1}
                </div>

                {/* Avatar */}
                <Avatar className="w-12 h-12 border-2 border-white/20">
                  <AvatarImage 
                    src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                    alt={player.ign}
                    onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                  />
                  <AvatarFallback className="bg-gray-700 text-white text-sm">
                    {player.ign.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Name and info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    {getDeviceIcon(player.device)}
                    <span className="font-semibold text-white text-lg truncate">
                      {player.ign}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`font-medium ${rankInfo.color}`}>
                      ◆ {rankInfo.title}
                    </span>
                    <span className="text-white/60">({playerPoints} pts)</span>
                  </div>
                </div>

                {/* Region */}
                <span className={`
                  px-3 py-1.5 rounded-full text-sm font-bold
                  ${player.region === 'NA' ? 'bg-red-600/80 text-white' :
                    player.region === 'EU' ? 'bg-green-600/80 text-white' :
                    player.region === 'ASIA' ? 'bg-blue-600/80 text-white' :
                    'bg-gray-600/80 text-white'}
                `}>
                  {player.region || 'NA'}
                </span>
              </div>

              {/* Tier icons row */}
              <div className="flex items-center justify-center gap-3 pt-3 border-t border-white/10">
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
                    <div key={mode} className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-gray-800/80 border border-gray-600/50 flex items-center justify-center mb-1">
                        <GameModeIcon mode={mode} className="w-4 h-4" />
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

  // Desktop table layout - full width
  return (
    <div className="w-full bg-dark-surface/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="grid grid-cols-12 gap-6 px-8 py-5 text-sm font-medium text-white/60 border-b border-white/10 bg-dark-surface/70">
        <div className="col-span-1"></div>
        <div className="col-span-4">PLAYER</div>
        <div className="col-span-2 text-center">REGION</div>
        <div className="col-span-5 text-center">TIERS</div>
      </div>

      {/* Player Rows */}
      <div className="divide-y divide-white/5">
        {players.map((player, index) => {
          const playerPoints = player.global_points || 0;
          const rankInfo = getPlayerRank(playerPoints);
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-12 gap-6 px-8 py-5 hover:bg-white/5 cursor-pointer transition-all group touch-manipulation"
              onClick={(e) => handlePlayerRowClick(player, e)}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              {/* Rank with styled background */}
              <div className="col-span-1 flex items-center">
                <div className={`
                  w-12 h-12 flex items-center justify-center rounded-lg text-lg font-bold relative
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-black' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-yellow-700 text-black' :
                    'bg-gray-700/80 text-white border border-gray-600'}
                `}>
                  {index + 1}
                </div>
              </div>

              {/* Player Info */}
              <div className="col-span-4 flex items-center gap-5">
                <div className="relative">
                  <Avatar className="w-14 h-14 border-2 border-white/20 group-hover:border-white/40 transition-all duration-300">
                    <AvatarImage 
                      src={player.avatar_url || getAvatarUrl(player.ign, player.java_username)}
                      alt={player.ign}
                      onError={(e) => handleAvatarError(e, player.ign, player.java_username)}
                    />
                    <AvatarFallback className="bg-gray-700">
                      {player.ign.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    {getDeviceIcon(player.device)}
                    <span className="text-white font-semibold text-xl group-hover:text-blue-200 transition-colors">
                      {player.ign}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${rankInfo.color} group-hover:brightness-110 transition-all`}>
                      ◆ {rankInfo.title}
                    </span>
                    <span className="text-white/60 text-sm">({playerPoints} points)</span>
                  </div>
                </div>
              </div>

              {/* Region */}
              <div className="col-span-2 flex items-center justify-center">
                <span className={`
                  px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 group-hover:scale-105
                  ${player.region === 'NA' ? 'bg-red-600/80 text-white group-hover:bg-red-500/90' :
                    player.region === 'EU' ? 'bg-green-600/80 text-white group-hover:bg-green-500/90' :
                    player.region === 'ASIA' ? 'bg-blue-600/80 text-white group-hover:bg-blue-500/90' :
                    'bg-gray-600/80 text-white group-hover:bg-gray-500/90'}
                `}>
                  {player.region || 'NA'}
                </span>
              </div>

              {/* Tier Icons with Badges - Using real data */}
              <div className="col-span-5 flex items-center justify-center">
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
                      <div key={mode} className="relative flex flex-col items-center group/tier">
                        {/* Game mode icon */}
                        <div className="w-9 h-9 rounded-full bg-gray-800/80 border border-gray-600/50 flex items-center justify-center hover:bg-gray-700/80 transition-all duration-300 group-hover/tier:scale-110 group-hover/tier:border-white/30 mb-2">
                          <GameModeIcon mode={mode} className="w-5 h-5 group-hover/tier:text-white transition-colors" />
                        </div>
                        {/* Tier badge positioned below - using real data */}
                        <div className={`px-2 py-1 rounded text-xs font-bold ${getTierBadgeColor(tier)} min-w-[32px] text-center transition-all duration-300 group-hover/tier:scale-105`}>
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
