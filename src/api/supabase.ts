
import { supabase } from "@/integrations/supabase/client";
import { Player, GamemodeScore, Staff, NewsPost } from "@/types";

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
  
  return { player, scores: scores || [] };
};

// Staff API
export const fetchStaff = async (): Promise<Staff[]> => {
  const { data, error } = await supabase
    .from("staff")
    .select("*");
    
  if (error) throw error;
  return data || [];
};

// News API
export const fetchNewsPosts = async (): Promise<NewsPost[]> => {
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const fetchNewsByTag = async (tag: string): Promise<NewsPost[]> => {
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .contains("tags", [tag])
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data || [];
};

// Admin Authentication
export const verifyAdminPin = async (pin: string): Promise<boolean> => {
  // In a real app, this should use a proper auth mechanism
  // For demo purposes, we're comparing the plain text pin
  // In production, use bcrypt or Supabase Auth
  const { data, error } = await supabase
    .rpc("verify_admin_pin", { pin_to_check: pin });
  
  if (error) throw error;
  return !!data;
};

// Let's setup an RPC function for admin PIN verification
// This should be implemented with SQL functions on the Supabase side
