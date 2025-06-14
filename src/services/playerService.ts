
import { supabase } from '@/integrations/supabase/client';

export type GameMode = 'Crystal' | 'Sword' | 'Bedwars' | 'Mace' | 'SMP' | 'UHC' | 'NethPot' | 'Axe';
export type TierLevel = 'HT1' | 'LT1' | 'HT2' | 'LT2' | 'HT3' | 'LT3' | 'HT4' | 'LT4' | 'HT5' | 'LT5' | 'Retired' | 'Not Ranked';

export interface Player {
  id: string;  // Changed from number to string to match database
  ign: string;
  java_username: string;
  discord_id?: string;
  avatar_url?: string;
  country?: string;
  region?: 'NA' | 'EU' | 'ASIA' | 'OCE' | 'SA' | 'AF';
  device?: 'PC' | 'Mobile' | 'Console';
  global_rank?: number;
  overall_rank?: number;
  global_points?: number;
  banned?: boolean;
  created_at?: string;
  updated_at?: string;
  uuid?: string;
  tierAssignments?: TierAssignment[];
}

export interface TierAssignment {
  player_id: string;  // Changed from number to string
  gamemode: GameMode;
  tier: string;
  score: number;
}

export async function updatePlayerTierAssignment(
  playerId: string,  // Changed from number to string
  gameMode: GameMode, 
  tier: string
): Promise<void> {
  try {
    // For now, we'll skip the tier assignment update since the table structure needs clarification
    console.log(`Would update player ${playerId} to tier ${tier} for ${gameMode}`);
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

export async function getLeaderboard(): Promise<Player[]> {
  try {
    const { data: players, error } = await supabase
      .from('players')
      .select('*')
      .order('global_points', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }

    return players || [];
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
}

export async function searchPlayers(query: string): Promise<Player[]> {
  try {
    const { data: players, error } = await supabase
      .from('players')
      .select('*')
      .or(`ign.ilike.%${query}%,java_username.ilike.%${query}%`)
      .limit(20);

    if (error) {
      console.error('Error searching players:', error);
      throw error;
    }

    return players || [];
  } catch (error) {
    console.error('Error searching players:', error);
    throw error;
  }
}

export async function updatePlayerGlobalPoints(playerId: string, points: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('players')
      .update({ global_points: points })
      .eq('id', playerId);

    if (error) {
      console.error('Error updating player global points:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating player global points:', error);
    throw error;
  }
}

export async function getPlayersByTierAndGamemode(gamemode: GameMode): Promise<Record<TierLevel, Player[]>> {
  try {
    const { data: players, error } = await supabase
      .from('players')
      .select('*');

    if (error) {
      console.error('Error fetching players by tier and gamemode:', error);
      throw error;
    }

    // Initialize tier groups
    const tierGroups: Record<TierLevel, Player[]> = {
      'HT1': [], 'LT1': [],
      'HT2': [], 'LT2': [],
      'HT3': [], 'LT3': [],
      'HT4': [], 'LT4': [],
      'HT5': [], 'LT5': [],
      'Retired': [],
      'Not Ranked': []
    };

    // For now, just return players in Not Ranked since we don't have tier assignments yet
    players?.forEach(player => {
      tierGroups['Not Ranked'].push(player);
    });

    return tierGroups;
  } catch (error) {
    console.error('Error getting players by tier and gamemode:', error);
    throw error;
  }
}
