
import { useState, useEffect } from 'react';
import { playerService, GameMode, Player, TierLevel } from '@/services/playerService';

export function useGamemodeTiers(gamemode: GameMode) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tierData, setTierData] = useState<Record<TierLevel, Player[]>>({
    'HT1': [], 'LT1': [],
    'HT2': [], 'LT2': [],
    'HT3': [], 'LT3': [],
    'HT4': [], 'LT4': [],
    'HT5': [], 'LT5': []
  });
  
  useEffect(() => {
    const fetchTierData = async () => {
      try {
        setLoading(true);
        const data = await playerService.getPlayersByTierAndGamemode(gamemode);
        setTierData(data);
        setError(null);
      } catch (err: any) {
        console.error(`Error fetching ${gamemode} tier data:`, err);
        setError(err.message || 'Failed to load tier data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTierData();
  }, [gamemode]);
  
  return { tierData, loading, error };
}
