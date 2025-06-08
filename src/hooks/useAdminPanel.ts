
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TierAssignment {
  gamemode: string;
  tier: string;
}

export function useAdminPanel() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [pinInputValue, setPinInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [tierAssignments, setTierAssignments] = useState<TierAssignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handlePinSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simple PIN verification - in production this should be more secure
      if (pinInputValue === '1234') {
        setIsAdminMode(true);
        toast.success('Admin mode activated');
      } else {
        toast.error('Invalid PIN');
      }
    } catch (error) {
      toast.error('PIN verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchPlayers = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .ilike('ign', `%${term}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const addTierAssignment = (gamemode: string, tier: string) => {
    setTierAssignments(prev => [
      ...prev.filter(ta => ta.gamemode !== gamemode),
      { gamemode, tier }
    ]);
  };

  const removeTierAssignment = (gamemode: string) => {
    setTierAssignments(prev => prev.filter(ta => ta.gamemode !== gamemode));
  };

  const resetTierSelections = () => {
    setTierAssignments([]);
  };

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  return {
    isAdminMode,
    pinInputValue,
    setPinInputValue,
    isSubmitting,
    handlePinSubmit,
    selectedPlayers,
    tierAssignments,
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    searchPlayers,
    addTierAssignment,
    removeTierAssignment,
    resetTierSelections,
    togglePlayerSelection,
  };
}
