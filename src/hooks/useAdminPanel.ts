
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player, GameMode, TierLevel, PlayerRegion, DeviceType } from '@/services/playerService';

export function useAdminPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignTier = async (playerId: string, gamemode: GameMode, tier: TierLevel) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const points = calculateTierPoints(tier);
      
      // Check if there's already a gamemode_score for this player
      const { data: existingData, error: existingError } = await supabase
        .from('gamemode_scores')
        .select('*')
        .eq('player_id', playerId)
        .eq('gamemode', gamemode)
        .maybeSingle();
        
      if (existingError) {
        throw existingError;
      }
      
      if (existingData) {
        // Update existing tier
        const { error } = await supabase
          .from('gamemode_scores')
          .update({
            score: points,
            internal_tier: tier,
            display_tier: tier,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
          
        if (error) throw error;
      } else {
        // Insert new tier
        const { error } = await supabase
          .from('gamemode_scores')
          .insert({
            player_id: playerId,
            gamemode,
            score: points,
            internal_tier: tier,
            display_tier: tier
          });
          
        if (error) throw error;
      }
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createPlayer = async (playerData: {
    ign: string;
    java_username?: string;
    region?: PlayerRegion;
    device?: DeviceType;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate device type
      const validDevices: DeviceType[] = ['PC', 'Mobile', 'Console'];
      const validRegions: PlayerRegion[] = ['NA', 'EU', 'ASIA', 'OCE', 'SA', 'AF'];
      
      const deviceType = validDevices.includes(playerData.device as DeviceType) 
        ? playerData.device as DeviceType 
        : 'PC';
      
      const regionType = validRegions.includes(playerData.region as PlayerRegion)
        ? playerData.region as PlayerRegion
        : 'NA';

      // Try to get avatar URL from Minecraft API
      let avatarUrl = null;
      if (playerData.java_username) {
        try {
          const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${playerData.java_username}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.id) {
              avatarUrl = `https://crafatar.com/avatars/${data.id}?overlay=true`;
            }
          }
        } catch (avatarError) {
          console.error('Error fetching avatar:', avatarError);
        }
      }
      
      const { data, error } = await supabase
        .from('players')
        .insert({
          ign: playerData.ign,
          java_username: playerData.java_username || null,
          region: regionType,
          device: deviceType,
          avatar_url: avatarUrl,
          global_points: 0
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data as Player;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTierPoints = (tier: TierLevel): number => {
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

  return {
    assignTier,
    createPlayer,
    isLoading,
    error
  };
}
