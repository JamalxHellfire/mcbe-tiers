
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard, Player } from '@/services/playerService';

export function useLeaderboard() {
  const { data: players = [], isLoading: loading, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      try {
        const data = await getLeaderboard();
        return data;
      } catch (err: any) {
        console.error('Error fetching leaderboard:', err);
        throw new Error(err.message || 'Failed to load leaderboard');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - increased for better performance
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Only fetch if data is stale
  });
  
  return { players, loading, error: error ? (error as Error).message : null };
}
