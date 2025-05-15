
import React, { useState } from 'react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';

interface LeaderboardTableProps {
  onPlayerClick: (player: any) => void;
}

export function LeaderboardTable({ onPlayerClick }: LeaderboardTableProps) {
  const { players, loading, error } = useLeaderboard();
  const [displayCount, setDisplayCount] = useState(20);
  
  const loadMore = () => {
    setDisplayCount(prev => prev + 20);
  };
  
  const visiblePlayers = players.slice(0, displayCount);
  const hasMorePlayers = displayCount < players.length;
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        Error loading leaderboard: {error}
      </div>
    );
  }
  
  if (players.length === 0) {
    return (
      <div className="text-center py-12 text-white/60">
        No players in the leaderboard yet.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="rounded-xl overflow-hidden border border-white/5">
        <Table>
          <TableHeader className="bg-dark-surface/70">
            <TableRow>
              <TableHead className="w-16 text-left">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Region</TableHead>
              <TableHead className="text-right">Device</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {visiblePlayers.map((player, index) => (
                <motion.tr
                  key={player.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="cursor-pointer hover:bg-white/5"
                  onClick={() => onPlayerClick(player)}
                >
                  <TableCell className="font-medium">
                    {index + 1 <= 3 ? (
                      <span className={`
                        inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold
                        ${index === 0 ? 'bg-yellow-500/20 text-yellow-300' : 
                          index === 1 ? 'bg-slate-400/20 text-slate-300' : 
                          'bg-amber-700/20 text-amber-600'}
                      `}>
                        {index + 1}
                      </span>
                    ) : (
                      <span className="pl-2">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={getAvatarUrl(player.avatar_url, player.java_username)} 
                          alt={player.ign}
                          onError={handleAvatarError} 
                        />
                        <AvatarFallback>{player.ign.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{player.ign}</div>
                        <div className="text-xs text-muted-foreground">
                          {player.java_username || 'No Java username'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{player.region || '—'}</TableCell>
                  <TableCell className="text-right">{player.device || '—'}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono">
                      {player.global_points || 0}
                    </Badge>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      
      {hasMorePlayers && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-6"
        >
          <Button 
            onClick={loadMore}
            variant="outline"
            className="flex items-center gap-1"
          >
            Load More <ChevronDown size={14} />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
