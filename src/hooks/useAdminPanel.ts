
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
        setError(error.message);
      } else {
        setPlayers(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePlayerTier = async (playerId: number, gamemode: GameMode, tier: TierLevel) => {
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
        setError(error.message);
      } else {
        // Automatically update global points
        await updatePlayerGlobalPoints(playerId.toString());
        
        toast({
          title: "Success",
          description: `Tier updated successfully for player ID ${playerId} in ${gamemode}. Global points recalculated.`,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePlayer = async (playerId: number) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId.toString());

      if (error) {
        setError(error.message);
      } else {
        setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerId.toString()));
        toast({
          title: "Success",
          description: `Player ID ${playerId} deleted successfully.`,
        });
      }
    } catch (err: any) {
      setError(err.message);
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

      const deviceAllowed = ['PC', 'Mobile', 'Console'] as const;
      const regionAllowed = ['NA', 'EU', 'ASIA', 'OCE', 'SA', 'AF'] as const;

      const safeDevice = deviceAllowed.includes(device as typeof deviceAllowed[number])
        ? (device as typeof deviceAllowed[number])
        : undefined;

      const safeRegion = regionAllowed.includes(region as typeof regionAllowed[number])
        ? (region as typeof regionAllowed[number])
        : undefined;

      const playerInsertObj = {
        ign,
        region: safeRegion,
        device: safeDevice,
        java_username: java_username || null
      };

      const { data: playerData, error: playerUpsertError } = await supabase
        .from('players')
        .upsert(playerInsertObj)
        .select()
        .single();

      if (playerUpsertError) {
        console.error('Player upsert error:', playerUpsertError);
        throw new Error(`Failed to upsert player: ${playerUpsertError.message}`);
      }

      if (!playerData) {
        throw new Error('No player data returned from upsert');
      }

      const playerId = playerData.id;

      if (results && results.length > 0) {
        for (const result of results) {
          const { gamemode, tier, points } = result;
          if (tier !== 'Not Ranked') {
            const { error: gamemodeUpsertError } = await supabase
              .from('gamemode_scores')
              .upsert(
                { 
                  player_id: playerId, 
                  gamemode, 
                  display_tier: tier,
                  internal_tier: tier,
                  score: points 
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
