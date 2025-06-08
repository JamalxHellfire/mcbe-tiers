
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
  
  // Additional states for AdminPanel
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isGeneratingData, setIsGeneratingData] = useState(false);
  const [playerCount, setPlayerCount] = useState(50);
  const [ign, setIgn] = useState('');
  const [javaUsername, setJavaUsername] = useState('');
  const [region, setRegion] = useState('');
  const [device, setDevice] = useState('');
  const [formErrors, setFormErrors] = useState<any>({});
  const [tierSelections, setTierSelections] = useState<any>({});

  const handlePinSubmit = async () => {
    setIsSubmitting(true);
    try {
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

  const handleLogout = () => {
    setIsAdminMode(false);
    setPinInputValue('');
    toast.success('Logged out');
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

  const loadPlayerDetails = async (playerId: string) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();

      if (error) throw error;
      setSelectedPlayer(data);
    } catch (error) {
      console.error('Load player error:', error);
      toast.error('Failed to load player details');
    }
  };

  const clearSelectedPlayer = () => {
    setSelectedPlayer(null);
  };

  const updatePlayer = async (playerData: any) => {
    try {
      const { error } = await supabase
        .from('players')
        .update(playerData)
        .eq('id', selectedPlayer.id);

      if (error) throw error;
      toast.success('Player updated successfully');
    } catch (error) {
      console.error('Update player error:', error);
      toast.error('Failed to update player');
    }
  };

  const updatePlayerTier = async (playerId: string, gamemode: string, tier: string) => {
    try {
      const { error } = await supabase
        .from('gamemode_scores')
        .upsert({
          player_id: playerId,
          gamemode,
          internal_tier: tier,
          display_tier: tier,
          score: 0
        });

      if (error) throw error;
      toast.success('Player tier updated successfully');
    } catch (error) {
      console.error('Update tier error:', error);
      toast.error('Failed to update player tier');
    }
  };

  const deletePlayer = async (playerId: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);

      if (error) throw error;
      toast.success('Player deleted successfully');
    } catch (error) {
      console.error('Delete player error:', error);
      toast.error('Failed to delete player');
    }
  };

  const banPlayer = async (playerId: string, reason?: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({ banned: true })
        .eq('id', playerId);

      if (error) throw error;
      toast.success('Player banned successfully');
    } catch (error) {
      console.error('Ban player error:', error);
      toast.error('Failed to ban player');
    }
  };

  const generateTestData = async () => {
    setIsGeneratingData(true);
    try {
      // Basic test data generation
      for (let i = 1; i <= playerCount; i++) {
        const playerData = {
          ign: `TestPlayer${i}`,
          java_username: `JavaPlayer${i}`,
          region: ['NA', 'EU', 'ASIA'][Math.floor(Math.random() * 3)],
          device: ['PC', 'Mobile', 'Console'][Math.floor(Math.random() * 3)],
          global_points: Math.floor(Math.random() * 1000)
        };

        await supabase.from('players').insert(playerData);
      }
      toast.success(`Generated ${playerCount} test players`);
    } catch (error) {
      console.error('Generate test data error:', error);
      toast.error('Failed to generate test data');
    } finally {
      setIsGeneratingData(false);
    }
  };

  const handleTierChange = (gamemode: string, tier: string) => {
    setTierSelections(prev => ({
      ...prev,
      [gamemode]: tier
    }));
  };

  const handleSubmitAllSelectedTiers = async () => {
    try {
      for (const playerId of selectedPlayers) {
        for (const [gamemode, tier] of Object.entries(tierSelections)) {
          await updatePlayerTier(playerId, gamemode, tier as string);
        }
      }
      toast.success('All tier assignments submitted successfully');
      setSelectedPlayers([]);
      setTierSelections({});
    } catch (error) {
      console.error('Submit tiers error:', error);
      toast.error('Failed to submit tier assignments');
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
    setTierSelections({});
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
    handleLogout,
    selectedPlayers,
    tierAssignments,
    searchTerm,
    setSearchTerm,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    selectedPlayer,
    loadPlayerDetails,
    clearSelectedPlayer,
    updatePlayer,
    updatePlayerTier,
    deletePlayer,
    banPlayer,
    generateTestData,
    isGeneratingData,
    playerCount,
    ign,
    setIgn,
    javaUsername,
    setJavaUsername,
    region,
    setRegion,
    device,
    setDevice,
    formErrors,
    tierSelections,
    setTierSelections,
    handleTierChange,
    handleSubmitAllSelectedTiers,
    searchPlayers,
    addTierAssignment,
    removeTierAssignment,
    resetTierSelections,
    togglePlayerSelection,
  };
}
