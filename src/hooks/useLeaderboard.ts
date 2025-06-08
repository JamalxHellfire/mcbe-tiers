
import { useQuery } from '@tanstack/react-query';
import { playerService, Player } from '@/services/playerService';

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
    staleTime: 60000, // 1 minute
  });
  
  return { players, loading, error: error ? (error as Error).message : null };
}
