import React, { useState, useEffect } from 'react';
import { fetchPlayers, fetchGamemodeScores } from '@/api/supabase';
import { Player, GamemodeScore } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Search, Edit, Trash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const PlayerManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<GamemodeScore[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [playersData, scoresData] = await Promise.all([
          fetchPlayers(),
          fetchGamemodeScores()
        ]);
        
        setPlayers(playersData);
        setScores(scoresData);
      } catch (error) {
        console.error('Error loading player data:', error);
        toast.error('Failed to load player data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Subscribe to realtime changes
    const playerSubscription = supabase
      .channel('player-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'players' 
      }, () => {
        loadData();
      })
      .subscribe();
      
    const scoresSubscription = supabase
      .channel('scores-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'gamemode_scores' 
      }, () => {
        loadData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(playerSubscription);
      supabase.removeChannel(scoresSubscription);
    };
  }, []);
  
  const filteredPlayers = searchQuery 
    ? players.filter(player => 
        player.ign.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : players;
  
  const handleEdit = (player: Player) => {
    // In a real implementation, this would open a modal for editing
    toast.info(`Editing ${player.ign}`);
  };
  
  const handleDelete = async (player: Player) => {
    if (window.confirm(`Are you sure you want to delete ${player.ign}?`)) {
      try {
        // Delete player's scores first due to foreign key constraint
        await supabase
          .from("gamemode_scores" as any)
          .delete()
          .eq('player_id', player.id);
          
        // Then delete the player
        await supabase
          .from("players")
          .delete()
          .eq('id', player.id);
          
        toast.success(`Deleted ${player.ign} successfully`);
        
        // Filter out the deleted player
        setPlayers(players.filter(p => p.id !== player.id));
      } catch (error) {
        console.error('Error deleting player:', error);
        toast.error('Failed to delete player');
      }
    }
  };
  
  const playerVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Players Management</h2>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-dark-surface/60 border-white/10"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-dark-surface/40">
                <TableHead>IGN</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Global Points</TableHead>
                <TableHead>Gamemodes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-white/60">
                    No players found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlayers.map((player, i) => {
                  const playerScores = scores.filter(score => score.player_id === player.id);
                  
                  return (
                    <motion.tr 
                      key={player.id}
                      custom={i}
                      variants={playerVariants}
                      initial="hidden"
                      animate="visible"
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <TableCell className="font-semibold">
                        {player.ign}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded bg-opacity-20 text-white">
                          {player.region || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>{player.global_points || 0}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {playerScores.map((score) => (
                            <span 
                              key={score.id} 
                              className="px-2 py-0.5 text-xs rounded bg-blue-900/40 text-blue-300"
                            >
                              {score.gamemode} (Tier {score.display_tier})
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleEdit(player)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10" 
                            onClick={() => handleDelete(player)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
