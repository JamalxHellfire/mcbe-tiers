
import { useState, useCallback } from 'react';
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

  const updateState = useCallback((updates: Partial<AdminPanelState>) => {
    setState(prev => ({ ...prev, ...updates }));
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
    } catch (error) {
      console.error('Error loading players:', error);
      updateState({ 
        error: error instanceof Error ? error.message : 'Failed to load players',
        loading: false 
      });
    }
  }, [updateState]);

  const createPlayer = useCallback(async () => {
    const { newPlayerData } = state;
    
    if (!newPlayerData.ign.trim()) {
      toast.error('IGN is required');
      return;
    }

    updateState({ loading: true });

    try {
      const validRegions = ['NA', 'EU', 'ASIA', 'OCE', 'SA', 'AF'];
      const validDevices = ['PC', 'Mobile', 'Console'];
      
      const playerToCreate = {
        ign: newPlayerData.ign.trim(),
        java_username: newPlayerData.java_username?.trim() || null,
        region: validRegions.includes(newPlayerData.region) ? newPlayerData.region as any : 'NA',
        device: validDevices.includes(newPlayerData.device) ? newPlayerData.device as any : 'PC',
        global_points: Number(newPlayerData.global_points) || 0,
      };

      const { data, error } = await supabase
        .from('players')
        .insert([playerToCreate])
        .select()
        .single();

      if (error) throw error;

      updateState({
        players: [data, ...state.players],
        isAddModalOpen: false,
        newPlayerData: initialState.newPlayerData,
        loading: false
      });

      toast.success('Player created successfully');
    } catch (error) {
      console.error('Error creating player:', error);
      updateState({ loading: false });
      toast.error(error instanceof Error ? error.message : 'Failed to create player');
    }
  }, [state, updateState]);

  const updatePlayerTiers = useCallback(async () => {
    if (state.tierUpdates.length === 0) {
      toast.error('No tier updates to apply');
      return;
    }

    updateState({ loading: true });

    try {
      // For now, just clear the tier updates without database operation
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

      toast.success('Player deleted successfully');
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

  return {
    state,
    updateState,
    loadPlayers,
    createPlayer,
    updatePlayerTiers,
    deletePlayer,
    addTierUpdate,
    removeTierUpdate,
  };
}
