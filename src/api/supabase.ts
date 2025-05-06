
import { supabase } from "@/integrations/supabase/client";
import { Player, GamemodeScore, Staff, NewsPost, Admin } from "@/types";

// Players API
export const fetchPlayers = async (): Promise<Player[]> => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("global_points", { ascending: false });
    
  if (error) throw error;
  return data as Player[] || [];
};

export const fetchPlayersByGamemode = async (gamemode: string): Promise<Player[]> => {
  // Get players who have scores in this gamemode
  const { data, error } = await supabase
    .from("players")
    .select("*, gamemode_scores!inner(*)")
    .eq("gamemode_scores.gamemode", gamemode)
    .order("gamemode_scores.score", { ascending: false });
    
  if (error) throw error;
  return data as Player[] || [];
};

// Search players by IGN
export const searchPlayersByIGN = async (searchQuery: string): Promise<Player[]> => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .ilike("ign", `%${searchQuery}%`)
    .order("global_points", { ascending: false });
    
  if (error) throw error;
  return data as Player[] || [];
};

// Gamemode Scores API
export const fetchGamemodeScores = async (): Promise<GamemodeScore[]> => {
  const { data, error } = await supabase
    .from("gamemode_scores")
    .select("*")
    .order("score", { ascending: false });
    
  if (error) throw error;
  return data as GamemodeScore[] || [];
};

export const fetchGamemodeScoresByGamemode = async (gamemode: string): Promise<GamemodeScore[]> => {
  const { data, error } = await supabase
    .from("gamemode_scores")
    .select("*")
    .eq("gamemode", gamemode)
    .order("score", { ascending: false });
    
  if (error) throw error;
  return data as GamemodeScore[] || [];
};

export const fetchPlayerWithGamemodeScores = async (playerId: string): Promise<{player: Player, scores: GamemodeScore[]}> => {
  // First get the player
  const { data: player, error: playerError } = await supabase
    .from("players")
    .select("*")
    .eq("id", playerId)
    .single();
  
  if (playerError) throw playerError;
  
  // Then get all gamemode scores
  const { data: scores, error: scoresError } = await supabase
    .from("gamemode_scores")
    .select("*")
    .eq("player_id", playerId);
  
  if (scoresError) throw scoresError;
  
  return { 
    player: player as Player, 
    scores: scores as GamemodeScore[] || [] 
  };
};

// Staff API - Use type assertion since table might not exist yet
export const fetchStaff = async (): Promise<Staff[]> => {
  try {
    // Since the staff table doesn't exist yet, we'll return an empty array
    // This function will be updated when the staff table is created
    return [] as Staff[];
  } catch (error) {
    console.error("Error fetching staff, table might not exist:", error);
    return [];
  }
};

// News API - Use type assertion since table might not exist yet
export const fetchNewsPosts = async (): Promise<NewsPost[]> => {
  try {
    // Since the news_posts table doesn't exist yet, we'll return an empty array
    // This function will be updated when the news_posts table is created
    return [] as NewsPost[];
  } catch (error) {
    console.error("Error fetching news posts, table might not exist:", error);
    return [];
  }
};

export const fetchNewsByTag = async (tag: string): Promise<NewsPost[]> => {
  try {
    // Since the news_posts table doesn't exist yet, we'll return an empty array
    // This function will be updated when the news_posts table is created
    return [] as NewsPost[];
  } catch (error) {
    console.error("Error fetching news by tag, table might not exist:", error);
    return [];
  }
};

// Admin Authentication and Functions
export const verifyAdminPin = async (pin: string): Promise<boolean> => {
  // For now, directly check the pin (in a real app, use proper auth)
  return pin === "1234"; // Using the requested pin "1234"
};

// Database management functions
export const wipeAllPlayerData = async (): Promise<void> => {
  try {
    // First delete all gamemode scores (due to foreign key constraints)
    const { error: scoresError } = await supabase
      .from("gamemode_scores")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all
      
    if (scoresError) throw scoresError;
      
    // Then delete all players
    const { error: playersError } = await supabase
      .from("players")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all
      
    if (playersError) throw playersError;
    return;
  } catch (error) {
    console.error("Error wiping player data:", error);
    throw error;
  }
};

// Function to calculate points based on tier
export const calculatePointsFromTier = (tier: string): number => {
  const tierPointsMap: Record<string, number> = {
    "HT1": 50,
    "LT1": 45,
    "HT2": 40,
    "LT2": 35,
    "HT3": 30,
    "LT3": 25,
    "HT4": 20,
    "LT4": 15,
    "HT5": 10,
    "LT5": 5,
  };
  
  return tierPointsMap[tier] || 0;
};

// Function to get display tier from internal tier
export const getDisplayTier = (internalTier: string): string => {
  const tierMapping: Record<string, string> = {
    "HT1": "TIER 1",
    "LT1": "TIER 1",
    "HT2": "TIER 2",
    "LT2": "TIER 2",
    "HT3": "TIER 3",
    "LT3": "TIER 3",
    "HT4": "TIER 4",
    "LT4": "TIER 4",
    "HT5": "TIER 5",
    "LT5": "TIER 5",
  };
  
  return tierMapping[internalTier] || "UNRANKED";
};

// Generate dummy player data - using more realistic names
export const generateDummyPlayers = async (count: number = 100): Promise<void> => {
  try {
    const gamemodes = ["SMP", "Bedwars", "Mace", "UHC", "Axe", "Pot", "Sword", "Crystal", "NetherPot"];
    const regions = ["EU", "NA", "ASIA", "OCE", "AF"];
    const devices = ["PC", "Mobile", "Controller"];
    const tiers = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"];
    
    const prefixes = ["Cool", "Epic", "Pro", "Ninja", "Dark", "Light", "Swift", "Mighty", "Shadow", "Crystal", "Royal", "Elite", "Ghost", "Venom", "Storm"];
    const suffixes = ["Gamer", "Player", "Miner", "PvP", "Hunter", "Master", "Legend", "Warrior", "Knight", "Boss", "Slayer", "King", "Queen", "God", "Killer"];
    
    // Generate names based on Minecraft-style naming
    const generateIGN = () => {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const numbers = Math.floor(Math.random() * 1000);
      
      return `${prefix}${suffix}${numbers}`;
    };
    
    const generateJavaUsername = () => {
      // For java usernames, we'll use UUIDs since Crafatar works with them
      return `player${Math.floor(Math.random() * 10000)}`;
    };
    
    const playerBatch: any[] = [];
    
    // Create players with random data
    for (let i = 0; i < count; i++) {
      const ign = generateIGN();
      const javaUsername = generateJavaUsername();
      const device = devices[Math.floor(Math.random() * devices.length)];
      const region = regions[Math.floor(Math.random() * regions.length)];
      
      // Insert player
      playerBatch.push({
        ign,
        java_username: javaUsername,
        device,
        region,
        gamemode: "overall", // Legacy field
        tier_number: "1",    // Legacy field
        global_points: 0,    // Will be calculated from scores
        avatar_url: `https://crafatar.com/avatars/${javaUsername}?overlay`
      });
    }
    
    // Insert players in batch
    const { data: players, error: playersError } = await supabase
      .from("players")
      .insert(playerBatch)
      .select();
    
    if (playersError) throw playersError;
    
    // Create scores for each player
    const scoresBatch: any[] = [];
    
    for (const player of players) {
      // Assign 1-3 random gamemodes to this player
      const numberOfGamemodes = Math.floor(Math.random() * 3) + 1;
      const playerGamemodes = [...gamemodes].sort(() => 0.5 - Math.random()).slice(0, numberOfGamemodes);
      
      let totalPoints = 0;
      
      // Create scores for each gamemode
      for (const gamemode of playerGamemodes) {
        const tier = tiers[Math.floor(Math.random() * tiers.length)];
        const points = calculatePointsFromTier(tier);
        const displayTier = getDisplayTier(tier);
        
        totalPoints += points;
        
        scoresBatch.push({
          player_id: player.id,
          gamemode,
          score: points,
          internal_tier: tier,
          display_tier: displayTier
        });
      }
      
      // Update player with total points
      if (totalPoints > 0) {
        await supabase
          .from("players")
          .update({ global_points: totalPoints })
          .eq("id", player.id);
      }
    }
    
    // Insert all scores in batch
    if (scoresBatch.length > 0) {
      const { error: scoresError } = await supabase
        .from("gamemode_scores")
        .insert(scoresBatch);
      
      if (scoresError) throw scoresError;
    }
  } catch (error) {
    console.error("Error generating dummy players:", error);
    throw error;
  }
};

// Mass register players - Fixed to correctly process all players at once
export const registerPlayers = async (playerData: string): Promise<{success: number, failed: number}> => {
  try {
    const lines = playerData.split('\n').filter(line => line.trim().length > 0);
    let success = 0;
    let failed = 0;
    
    // Prepare batch insert data
    const playerBatch = [];
    
    for (const line of lines) {
      const [ign, javaUsername] = line.split(',').map(part => part.trim());
      
      if (!ign || !javaUsername) {
        failed++;
        continue;
      }
      
      playerBatch.push({
        ign,
        java_username: javaUsername,
        gamemode: "overall", // Legacy field
        tier_number: "0", // Unranked
        avatar_url: `https://crafatar.com/avatars/${javaUsername}?overlay`
      });
      
      success++;
    }
    
    // Insert all players at once
    if (playerBatch.length > 0) {
      const { error } = await supabase
        .from("players")
        .insert(playerBatch);
      
      if (error) {
        console.error('Failed to batch register players:', error);
        return { success: 0, failed: lines.length };
      }
    }
    
    return { success, failed };
  } catch (error) {
    console.error("Error registering players:", error);
    throw error;
  }
};

// Submit player result - Fixed to correctly handle data and return inserted/updated record
export const submitPlayerResult = async (
  playerData: {
    ign: string;
    javaUsername: string;
    device: string;
    region: string;
    gamemode: string;
    tier: string;
  }
): Promise<Player> => {
  try {
    // Check if player already exists
    const { data: existingPlayers, error: searchError } = await supabase
      .from("players")
      .select("*")
      .eq("ign", playerData.ign);
    
    if (searchError) throw searchError;
    
    let player: Player;
    const points = calculatePointsFromTier(playerData.tier);
    const displayTier = getDisplayTier(playerData.tier);
    
    if (existingPlayers && existingPlayers.length > 0) {
      // Player exists, update their data
      player = existingPlayers[0] as Player;
      
      // Update player info
      const { data: updatedPlayer, error: updateError } = await supabase
        .from("players")
        .update({
          java_username: playerData.javaUsername,
          device: playerData.device,
          region: playerData.region,
          avatar_url: `https://crafatar.com/avatars/${playerData.javaUsername}?overlay`
        })
        .eq("id", player.id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      player = updatedPlayer as Player;
        
      // Check if player already has a score for this gamemode
      const { data: existingScores } = await supabase
        .from("gamemode_scores")
        .select("*")
        .eq("player_id", player.id)
        .eq("gamemode", playerData.gamemode);
      
      if (existingScores && existingScores.length > 0) {
        // Update existing score
        await supabase
          .from("gamemode_scores")
          .update({
            score: points,
            internal_tier: playerData.tier,
            display_tier: displayTier
          })
          .eq("id", existingScores[0].id);
      } else {
        // Create new score
        await supabase
          .from("gamemode_scores")
          .insert({
            player_id: player.id,
            gamemode: playerData.gamemode,
            score: points,
            internal_tier: playerData.tier,
            display_tier: displayTier
          });
      }
    } else {
      // Create new player
      const { data: newPlayer, error: insertError } = await supabase
        .from("players")
        .insert({
          ign: playerData.ign,
          java_username: playerData.javaUsername,
          device: playerData.device,
          region: playerData.region,
          gamemode: "overall", // Legacy field
          tier_number: "0", 
          avatar_url: `https://crafatar.com/avatars/${playerData.javaUsername}?overlay`
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      player = newPlayer as Player;
      
      // Create score for new player
      await supabase
        .from("gamemode_scores")
        .insert({
          player_id: player.id,
          gamemode: playerData.gamemode,
          score: points,
          internal_tier: playerData.tier,
          display_tier: displayTier
        });
    }
    
    // Calculate and update global points
    const { data: allScores } = await supabase
      .from("gamemode_scores")
      .select("score")
      .eq("player_id", player.id);
    
    const globalPoints = allScores ? allScores.reduce((sum, score) => sum + (score.score || 0), 0) : points;
    
    const { data: finalPlayer } = await supabase
      .from("players")
      .update({
        global_points: globalPoints
      })
      .eq("id", player.id)
      .select()
      .single();
    
    return finalPlayer as Player;
  } catch (error) {
    console.error("Error submitting player result:", error);
    throw error;
  }
};

// Update player details
export const updatePlayer = async (
  playerId: string,
  updates: Partial<Player & { gamemode?: string; tier?: string }>
): Promise<Player> => {
  try {
    const { gamemode, tier, ...playerUpdates } = updates;
    
    // Update player basic info if there are any updates
    if (Object.keys(playerUpdates).length > 0) {
      const { data: updatedPlayer, error: updateError } = await supabase
        .from("players")
        .update(playerUpdates)
        .eq("id", playerId)
        .select()
        .single();
      
      if (updateError) throw updateError;
    }
    
    // Update gamemode tier if provided
    if (gamemode && tier) {
      const points = calculatePointsFromTier(tier);
      const displayTier = getDisplayTier(tier);
      
      // Check if player already has a score for this gamemode
      const { data: existingScores } = await supabase
        .from("gamemode_scores")
        .select("*")
        .eq("player_id", playerId)
        .eq("gamemode", gamemode);
      
      if (existingScores && existingScores.length > 0) {
        // Update existing score
        await supabase
          .from("gamemode_scores")
          .update({
            score: points,
            internal_tier: tier,
            display_tier: displayTier
          })
          .eq("id", existingScores[0].id);
      } else {
        // Create new score
        await supabase
          .from("gamemode_scores")
          .insert({
            player_id: playerId,
            gamemode: gamemode,
            score: points,
            internal_tier: tier,
            display_tier: displayTier
          });
      }
      
      // Recalculate global points
      const { data: allScores } = await supabase
        .from("gamemode_scores")
        .select("score")
        .eq("player_id", playerId);
      
      const globalPoints = allScores ? allScores.reduce((sum, score) => sum + (score.score || 0), 0) : 0;
      
      await supabase
        .from("players")
        .update({
          global_points: globalPoints
        })
        .eq("id", playerId);
    }
    
    // Get the updated player
    const { data: finalPlayer } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();
    
    return finalPlayer as Player;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
};

// Delete a player's tier in a specific gamemode
export const deletePlayerTier = async (
  playerId: string,
  gamemode: string
): Promise<void> => {
  try {
    // Delete the gamemode score
    const { error } = await supabase
      .from("gamemode_scores")
      .delete()
      .eq("player_id", playerId)
      .eq("gamemode", gamemode);
    
    if (error) throw error;
    
    // Recalculate global points
    const { data: allScores } = await supabase
      .from("gamemode_scores")
      .select("score")
      .eq("player_id", playerId);
    
    const globalPoints = allScores ? allScores.reduce((sum, score) => sum + (score.score || 0), 0) : 0;
    
    await supabase
      .from("players")
      .update({
        global_points: globalPoints
      })
      .eq("id", playerId);
  } catch (error) {
    console.error("Error deleting player tier:", error);
    throw error;
  }
};
