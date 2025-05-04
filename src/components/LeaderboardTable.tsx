
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

export function LeaderboardTable() {
  // Placeholder data - will be replaced with real data later
  const placeholderRanks = Array.from({ length: 15 }, (_, i) => ({
    position: i + 1,
    username: `Player_${i + 1}`,
    name: `Player ${i + 1}`,
    region: ['NA', 'EU', 'ASIA', 'OCE'][i % 4],
    tiers: `T${(i % 5) + 1}`
  }));
  
  return (
    <div className="w-full animate-fade-in">
      <div className="rounded-xl overflow-hidden bg-[#121212] border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#2b2b2b]">
              <TableHead className="w-16 text-center font-semibold text-sm text-gray-400 uppercase">#</TableHead>
              <TableHead className="w-16 text-center font-semibold text-sm text-gray-400 uppercase">@</TableHead>
              <TableHead className="font-semibold text-sm text-gray-400 uppercase">Player</TableHead>
              <TableHead className="font-semibold text-sm text-gray-400 uppercase">Region</TableHead>
              <TableHead className="font-semibold text-sm text-gray-400 uppercase">Tiers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placeholderRanks.map((rank) => {
              // Special styling for top 3 positions
              let borderClass = '';
              if (rank.position === 1) borderClass = 'border-l-4 border-yellow-400';
              else if (rank.position === 2) borderClass = 'border-l-4 border-gray-300';
              else if (rank.position === 3) borderClass = 'border-l-4 border-orange-300';
              
              return (
                <TableRow 
                  key={rank.position}
                  className={`hover:bg-[#1f1f1f] transition-colors ${borderClass}`}
                  style={{ animationDelay: `${rank.position * 0.05}s` }}
                >
                  <TableCell className="font-bold text-center">
                    {rank.position}
                  </TableCell>
                  <TableCell className="text-center text-gray-400">
                    @{rank.username}
                  </TableCell>
                  <TableCell>
                    {rank.name}
                  </TableCell>
                  <TableCell>
                    {rank.region}
                  </TableCell>
                  <TableCell>
                    {rank.tiers}
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
