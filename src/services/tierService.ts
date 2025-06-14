
import { supabase } from '@/integrations/supabase/client';
import { Player, GameMode } from './playerService';

export async function getPlayersForTier(gameMode: GameMode): Promise<Record<string, Player[]>> {
  try {
    const { data: players, error } = await supabase
      .from('players')
      .select(`
        *,
        tierAssignments:tier_assignments(*)
      `);

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

    // Group players by their tier assignment for the specific game mode
    players?.forEach(player => {
      const tierAssignment = player.tierAssignments?.find(
        (assignment: any) => assignment.gamemode === gameMode
      );
      
      if (tierAssignment) {
        const tierKey = `tier-${tierAssignment.tier.toLowerCase()}`;
        if (tierGroups[tierKey]) {
          tierGroups[tierKey].push(player);
        } else {
          tierGroups['unassigned'].push(player);
        }
      } else {
        tierGroups['unassigned'].push(player);
      }
    });

    return tierGroups;
  } catch (error) {
    console.error('Error fetching players for tier:', error);
    throw error;
  }
}
