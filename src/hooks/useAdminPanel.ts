
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player, GameMode, TierLevel, updatePlayerGlobalPoints } from '@/services/playerService';
import { useToast } from '@/hooks/use-toast';

interface PlayerResult {
  gamemode: GameMode;
  tier: TierLevel;
  points: number;
}

export const useAdminPanel = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const refreshPlayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('global_points', { ascending: false });

      if (error) {
        console.error('Error fetching players:', error);
        setError(error.message);
      } else {
        console.log('Fetched players:', data);
        setPlayers(data || []);
      }
    } catch (err: any) {
      console.error('Exception in refreshPlayers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePlayerTier = async (playerId: number, gamemode: GameMode, tier: TierLevel) => {
    // Validate inputs
    if (!playerId || isNaN(playerId)) {
      toast({
        title: "Invalid Player ID",
        description: "Player ID must be a valid number",
        variant: "destructive"
      });
      return;
    }

    if (tier === 'Not Ranked') {
      toast({
        title: "Invalid Tier",
        description: "Cannot set tier to 'Not Ranked'",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`Updating player ${playerId} tier for ${gamemode} to ${tier}`);
      
      const { error } = await supabase
        .from('gamemode_scores')
        .upsert(
          { 
            player_id: playerId.toString(), 
            gamemode: gamemode, 
            display_tier: tier,
            internal_tier: tier,
            score: 0
          },
          { onConflict: 'player_id,gamemode' }
        );

      if (error) {
        console.error('Error updating tier:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: `Failed to update tier: ${error.message}`,
          variant: "destructive"
        });
      } else {
        // Automatically update global points
        await updatePlayerGlobalPoints(playerId.toString());
        
        toast({
          title: "Success",
          description: `Tier updated successfully for player ID ${playerId} in ${gamemode}. Global points recalculated.`,
        });
      }
    } catch (err: any) {
      console.error('Exception in updatePlayerTier:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to update tier: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePlayer = async (playerId: number) => {
    // Validate player ID
    if (!playerId || isNaN(playerId)) {
      toast({
        title: "Invalid Player ID",
        description: "Cannot delete player with invalid ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log(`Deleting player with ID: ${playerId}`);
      
      // First delete gamemode scores
      const { error: scoresError } = await supabase
        .from('gamemode_scores')
        .delete()
        .eq('player_id', playerId.toString());

      if (scoresError) {
        console.error('Error deleting gamemode scores:', scoresError);
        throw new Error(`Failed to delete gamemode scores: ${scoresError.message}`);
      }

      // Then delete the player
      const { error: playerError } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId.toString());

      if (playerError) {
        console.error('Error deleting player:', playerError);
        throw new Error(`Failed to delete player: ${playerError.message}`);
      }

      setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerId.toString()));
      toast({
        title: "Success",
        description: `Player ID ${playerId} deleted successfully.`,
      });
    } catch (err: any) {
      console.error('Exception in deletePlayer:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to delete player: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitPlayerResults = async (
    ign: string,
    region: string,
    device: string,
    java_username?: string,
    results?: Array<{ gamemode: GameMode; tier: TierLevel; points: number }>
  ) => {
    try {
      setLoading(true);
      console.log('Submitting player results:', { ign, region, device, java_username, results });

      // Validate inputs
      if (!ign || !ign.trim()) {
        throw new Error('IGN is required');
      }

      const deviceAllowed = ['PC', 'Mobile', 'Console'] as const;
      const regionAllowed = ['NA', 'EU', 'ASIA', 'OCE', 'SA', 'AF'] as const;

      const safeDevice = deviceAllowed.includes(device as typeof deviceAllowed[number])
        ? (device as typeof deviceAllowed[number])
        : 'PC';

      const safeRegion = regionAllowed.includes(region as typeof regionAllowed[number])
        ? (region as typeof regionAllowed[number])
        : 'NA';

      const playerInsertObj = {
        ign: ign.trim(),
        region: safeRegion,
        device: safeDevice,
        java_username: java_username && java_username.trim() ? java_username.trim() : null
      };

      console.log('Upserting player:', playerInsertObj);

      const { data: playerData, error: playerUpsertError } = await supabase
        .from('players')
        .upsert(playerInsertObj, { onConflict: 'ign' })
        .select()
        .single();

      if (playerUpsertError) {
        console.error('Player upsert error:', playerUpsertError);
        throw new Error(`Failed to upsert player: ${playerUpsertError.message}`);
      }

      if (!playerData) {
        throw new Error('No player data returned from upsert');
      }

      console.log('Player upserted successfully:', playerData);
      const playerId = playerData.id;

      if (results && results.length > 0) {
        console.log('Processing gamemode results:', results);
        
        for (const result of results) {
          const { gamemode, tier, points } = result;
          if (tier !== 'Not Ranked') {
            console.log(`Upserting gamemode score: ${gamemode} - ${tier} - ${points}`);
            
            const { error: gamemodeUpsertError } = await supabase
              .from('gamemode_scores')
              .upsert(
                { 
                  player_id: playerId, 
                  gamemode, 
                  display_tier: tier,
                  internal_tier: tier,
                  score: points || 0
                },
                { onConflict: 'player_id,gamemode' }
              );

            if (gamemodeUpsertError) {
              console.error(`Gamemode ${gamemode} upsert error:`, gamemodeUpsertError);
              throw new Error(`Failed to upsert gamemode ${gamemode}: ${gamemodeUpsertError.message}`);
            }
          }
        }
        
        // Automatically calculate and update global points
        console.log('Updating global points for player:', playerId);
        await updatePlayerGlobalPoints(playerId);
      }

      toast({
        title: "Success",
        description: `Player ${ign} results submitted successfully. Global points calculated automatically.`,
      });

      return { success: true, player: playerData };
    } catch (error: any) {
      console.error('Submission error:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: `Failed to submit player results: ${error.message}`,
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    players,
    loading,
    error,
    submitPlayerResults,
    updatePlayerTier,
    refreshPlayers,
    deletePlayer
  };
};
