
import { useState, useEffect } from 'react';
import { playerService, Player } from '@/services/playerService';

export function useLeaderboard(limit: number = 100) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await playerService.getRankedPlayers(limit);
        setPlayers(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to fetch leaderboard');
        setPlayers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlayers();
  }, [limit]);

  return {
    players,
    isLoading,
    error
  };
}
