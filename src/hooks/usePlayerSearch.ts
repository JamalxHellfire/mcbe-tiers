
import { useState, useEffect } from 'react';
import { playerService, Player } from '@/services/playerService';
import { useDebounce } from '@/hooks/useDebounce';

export function usePlayerSearch() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    const searchPlayers = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        setPlayers([]);
        return;
      }
      
      setLoading(true);
      
      try {
        // Use supabase directly for ilike search
        const { data, error } = await playerService.supabase
          .from('players')
          .select('*')
          .ilike('ign', `%${debouncedSearchTerm}%`)
          .limit(10);
          
        if (error) {
          console.error('Player search error:', error);
          setPlayers([]);
        } else {
          setPlayers(data || []);
        }
      } catch (error) {
        console.error('Player search error:', error);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    searchPlayers();
  }, [debouncedSearchTerm]);
  
  return {
    searchTerm,
    setSearchTerm,
    loading,
    players,
    selectedPlayer,
    setSelectedPlayer
  };
}
