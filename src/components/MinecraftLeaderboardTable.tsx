
import React from 'react';
import { Player } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GameModeIcon } from './GameModeIcon';
import { motion } from 'framer-motion';
import { Trophy, Star, Medal } from 'lucide-react';

interface MinecraftLeaderboardTableProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

export const MinecraftLeaderboardTable: React.FC<MinecraftLeaderboardTableProps> = ({
  players,
  onPlayerClick,
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <Star className="w-4 h-4 text-blue-400" />;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-yellow-700/20 border-amber-600/30';
    return 'bg-gradient-to-r from-slate-700/30 to-slate-800/30 border-slate-600/30';
  };

  const getCombatRank = (points: number) => {
    if (points >= 300) return { title: 'Combat Master', color: 'text-yellow-400' };
    if (points >= 200) return { title: 'Combat Marshal', color: 'text-red-400' };
    if (points >= 100) return { title: 'Combat Ace', color: 'text-blue-400' };
    return { title: 'Combat Cadet', color: 'text-green-400' };
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-b border-white/10 px-8 py-6">
        <div className="grid grid-cols-12 gap-6 text-sm font-semibold text-white/80 uppercase tracking-wider">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4">Player Info</div>
          <div className="col-span-2 text-center">Region</div>
          <div className="col-span-3 text-center">Combat Rank</div>
          <div className="col-span-2 text-center">Gamemode Tiers</div>
        </div>
      </div>

      {/* Player Rows */}
      <div className="divide-y divide-white/5">
        {players.map((player, index) => {
          const rank = index + 1;
          const combatRank = getCombatRank(player.global_points || 0);
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-12 gap-6 px-8 py-6 hover:bg-white/5 cursor-pointer transition-all duration-300 ${getRankStyle(rank)} border-l-4`}
              onClick={() => onPlayerClick(player)}
              whileHover={{ scale: 1.01 }}
            >
              {/* Enhanced Rank */}
              <div className="col-span-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-1">
                  {getRankIcon(rank)}
                  <span className="text-white font-bold text-lg">#{rank}</span>
                </div>
              </div>

              {/* Enhanced Player Info */}
              <div className="col-span-4 flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-16 h-16 border-3 border-white/20 shadow-lg">
                    <AvatarImage 
                      src={`https://visage.surgeplay.com/bust/128/${player.ign}`}
                      alt={player.ign}
                      className="object-cover object-center"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white text-lg font-bold">
                      {player.ign.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {rank <= 3 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-3 h-3 text-black" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-white font-bold text-xl">{player.ign}</span>
                  <div className="flex items-center gap-2">
                    <span className={`${combatRank.color} text-sm font-medium`}>
                      ◆ {combatRank.title}
                    </span>
                    <span className="text-white/60 text-sm">({player.global_points || 0} pts)</span>
                  </div>
                  {player.java_username && (
                    <span className="text-white/50 text-xs">Java: {player.java_username}</span>
                  )}
                </div>
              </div>

              {/* Enhanced Region */}
              <div className="col-span-2 flex items-center justify-center">
                <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                  player.region === 'NA' ? 'bg-red-600/80 text-white' :
                  player.region === 'EU' ? 'bg-green-600/80 text-white' :
                  player.region === 'ASIA' ? 'bg-blue-600/80 text-white' :
                  player.region === 'OCE' ? 'bg-purple-600/80 text-white' :
                  player.region === 'SA' ? 'bg-yellow-600/80 text-white' :
                  player.region === 'AF' ? 'bg-orange-600/80 text-white' :
                  'bg-gray-600/80 text-white'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    player.region === 'NA' ? 'bg-red-400' :
                    player.region === 'EU' ? 'bg-green-400' :
                    player.region === 'ASIA' ? 'bg-blue-400' :
                    player.region === 'OCE' ? 'bg-purple-400' :
                    player.region === 'SA' ? 'bg-yellow-400' :
                    player.region === 'AF' ? 'bg-orange-400' :
                    'bg-gray-400'
                  }`} />
                  {player.region || 'NA'}
                </div>
              </div>

              {/* Combat Rank Display */}
              <div className="col-span-3 flex items-center justify-center">
                <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${
                  combatRank.title === 'Combat Master' ? 'from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' :
                  combatRank.title === 'Combat Marshal' ? 'from-red-500/20 to-pink-500/20 border border-red-500/30' :
                  combatRank.title === 'Combat Ace' ? 'from-blue-500/20 to-cyan-500/20 border border-blue-500/30' :
                  'from-green-500/20 to-emerald-500/20 border border-green-500/30'
                } backdrop-blur-sm`}>
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-4 h-4 ${combatRank.color}`} />
                    <span className={`font-bold text-sm ${combatRank.color}`}>
                      {combatRank.title.replace('Combat ', '')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Tier Icons */}
              <div className="col-span-2 flex items-center justify-center">
                <div className="flex gap-1 flex-wrap">
                  {['Crystal', 'Sword', 'Mace', 'Axe'].map((gamemode) => (
                    <div key={gamemode} className="relative group">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700/80 to-slate-800/80 border border-white/20 flex items-center justify-center hover:from-slate-600/80 hover:to-slate-700/80 transition-all duration-300 shadow-lg">
                        <GameModeIcon mode={gamemode.toLowerCase()} className="w-5 h-5" />
                      </div>
                      {/* Example tier badge - would be dynamic based on player data */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-md text-xs flex items-center justify-center text-black font-bold shadow-lg">
                        HT1
                      </div>
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                        {gamemode}: HT1
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Footer */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-t border-white/10 px-8 py-4">
        <div className="flex items-center justify-between text-white/60 text-sm">
          <span>Showing top {players.length} players</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>Global Leaderboard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
