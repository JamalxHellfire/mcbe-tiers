
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player, GameMode, TierLevel } from '@/services/playerService';
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

  const updatePlayerTier = async (playerId: string, gamemode: GameMode, tier: TierLevel) => {
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
            player_id: playerId, 
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
        toast({
          title: "Success",
          description: `Tier updated successfully for player ID ${playerId} in ${gamemode}.`,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePlayer = async (playerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);

      if (error) {
        setError(error.message);
      } else {
        setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerId));
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
      const { data: playerData, error: playerUpsertError } = await supabase
        .from('players')
        .upsert(
          { 
            ign, 
            region, 
            device, 
            java_username: java_username || null 
          },
          { onConflict: 'ign' }
        )
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
      }

      toast({
        title: "Success",
        description: `Player ${ign} results submitted successfully.`,
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
