
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
    badge: i < 3 ? 'Combat Master' : 'Combat Ace',
    points: 350 - (i * 12),
    device: ['Mobile', 'Console', 'PC'][i % 3]
  }));
  
  return (
    <div className="w-full animate-fade-in">
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
                <TableRow 
                  key={player.position}
                  className={cn(
                    "cursor-pointer transition-colors",
                    borderClass,
                    bgClass
                  )}
                  style={{ animationDelay: `${player.position * 0.05}s` }}
                  onClick={() => onPlayerClick(player)}
                >
                  <TableCell className="font-bold text-center text-lg py-4 w-12">
                    {player.position}
                  </TableCell>
                  <TableCell className="w-12 py-3">
                    <Avatar className="h-9 w-9 border-2 border-white/10">
                      <AvatarImage src={player.avatar} alt={player.name} />
                      <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-base">{player.displayName}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-white/60">
                          <Trophy size={14} className="inline mr-1 text-yellow-400" />
                          {player.points} points
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
                  <TableCell className="text-right pr-4">
                    <span className="text-tier-1 font-semibold">
                      {player.tiers}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
