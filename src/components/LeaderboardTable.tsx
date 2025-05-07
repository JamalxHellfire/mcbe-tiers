
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Trophy, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LeaderboardTableProps {
  onPlayerClick: (player: any) => void;
}

export function LeaderboardTable({ onPlayerClick }: LeaderboardTableProps) {
  // Placeholder data for leaderboard
  const placeholderRanks = Array.from({ length: 20 }, (_, i) => ({
    id: `player-${i}`,
    position: i + 1,
    name: `Player_${i + 1}`,
    displayName: `Player ${i + 1}`,
    region: ['NA', 'EU', 'ASIA', 'OCE'][i % 4],
    tiers: `T${(i % 5) + 1}`,
    avatar: `https://crafthead.net/avatar/MHF_Steve${i}`,
    badge: i < 3 ? 'Combat Master' : i < 10 ? 'Combat Ace' : i < 20 ? 'Combat Cadet' : 'Combat Rookie',
    points: 350 - (i * 12),
    device: ['Mobile', 'Console', 'PC'][i % 3]
  }));
  
  // Function to get badge color
  const getBadgeColor = (badge: string) => {
    switch(badge) {
      case 'Combat Master': return 'text-yellow-400';
      case 'Combat Ace': return 'text-orange-400';
      case 'Combat Cadet': return 'text-purple-400';
      default: return 'text-blue-400';
    }
  };
  
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="rounded-xl overflow-hidden bg-[#0B0B0F]/80 backdrop-blur-md border border-white/5 shadow-lg">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-[#121218]/90">
              <TableHead className="w-12 text-center font-semibold text-sm text-gray-400">#</TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead className="font-semibold text-sm text-gray-400">Player</TableHead>
              <TableHead className="hidden sm:table-cell font-semibold text-sm text-center text-gray-400">Region</TableHead>
              <TableHead className="font-semibold text-sm text-gray-400 text-right pr-4">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placeholderRanks.map((player) => {
              // Special styling for top positions
              let borderClass = '';
              let bgClass = 'hover:bg-[#151520]';
              
              if (player.position === 1) {
                borderClass = 'border-l-4 border-yellow-400';
                bgClass = 'bg-[#131313] hover:bg-[#181820]';
              }
              else if (player.position === 2) borderClass = 'border-l-4 border-gray-300';
              else if (player.position === 3) borderClass = 'border-l-4 border-orange-300';
              
              return (
                <motion.tr 
                  key={player.position}
                  className={cn(
                    "cursor-pointer transition-colors",
                    borderClass,
                    bgClass
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: player.position * 0.03 }}
                  onClick={() => onPlayerClick(player)}
                >
                  <TableCell className="font-bold text-center text-lg py-4 w-12">
                    {player.position}
                  </TableCell>
                  <TableCell className="w-12 py-3">
                    <Avatar className={cn(
                      "h-9 w-9 border-2",
                      player.region === 'NA' ? 'border-red-400/30' : 
                      player.region === 'EU' ? 'border-green-400/30' :
                      player.region === 'ASIA' ? 'border-blue-400/30' : 
                      'border-purple-400/30'
                    )}>
                      <AvatarImage src={player.avatar} alt={player.name} />
                      <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-base">{player.displayName}</span>
                      <div className="flex items-center space-x-1">
                        <span className={cn(
                          "text-xs flex items-center",
                          getBadgeColor(player.badge)
                        )}>
                          <Award size={14} className="mr-1" />
                          {player.badge}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      player.region === 'NA' ? 'bg-red-900/30 text-red-400' : 
                      player.region === 'EU' ? 'bg-green-900/30 text-green-400' :
                      player.region === 'ASIA' ? 'bg-blue-900/30 text-blue-400' : 
                      'bg-purple-900/30 text-purple-400'
                    )}>
                      {player.region}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4 font-medium text-yellow-500">
                    {player.points}
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
