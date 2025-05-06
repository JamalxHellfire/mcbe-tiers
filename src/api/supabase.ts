import { supabase } from "@/integrations/supabase/client";
import { Player, GamemodeScore, Staff, NewsPost, Admin, TIER_POINTS } from "@/types";

// Players API
export const fetchPlayers = async (): Promise<Player[]> => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .order("global_points", { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const fetchPlayersByGamemode = async (gamemode: string): Promise<Player[]> => {
  // Get players who have scores in this gamemode
  const { data, error } = await supabase
    .from("players")
    .select("*, gamemode_scores!inner(*)")
    .eq("gamemode_scores.gamemode", gamemode)
    .order("gamemode_scores.score", { ascending: false });
    
  if (error) throw error;
  return data || [];
};

// Gamemode Scores API
export const fetchGamemodeScores = async (): Promise<GamemodeScore[]> => {
  const { data, error } = await supabase
    .from("gamemode_scores")
    .select("*")
    .order("score", { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const fetchGamemodeScoresByGamemode = async (gamemode: string): Promise<GamemodeScore[]> => {
  const { data, error } = await supabase
    .from("gamemode_scores")
    .select("*")
    .eq("gamemode", gamemode)
    .order("score", { ascending: false });
    
  if (error) throw error;
  return data || [];
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

// Staff API - Deprecated, keeping interface for compatibility
export const fetchStaff = async (): Promise<Staff[]> => {
  return [];
};

// News API - Deprecated, keeping interface for compatibility
export const fetchNewsPosts = async (): Promise<NewsPost[]> => {
  return [];
};

export const fetchNewsByTag = async (tag: string): Promise<NewsPost[]> => {
  return [];
};

// Admin Authentication
export const verifyAdminPin = async (pin: string): Promise<boolean> => {
  // Use a generic approach to RPC calls for better TypeScript compatibility
  const { data, error } = await supabase.functions.invoke('verify-admin-pin', {
    body: { pin }
  });
  
  if (error) throw error;
  return !!data?.isValid;
};

// New functions for the MCBE TIERS features
export const massRegisterPlayers = async (playerData: string): Promise<{ success: boolean, created: number, errors: string[] }> => {
  const { data, error } = await supabase.functions.invoke('register-players', {
    body: { playerData }
  });
  
  if (error) throw error;
  return data as { success: boolean, created: number, errors: string[] };
};

export const submitPlayerResult = async (
  playerData: {
    ign: string;
    java_username: string;
    device: string;
    region: string;
    gamemode: string;
    internal_tier: string;
  }
): Promise<{ success: boolean, playerId: string }> => {
  // First check if player exists
  const { data: existingPlayers } = await supabase
    .from("players")
    .select("id")
    .eq("ign", playerData.ign);
  
  let playerId: string;
  
  // Find tier points
  const tierData = TIER_POINTS.find(t => t.internal_tier === playerData.internal_tier);
  if (!tierData) throw new Error("Invalid tier selected");
  
  // Generate avatar URL
  const avatar_url = `https://crafthead.net/avatar/${playerData.java_username}`;
  
  // If player doesn't exist, create them
  if (!existingPlayers || existingPlayers.length === 0) {
    const { data: newPlayer, error: createError } = await supabase
      .from("players")
      .insert({
        ign: playerData.ign,
        java_username: playerData.java_username,
        avatar_url,
        device: playerData.device,
        region: playerData.region,
        gamemode: playerData.gamemode, // Legacy field
        tier_number: playerData.internal_tier, // Legacy field
      })
      .select("id")
      .single();
    
    if (createError) throw createError;
    playerId = newPlayer.id;
  } else {
    playerId = existingPlayers[0].id;
    
    // Update player info
    const { error: updateError } = await supabase
      .from("players")
      .update({
        java_username: playerData.java_username,
        avatar_url,
        device: playerData.device,
        region: playerData.region,
        updated_at: new Date().toISOString()
      })
      .eq("id", playerId);
    
    if (updateError) throw updateError;
  }
  
  // Check if player already has a score for this gamemode
  const { data: existingScores } = await supabase
    .from("gamemode_scores")
    .select("id")
    .eq("player_id", playerId)
    .eq("gamemode", playerData.gamemode);
  
  // Insert or update score
  if (!existingScores || existingScores.length === 0) {
    const { error: scoreError } = await supabase
      .from("gamemode_scores")
      .insert({
        player_id: playerId,
        gamemode: playerData.gamemode,
        score: tierData.points,
        internal_tier: playerData.internal_tier,
        display_tier: tierData.display_tier,
      });
    
    if (scoreError) throw scoreError;
  } else {
    const { error: updateScoreError } = await supabase
      .from("gamemode_scores")
      .update({
        score: tierData.points,
        internal_tier: playerData.internal_tier,
        display_tier: tierData.display_tier,
        updated_at: new Date().toISOString()
      })
      .eq("id", existingScores[0].id);
    
    if (updateScoreError) throw updateScoreError;
  }
  
  // Update player's global points
  await updatePlayerGlobalPoints(playerId);
  
  return { success: true, playerId };
};

// Helper function to recalculate global points
export const updatePlayerGlobalPoints = async (playerId: string): Promise<void> => {
  // Get all scores for this player
  const { data: scores, error } = await supabase
    .from("gamemode_scores")
    .select("score")
    .eq("player_id", playerId);
  
  if (error) throw error;
  
  // Calculate total points
  const globalPoints = scores ? scores.reduce((total, score) => total + (score.score || 0), 0) : 0;
  
  // Update player's global points
  const { error: updateError } = await supabase
    .from("players")
    .update({ global_points: globalPoints })
    .eq("id", playerId);
  
  if (updateError) throw updateError;
};

export const searchPlayers = async (query: string): Promise<Player[]> => {
  if (!query || query.trim().length < 2) return [];
  
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .ilike("ign", `%${query}%`)
    .limit(10);
  
  if (error) throw error;
  return data || [];
};
