
import { createClient } from '@supabase/supabase-js';

// Define the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ygggfrjwrddpigblfowy.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZ2dmcmp3cmRkcGlnYmxmb3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MTkyMDMsImV4cCI6MjA2MTI5NTIwM30.eAafDrsDXOJlqO8940KQVTje8BTZjnY4450CiP3NfDM";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and key must be defined in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Update enums to use string literal types to match component usage
export type PlayerRegion = 'NA' | 'EU' | 'ASIA' | 'OCE' | 'SA' | 'AF';
export const PlayerRegion = {
  NA: 'NA' as PlayerRegion,
  EU: 'EU' as PlayerRegion,
  ASIA: 'ASIA' as PlayerRegion,
  OCE: 'OCE' as PlayerRegion,
  SA: 'SA' as PlayerRegion,
  AF: 'AF' as PlayerRegion
};

export type DeviceType = 'Mobile' | 'Console' | 'PC' | 'Touch';
export const DeviceType = {
  MOBILE: 'Mobile' as DeviceType,
  CONTROLLER: 'Console' as DeviceType,
  KEYBOARD: 'PC' as DeviceType,
  TOUCH: 'Touch' as DeviceType
};

export type GameMode = 'SMP' | 'Mace' | 'Bedwars' | 'Crystal' | 'Sword' | 'UHC' | 'Axe' | 'NethPot' | 'UNRANKED';
export const GameMode = {
  SMP: 'SMP' as GameMode,
  MACE: 'Mace' as GameMode,
  BEDWARS: 'Bedwars' as GameMode,
  CRYSTAL: 'Crystal' as GameMode,
  SWORD: 'Sword' as GameMode,
  UHC: 'UHC' as GameMode,
  AXE: 'Axe' as GameMode,
  NETHPOT: 'NethPot' as GameMode,
  UNRANKED: 'UNRANKED' as GameMode
};

export type TierLevel = 'LT5' | 'HT5' | 'LT4' | 'HT4' | 'LT3' | 'HT3' | 'LT2' | 'HT2' | 'LT1' | 'HT1';
export const TierLevel = {
  LT5: 'LT5' as TierLevel,
  HT5: 'HT5' as TierLevel,
  LT4: 'LT4' as TierLevel,
  HT4: 'HT4' as TierLevel,
  LT3: 'LT3' as TierLevel,
  HT3: 'HT3' as TierLevel,
  LT2: 'LT2' as TierLevel,
  HT2: 'HT2' as TierLevel,
  LT1: 'LT1' as TierLevel,
  HT1: 'HT1' as TierLevel
};

export interface Player {
  id: string;
  created_at: string;
  ign: string;
  java_username?: string;
  region?: PlayerRegion;
  device?: DeviceType;
  gamemode: GameMode;
  tier_number: number;
  avatar_url?: string;
}

export interface PlayerCreateData {
  ign: string;
  java_username?: string;
  region?: PlayerRegion;
  device?: DeviceType;
}

export interface TierAssignment {
  playerId: string;
  gamemode: GameMode;
  tier: TierLevel;
}

export interface BulkSubmissionData {
  ign: string;
  gamemode: GameMode;
  tier: TierLevel;
  region?: PlayerRegion;
}

export interface AdditionalPlayerInfo {
  javaUsername?: string;
  region?: PlayerRegion;
  device?: DeviceType;
  notes?: string;
}

// Interface for gamemode scores
export interface GamemodeScore {
  id: string;
  player_id: string;
  gamemode: string;
  internal_tier: string;
  display_tier: string;
  score: number;
  created_at: string;
  updated_at: string;
}

// Helper function to convert TierLevel to a numerical value
export function getTierPointValue(tier: TierLevel): number {
  switch (tier) {
    case TierLevel.HT1: return 10;
    case TierLevel.LT1: return 9;
    case TierLevel.HT2: return 8;
    case TierLevel.LT2: return 7;
    case TierLevel.HT3: return 6;
    case TierLevel.LT3: return 5;
    case TierLevel.HT4: return 4;
    case TierLevel.LT4: return 3;
    case TierLevel.HT5: return 2;
    case TierLevel.LT5: return 1;
    default: return 0;
  }
}

/**
 * Get a player by their IGN (In-Game Name)
 * @param ign The IGN of the player
 * @returns Player object if found, null otherwise
 */
async function getPlayerByIGN(ign: string): Promise<Player | null> {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('ign', ign)
      .single();

    if (error) {
      console.error('Error fetching player by IGN:', error);
      return null;
    }

    return data ? data as Player : null;
  } catch (error) {
    console.error('Error fetching player by IGN:', error);
    return null;
  }
}

/**
 * Create a new player
 * @param player The player data to create
 * @returns Player object if created, null otherwise
 */
async function createPlayer(player: PlayerCreateData): Promise<Player | null> {
  try {
    const { data, error } = await supabase
      .from('players')
      .insert([
        {
          ign: player.ign,
          java_username: player.java_username,
          region: player.region,
          device: player.device,
          gamemode: 'UNRANKED', // Default gamemode for new players
          tier_number: 0      // Default tier for new players
        }
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating player:', error);
      return null;
    }

    return data ? data as Player : null;
  } catch (error) {
    console.error('Error creating player:', error);
    return null;
  }
}

/**
 * Update an existing player
 * @param id The ID of the player to update
 * @param updates The updates to apply to the player
 * @returns Player object if updated, null otherwise
 */
async function updatePlayer(id: string, updates: Partial<Player>): Promise<Player | null> {
  try {
    const { data, error } = await supabase
      .from('players')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating player:', error);
      return null;
    }

    return data ? data as Player : null;
  } catch (error) {
    console.error('Error updating player:', error);
    return null;
  }
}

/**
 * Assign a tier to a player for a specific game mode
 * @param assignment The tier assignment data
 * @returns True if the tier was assigned, false otherwise
 */
async function assignTier(assignment: TierAssignment): Promise<boolean> {
  try {
    const tierNumber = getTierPointValue(assignment.tier);

    const { data, error } = await supabase
      .from('players')
      .update({
        gamemode: assignment.gamemode,
        tier_number: tierNumber
      })
      .eq('id', assignment.playerId);

    if (error) {
      console.error('Error assigning tier:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error assigning tier:', error);
    return false;
  }
}

/**
 * Submit a player result, creating the player if they don't exist
 * @param ign The IGN of the player
 * @param gamemode The game mode
 * @param tier The tier achieved
 * @param additionalInfo Additional player information
 * @returns True if the result was submitted, false otherwise
 */
async function submitPlayerResult(
  ign: string,
  gamemode: GameMode,
  tier: TierLevel,
  additionalInfo?: AdditionalPlayerInfo
): Promise<boolean> {
  try {
    // First, check if the player exists
    let player = await getPlayerByIGN(ign);

    if (!player) {
      // Create the player if they don't exist
      player = await createPlayer({
        ign,
        java_username: additionalInfo?.javaUsername,
        region: additionalInfo?.region,
        device: additionalInfo?.device
      });

      if (!player) {
        console.error(`Could not create player: ${ign}`);
        return false;
      }
    } else {
      // Update the player's info if needed
      if (
        (additionalInfo?.javaUsername && player.java_username !== additionalInfo?.javaUsername) ||
        (additionalInfo?.device && player.device !== additionalInfo?.device) ||
        (additionalInfo?.region && player.region !== additionalInfo?.region)
      ) {
        await updatePlayer(player.id, {
          java_username: additionalInfo?.javaUsername || player.java_username,
          device: additionalInfo?.device || player.device,
          region: additionalInfo?.region || player.region
        });
      }
    }

    // Assign the tier to the player
    return await assignTier({
      playerId: player.id,
      gamemode,
      tier
    });
  } catch (error) {
    console.error('Error submitting player result:', error);
    return false;
  }
}

/**
 * Bulk submit player results
 * @param submissions An array of player submission data
 * @returns An object containing the number of successful and failed submissions
 */
async function bulkSubmitResults(submissions: BulkSubmissionData[]): Promise<{ success: number; failed: number }> {
  let successCount = 0;
  let failedCount = 0;

  for (const submission of submissions) {
    const { ign, gamemode, tier, region } = submission;

    const result = await submitPlayerResult(ign, gamemode, tier, { region });

    if (result) {
      successCount++;
    } else {
      failedCount++;
    }
  }

  return { success: successCount, failed: failedCount };
}

/**
 * Mass create players from a list of player data
 * @param players List of player data objects
 * @returns Number of players created
 */
async function massCreatePlayers(players: PlayerCreateData[] | PlayerCreateData): Promise<number> {
  try {
    let playersList: PlayerCreateData[];
    
    // Convert single player to array if needed
    if (!Array.isArray(players)) {
      playersList = [players];
    } else {
      playersList = players;
    }
    
    // Filter out any invalid data
    const validPlayers = playersList.filter(p => p.ign && p.ign.trim() !== '');
    
    if (validPlayers.length === 0) {
      return 0;
    }
    
    // Transform the data to match the required format for database insert
    const playersToInsert = validPlayers.map(player => ({
      ign: player.ign,
      java_username: player.java_username,
      region: player.region,
      device: player.device,
      gamemode: 'UNRANKED', // Default gamemode for new players
      tier_number: 0      // Default tier for new players
    }));
    
    // Insert players - make sure to use the correct format for insert
    const { data, error } = await supabase
      .from('players')
      .insert(playersToInsert)
      .select('*');
    
    if (error) {
      console.error('Mass player creation error:', error);
      return 0;
    }
    
    return validPlayers.length;
  } catch (error) {
    console.error('Mass player creation error:', error);
    return 0;
  }
}

/**
 * Verify if the provided PIN is the admin PIN
 * @param pin The PIN to verify
 * @returns True if the PIN is valid, false otherwise
 */
async function verifyAdminPIN(pin: string): Promise<boolean> {
  // Retrieve the admin PIN from environment variables or use a default one for development
  const adminPin = import.meta.env.VITE_ADMIN_PIN || "1234";

  // Compare the provided PIN with the admin PIN
  return pin === adminPin;
}

/**
 * Generate fake players for testing
 * @param count Number of fake players to generate
 * @returns Number of players generated
 */
async function generateFakePlayers(count: number): Promise<number> {
  try {
    const fakePlayersList: any[] = [];
    const gamemodes = ['SMP', 'MACE', 'BEDWARS'];
    const regions = ['NA', 'EU', 'ASIA', 'OCE', 'SA', 'AF'];
    const devices = ['MOBILE', 'CONTROLLER', 'KEYBOARD', 'TOUCH'];
    const tiers = ['LT5', 'HT5', 'LT4', 'HT4', 'LT3', 'HT3', 'LT2', 'HT2', 'LT1', 'HT1'];
    
    for (let i = 0; i < count; i++) {
      const randomGamemode = gamemodes[Math.floor(Math.random() * gamemodes.length)];
      const randomTier = tiers[Math.floor(Math.random() * tiers.length)];
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      
      fakePlayersList.push({
        ign: `TestPlayer${Date.now()}${i}`,
        java_username: Math.random() > 0.5 ? `JavaPlayer${Date.now()}${i}` : null,
        region: randomRegion,
        device: randomDevice,
        gamemode: randomGamemode,
        tier_number: getTierPointValue(randomTier)
      });
    }
    
    // Insert the fake players
    const { error } = await supabase
      .from('players')
      .insert(fakePlayersList);
    
    if (error) {
      console.error('Fake players generation error:', error);
      return 0;
    }
    
    return count;
  } catch (error) {
    console.error('Fake players generation error:', error);
    return 0;
  }
}

/**
 * Wipe all data from the players table
 * @returns True if the data was wiped, false otherwise
 */
async function wipeAllData(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('players')
      .delete()
      .neq('id', null); // This will delete all rows

    if (error) {
      console.error('Error wiping all data:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error wiping all data:', error);
    return false;
  }
}

/**
 * Get gamemode scores for a player
 * @param playerId The player ID to get scores for
 */
async function getPlayerGamemodeScores(playerId: string): Promise<GamemodeScore[]> {
  try {
    const { data, error } = await supabase
      .from('gamemode_scores')
      .select('*')
      .eq('player_id', playerId);
      
    if (error) {
      console.error('Error fetching player gamemode scores:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching player gamemode scores:', error);
    return [];
  }
}

/**
 * Get players by tier and gamemode for hooks/useGamemodeTiers.ts
 */
async function getPlayersByTierAndGamemode(gamemode: GameMode, tier: TierLevel): Promise<Player[]> {
  try {
    // This is a placeholder implementation
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('gamemode', gamemode)
      .eq('tier_number', getTierPointValue(tier));
      
    if (error) {
      console.error('Error fetching players by tier and gamemode:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching players by tier and gamemode:', error);
    return [];
  }
}

/**
 * Get ranked players for hooks/useLeaderboard.ts
 */
async function getRankedPlayers(limit: number = 100): Promise<Player[]> {
  try {
    // This is a placeholder implementation
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('global_points', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching ranked players:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching ranked players:', error);
    return [];
  }
}

export const playerService = {
  supabase,
  getPlayerByIGN,
  createPlayer,
  updatePlayer,
  assignTier,
  submitPlayerResult,
  bulkSubmitResults,
  massCreatePlayers,
  verifyAdminPIN,
  generateFakePlayers,
  wipeAllData,
  getPlayerGamemodeScores,
  getPlayersByTierAndGamemode,
  getRankedPlayers
};
