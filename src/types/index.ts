
export interface Player {
  id: string;
  ign: string;
  gamemode: string; // Legacy field, will be preserved for compatibility
  tier_number: string; // Legacy field, will be preserved for compatibility
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  region?: string;
  device?: string;
  global_points?: number;
  badges?: string[];
  java_username?: string;
}

export interface GamemodeScore {
  id: string;
  player_id: string;
  gamemode: string;
  score: number;
  internal_tier: string; // LT5, HT5, LT4, etc.
  display_tier: string;  // TIER 5, TIER 4, etc.
  updated_at: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar_url?: string;
  discord?: string;
}

export interface NewsPost {
  id: string;
  title: string;
  tags?: string[];
  image_url?: string;
  content: string;
  created_at: string;
}

export interface Admin {
  id: string;
  role: string;
  created_at?: string;
}

export interface TierPointsMapping {
  internal_tier: string;
  display_tier: string;
  points: number;
}

export const TIER_POINTS: TierPointsMapping[] = [
  { internal_tier: "HT1", display_tier: "TIER 1", points: 50 },
  { internal_tier: "LT1", display_tier: "TIER 1", points: 45 },
  { internal_tier: "HT2", display_tier: "TIER 2", points: 40 },
  { internal_tier: "LT2", display_tier: "TIER 2", points: 35 },
  { internal_tier: "HT3", display_tier: "TIER 3", points: 30 },
  { internal_tier: "LT3", display_tier: "TIER 3", points: 25 },
  { internal_tier: "HT4", display_tier: "TIER 4", points: 20 },
  { internal_tier: "LT4", display_tier: "TIER 4", points: 15 },
  { internal_tier: "HT5", display_tier: "TIER 5", points: 10 },
  { internal_tier: "LT5", display_tier: "TIER 5", points: 5 }
];

export const SUPPORTED_GAMEMODES = ["SMP", "Crystal", "Bedwars", "UHC", "Axe", "Pot", "Sword", "overall"];

export const REGIONS = ["EU", "NA", "AS", "OCE", "AF"];
export const DEVICES = ["Mobile", "PC", "Controller"];
