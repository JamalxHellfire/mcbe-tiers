
import { supabase } from '@/integrations/supabase/client';
import { Player, GameMode } from './playerService';

export async function getPlayersForTier(gameMode: GameMode): Promise<Record<string, Player[]>> {
  try {
    const { data: players, error } = await supabase
      .from('players')
      .select('*');

    if (error) throw error;

    // Initialize tier groups
    const tierGroups: Record<string, Player[]> = {
      'tier-1': [],
      'tier-2': [],
      'tier-3': [],
      'tier-4': [],
      'tier-5': [],
      'unassigned': [],
      'retired': []
    };

    // For now, put all players in unassigned since we don't have tier assignment logic yet
    players?.forEach(player => {
      tierGroups['unassigned'].push(player);
    });

    return tierGroups;
  } catch (error) {
    console.error('Error fetching players for tier:', error);
    throw error;
  }
}
