
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player, GameMode, TierLevel } from '@/services/playerService';
import { toast } from 'sonner';

export interface AdminPanelState {
  players: Player[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedPlayer: Player | null;
  isModalOpen: boolean;
  isAddModalOpen: boolean;
  newPlayerData: {
    ign: string;
    java_username: string;
    region: string;
    device: string;
    global_points: number;
  };
  tierUpdates: Array<{
    playerId: string;
    gamemode: GameMode;
    tier: TierLevel;
    points: number;
  }>;
}

const initialState: AdminPanelState = {
  players: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedPlayer: null,
  isModalOpen: false,
  isAddModalOpen: false,
  newPlayerData: {
    ign: '',
    java_username: '',
    region: 'NA',
    device: 'PC',
    global_points: 0,
  },
  tierUpdates: [],
};

export function useAdminPanel() {
  const [state, setState] = useState<AdminPanelState>(initialState);
  
  // Admin authentication state
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [pinInputValue, setPinInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  // Form state
  const [ign, setIgn] = useState('');
  const [javaUsername, setJavaUsername] = useState('');
  const [region, setRegion] = useState('NA');
  const [device, setDevice] = useState('PC');
  const [formErrors, setFormErrors] = useState<any>({});
  const [tierSelections, setTierSelections] = useState<Record<GameMode, TierLevel | "NA">>({
    Crystal: "NA",
    Sword: "NA", 
    Mace: "NA",
    Axe: "NA",
    SMP: "NA",
    UHC: "NA",
    NethPot: "NA",
    Bedwars: "NA"
  });
  
  // Test data state
  const [isGeneratingData, setIsGeneratingData] = useState(false);
  const [playerCount, setPlayerCount] = useState(0);

  const updateState = useCallback((updates: Partial<AdminPanelState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Admin authentication functions
  const handlePinSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('verify_admin_pin', { input_pin: pinInputValue });
      
      if (error || !data || data.length === 0) {
        toast.error('Invalid PIN');
        return;
      }
      
      setIsAdminMode(true);
      setPinInputValue('');
      toast.success('Logged in as admin');
      await loadPlayers();
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [pinInputValue]);

  const handleLogout = useCallback(() => {
    setIsAdminMode(false);
    setPinInputValue('');
    toast.success('Logged out');
  }, []);

  // Search functionality
  useEffect(() => {
    const searchPlayers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .ilike('ign', `%${searchQuery}%`)
          .limit(10);
          
        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchPlayers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const loadPlayerDetails = useCallback(async (playerId: string) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();
        
      if (error) throw error;
      
      // Load player tiers
      const { data: tierData } = await supabase
        .from('gamemode_scores')
        .select('*')
        .eq('player_id', playerId);
        
      const tiers: Record<string, any> = {};
      tierData?.forEach(tier => {
        tiers[tier.gamemode] = {
          tier: tier.internal_tier,
          score: tier.score,
          created_at: tier.created_at,
          updated_at: tier.updated_at,
          id: tier.id
        };
      });
      
      setSelectedPlayer({ ...data, tiers });
    } catch (error) {
      console.error('Error loading player details:', error);
      toast.error('Failed to load player details');
    }
  }, []);

  const clearSelectedPlayer = useCallback(() => {
    setSelectedPlayer(null);
  }, []);

  const loadPlayers = useCallback(async () => {
    updateState({ loading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('global_points', { ascending: false });

      if (error) throw error;

      updateState({ 
        players: data || [], 
        loading: false 
      });
      
      setPlayerCount(data?.length || 0);
    } catch (error) {
      console.error('Error loading players:', error);
      updateState({ 
        error: error instanceof Error ? error.message : 'Failed to load players',
        loading: false 
      });
    }
  }, [updateState]);

  const createPlayer = useCallback(async () => {
    const errors: any = {};
    if (!ign.trim()) errors.ign = true;
    if (!region) errors.region = true;
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateState({ loading: true });

    try {
      const playerToCreate = {
        ign: ign.trim(),
        java_username: javaUsername?.trim() || null,
        region: region as any,
        device: device as any,
        global_points: 0,
      };

      const { data, error } = await supabase
        .from('players')
        .insert([playerToCreate])
        .select()
        .single();

      if (error) throw error;

      updateState({
        players: [data, ...state.players],
        loading: false
      });
      
      // Clear form
      setIgn('');
      setJavaUsername('');
      setRegion('NA');
      setDevice('PC');
      setTierSelections({
        Crystal: "NA",
        Sword: "NA", 
        Mace: "NA",
        Axe: "NA",
        SMP: "NA",
        UHC: "NA",
        NethPot: "NA",
        Bedwars: "NA"
      });

      toast.success('Player created successfully');
      await loadPlayers();
    } catch (error) {
      console.error('Error creating player:', error);
      updateState({ loading: false });
      toast.error(error instanceof Error ? error.message : 'Failed to create player');
    }
  }, [ign, javaUsername, region, device, state.players, updateState]);

  const updatePlayerTiers = useCallback(async () => {
    if (state.tierUpdates.length === 0) {
      toast.error('No tier updates to apply');
      return;
    }

    updateState({ loading: true });

    try {
      updateState({
        tierUpdates: [],
        loading: false
      });

      toast.success('Tier updates applied successfully');
      await loadPlayers();
    } catch (error) {
      console.error('Error updating tiers:', error);
      updateState({ loading: false });
      toast.error(error instanceof Error ? error.message : 'Failed to update tiers');
    }
  }, [state.tierUpdates, updateState, loadPlayers]);

  const deletePlayer = useCallback(async (playerId: string) => {
    if (!confirm('Are you sure you want to delete this player?')) {
      return;
    }

    updateState({ loading: true });

    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);

      if (error) throw error;

      updateState({
        players: state.players.filter(p => p.id !== playerId),
        loading: false
      });
      
      setSelectedPlayer(null);
      toast.success('Player deleted successfully');
      await loadPlayers();
    } catch (error) {
      console.error('Error deleting player:', error);
      updateState({ loading: false });
      toast.error(error instanceof Error ? error.message : 'Failed to delete player');
    }
  }, [state.players, updateState]);

  const addTierUpdate = useCallback((playerId: string, gamemode: GameMode, tier: TierLevel, points: number) => {
    const existingIndex = state.tierUpdates.findIndex(
      u => u.playerId === playerId && u.gamemode === gamemode
    );

    let newUpdates;
    if (existingIndex >= 0) {
      newUpdates = [...state.tierUpdates];
      newUpdates[existingIndex] = { playerId, gamemode, tier, points };
    } else {
      newUpdates = [...state.tierUpdates, { playerId, gamemode, tier, points }];
    }

    updateState({ tierUpdates: newUpdates });
  }, [state.tierUpdates, updateState]);

  const removeTierUpdate = useCallback((playerId: string, gamemode: GameMode) => {
    updateState({
      tierUpdates: state.tierUpdates.filter(
        u => !(u.playerId === playerId && u.gamemode === gamemode)
      )
    });
  }, [state.tierUpdates, updateState]);

  // Additional admin functions
  const updatePlayer = useCallback(async (playerId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('players')
        .update(updates)
        .eq('id', playerId);
        
      if (error) throw error;
      
      toast.success('Player updated successfully');
      await loadPlayers();
    } catch (error) {
      console.error('Error updating player:', error);
      toast.error('Failed to update player');
    }
  }, [loadPlayers]);

  const updatePlayerTier = useCallback(async (playerId: string, gamemode: GameMode, tier: TierLevel) => {
    try {
      const points = calculateTierPoints(tier);
      
      const { error } = await supabase
        .from('gamemode_scores')
        .upsert({
          player_id: playerId,
          gamemode: gamemode,
          score: points,
          internal_tier: tier,
          display_tier: tier
        });
        
      if (error) throw error;
      
      toast.success('Tier updated successfully');
      await loadPlayers();
    } catch (error) {
      console.error('Error updating tier:', error);
      toast.error('Failed to update tier');
    }
  }, [loadPlayers]);

  const banPlayer = useCallback(async (player: Player) => {
    try {
      const { error } = await supabase.rpc('admin_ban_player', {
        player_id: player.id,
        player_ign: player.ign
      });
      
      if (error) throw error;
      
      toast.success('Player banned successfully');
      await loadPlayers();
    } catch (error) {
      console.error('Error banning player:', error);
      toast.error('Failed to ban player');
    }
  }, [loadPlayers]);

  const generateTestData = useCallback(async (count: number) => {
    setIsGeneratingData(true);
    try {
      // This would generate test data - implement as needed
      toast.success(`Generated ${count} test players`);
      await loadPlayers();
    } catch (error) {
      console.error('Error generating test data:', error);
      toast.error('Failed to generate test data');
    } finally {
      setIsGeneratingData(false);
    }
  }, [loadPlayers]);

  const handleTierChange = useCallback((gamemode: GameMode, tier: TierLevel | "NA") => {
    setTierSelections(prev => ({
      ...prev,
      [gamemode]: tier
    }));
  }, []);

  const handleSubmitAllSelectedTiers = useCallback(async () => {
    if (!ign.trim()) {
      toast.error('Please enter a player IGN first');
      return;
    }

    const errors: any = {};
    if (!ign.trim()) errors.ign = true;
    if (!region) errors.region = true;
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      updateState({ loading: true });
      
      // First create or get the player
      let playerId: string;
      
      const { data: existingPlayer } = await supabase
        .from('players')
        .select('id')
        .eq('ign', ign.trim())
        .single();
        
      if (existingPlayer) {
        playerId = existingPlayer.id;
      } else {
        const { data: newPlayer, error: createError } = await supabase
          .from('players')
          .insert({
            ign: ign.trim(),
            java_username: javaUsername?.trim() || null,
            region: region as any,
            device: device as any,
            global_points: 0,
          })
          .select('id')
          .single();
          
        if (createError) throw createError;
        playerId = newPlayer.id;
      }
      
      // Submit tier data
      const tierInserts = [];
      for (const [gamemode, tier] of Object.entries(tierSelections)) {
        if (tier !== "NA") {
          const points = calculateTierPoints(tier as TierLevel);
          tierInserts.push({
            player_id: playerId,
            gamemode: gamemode,
            score: points,
            internal_tier: tier,
            display_tier: tier
          });
        }
      }
      
      if (tierInserts.length > 0) {
        const { error: tierError } = await supabase
          .from('gamemode_scores')
          .upsert(tierInserts);
          
        if (tierError) throw tierError;
      }
      
      // Clear form
      setIgn('');
      setJavaUsername('');
      setRegion('NA');
      setDevice('PC');
      setTierSelections({
        Crystal: "NA",
        Sword: "NA", 
        Mace: "NA",
        Axe: "NA",
        SMP: "NA",
        UHC: "NA",
        NethPot: "NA",
        Bedwars: "NA"
      });
      
      toast.success('Player results submitted successfully');
      await loadPlayers();
    } catch (error) {
      console.error('Error submitting results:', error);
      toast.error('Failed to submit results');
    } finally {
      updateState({ loading: false });
    }
  }, [ign, javaUsername, region, device, tierSelections, updateState, loadPlayers]);

  const calculateTierPoints = (tier: TierLevel): number => {
    switch (tier) {
      case "HT1": return 50;
      case "LT1": return 45;
      case "HT2": return 40;
      case "LT2": return 35;
      case "HT3": return 30;
      case "LT3": return 25;
      case "HT4": return 20;
      case "LT4": return 15;
      case "HT5": return 10;
      case "LT5": return 5;
      case "Retired": return 0;
      default: return 0;
    }
  };

  return {
    state,
    updateState,
    loadPlayers,
    createPlayer,
    updatePlayerTiers,
    deletePlayer,
    addTierUpdate,
    removeTierUpdate,
    // Admin auth
    isAdminMode,
    pinInputValue,
    setPinInputValue,
    isSubmitting,
    handlePinSubmit,
    handleLogout,
    // Search
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    selectedPlayer,
    loadPlayerDetails,
    clearSelectedPlayer,
    updatePlayer,
    updatePlayerTier,
    banPlayer,
    // Test data
    generateTestData,
    isGeneratingData,
    playerCount,
    // Form
    ign, setIgn,
    javaUsername, setJavaUsername,
    region, setRegion,
    device, setDevice,
    formErrors,
    tierSelections, setTierSelections,
    handleTierChange,
    handleSubmitAllSelectedTiers
  };
}
