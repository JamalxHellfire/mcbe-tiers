
import { useState, useEffect } from 'react';
import { playerService, Player } from '@/services/playerService';
import { useQuery } from '@tanstack/react-query';

export function useLeaderboard() {
  const { data: players = [], isLoading: loading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      try {
        const data = await playerService.getRankedPlayers();
        return data;
      } catch (err: any) {
        console.error('Error fetching leaderboard:', err);
        throw new Error(err.message || 'Failed to load leaderboard');
      }
    },
    staleTime: 300000, // Increased to 5 minutes for better caching
    refetchOnWindowFocus: false, // Avoid unnecessary refetches
  });
  
  return { players, loading, error: error ? (error as Error).message : null };
}
