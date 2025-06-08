
import React from 'react';
import { Player } from '@/services/playerService';
import { PlayerRow } from './PlayerRow';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LeaderboardTableProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  players,
  onPlayerClick,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-center">Region</TableHead>
            <TableHead className="text-center">Device</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player, index) => (
            <PlayerRow
              key={player.id}
              player={player}
              rank={index + 1}
              onClick={() => onPlayerClick(player)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
