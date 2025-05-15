// This file contains services for player data management
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { adminService } from './adminService';

// Type definitions
export type PlayerRegion = 'NA' | 'EU' | 'ASIA' | 'OCE' | 'SA' | 'AF';
export type DeviceType = 'Mobile' | 'PC' | 'Console';
export type GameMode = 'Crystal' | 'Sword' | 'SMP' | 'UHC' | 'Axe' | 'NethPot' | 'Bedwars' | 'Mace';
export type TierLevel = 'LT5' | 'HT5' | 'LT4' | 'HT4' | 'LT3' | 'HT3' | 'LT2' | 'HT2' | 'LT1' | 'HT1' | 'Retired';

export interface Player {
  id: string;
  ign: string;
  java_username?: string | null;
  region?: PlayerRegion | null;
  device?: DeviceType | null;
  global_points?: number | null;
  avatar_url?: string | null;
  badges?: string[] | null;
  banned?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  tiers?: Record<GameMode, TierResult>; // Adding tiers as an optional property
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

export interface TierResult {
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
  
  // Delete a player
  deletePlayer: async (id: string): Promise<boolean> => {
    // First delete all gamemode scores for this player
    const { error: scoreError } = await supabase
      .from('gamemode_scores')
      .delete()
      .eq('player_id', id);
      
    if (scoreError) {
      console.error(`Error deleting scores for player ${id}:`, scoreError);
      return false;
    }
    
    // Then delete the player
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Error deleting player ${id}:`, error);
      return false;
    }
    
    return true;
  },
  
  // Ban a player
  banPlayer: async (player: Player): Promise<boolean> => {
    // First, insert into banned_players table
    const { error: banError } = await supabase
      .from('banned_players')
      .insert({
        player_id: player.id,
        ign: player.ign,
        reason: 'Banned by administrator',
        banned_at: new Date().toISOString()
      });
      
    if (banError) {
      console.error(`Error banning player ${player.id}:`, banError);
      return false;
    }
    
    // We keep the player in the database but mark them as banned
    const { error } = await supabase
      .from('players')
      .update({
        banned: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', player.id);
      
    if (error) {
      console.error(`Error updating player ${player.id} ban status:`, error);
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
    // Use the adminService to verify the PIN
    return adminService.verifyAdminPIN(pin);
  },
  
  // Generate fake players for testing
  generateFakePlayers: async (count: number = 10): Promise<number> => {
    const regions: PlayerRegion[] = ['NA', 'EU', 'ASIA', 'OCE', 'SA', 'AF'];
    const devices: DeviceType[] = ['Mobile', 'PC', 'Console'];
    const gameModes: GameMode[] = ['Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'];
    const tiers: TierLevel[] = ['LT5', 'HT5', 'LT4', 'HT4', 'LT3', 'HT3', 'LT2', 'HT2', 'LT1', 'HT1', 'Retired'];
    
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
  
  // Generate realistic Minecraft players with realistic names
  generateRealisticPlayers: async (count: number = 200): Promise<number> => {
    const regions: PlayerRegion[] = ['NA', 'EU', 'ASIA', 'OCE', 'SA', 'AF'];
    const devices: DeviceType[] = ['Mobile', 'PC', 'Console'];
    const gameModes: GameMode[] = ['Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'];
    const tiers: TierLevel[] = ['LT5', 'HT5', 'LT4', 'HT4', 'LT3', 'HT3', 'LT2', 'HT2', 'LT1', 'HT1', 'Retired'];
    
    // Common Minecraft name prefixes and suffixes
    const prefixes = ['MC', 'Pro', 'Epic', 'Cool', 'The', 'Hyper', 'Ultra', 'Super', 'Amazing', 'Awesome', 'Dark', 'Light', 'Angry', 'Pixel', 'Block', 'Gold', 'Diamond', 'Iron', 'Shadow', 'Fire', 'Ice', 'Ender', 'Swift', 'Toxic', 'Ninja', 'Elite', 'Sneaky', 'Stealth', 'Mystic', 'Royal', 'Legend', 'Magic'];
    const middles = ['Gamer', 'Player', 'PvP', 'Warrior', 'Knight', 'Dragon', 'Wolf', 'Fox', 'Cat', 'Dog', 'Hunter', 'Slayer', 'Miner', 'Crafter', 'Builder', 'Steve', 'Alex', 'Creeper', 'Zombie', 'Spider', 'Skeleton', 'Blaze', 'Herobrine', 'Notch', 'Wither', 'Night', 'Craft', 'Mine', 'Dig', 'Build', 'Redstone'];
    const suffixes = ['X', 'Pro', 'YT', 'TV', 'Gaming', '123', '69', '420', 'XD', 'Boss', 'Master', 'God', 'King', 'Queen', 'Lord', 'HD', '4K', 'UHD', '60FPS', 'Official', 'Real', 'Plays', 'Gamer', 'PVP'];
    
    // Real-world Minecraft streamers/YouTubers for added realism
    const realPlayers = [
      'Dream', 'Technoblade', 'GeorgeNotFound', 'Sapnap', 'TommyInnit', 'Tubbo', 'WilburSoot', 'Ph1LzA', 'Skeppy', 'BadBoyHalo', 
      'Fundy', 'Quackity', 'Nihachu', 'Karl_Jacobs', 'CaptainSparklez', 'DanTDM', 'StampyLongHead', 'PopularMMOs', 'PrestonPlayz',
      'JeromeASF', 'BajanCanadian', 'SSundee', 'CaptainSparklez', 'LDShadowLady', 'iHasCupquake', 'Aphmau', 'GamingWithJen',
      'TheDiamondMinecart', 'ExplodingTNT', 'UnspeakableGaming', 'PrestonPlayz', 'JerryAndHarry', 'Vikkstar123', 'Lachlan'
    ];
    
    const players: Array<PlayerCreateData> = [];
    const usedNames = new Set<string>();
    
    // Generate unique player names
    for (let i = 0; i < count; i++) {
      let ign: string;
      let javaUsername: string;
      
      // 10% chance to use a real player name with a slight modification
      if (Math.random() < 0.1 && realPlayers.length > 0) {
        const index = Math.floor(Math.random() * realPlayers.length);
        ign = realPlayers[index] + (Math.random() < 0.5 ? 
          suffixes[Math.floor(Math.random() * suffixes.length)] : 
          Math.floor(Math.random() * 1000).toString());
        javaUsername = ign;
        realPlayers.splice(index, 1); // Remove used name
      } else {
        // Generate a random username
        do {
          if (Math.random() < 0.3) {
            // Simple format: prefix + middle (e.g., EpicGamer)
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const middle = middles[Math.floor(Math.random() * middles.length)];
            ign = `${prefix}${middle}`;
          } else if (Math.random() < 0.6) {
            // Full format: prefix + middle + suffix (e.g., ProWarriorYT)
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const middle = middles[Math.floor(Math.random() * middles.length)];
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            ign = `${prefix}${middle}${suffix}`;
          } else {
            // Random format with underscores and numbers
            const middle = middles[Math.floor(Math.random() * middles.length)];
            const number = Math.floor(Math.random() * 999);
            ign = Math.random() < 0.5 ? 
              `${middle}_${number}` : 
              `${middle}${number}`;
          }
          
          // Ensure name is unique
        } while (usedNames.has(ign));
        
        javaUsername = ign;
      }
      
      usedNames.add(ign);
      
      const randomRegionIdx = Math.floor(Math.random() * regions.length);
      const randomDeviceIdx = Math.floor(Math.random() * devices.length);
      
      players.push({
        ign,
        java_username: javaUsername,
        region: regions[randomRegionIdx],
        device: devices[randomDeviceIdx]
      });
    }
    
    // Insert players in batches to avoid overloading the database
    const batchSize = 50;
    let insertedCount = 0;
    let playerIds: string[] = [];
    
    for (let i = 0; i < players.length; i += batchSize) {
      const batch = players.slice(i, i + batchSize);
      
      // Process players to prepare for insertion
      const preparedPlayers = await Promise.all(
        batch.map(async (player) => {
          let avatarUrl = null;
          if (player.java_username) {
            avatarUrl = await getPlayerAvatar(player.java_username);
            // If we can't get an avatar, we'll use a default one
            if (!avatarUrl) {
              avatarUrl = '/default-avatar.png';
            }
          }
          
          return {
            ign: player.ign,
            java_username: player.java_username,
            region: player.region,
            device: player.device,
            avatar_url: avatarUrl,
          };
        })
      );
      
      // Insert batch of players
      const { data, error } = await supabase
        .from('players')
        .insert(preparedPlayers)
        .select();
        
      if (error) {
        console.error('Error generating realistic players:', error);
        continue;
      }
      
      if (data) {
        insertedCount += data.length;
        playerIds = playerIds.concat(data.map(player => player.id));
      }
    }
    
    // Now generate random gamemode scores for each player
    for (const playerId of playerIds) {
      const scoresToInsert = [];
      
      // Each player will have between 4-8 gamemodes they play
      const playerGamemodes = [...gameModes];
      const shuffledGamemodes = playerGamemodes.sort(() => 0.5 - Math.random());
      const gamemodeCount = 4 + Math.floor(Math.random() * 5); // 4-8 gamemodes
      
      // Assign tiers for different gamemodes
      for (let j = 0; j < Math.min(gamemodeCount, playerGamemodes.length); j++) {
        const gamemode = shuffledGamemodes[j];
        
        // Weight the tier distribution to be more realistic:
        // - Many players in lower tiers (Tier 4-5)
        // - Fewer players in mid tiers (Tier 2-3)
        // - Very few players in top tiers (Tier 1)
        // - Small chance to be retired
        let tierIndex;
        const tierRoll = Math.random();
        
        if (tierRoll < 0.05) {
          // 5% chance for retired
          tierIndex = tiers.indexOf('Retired');
        } else if (tierRoll < 0.12) {
          // 7% chance for top tier (HT1/LT1)
          tierIndex = Math.floor(Math.random() * 2); 
        } else if (tierRoll < 0.30) {
          // 18% chance for tier 2 (HT2/LT2)
          tierIndex = 2 + Math.floor(Math.random() * 2);
        } else if (tierRoll < 0.60) {
          // 30% chance for tier 3 (HT3/LT3)
          tierIndex = 4 + Math.floor(Math.random() * 2);
        } else {
          // 40% chance for tier 4-5 (HT4/LT4/HT5/LT5)
          tierIndex = 6 + Math.floor(Math.random() * 4);
        }
        
        const tier = tiers[tierIndex];
        
        // Calculate tier score using the pre-defined function
        const tierPoints = await supabase.rpc('calculate_tier_points', { tier_value: tier });
        const score = tierPoints.data || 0;
        
        scoresToInsert.push({
          player_id: playerId,
          gamemode,
          internal_tier: tier,
          display_tier: tier,
          score
        });
      }
      
      // Insert all scores for this player
      if (scoresToInsert.length > 0) {
        const { error: scoreError } = await supabase
          .from('gamemode_scores')
          .insert(scoresToInsert);
          
        if (scoreError) {
          console.error(`Error generating scores for player ${playerId}:`, scoreError);
        }
      }
    }
    
    return insertedCount;
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
    
    // Then delete all banned players records
    const { error: bannedError } = await supabase
      .from('banned_players')
      .delete()
      .neq('id', ''); // Delete all
      
    if (bannedError) {
      console.error('Error deleting banned players:', bannedError);
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
