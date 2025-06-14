
import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { searchPlayers, Player } from '@/services/playerService';

export function usePlayerSearch() {
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await searchPlayers(debouncedQuery);
        setResults(data || []);
      } catch (err) {
        console.error('Player search error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    performSearch();
  }, [debouncedQuery]);
  
  return {
    query,
    setQuery,
    results,
    isLoading,
    error
  };
}
