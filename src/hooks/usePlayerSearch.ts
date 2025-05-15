
import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { playerService, Player } from '@/services/playerService';

export function usePlayerSearch() {
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const searchPlayers = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Use direct try/catch query without supabase reference
        const { data, error } = await fetch(`/api/players/search?query=${encodeURIComponent(debouncedQuery)}`)
          .then(res => res.json());
          
        if (error) {
          throw new Error(error.message || 'Error searching players');
        }
        
        setResults(data || []);
      } catch (err) {
        console.error('Player search error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    searchPlayers();
  }, [debouncedQuery]);
  
  return {
    query,
    setQuery,
    results,
    isLoading,
    error
  };
}
