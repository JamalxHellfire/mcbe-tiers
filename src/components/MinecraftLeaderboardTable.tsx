
import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GameModeIcon } from './GameModeIcon';
import { motion } from 'framer-motion';
import { getPlayerRank } from '@/utils/rankUtils';

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
          const rankInfo = getPlayerRank(player.global_points || 0);
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 cursor-pointer transition-all"
              onClick={() => onPlayerClick(player)}
            >
              {/* Rank with styled background */}
              <div className="col-span-1 flex items-center">
                <div className={`
                  w-10 h-10 flex items-center justify-center rounded-lg text-lg font-bold
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
                <Avatar className="w-12 h-12 border-2 border-white/20">
                  <AvatarImage 
                    src={`https://visage.surgeplay.com/bust/128/${player.ign}`}
                    alt={player.ign}
                  />
                  <AvatarFallback className="bg-gray-700">
                    {player.ign.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-lg">{player.ign}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${rankInfo.color}`}>
                      ◆ {rankInfo.title}
                    </span>
                    <span className="text-white/60 text-sm">({player.global_points || 0} points)</span>
                  </div>
                </div>
              </div>

              {/* Region */}
              <div className="col-span-2 flex items-center justify-center">
                <span className={`
                  px-3 py-1 rounded-full text-sm font-bold
                  ${player.region === 'NA' ? 'bg-red-600/80 text-white' :
                    player.region === 'EU' ? 'bg-green-600/80 text-white' :
                    player.region === 'ASIA' ? 'bg-blue-600/80 text-white' :
                    'bg-gray-600/80 text-white'}
                `}>
                  {player.region || 'NA'}
                </span>
              </div>

              {/* Tier Icons with Badges - Fixed spacing and positioning */}
              <div className="col-span-5 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  {[
                    { mode: 'mace', tier: 'LT2' },
                    { mode: 'sword', tier: 'HT3' },
                    { mode: 'crystal', tier: 'HT1' },
                    { mode: 'axe', tier: 'HT1' },
                    { mode: 'uhc', tier: 'HT1' },
                    { mode: 'smp', tier: 'HT1' },
                    { mode: 'nethpot', tier: 'LT2' },
                    { mode: 'bedwars', tier: 'LT2' }
                  ].map(({ mode, tier }) => (
                    <div key={mode} className="relative flex flex-col items-center">
                      {/* Game mode icon */}
                      <div className="w-8 h-8 rounded-full bg-gray-800/80 border border-gray-600/50 flex items-center justify-center hover:bg-gray-700/80 transition-colors mb-1">
                        <GameModeIcon mode={mode} className="w-4 h-4" />
                      </div>
                      {/* Tier badge positioned below */}
                      <div className={`px-1.5 py-0.5 rounded text-xs font-bold ${getTierBadgeColor(tier)} min-w-[28px] text-center`}>
                        {tier}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
