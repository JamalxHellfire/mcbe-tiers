
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Database } from '@/integrations/supabase/types';

// Type definitions
export type Player = Database['public']['Tables']['players']['Row'];
export type GamemodeScore = Database['public']['Tables']['gamemode_scores']['Row'];

export type TierLevel = 
  | 'LT5' | 'HT5' 
  | 'LT4' | 'HT4' 
  | 'LT3' | 'HT3' 
  | 'LT2' | 'HT2' 
  | 'LT1' | 'HT1';

export type PlayerRegion = 'NA' | 'EU' | 'ASIA' | 'OCE';
export type DeviceType = 'Mobile' | 'PC' | 'Console';
export type GameMode = 'Crystal' | 'Sword' | 'SMP' | 'UHC' | 'Axe' | 'NethPot' | 'Bedwars' | 'Mace';

interface PlayerCreateData {
  ign: string;
  java_username?: string;
  avatar_url?: string;
  region?: PlayerRegion;
  device?: DeviceType;
}

interface TierAssignment {
  playerId: string;
  gamemode: GameMode;
  tier: TierLevel;
}

// Tier points mapping
const TIER_POINTS: Record<TierLevel, number> = {
  'HT1': 50,
  'LT1': 45,
  'HT2': 40,
  'LT2': 35,
  'HT3': 30,
  'LT3': 25,
  'HT4': 20,
  'LT4': 15,
  'HT5': 10,
  'LT5': 5
};

// Player management functions
export const playerService = {
  // Expose supabase client for direct queries
  supabase,
  
  // Get all players
  async getAllPlayers(): Promise<Player[]> {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('global_points', { ascending: false });

      if (error) {
        console.error('Error fetching players:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch players:', error);
      return [];
    }
  },
  
  // Get ranked players (with at least one gamemode score)
  async getRankedPlayers(): Promise<Player[]> {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .gt('global_points', 0)
        .order('global_points', { ascending: false });

      if (error) {
        console.error('Error fetching ranked players:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch ranked players:', error);
      return [];
    }
  },
  
  // Get a player by IGN
  async getPlayerByIGN(ign: string): Promise<Player | null> {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .ilike('ign', ign)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Not found error code
          console.error('Error fetching player by IGN:', error);
        }
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch player by IGN:', error);
      return null;
    }
  },
  
  // Create a new player
  async createPlayer(playerData: PlayerCreateData): Promise<Player | null> {
    try {
      // If java_username is provided but avatar_url is not, generate the avatar URL
      if (playerData.java_username && !playerData.avatar_url) {
        playerData.avatar_url = `https://crafthead.net/avatar/${playerData.java_username}`;
      }
      
      const { data, error } = await supabase
        .from('players')
        .insert([playerData])
        .select()
        .single();

      if (error) {
        console.error('Error creating player:', error);
        toast.error(`Failed to create player: ${error.message}`);
        return null;
      }

      toast.success(`Player ${playerData.ign} created successfully`);
      return data;
    } catch (error: any) {
      console.error('Failed to create player:', error);
      toast.error(`Failed to create player: ${error.message}`);
      return null;
    }
  },
  
  // Mass create players
  async massCreatePlayers(playerDataList: PlayerCreateData[]): Promise<number> {
    try {
      // Prepare player data with avatar URLs where possible
      const preparedData = playerDataList.map(player => {
        if (player.java_username && !player.avatar_url) {
          return {
            ...player,
            avatar_url: `https://crafthead.net/avatar/${player.java_username}`
          };
        }
        return player;
      });
      
      const { data, error } = await supabase
        .from('players')
        .insert(preparedData)
        .select();

      if (error) {
        console.error('Error mass creating players:', error);
        toast.error(`Failed to create players: ${error.message}`);
        return 0;
      }

      toast.success(`Successfully created ${data.length} players`);
      return data.length;
    } catch (error: any) {
      console.error('Failed to mass create players:', error);
      toast.error(`Failed to create players: ${error.message}`);
      return 0;
    }
  },
  
  // Update a player
  async updatePlayer(id: string, playerData: Partial<Player>): Promise<Player | null> {
    try {
      const { data, error } = await supabase
        .from('players')
        .update(playerData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating player:', error);
        toast.error(`Failed to update player: ${error.message}`);
        return null;
      }

      toast.success(`Player ${data.ign} updated successfully`);
      return data;
    } catch (error: any) {
      console.error('Failed to update player:', error);
      toast.error(`Failed to update player: ${error.message}`);
      return null;
    }
  },
  
  // Delete a player
  async deletePlayer(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting player:', error);
        toast.error(`Failed to delete player: ${error.message}`);
        return false;
      }

      toast.success('Player deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Failed to delete player:', error);
      toast.error(`Failed to delete player: ${error.message}`);
      return false;
    }
  },
  
  // Gamemode scores functions
  
  // Assign tier to a player for a specific gamemode
  async assignTier({ playerId, gamemode, tier }: TierAssignment): Promise<GamemodeScore | null> {
    try {
      // Calculate points based on tier
      const points = TIER_POINTS[tier];
      const displayTier = tier; // Tier like 'HT1', 'LT5', etc.
      
      // First, check if the player already has a tier for this gamemode
      const { data: existingScore } = await supabase
        .from('gamemode_scores')
        .select('*')
        .eq('player_id', playerId)
        .eq('gamemode', gamemode)
        .maybeSingle();
      
      let result;
      
      if (existingScore) {
        // Update existing score
        const { data, error } = await supabase
          .from('gamemode_scores')
          .update({
            score: points,
            internal_tier: tier,
            display_tier: displayTier,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingScore.id)
          .select()
          .single();
          
        if (error) {
          console.error('Error updating tier:', error);
          toast.error(`Failed to update tier: ${error.message}`);
          return null;
        }
        
        result = data;
        toast.success(`Updated ${gamemode} tier to ${displayTier}`);
      } else {
        // Insert new score
        const { data, error } = await supabase
          .from('gamemode_scores')
          .insert([{
            player_id: playerId,
            gamemode,
            score: points,
            internal_tier: tier,
            display_tier: displayTier
          }])
          .select()
          .single();
          
        if (error) {
          console.error('Error assigning tier:', error);
          toast.error(`Failed to assign tier: ${error.message}`);
          return null;
        }
        
        result = data;
        toast.success(`Assigned ${gamemode} tier ${displayTier}`);
      }
      
      return result;
    } catch (error: any) {
      console.error('Failed to assign tier:', error);
      toast.error(`Failed to assign tier: ${error.message}`);
      return null;
    }
  },
  
  // Get all gamemode scores for a player
  async getPlayerGamemodeScores(playerId: string): Promise<GamemodeScore[]> {
    try {
      const { data, error } = await supabase
        .from('gamemode_scores')
        .select('*')
        .eq('player_id', playerId);

      if (error) {
        console.error('Error fetching gamemode scores:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch gamemode scores:', error);
      return [];
    }
  },
  
  // Get players by tier for a specific gamemode
  async getPlayersByTierAndGamemode(gamemode: GameMode): Promise<Record<TierLevel, Player[]>> {
    try {
      // Initialize result structure with empty arrays for each tier
      const result: Record<TierLevel, Player[]> = {
        'HT1': [], 'LT1': [],
        'HT2': [], 'LT2': [],
        'HT3': [], 'LT3': [],
        'HT4': [], 'LT4': [],
        'HT5': [], 'LT5': []
      };
      
      // Get all gamemode scores for the specified gamemode
      const { data: scores, error: scoresError } = await supabase
        .from('gamemode_scores')
        .select('player_id, internal_tier')
        .eq('gamemode', gamemode);
        
      if (scoresError) {
        console.error(`Error fetching ${gamemode} scores:`, scoresError);
        return result;
      }
      
      if (!scores || scores.length === 0) {
        return result;
      }
      
      // Group player IDs by tier
      const playerIdsByTier: Record<string, string[]> = {};
      scores.forEach(score => {
        const tier = score.internal_tier as TierLevel;
        if (!playerIdsByTier[tier]) {
          playerIdsByTier[tier] = [];
        }
        playerIdsByTier[tier].push(score.player_id);
      });
      
      // For each tier with players, fetch the player details
      for (const [tier, playerIds] of Object.entries(playerIdsByTier)) {
        if (playerIds.length === 0) continue;
        
        const { data: players, error: playersError } = await supabase
          .from('players')
          .select('*')
          .in('id', playerIds);
          
        if (playersError) {
          console.error(`Error fetching players for tier ${tier}:`, playersError);
          continue;
        }
        
        if (players && players.length > 0) {
          result[tier as TierLevel] = players;
        }
      }
      
      return result;
    } catch (error) {
      console.error(`Failed to fetch players by tier for ${gamemode}:`, error);
      return {
        'HT1': [], 'LT1': [],
        'HT2': [], 'LT2': [],
        'HT3': [], 'LT3': [],
        'HT4': [], 'LT4': [],
        'HT5': [], 'LT5': []
      };
    }
  },
  
  // Admin functions
  
  // Verify admin PIN
  async verifyAdminPIN(pin: string): Promise<boolean> {
    try {
      // Note: In a real implementation, this should use a secure authentication method
      // For demo purposes, we're just checking if any admin has this pin (pre-hashed)
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('hashed_pin', '$2a$10$QbTUEJ.XR6PqR4ckBVGbYO9g97zvXwZF.l5t5.c5XFgQX6nwNP31.') // This is the hash for "1234"
        .single();
      
      if (error || !data) {
        console.error('Admin verification failed:', error);
        return false;
      }
      
      return pin === '1234'; // Hardcoded for demo
    } catch (error) {
      console.error('Failed to verify admin PIN:', error);
      return false;
    }
  },
  
  // Generate fake players for testing
  async generateFakePlayers(count: number = 100): Promise<number> {
    try {
      // Prepare array for batch insertion
      const fakePlayers: PlayerCreateData[] = [];
      const gamemodes: GameMode[] = ['Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'];
      const regions: PlayerRegion[] = ['NA', 'EU', 'ASIA', 'OCE'];
      const devices: DeviceType[] = ['Mobile', 'PC', 'Console'];
      const tiers: TierLevel[] = ['LT5', 'HT5', 'LT4', 'HT4', 'LT3', 'HT3', 'LT2', 'HT2', 'LT1', 'HT1'];
      const avatarNames = ['MHF_Steve', 'MHF_Alex', 'Technoblade'];
      
      // Generate player records
      for (let i = 1; i <= count; i++) {
        const ign = `Player_${Math.floor(Math.random() * 10000)}`;
        const javaUsername = avatarNames[Math.floor(Math.random() * avatarNames.length)];
        
        fakePlayers.push({
          ign,
          java_username: javaUsername,
          avatar_url: `https://crafthead.net/avatar/${javaUsername}`,
          region: regions[Math.floor(Math.random() * regions.length)],
          device: devices[Math.floor(Math.random() * devices.length)]
        });
      }
      
      // Insert all players in batch
      const { data: insertedPlayers, error: insertError } = await supabase
        .from('players')
        .insert(fakePlayers)
        .select('id, ign');
        
      if (insertError) {
        console.error('Error creating fake players:', insertError);
        toast.error(`Failed to create fake players: ${insertError.message}`);
        return 0;
      }
      
      // For each inserted player, assign random tiers for 1-3 random gamemodes
      const tierAssignments: Array<{
        player_id: string;
        gamemode: GameMode;
        score: number;
        internal_tier: TierLevel;
        display_tier: string;
      }> = [];
      
      for (const player of insertedPlayers) {
        // Randomly select 1-3 gamemodes for this player
        const playerGamemodes = [...gamemodes]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1);
          
        for (const gamemode of playerGamemodes) {
          // Assign a random tier
          const tier = tiers[Math.floor(Math.random() * tiers.length)];
          tierAssignments.push({
            player_id: player.id,
            gamemode,
            score: TIER_POINTS[tier],
            internal_tier: tier,
            display_tier: tier
          });
        }
      }
      
      // Insert all tier assignments in batch
      if (tierAssignments.length > 0) {
        const { error: tiersError } = await supabase
          .from('gamemode_scores')
          .insert(tierAssignments);
          
        if (tiersError) {
          console.error('Error assigning tiers to fake players:', tiersError);
          toast.error(`Failed to assign tiers to fake players: ${tiersError.message}`);
        }
      }
      
      toast.success(`Created ${insertedPlayers.length} fake players with random tiers`);
      return insertedPlayers.length;
    } catch (error: any) {
      console.error('Failed to generate fake players:', error);
      toast.error(`Failed to generate fake players: ${error.message}`);
      return 0;
    }
  },
  
  // Wipe all data (dangerous operation!)
  async wipeAllData(): Promise<boolean> {
    try {
      // Delete all gamemode_scores first (due to foreign key constraints)
      const { error: scoresError } = await supabase
        .from('gamemode_scores')
        .delete()
        .neq('player_id', '00000000-0000-0000-0000-000000000000'); // Delete all
        
      if (scoresError) {
        console.error('Error deleting gamemode scores:', scoresError);
        toast.error(`Failed to delete gamemode scores: ${scoresError.message}`);
        return false;
      }
      
      // Then delete all players
      const { error: playersError } = await supabase
        .from('players')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
        
      if (playersError) {
        console.error('Error deleting players:', playersError);
        toast.error(`Failed to delete players: ${playersError.message}`);
        return false;
      }
      
      toast.success('All data has been wiped successfully');
      return true;
    } catch (error: any) {
      console.error('Failed to wipe all data:', error);
      toast.error(`Failed to wipe data: ${error.message}`);
      return false;
    }
  }
};
