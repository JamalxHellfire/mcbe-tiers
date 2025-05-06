
import React, { useState, useEffect } from 'react';
import { fetchPlayers, fetchGamemodeScores } from '@/api/supabase';
import { Player, GamemodeScore } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PlayerRow } from '@/components/PlayerRow';
import { Users, Award, ListFilter, Database } from 'lucide-react';

export const StatsOverview = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<GamemodeScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Stats
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [rankedPlayers, setRankedPlayers] = useState(0);
  const [unrankedPlayers, setUnrankedPlayers] = useState(0);
  const [gamemodeStats, setGamemodeStats] = useState<Record<string, number>>({});
  
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
        
        // Calculate stats
        setTotalPlayers(playersData.length);
        
        // Get unique players who have at least one score
        const playerIdsWithScores = new Set(scoresData.map(score => score.player_id));
        setRankedPlayers(playerIdsWithScores.size);
        setUnrankedPlayers(playersData.length - playerIdsWithScores.size);
        
        // Count players per gamemode
        const gamemodePlayerCounts: Record<string, number> = {};
        scoresData.forEach(score => {
          if (!gamemodePlayerCounts[score.gamemode]) {
            gamemodePlayerCounts[score.gamemode] = 0;
          }
          gamemodePlayerCounts[score.gamemode] += 1;
        });
        
        setGamemodeStats(gamemodePlayerCounts);
      } catch (error) {
        console.error('Error loading data for stats:', error);
        toast.error('Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Get top 10 players by global points
  const topPlayers = [...players]
    .sort((a, b) => (b.global_points || 0) - (a.global_points || 0))
    .slice(0, 10);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-dark-surface/60 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-400" />
                Total Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-6 w-1/2" />
              ) : (
                <div className="text-3xl font-bold">{totalPlayers}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-dark-surface/60 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center">
                <Award className="mr-2 h-5 w-5 text-green-400" />
                Ranked Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-6 w-1/2" />
              ) : (
                <div className="text-3xl font-bold">{rankedPlayers}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-dark-surface/60 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center">
                <ListFilter className="mr-2 h-5 w-5 text-yellow-400" />
                Unranked Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-6 w-1/2" />
              ) : (
                <div className="text-3xl font-bold">{unrankedPlayers}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="col-span-1"
        >
          <Card className="bg-dark-surface/60 border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-md flex items-center">
                <Database className="mr-2 h-5 w-5 text-purple-400" />
                Players Per Gamemode
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-6" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.keys(gamemodeStats).length === 0 ? (
                    <p className="text-white/50">No gamemode data available</p>
                  ) : (
                    Object.entries(gamemodeStats)
                      .sort((a, b) => b[1] - a[1])
                      .map(([gamemode, count]) => (
                        <div key={gamemode} className="flex justify-between items-center">
                          <span className="font-medium">{gamemode}</span>
                          <span className="bg-blue-900/20 text-blue-400 px-2 py-0.5 rounded text-sm">
                            {count} players
                          </span>
                        </div>
                      ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="col-span-1"
        >
          <Card className="bg-dark-surface/60 border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-md flex items-center">
                <Award className="mr-2 h-5 w-5 text-yellow-400" />
                Top 10 Players (Global Points)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {topPlayers.length === 0 ? (
                    <p className="text-white/50 p-4">No player data available</p>
                  ) : (
                    topPlayers.map((player, index) => {
                      // Find any score for this player to use in PlayerRow
                      const playerScore = scores.find(s => s.player_id === player.id);
                      
                      if (!playerScore) return null;
                      
                      return (
                        <div key={player.id} className="px-4">
                          <PlayerRow
                            playerScore={playerScore}
                            onClick={() => {}}
                            delay={index * 0.05}
                            showGlobalRank={true}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
