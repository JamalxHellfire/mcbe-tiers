
import { supabase } from '@/integrations/supabase/client';

export type GameMode = 'Crystal' | 'Sword' | 'Mace' | 'Axe' | 'SMP' | 'UHC' | 'NethPot' | 'Bedwars';
export type TierLevel = 'HT1' | 'LT1' | 'HT2' | 'LT2' | 'HT3' | 'LT3' | 'HT4' | 'LT4' | 'HT5' | 'LT5' | 'Retired' | 'Not Ranked';
export type PlayerRegion = 'NA' | 'EU' | 'AS' | 'OC' | 'SA' | 'AF';
export type DeviceType = 'PC' | 'Mobile' | 'Console';

export interface Player {
  id: string;
  ign: string;
  region: string;
  device?: string;
  global_points: number;
  overall_rank: number;
  tier?: TierLevel;
  avatar_url?: string;
  java_username?: string;
  gamemode_points?: {
    [key in GameMode]?: number;
  };
}

export async function getLeaderboard(): Promise<Player[]> {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('global_points', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }

    const players: Player[] = data.map((player, index) => ({
      id: player.id,
      ign: player.ign,
      region: player.region,
      device: player.device,
      global_points: player.global_points,
      overall_rank: index + 1
    }));

    return players;
  } catch (error) {
    console.error('Error in getLeaderboard:', error);
    throw error;
  }
}

export async function getGamemodeTiers(gamemode: GameMode): Promise<Player[]> {
  console.log(`Fetching tiers for gamemode: ${gamemode}`);
  
  try {
    const { data, error } = await supabase
      .from('gamemode_scores')
      .select(`
        points,
        internal_tier,
        player_id,
        players!inner (
          id,
          ign,
          region,
          device
        )
      `)
      .eq('gamemode', gamemode)
      .order('points', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching gamemode tiers:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log(`No data found for gamemode: ${gamemode}`);
      return [];
    }

    console.log(`Found ${data.length} players for gamemode: ${gamemode}`);

    const players: Player[] = data.map((item: any, index: number) => ({
      id: item.players.id,
      ign: item.players.ign,
      region: item.players.region,
      device: item.players.device,
      global_points: item.points,
      overall_rank: index + 1,
      tier: item.internal_tier,
      gamemode_points: {
        [gamemode]: item.points
      }
    }));

    return players;
  } catch (error) {
    console.error('Error in getGamemodeTiers:', error);
    throw error;
  }
}

export async function searchPlayers(query: string): Promise<Player[]> {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .ilike('ign', `%${query}%`)
      .limit(20);

    if (error) {
      console.error('Error searching players:', error);
      return [];
    }

    return data.map(player => ({
      id: player.id,
      ign: player.ign,
      region: player.region,
      device: player.device,
      global_points: player.global_points,
      overall_rank: 0 // Set a default value or fetch it if needed
    }));
  } catch (error) {
    console.error('Error in searchPlayers:', error);
    return [];
  }
}

// Function to get players by tier and gamemode - this seems to be expected by useGamemodeTiers
export async function getPlayersByTierAndGamemode(gamemode: GameMode): Promise<{
  [key in TierLevel]?: Player[]
}> {
  console.log(`Fetching tier data for gamemode: ${gamemode}`);
  
  try {
    const { data, error } = await supabase
      .from('gamemode_scores')
      .select(`
        points,
        internal_tier,
        player_id,
        players!inner (
          id,
          ign,
          region,
          device
        )
      `)
      .eq('gamemode', gamemode)
      .order('points', { ascending: false });

    if (error) {
      console.error('Error fetching gamemode tier data:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log(`No tier data found for gamemode: ${gamemode}`);
      return {
        'HT1': [], 'LT1': [],
        'HT2': [], 'LT2': [],
        'HT3': [], 'LT3': [],
        'HT4': [], 'LT4': [],
        'HT5': [], 'LT5': [],
        'Retired': []
      };
    }

    // Group players by tier
    const tierData: { [key in TierLevel]?: Player[] } = {
      'HT1': [], 'LT1': [],
      'HT2': [], 'LT2': [],
      'HT3': [], 'LT3': [],
      'HT4': [], 'LT4': [],
      'HT5': [], 'LT5': [],
      'Retired': []
    };

    data.forEach((item: any) => {
      const player: Player = {
        id: item.players.id,
        ign: item.players.ign,
        region: item.players.region,
        device: item.players.device,
        global_points: item.points,
        overall_rank: 0, // Will be set later if needed
        tier: item.internal_tier,
        gamemode_points: {
          [gamemode]: item.points
        }
      };

      const tier = item.internal_tier as TierLevel;
      if (tierData[tier]) {
        tierData[tier]!.push(player);
      }
    });

    return tierData;
  } catch (error) {
    console.error('Error in getPlayersByTierAndGamemode:', error);
    throw error;
  }
}
