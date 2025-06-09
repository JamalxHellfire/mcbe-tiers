
import React from 'react';
import { Player } from '@/services/playerService';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MinecraftLeaderboardTableProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

export const MinecraftLeaderboardTable: React.FC<MinecraftLeaderboardTableProps> = ({
  players,
  onPlayerClick,
}) => {
  const getRankBadgeColor = (position: number) => {
    if (position === 1) return 'bg-yellow-500 text-black'; // Gold
    if (position === 2) return 'bg-gray-300 text-black'; // Silver
    if (position === 3) return 'bg-amber-600 text-white'; // Bronze
    return 'bg-gray-600 text-white';
  };

  const getCombatRank = (points: number) => {
    if (points >= 300) return { title: 'Combat Master', color: 'text-yellow-400', icon: '💎' };
    if (points >= 200) return { title: 'Combat Ace', color: 'text-red-400', icon: '🔸' };
    return { title: 'Fighter', color: 'text-gray-400', icon: '⚔️' };
  };

  const getRegionBadge = (region: string) => {
    switch (region) {
      case 'NA':
        return 'bg-red-600 text-white';
      case 'EU':
        return 'bg-green-600 text-white';
      case 'ASIA':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-400 font-semibold">#</TableHead>
            <TableHead className="text-gray-400 font-semibold">PLAYER</TableHead>
            <TableHead className="text-gray-400 font-semibold text-center">REGION</TableHead>
            <TableHead className="text-gray-400 font-semibold text-center">TIERS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player, index) => {
            const position = index + 1;
            const combatRank = getCombatRank(player.global_points || 0);
            
            return (
              <motion.tr
                key={player.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                onClick={() => onPlayerClick(player)}
              >
                <TableCell>
                  <div className={cn(
                    "w-12 h-8 rounded flex items-center justify-center font-bold text-lg",
                    getRankBadgeColor(position)
                  )}>
                    {position}.
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-700">
                      <img
                        src={`https://visage.surgeplay.com/bust/64/${player.ign}`}
                        alt={player.ign}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-lg">{player.ign}</span>
                      <div className="flex items-center space-x-2">
                        <span className={cn("text-sm font-medium", combatRank.color)}>
                          {combatRank.icon} {combatRank.title}
                        </span>
                        <span className="text-gray-400 text-sm">
                          ({player.global_points || 0} points)
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <span className={cn(
                    "px-2 py-1 rounded text-sm font-medium",
                    getRegionBadge(player.region || 'NA')
                  )}>
                    {player.region || 'NA'}
                  </span>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {/* Mock tier badges - in a real app, this would come from player's tier data */}
                    <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded font-medium">HT1</span>
                    <span className="px-2 py-1 bg-yellow-700 text-white text-xs rounded font-medium">HT1</span>
                    <span className="px-2 py-1 bg-yellow-800 text-white text-xs rounded font-medium">HT1</span>
                    <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded font-medium">LT1</span>
                    <span className="px-2 py-1 bg-orange-700 text-white text-xs rounded font-medium">LT1</span>
                    <span className="px-2 py-1 bg-orange-800 text-white text-xs rounded font-medium">LT1</span>
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded font-medium">LT2</span>
                    <span className="px-2 py-1 bg-purple-700 text-white text-xs rounded font-medium">LT1</span>
                  </div>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
