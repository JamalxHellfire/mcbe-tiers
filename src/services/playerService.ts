
import { supabase } from '@/integrations/supabase/client';

export type GameMode = 'Crystal' | 'Sword' | 'Mace' | 'Axe' | 'SMP' | 'UHC' | 'NethPot' | 'Bedwars';
export type TierLevel = 'HT1' | 'LT1' | 'HT2' | 'LT2' | 'HT3' | 'LT3' | 'HT4' | 'LT4' | 'HT5' | 'LT5' | 'Retired' | 'Not Ranked';
export type PlayerRegion = 'NA' | 'EU' | 'ASIA' | 'OCE' | 'SA' | 'AF';
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
  tierAssignments?: {
    gamemode: GameMode;
    tier: TierLevel;
    score: number;
  }[];
}

export async function getLeaderboard(): Promise<Player[]> {
  try {
    console.log('Fetching leaderboard data...');
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('banned', false)
      .order('global_points', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error fetching leaderboard:', error);
      throw error;
    }

    console.log('Raw leaderboard data:', data);

    if (!data || data.length === 0) {
      console.log('No players found in database');
      return [];
    }

    const players: Player[] = await Promise.all(data.map(async (player, index) => {
      // Fetch tier assignments for each player
      const tierAssignments = await getPlayerTierAssignments(player.id);
      
      return {
        id: player.id,
        ign: player.ign,
        region: player.region || 'NA',
        device: player.device || 'PC',
        global_points: player.global_points || 0,
        overall_rank: index + 1,
        java_username: player.java_username,
        avatar_url: player.avatar_url,
        tierAssignments
      };
    }));

    console.log('Processed players:', players);
    return players;
  } catch (error) {
    console.error('Error in getLeaderboard:', error);
    throw error;
  }
}

export async function getPlayerTierAssignments(playerId: string): Promise<{gamemode: GameMode; tier: TierLevel; score: number}[]> {
  try {
    const { data, error } = await supabase
      .from('gamemode_scores')
      .select('gamemode, internal_tier, score')
      .eq('player_id', playerId);

    if (error) {
      console.error('Error fetching tier assignments:', error);
      return [];
    }

    if (!data) return [];

    return data.map(item => ({
      gamemode: item.gamemode as GameMode,
      tier: item.internal_tier as TierLevel,
      score: item.score || 0
    }));
  } catch (error) {
    console.error('Error in getPlayerTierAssignments:', error);
    return [];
  }
}

export async function getGamemodeTiers(gamemode: GameMode): Promise<Player[]> {
  console.log(`Fetching tiers for gamemode: ${gamemode}`);
  
  try {
    const { data, error } = await supabase
      .from('gamemode_scores')
      .select(`
        score,
        internal_tier,
        player_id,
        players!inner (
          id,
          ign,
          region,
          device,
          java_username,
          avatar_url,
          banned
        )
      `)
      .eq('gamemode', gamemode)
      .eq('players.banned', false)
      .order('score', { ascending: false })
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

    const players: Player[] = await Promise.all(data.map(async (item: any, index: number) => {
      const tierAssignments = await getPlayerTierAssignments(item.players.id);
      
      return {
        id: item.players.id,
        ign: item.players.ign,
        region: item.players.region || 'NA',
        device: item.players.device || 'PC',
        global_points: item.score,
        overall_rank: index + 1,
        tier: item.internal_tier,
        java_username: item.players.java_username,
        avatar_url: item.players.avatar_url,
        tierAssignments,
        gamemode_points: {
          [gamemode]: item.score
        }
      };
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
      .eq('banned', false)
      .ilike('ign', `%${query}%`)
      .limit(20);

    if (error) {
      console.error('Error searching players:', error);
      return [];
    }

    if (!data) return [];

    const players: Player[] = await Promise.all(data.map(async player => {
      const tierAssignments = await getPlayerTierAssignments(player.id);
      
      return {
        id: player.id,
        ign: player.ign,
        region: player.region || 'NA',
        device: player.device || 'PC',
        global_points: player.global_points || 0,
        overall_rank: 0,
        java_username: player.java_username,
        avatar_url: player.avatar_url,
        tierAssignments
      };
    }));

    return players;
  } catch (error) {
    console.error('Error in searchPlayers:', error);
    return [];
  }
}

export async function getPlayersByTierAndGamemode(gamemode: GameMode): Promise<{
  [key in TierLevel]?: Player[]
}> {
  console.log(`Fetching tier data for gamemode: ${gamemode}`);
  
  try {
    const { data, error } = await supabase
      .from('gamemode_scores')
      .select(`
        score,
        internal_tier,
        player_id,
        players!inner (
          id,
          ign,
          region,
          device,
          java_username,
          avatar_url,
          banned
        )
      `)
      .eq('gamemode', gamemode)
      .eq('players.banned', false)
      .order('score', { ascending: false });

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

    const tierData: { [key in TierLevel]?: Player[] } = {
      'HT1': [], 'LT1': [],
      'HT2': [], 'LT2': [],
      'HT3': [], 'LT3': [],
      'HT4': [], 'LT4': [],
      'HT5': [], 'LT5': [],
      'Retired': []
    };

    await Promise.all(data.map(async (item: any) => {
      const tierAssignments = await getPlayerTierAssignments(item.players.id);
      
      const player: Player = {
        id: item.players.id,
        ign: item.players.ign,
        region: item.players.region || 'NA',
        device: item.players.device || 'PC',
        global_points: item.score,
        overall_rank: 0,
        tier: item.internal_tier,
        java_username: item.players.java_username,
        avatar_url: item.players.avatar_url,
        tierAssignments,
        gamemode_points: {
          [gamemode]: item.score
        }
      };

      const tier = item.internal_tier as TierLevel;
      if (tierData[tier]) {
        tierData[tier]!.push(player);
      }
    }));

    return tierData;
  } catch (error) {
    console.error('Error in getPlayersByTierAndGamemode:', error);
    throw error;
  }
}
