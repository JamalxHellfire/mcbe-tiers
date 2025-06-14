
import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GameModeIcon } from './GameModeIcon';
import { motion } from 'framer-motion';
import { getPlayerRank } from '@/utils/rankUtils';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';

interface MinecraftLeaderboardTableProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

export const MinecraftLeaderboardTable: React.FC<MinecraftLeaderboardTableProps> = ({
  players,
  onPlayerClick,
}) => {
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

  const handlePlayerRowClick = (player: Player) => {
    onPlayerClick(player);
  };

  return (
    <div className="w-full bg-dark-surface/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-white/60 border-b border-white/10 bg-dark-surface/70">
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
              className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 cursor-pointer transition-all group"
              onClick={() => handlePlayerRowClick(player)}
            >
              {/* Rank with styled background */}
              <div className="col-span-1 flex items-center">
                <div className={`
                  w-10 h-10 flex items-center justify-center rounded-lg text-lg font-bold relative
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-black' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-yellow-700 text-black' :
                    'bg-gray-700/80 text-white border border-gray-600'}
                `}>
                  {index + 1}
                </div>
              </div>

              {/* Player Info */}
              <div className="col-span-4 flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-white/20 group-hover:border-white/40 transition-all duration-300">
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
                  <span className="text-white font-semibold text-lg group-hover:text-blue-200 transition-colors">
                    {player.ign}
                  </span>
                  <div className="flex items-center gap-2">
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
                  px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 group-hover:scale-105
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
                <div className="flex items-center gap-3">
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
                        <div className="w-8 h-8 rounded-full bg-gray-800/80 border border-gray-600/50 flex items-center justify-center hover:bg-gray-700/80 transition-all duration-300 group-hover/tier:scale-110 group-hover/tier:border-white/30 mb-1">
                          <GameModeIcon mode={mode} className="w-4 h-4 group-hover/tier:text-white transition-colors" />
                        </div>
                        {/* Tier badge positioned below - using real data */}
                        <div className={`px-1.5 py-0.5 rounded text-xs font-bold ${getTierBadgeColor(tier)} min-w-[28px] text-center transition-all duration-300 group-hover/tier:scale-105`}>
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
