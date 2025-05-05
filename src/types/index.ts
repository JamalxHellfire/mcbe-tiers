
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
