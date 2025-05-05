
import React, { useState, useEffect } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Trophy, Award, Monitor, Smartphone, Gamepad } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Player } from '@/types';
import { fetchPlayers } from '@/api/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardTableProps {
  onPlayerClick: (player: any) => void;
}

export function LeaderboardTable({ onPlayerClick }: LeaderboardTableProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const playersData = await fetchPlayers();
        setPlayers(playersData);
      } catch (err) {
        console.error("Error fetching players:", err);
        setError("Failed to load leaderboard data");
        toast.error("Failed to load leaderboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Subscribe to realtime changes
    const playersChannel = supabase
      .channel('players-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'players' 
      }, () => {
        loadData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(playersChannel);
    };
  }, []);
  
  // Function to get badge color
  const getBadgeColor = (player: Player) => {
    const points = player.global_points || 0;
    
    if (points > 300) return 'text-yellow-400';
    if (points > 200) return 'text-orange-400';
    if (points > 100) return 'text-purple-400';
    return 'text-blue-400';
  };
  
  // Function to get badge name
  const getBadgeName = (player: Player) => {
    const points = player.global_points || 0;
    
    if (points > 300) return 'Combat Master';
    if (points > 200) return 'Combat Ace';
    if (points > 100) return 'Combat Cadet';
    return 'Combat Rookie';
  };
  
  const getDeviceIcon = (device: string | undefined) => {
    switch(device) {
      case 'PC': return <Monitor size={16} className="mr-1" />;
      case 'Mobile': return <Smartphone size={16} className="mr-1" />;
      case 'Console': return <Gamepad size={16} className="mr-1" />;
      default: return <Monitor size={16} className="mr-1" />;
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
            {isLoading ? (
              [...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="w-12 text-center">
                    <Skeleton className="h-6 w-6 mx-auto" />
                  </TableCell>
                  <TableCell className="w-12">
                    <Skeleton className="h-9 w-9 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    <Skeleton className="h-6 w-16 mx-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-red-400">
                  {error}
                </TableCell>
              </TableRow>
            ) : players.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-white/60">
                  No players found.
                </TableCell>
              </TableRow>
            ) : (
              players.map((player, i) => {
                // Special styling for top positions
                let borderClass = '';
                let bgClass = 'hover:bg-[#151520]';
                
                if (i === 0) {
                  borderClass = 'border-l-4 border-yellow-400';
                  bgClass = 'bg-[#131313] hover:bg-[#181820]';
                }
                else if (i === 1) borderClass = 'border-l-4 border-gray-300';
                else if (i === 2) borderClass = 'border-l-4 border-orange-300';
                
                return (
                  <motion.tr 
                    key={player.id}
                    className={cn(
                      "cursor-pointer transition-colors",
                      borderClass,
                      bgClass
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => onPlayerClick(player)}
                  >
                    <TableCell className="font-bold text-center text-lg py-4 w-12">
                      {i + 1}
                    </TableCell>
                    <TableCell className="w-12 py-3">
                      <Avatar className={cn(
                        "h-9 w-9 border-2",
                        player.region === 'NA' ? 'border-red-400/30' : 
                        player.region === 'EU' ? 'border-green-400/30' :
                        player.region === 'ASIA' ? 'border-blue-400/30' : 
                        'border-purple-400/30'
                      )}>
                        <AvatarImage src={player.avatar_url || `https://crafthead.net/avatar/${player.ign}`} alt={player.ign} />
                        <AvatarFallback>{player.ign.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col">
                        <motion.span 
                          className="font-bold text-base flex items-center gap-1"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.03 + 0.2 }}
                        >
                          {player.ign}
                          <motion.span
                            className="text-xs bg-yellow-600/20 text-yellow-400 px-1.5 rounded-sm flex items-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.03 + 0.3, type: "spring" }}
                          >
                            <Trophy size={10} className="mr-0.5" />
                            #{i + 1}
                          </motion.span>
                        </motion.span>
                        <div className="flex items-center space-x-1">
                          <span className={cn(
                            "text-xs flex items-center",
                            getBadgeColor(player)
                          )}>
                            <Award size={14} className="mr-1" />
                            {getBadgeName(player)}
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
                        {player.region || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4 font-medium text-yellow-500">
                      {player.global_points || 0}
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
