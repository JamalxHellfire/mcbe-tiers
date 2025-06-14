
import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GameModeIcon } from './GameModeIcon';
import { motion } from 'framer-motion';

interface MinecraftLeaderboardTableProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

export const MinecraftLeaderboardTable: React.FC<MinecraftLeaderboardTableProps> = ({
  players,
  onPlayerClick,
}) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-white/60 border-b border-white/10">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-4">PLAYER</div>
        <div className="col-span-2 text-center">REGION</div>
        <div className="col-span-5 text-center">TIERS</div>
      </div>

      {/* Player Rows */}
      <div className="space-y-0">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 cursor-pointer transition-all border-b border-white/5"
            onClick={() => onPlayerClick(player)}
          >
            {/* Rank */}
            <div className="col-span-1 flex items-center justify-center">
              <div className={`
                w-12 h-8 flex items-center justify-center rounded text-sm font-bold
                ${index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' :
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-black' :
                  index === 2 ? 'bg-gradient-to-r from-amber-600 to-yellow-700 text-black' :
                  'bg-gray-700/50 text-white/80'}
              `}>
                {index + 1}.
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
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-sm">
                    ◆ Combat {player.global_points >= 300 ? 'Master' : player.global_points >= 200 ? 'Marshal' : player.global_points >= 100 ? 'Ace' : 'Cadet'}
                  </span>
                  <span className="text-white/60 text-sm">({player.global_points || 0} points)</span>
                </div>
              </div>
            </div>

            {/* Region */}
            <div className="col-span-2 flex items-center justify-center">
              <span className={`
                px-3 py-1 rounded text-sm font-medium
                ${player.region === 'NA' ? 'bg-red-600/80 text-white' :
                  player.region === 'EU' ? 'bg-green-600/80 text-white' :
                  player.region === 'ASIA' ? 'bg-blue-600/80 text-white' :
                  'bg-gray-600/80 text-white'}
              `}>
                {player.region || 'NA'}
              </span>
            </div>

            {/* Tier Icons */}
            <div className="col-span-5 flex items-center justify-center gap-1">
              {['mace', 'sword', 'crystal', 'axe', 'uhc', 'smp', 'nethpot', 'bedwars'].map((gamemode) => (
                <div key={gamemode} className="relative">
                  <div className="w-8 h-8 rounded-full bg-gray-700/50 border border-white/20 flex items-center justify-center">
                    <GameModeIcon mode={gamemode} className="w-4 h-4" />
                  </div>
                  {/* Tier badges would be dynamically added based on player data */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-4 bg-yellow-600 rounded text-xs flex items-center justify-center text-black font-bold">
                    HT1
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
