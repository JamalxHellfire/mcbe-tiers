import { supabase } from '@/integrations/supabase/client';

export type GameMode = 'Crystal' | 'Sword' | 'Bedwars' | 'Mace' | 'SMP' | 'UHC' | 'NethPot' | 'Axe';

export interface Player {
  id: number;
  ign: string;
  java_username: string;
  discord_id?: string;
  avatar_url?: string;
  country?: string;
  region?: 'NA' | 'EU' | 'ASIA';
  global_rank?: number;
  overall_rank?: number;
  global_points?: number;
  tierAssignments?: TierAssignment[];
}

export interface TierAssignment {
  player_id: number;
  gamemode: GameMode;
  tier: string;
  score: number;
}

export async function updatePlayerTierAssignment(
  playerId: number, 
  gameMode: GameMode, 
  tier: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('tier_assignments')
      .upsert({
        player_id: playerId,
        gamemode: gameMode,
        tier: tier,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'player_id,gamemode'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating player tier assignment:', error);
    throw error;
  }
}

export async function getPlayers(): Promise<Player[]> {
  try {
    const { data: players, error } = await supabase
      .from('players')
      .select('*');

    if (error) {
      console.error('Error fetching players:', error);
      throw error;
    }

    return players || [];
  } catch (error) {
    console.error('Error getting players:', error);
    throw error;
  }
}
