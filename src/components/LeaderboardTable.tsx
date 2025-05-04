
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

export function LeaderboardTable() {
  // Placeholder data - will be replaced with real data later
  const placeholderRanks = Array.from({ length: 10 }, (_, i) => ({
    position: i + 1,
    username: `Player_${i + 1}`,
    name: `Player ${i + 1}`,
    region: ['NA', 'EU', 'ASIA', 'OCE'][i % 4],
    tiers: `T${(i % 5) + 1}`,
    badge: i < 3 ? 'Combat Master' : 'Combat Ace',
    points: 350 - (i * 20)
  }));
  
  return (
    <div className="w-full animate-fade-in">
      <div className="rounded-xl overflow-hidden bg-[#0B0B0F] border border-white/5 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#121218]">
              <TableHead className="w-16 text-center font-semibold text-xs md:text-sm text-gray-400 uppercase">#</TableHead>
              <TableHead className="font-semibold text-xs md:text-sm text-gray-400 uppercase">Player</TableHead>
              <TableHead className="font-semibold text-xs md:text-sm text-gray-400 uppercase text-center">Region</TableHead>
              <TableHead className="font-semibold text-xs md:text-sm text-gray-400 uppercase text-right pr-4">Tiers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placeholderRanks.map((rank) => {
              // Special styling for top 3 positions
              let borderClass = '';
              let bgClass = 'bg-[#0B0B0F]';
              
              if (rank.position === 1) {
                borderClass = 'border-l-4 border-yellow-400';
                bgClass = 'bg-[#131313]';
              }
              else if (rank.position === 2) borderClass = 'border-l-4 border-gray-300';
              else if (rank.position === 3) borderClass = 'border-l-4 border-orange-300';
              
              return (
                <TableRow 
                  key={rank.position}
                  className={`hover:bg-[#151520] transition-colors ${borderClass} ${bgClass}`}
                  style={{ animationDelay: `${rank.position * 0.05}s` }}
                >
                  <TableCell className="font-bold text-center text-xl md:text-2xl py-4">
                    {rank.position}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-base md:text-lg">{rank.name}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-yellow-400">
                          <Trophy size={14} className="inline mr-1" />
                          {rank.badge}
                        </span>
                        <span className="text-xs text-gray-400">({rank.points} points)</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium 
                      ${rank.region === 'NA' ? 'bg-red-900/30 text-red-400' : 
                        rank.region === 'EU' ? 'bg-green-900/30 text-green-400' :
                        rank.region === 'ASIA' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'}`}>
                      {rank.region}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex justify-end gap-1">
                      {Array(3).fill(0).map((_, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded text-xs bg-gray-800 text-white">
                          {i === 0 ? 'HT1' : i === 1 ? 'LT2' : 'HT3'}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="text-center mt-4 text-sm text-gray-500">
        Early version - Player rankings and tiers will be updated soon
      </div>
    </div>
  );
}
