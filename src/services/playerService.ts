
// This file contains services for player data management
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export type PlayerRegion = 'NA' | 'EU' | 'ASIA' | 'OCE' | 'SA' | 'AF';
export type DeviceType = 'Mobile' | 'PC' | 'Console';
export type GameMode = 'Crystal' | 'Sword' | 'SMP' | 'UHC' | 'Axe' | 'NethPot' | 'Bedwars' | 'Mace';
export type TierLevel = 'LT5' | 'HT5' | 'LT4' | 'HT4' | 'LT3' | 'HT3' | 'LT2' | 'HT2' | 'LT1' | 'HT1' | 'Retired';

export interface Player {
  id: string;
  ign: string;
  java_username?: string;
  region?: PlayerRegion;
  device?: DeviceType;
  global_points?: number;
  avatar_url?: string;
  badges?: string[];
  created_at?: string;
  updated_at?: string;
}

interface PlayerCreateData {
  ign: string;
  java_username?: string;
  region?: PlayerRegion;
  device?: DeviceType;
}

interface PlayerUpdateData {
  java_username?: string;
  region?: PlayerRegion;
  device?: DeviceType;
  avatar_url?: string;
  badges?: string[];
}

export interface TierAssignment {
  playerId: string;
  gamemode: GameMode;
  tier: TierLevel;
}

interface TierResult {
  tier: TierLevel;
  gamemode: GameMode;
  score: number;
}

// Function to get a player's Minecraft avatar using Crafatar API
export const getPlayerAvatar = async (javaUsername: string): Promise<string | null> => {
  try {
    // First, convert username to UUID
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${javaUsername}`);
    if (!response.ok) {
      console.error('Failed to fetch player UUID:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    if (!data || !data.id) return null;
    
    // Return Crafatar URL with the UUID
    return `https://crafatar.com/avatars/${data.id}?overlay`;
  } catch (error) {
    console.error('Error fetching player avatar:', error);
    return null;
  }
};

// Player service functions
export const playerService = {
  // Get all ranked players
  getRankedPlayers: async (): Promise<Player[]> => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('global_points', { ascending: false });
      
    if (error) {
      console.error('Error fetching ranked players:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Get a specific player by ID
  getPlayerById: async (id: string): Promise<Player | null> => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching player with ID ${id}:`, error);
      return null;
    }
    
    return data || null;
  },
  
  // Get a player by IGN
  getPlayerByIGN: async (ign: string): Promise<Player | null> => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .ilike('ign', ign)
      .single();
      
    if (error) {
      // If not found, we just return null without logging
      if (error.code === 'PGRST116') return null;
      console.error(`Error fetching player with IGN ${ign}:`, error);
      return null;
    }
    
    return data || null;
  },
  
  // Create a new player
  createPlayer: async (playerData: PlayerCreateData): Promise<Player | null> => {
    // Generate avatar URL if Java username is provided
    let avatarUrl = null;
    if (playerData.java_username) {
      avatarUrl = await getPlayerAvatar(playerData.java_username);
    }
    
    // Insert the new player
    const { data, error } = await supabase
      .from('players')
      .insert({
        ign: playerData.ign,
        java_username: playerData.java_username,
        region: playerData.region,
        device: playerData.device,
        avatar_url: avatarUrl,
        gamemode: 'Crystal', // Default gamemode
        tier_number: 'LT5', // Default tier
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating player:', error);
      return null;
    }
    
    return data;
  },
  
  // Mass create players from a list
  massCreatePlayers: async (playersData: PlayerCreateData[]): Promise<number> => {
    if (!playersData || playersData.length === 0) return 0;
    
    // Process players to prepare for insertion
    const preparedPlayers = await Promise.all(
      playersData.map(async (player) => {
        let avatarUrl = null;
        if (player.java_username) {
          avatarUrl = await getPlayerAvatar(player.java_username);
        }
        
        return {
          ign: player.ign,
          java_username: player.java_username,
          region: player.region,
          device: player.device,
          avatar_url: avatarUrl,
          gamemode: 'Crystal' as GameMode, // Default gamemode
          tier_number: 'LT5' as TierLevel, // Default tier
        };
      })
    );
    
    // Insert all players
    const { data, error } = await supabase
      .from('players')
      .insert(preparedPlayers)
      .select();
      
    if (error) {
      console.error('Error mass creating players:', error);
      return 0;
    }
    
    return data?.length || 0;
  },
  
  // Update player information
  updatePlayer: async (id: string, updateData: PlayerUpdateData): Promise<boolean> => {
    // Update avatar URL if Java username is updated
    let finalData = { ...updateData };
    if (updateData.java_username) {
      const avatarUrl = await getPlayerAvatar(updateData.java_username);
      if (avatarUrl) {
        finalData.avatar_url = avatarUrl;
      }
    }
    
    // Update player record
    const { error } = await supabase
      .from('players')
      .update(finalData)
      .eq('id', id);
      
    if (error) {
      console.error(`Error updating player ${id}:`, error);
      return false;
    }
    
    return true;
  },
  
  // Assign a tier to a player for a specific gamemode
  assignTier: async ({ playerId, gamemode, tier }: TierAssignment): Promise<boolean> => {
    // First, check if the player exists
    const player = await playerService.getPlayerById(playerId);
    if (!player) {
      console.error(`Cannot assign tier: Player with ID ${playerId} not found.`);
      return false;
    }
    
    // Calculate points based on the tier
    const points = await supabase.rpc('calculate_tier_points', { tier_value: tier });
    if (!points.data && points.error) {
      console.error('Error calculating tier points:', points.error);
      return false;
    }
    
    const score = points.data || 0;
    
    // Check if this gamemode score already exists for the player
    const { data: existingScore } = await supabase
      .from('gamemode_scores')
      .select('id')
      .eq('player_id', playerId)
      .eq('gamemode', gamemode)
      .single();
      
    if (existingScore) {
      // Update existing score
      const { error } = await supabase
        .from('gamemode_scores')
        .update({
          internal_tier: tier,
          display_tier: tier,
          score,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingScore.id);
        
      if (error) {
        console.error(`Error updating tier for player ${playerId}:`, error);
        return false;
      }
    } else {
      // Create new score record
      const { error } = await supabase
        .from('gamemode_scores')
        .insert({
          player_id: playerId,
          gamemode,
          internal_tier: tier,
          display_tier: tier,
          score,
        });
        
      if (error) {
        console.error(`Error creating tier for player ${playerId}:`, error);
        return false;
      }
    }
    
    return true;
  },
  
  // Get all tier data for a specific gamemode
  getPlayersByTierAndGamemode: async (gamemode: GameMode): Promise<Record<TierLevel, Player[]>> => {
    // Initialize empty tier buckets
    const result: Record<string, Player[]> = {
      'HT1': [], 'LT1': [],
      'HT2': [], 'LT2': [],
      'HT3': [], 'LT3': [],
      'HT4': [], 'LT4': [],
      'HT5': [], 'LT5': [],
      'Retired': []
    };
    
    // Fetch all players with scores for this gamemode
    const { data, error } = await supabase
      .from('gamemode_scores')
      .select(`
        internal_tier,
        players(*)
      `)
      .eq('gamemode', gamemode);
      
    if (error) {
      console.error(`Error fetching players for gamemode ${gamemode}:`, error);
      return result;
    }
    
    // Organize players by their tier
    if (data && data.length > 0) {
      data.forEach(item => {
        const tier = item.internal_tier as TierLevel;
        const player = item.players as unknown as Player;
        
        if (tier && player) {
          if (!result[tier]) result[tier] = [];
          result[tier].push(player);
        }
      });
    }
    
    return result;
  },
  
  // Get a player's tiers across all gamemodes
  getPlayerTiers: async (playerId: string): Promise<Record<GameMode, TierResult>> => {
    const { data, error } = await supabase
      .from('gamemode_scores')
      .select('gamemode, internal_tier, score')
      .eq('player_id', playerId);
      
    if (error) {
      console.error(`Error fetching tiers for player ${playerId}:`, error);
      return {} as Record<GameMode, TierResult>;
    }
    
    // Convert array to record format
    const tiers: Record<string, TierResult> = {};
    if (data) {
      data.forEach(item => {
        tiers[item.gamemode as GameMode] = {
          tier: item.internal_tier as TierLevel,
          gamemode: item.gamemode as GameMode,
          score: item.score
        };
      });
    }
    
    return tiers;
  },
  
  // Check admin PIN function
  verifyAdminPIN: async (pin: string): Promise<boolean> => {
    // This is a simplified approach. In a real system, we'd use proper auth
    // and verify against a hashed PIN in the database.
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('hashed_pin', pin)
      .single();
      
    if (error || !data) {
      return false;
    }
    
    return true;
  },
  
  // Generate fake players for testing
  generateFakePlayers: async (count: number = 10): Promise<number> => {
    const regions: PlayerRegion[] = ['NA', 'EU', 'ASIA', 'OCE', 'SA', 'AF'];
    const devices: DeviceType[] = ['Mobile', 'PC', 'Console'];
    const gameModes: GameMode[] = ['Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'];
    const tiers: TierLevel[] = ['LT5', 'HT5', 'LT4', 'HT4', 'LT3', 'HT3', 'LT2', 'HT2', 'LT1', 'HT1'];
    
    const players: Array<PlayerCreateData & { gamemode: GameMode, tier_number: TierLevel }> = [];
    
    // Generate player data
    for (let i = 0; i < count; i++) {
      const randomRegionIdx = Math.floor(Math.random() * regions.length);
      const randomDeviceIdx = Math.floor(Math.random() * devices.length);
      const randomGamemodeIdx = Math.floor(Math.random() * gameModes.length);
      const randomTierIdx = Math.floor(Math.random() * tiers.length);
      
      players.push({
        ign: `TestPlayer_${i + 1}`,
        java_username: `JavaPlayer_${i + 1}`,
        region: regions[randomRegionIdx],
        device: devices[randomDeviceIdx],
        gamemode: gameModes[randomGamemodeIdx],
        tier_number: tiers[randomTierIdx]
      });
    }
    
    // Insert data
    const { data, error } = await supabase
      .from('players')
      .insert(players)
      .select();
      
    if (error) {
      console.error('Error generating fake players:', error);
      return 0;
    }
    
    // Also create gamemode scores for each player
    if (data && data.length > 0) {
      const scoresToInsert = [];
      
      for (const player of data) {
        const playerGamemodes = [...gameModes];
        const playerGamemodesCount = 3 + Math.floor(Math.random() * 6); // 3-8 gamemodes per player
        
        // Assign random tiers for different gamemodes
        for (let j = 0; j < playerGamemodesCount; j++) {
          const randomGamemodeIdx = Math.floor(Math.random() * playerGamemodes.length);
          const gamemode = playerGamemodes[randomGamemodeIdx];
          playerGamemodes.splice(randomGamemodeIdx, 1); // Remove to avoid duplicates
          
          const randomTierIdx = Math.floor(Math.random() * tiers.length);
          const tier = tiers[randomTierIdx];
          
          // Calculate tier score
          const tierPoints = await supabase.rpc('calculate_tier_points', { tier_value: tier });
          const score = tierPoints.data || 0;
          
          scoresToInsert.push({
            player_id: player.id,
            gamemode: gamemode,
            internal_tier: tier,
            display_tier: tier,
            score: score
          });
        }
      }
      
      // Insert all scores at once
      if (scoresToInsert.length > 0) {
        const { error: scoreError } = await supabase
          .from('gamemode_scores')
          .insert(scoresToInsert);
          
        if (scoreError) {
          console.error('Error generating fake player scores:', scoreError);
        }
      }
    }
    
    return data?.length || 0;
  },
  
  // Wipe all player data (admin function)
  wipeAllData: async (): Promise<boolean> => {
    // First delete all gamemode scores
    const { error: scoreError } = await supabase
      .from('gamemode_scores')
      .delete()
      .neq('id', ''); // Delete all
      
    if (scoreError) {
      console.error('Error deleting scores:', scoreError);
      return false;
    }
    
    // Then delete all players
    const { error: playerError } = await supabase
      .from('players')
      .delete()
      .neq('id', ''); // Delete all
      
    if (playerError) {
      console.error('Error deleting players:', playerError);
      return false;
    }
    
    return true;
  }
};
