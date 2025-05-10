
import { useState, useEffect } from 'react';
import { supabase } from '@/services/playerService';
import { Player } from '@/services/playerService';
import { toast } from 'sonner';

export function usePlayerSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const searchPlayers = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setPlayers([]);
        return;
      }

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .ilike('ign', `%${searchTerm}%`)
          .order('ign')
          .limit(10);

        if (error) {
          console.error('Error searching players:', error);
          toast.error('Failed to search players');
          setPlayers([]);
        } else {
          setPlayers(data || []);
        }
      } catch (error) {
        console.error('Error searching players:', error);
        toast.error('Failed to search players');
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      searchPlayers();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    players,
    loading,
    selectedPlayer,
    setSelectedPlayer
  };
}
