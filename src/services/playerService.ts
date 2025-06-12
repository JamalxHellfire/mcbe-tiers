import { supabase } from '@/integrations/supabase/client';

// Define the player's regions
export type PlayerRegion = "NA" | "EU" | "ASIA" | "OCE" | "SA" | "AF";

// Define the device types
export type DeviceType = "Mobile" | "PC" | "Console";

// Define the game modes
export type GameMode = "Crystal" | "Sword" | "SMP" | "UHC" | "Axe" | "NethPot" | "Bedwars" | "Mace";

// Define the tier levels
export type TierLevel = "LT5" | "HT5" | "LT4" | "HT4" | "LT3" | "HT3" | "LT2" | "HT2" | "LT1" | "HT1" | "Retired";

// Define the player type
export interface Player {
  id: string;
  ign: string;
  global_points?: number;
  overall_rank?: number;
  badges?: string[];
  java_username?: string;
  avatar_url?: string;
  region?: PlayerRegion;
  device?: DeviceType;
  tiers?: Record<GameMode, {
    tier: TierLevel;
    score: number;
    created_at: string;
    updated_at: string;
    id: string;
  }>;
  banned?: boolean;
}

// Define the tier data type
export interface TierData {
  playerId: string;
  gamemode: GameMode;
  tier: TierLevel;
}

// Define the tier data type
export interface GameModeData {
  HT1: Player[];
  LT1: Player[];
  HT2: Player[];
  LT2: Player[];
  HT3: Player[];
  LT3: Player[];
  HT4: Player[];
  LT4: Player[];
  HT5: Player[];
  LT5: Player[];
  Retired: Player[];
}

// Define the getPlayerByIGN function
export const getPlayerByIGN = async (ign: string): Promise<Player | null> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('ign', ign)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching player by IGN:', error);
      return null;
    }
    
    return data as Player;
  } catch (error) {
    console.error('Failed to fetch player by IGN:', error);
    return null;
  }
};

// Define the getPlayerById function
export const getPlayerById = async (id: string): Promise<Player | null> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching player by ID:', error);
      return null;
    }
    
    return data as Player;
  } catch (error) {
    console.error('Failed to fetch player by ID:', error);
    return null;
  }
};

// Define the create player interface
interface CreatePlayerParams {
  ign: string;
  java_username?: string;
  region?: PlayerRegion;
  device?: DeviceType;
}

// Define the createPlayer function
export const createPlayer = async (params: CreatePlayerParams): Promise<Player | null> => {
  if (!params.ign) {
    console.error('IGN is required to create a player');
    return null;
  }
  
  try {
    // Try to get avatar URL from Minecraft API
    let avatarUrl = null;
    if (params.java_username) {
      try {
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${params.java_username}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.id) {
            avatarUrl = `https://crafatar.com/avatars/${data.id}?overlay=true`;
          }
        }
      } catch (avatarError) {
        console.error('Error fetching avatar:', avatarError);
        // Continue without avatar
      }
    }
    
    // Insert player
    const { data, error } = await supabase
      .from('players')
      .insert({
        ign: params.ign,
        java_username: params.java_username || null,
        region: params.region || null,
        device: params.device || null,
        avatar_url: avatarUrl,
        global_points: 0
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating player:', error);
      return null;
    }
    
    return data as Player;
  } catch (error) {
    console.error('Failed to create player:', error);
    return null;
  }
};

// Define the update player interface
interface UpdatePlayerParams {
  java_username?: string;
  region?: PlayerRegion;
  device?: DeviceType;
}

// Define the updatePlayer function
export const updatePlayer = async (
  playerId: string,
  params: UpdatePlayerParams
): Promise<boolean> => {
  try {
    // Try to get updated avatar URL if java_username is provided
    let avatarUrl = undefined;
    if (params.java_username) {
      try {
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${params.java_username}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.id) {
            avatarUrl = `https://crafatar.com/avatars/${data.id}?overlay=true`;
          }
        }
      } catch (avatarError) {
        console.error('Error fetching avatar:', avatarError);
        // Continue without updating avatar
      }
    }
    
    // Update player
    const { error } = await supabase
      .from('players')
      .update({
        java_username: params.java_username,
        region: params.region,
        device: params.device,
        ...(avatarUrl && { avatar_url: avatarUrl }),
        updated_at: new Date().toISOString()
      })
      .eq('id', playerId);
    
    if (error) {
      console.error('Error updating player:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update player:', error);
    return false;
  }
};

// Define the assignTier function
export const assignTier = async (tierData: TierData): Promise<boolean> => {
  try {
    // Calculate points based on tier
    const points = calculateTierPoints(tierData.tier);
    
    // First check if there's already a gamemode_score for this player
    const { data: existingData, error: existingError } = await supabase
      .from('gamemode_scores')
      .select('*')
      .eq('player_id', tierData.playerId)
      .eq('gamemode', tierData.gamemode)
      .maybeSingle();
      
    if (existingError) {
      console.error('Error checking existing tier:', existingError);
      return false;
    }
    
    if (existingData) {
      // Update existing tier
      const { error } = await supabase
        .from('gamemode_scores')
        .update({
          score: points,
          internal_tier: tierData.tier,
          display_tier: tierData.tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);
        
      if (error) {
        console.error('Error updating tier:', error);
        return false;
      }
    } else {
      // Insert new tier
      const { error } = await supabase
        .from('gamemode_scores')
        .insert({
          player_id: tierData.playerId,
          gamemode: tierData.gamemode,
          score: points,
          internal_tier: tierData.tier,
          display_tier: tierData.tier
        });
        
      if (error) {
        console.error('Error inserting tier:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to assign tier:', error);
    return false;
  }
};

// Helper function to calculate points based on tier
export const calculateTierPoints = (tier: TierLevel): number => {
  switch (tier) {
    case "HT1": return 50;
    case "LT1": return 45;
    case "HT2": return 40;
    case "LT2": return 35;
    case "HT3": return 30;
    case "LT3": return 25;
    case "HT4": return 20;
    case "LT4": return 15;
    case "HT5": return 10;
    case "LT5": return 5;
    case "Retired": return 0;
    default: return 0;
  }
};

// Define the getPlayerTiers function
export const getPlayerTiers = async (playerId: string): Promise<Record<GameMode, any>> => {
  try {
    // Get all tiers for the player
    const { data, error } = await supabase
      .from('gamemode_scores')
      .select('*')
      .eq('player_id', playerId);
      
    if (error) {
      console.error('Error fetching player tiers:', error);
      return {} as Record<GameMode, any>;
    }
    
    // Initialize with default empty structure for all game modes
    const tierRecord: Record<GameMode, any> = {
      Crystal: null,
      Sword: null,
      SMP: null,
      UHC: null,
      Axe: null,
      NethPot: null,
      Bedwars: null,
      Mace: null
    };
    
    // Fill in data for modes that have scores
    data.forEach(item => {
      tierRecord[item.gamemode as GameMode] = {
        tier: item.internal_tier,
        score: item.score,
        created_at: item.created_at,
        updated_at: item.updated_at,
        id: item.id
      };
    });
    
    return tierRecord;
  } catch (error) {
    console.error('Failed to fetch player tiers:', error);
    return {
      Crystal: null,
      Sword: null,
      SMP: null,
      UHC: null,
      Axe: null,
      NethPot: null,
      Bedwars: null,
      Mace: null
    } as Record<GameMode, any>;
  }
};

// Define function to get players by tier and gamemode
export const getPlayersByTierAndGamemode = async (gamemode: GameMode): Promise<GameModeData> => {
  try {
    // Initialize empty structure
    const tierData: GameModeData = {
      HT1: [], LT1: [],
      HT2: [], LT2: [],
      HT3: [], LT3: [],
      HT4: [], LT4: [],
      HT5: [], LT5: [],
      Retired: []
    };
    
    // Get all players with the given gamemode scores
    const { data: gamemodeScores, error: scoresError } = await supabase
      .from('gamemode_scores')
      .select('player_id, internal_tier')
      .eq('gamemode', gamemode);
    
    if (scoresError) {
      console.error(`Error fetching ${gamemode} tier data:`, scoresError);
      return tierData;
    }
    
    if (!gamemodeScores || gamemodeScores.length === 0) {
      return tierData;
    }
    
    // Get all player details for the IDs we found
    const playerIds = gamemodeScores.map(score => score.player_id);
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')
      .in('id', playerIds);
    
    if (playersError) {
      console.error(`Error fetching players for ${gamemode}:`, playersError);
      return tierData;
    }
    
    // Group players by their tier for this gamemode
    players.forEach(player => {
      const score = gamemodeScores.find(score => score.player_id === player.id);
      if (score && score.internal_tier) {
        const tier = score.internal_tier as TierLevel;
        if (tierData[tier]) {
          tierData[tier].push(player as Player);
        }
      }
    });
    
    return tierData;
  } catch (error) {
    console.error(`Failed to fetch ${gamemode} tier data:`, error);
    return {
      HT1: [], LT1: [],
      HT2: [], LT2: [],
      HT3: [], LT3: [],
      HT4: [], LT4: [],
      HT5: [], LT5: [],
      Retired: []
    };
  }
};

// Define function to get ranked players for leaderboard
export const getRankedPlayers = async (): Promise<Player[]> => {
  try {
    const { data, error } = await supabase.rpc('get_ranked_players', { limit_count: 100 });
    
    if (error) {
      console.error('Error fetching ranked players:', error);
      return [];
    }
    
    return data as Player[];
  } catch (error) {
    console.error('Failed to fetch ranked players:', error);
    return [];
  }
};

// Define the deletePlayer function
export const deletePlayer = async (playerId: string): Promise<boolean> => {
  try {
    // First delete all tiers associated with the player
    const { error: tiersError } = await supabase
      .from('gamemode_scores')
      .delete()
      .eq('player_id', playerId);
      
    if (tiersError) {
      console.error('Error deleting player tiers:', tiersError);
      return false;
    }
    
    // Then delete the player
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', playerId);
      
    if (error) {
      console.error('Error deleting player:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete player:', error);
    return false;
  }
};

// Define the banPlayer function
export const banPlayer = async (player: Player): Promise<boolean> => {
  try {
    // First update the player's banned status
    const { error: updateError } = await supabase
      .from('players')
      .update({ banned: true })
      .eq('id', player.id);
      
    if (updateError) {
      console.error('Error updating player banned status:', updateError);
      return false;
    }
    
    // Then add a record to banned_players table
    const { error } = await supabase
      .from('banned_players')
      .insert({
        player_id: player.id,
        ign: player.ign
      });
      
    if (error) {
      console.error('Error adding to banned players:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to ban player:', error);
    return false;
  }
};

// Add missing functions
export const verifyAdminPIN = async (pin: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('verify_admin_pin', { input_pin: pin });
    if (error) {
      console.error('Error verifying admin PIN:', error);
      return false;
    }
    return data && data.length > 0;
  } catch (error) {
    console.error('Failed to verify admin PIN:', error);
    return false;
  }
};

export const updatePlayerGlobalPoints = async (playerId: string): Promise<boolean> => {
  try {
    await supabase.rpc('admin_update_global_points', { player_id: playerId });
    return true;
  } catch (error) {
    console.error('Failed to update player global points:', error);
    return false;
  }
};

export const playerService = {
  getPlayerByIGN,
  getPlayerById,
  createPlayer,
  updatePlayer,
  assignTier,
  getPlayerTiers,
  deletePlayer,
  banPlayer,
  verifyAdminPIN,
  updatePlayerGlobalPoints,
  calculateTierPoints,
  getPlayersByTierAndGamemode,
  getRankedPlayers
};

export default playerService;
