
import { useState, useEffect } from 'react';
import { playerService, Player, GameMode } from '@/services/playerService';
import { useQuery } from '@tanstack/react-query';

export function useLeaderboard(gamemode: GameMode = 'overall') {
  const { data: players = [], isLoading: loading, error } = useQuery({
    queryKey: ['leaderboard', gamemode],
    queryFn: async () => {
      try {
        const data = await playerService.getRankedPlayers(gamemode);
        return data;
      } catch (err: any) {
        console.error('Error fetching leaderboard:', err);
        throw new Error(err.message || 'Failed to load leaderboard');
      }
    },
    staleTime: 60000, // 1 minute
  });
  
  return { players, loading, error: error ? (error as Error).message : null };
}
