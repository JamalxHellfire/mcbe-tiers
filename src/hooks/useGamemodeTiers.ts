
import { useState, useEffect } from 'react';
import { playerService, GameMode, Player, TierLevel } from '@/services/playerService';
import { useQuery } from '@tanstack/react-query';

export function useGamemodeTiers(gamemode: GameMode) {
  const { 
    data: tierData = {
      'HT1': [], 'LT1': [],
      'HT2': [], 'LT2': [],
      'HT3': [], 'LT3': [],
      'HT4': [], 'LT4': [],
      'HT5': [], 'LT5': []
    }, 
    isLoading: loading, 
    error 
  } = useQuery({
    queryKey: ['tierData', gamemode],
    queryFn: async () => {
      try {
        const data = await playerService.getPlayersByTierAndGamemode(gamemode);
        return data;
      } catch (err: any) {
        console.error(`Error fetching ${gamemode} tier data:`, err);
        throw new Error(err.message || 'Failed to load tier data');
      }
    },
    staleTime: 60000, // 1 minute
  });
  
  return { tierData, loading, error: error ? (error as Error).message : null };
}
