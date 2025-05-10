
import { useState, useEffect } from 'react';
import { playerService, GameMode, TierLevel, Player } from '@/services/playerService';

export function useGamemodeTiers(gamemode: GameMode, tier: TierLevel) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await playerService.getPlayersByTierAndGamemode(gamemode, tier);
        setPlayers(data);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('Failed to fetch players');
        setPlayers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlayers();
  }, [gamemode, tier]);

  return {
    players,
    isLoading,
    error
  };
}
