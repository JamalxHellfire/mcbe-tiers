
import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { searchPlayers, Player } from '@/services/playerService';

export function usePlayerSearch() {
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 500); // Increased debounce time for better performance
  const [results, setResults] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Memoize the search function to prevent unnecessary re-renders
  const performSearch = useMemo(() => async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Searching for players with query:', searchQuery);
      const data = await searchPlayers(searchQuery);
      console.log('Search results received:', data?.length || 0, 'players');
      setResults(data || []);
    } catch (err) {
      console.error('Player search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);
  
  return {
    query,
    setQuery,
    results,
    isLoading,
    error
  };
}
