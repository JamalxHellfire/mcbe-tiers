
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GameMode, TierLevel, PlayerRegion, DeviceType } from '@/services/playerService';

export function useAdminPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addTierAssignment = async (data: {
    playerId: string;
    gamemode: GameMode;
    tier: TierLevel;
    score: number;
  }) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('gamemode_scores')
        .insert({
          player_id: data.playerId,
          gamemode: data.gamemode,
          internal_tier: data.tier,
          display_tier: data.tier,
          score: data.score
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tier assignment added successfully"
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add tier assignment"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addPlayer = async (data: {
    ign: string;
    java_username: string;
    region: PlayerRegion;
    device: DeviceType;
    global_points: number;
  }) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('players')
        .insert([{
          ign: data.ign,
          java_username: data.java_username,
          region: data.region,
          device: data.device,
          global_points: data.global_points
        }]);

      if (error) throw error;

      toast({
        title: "Success", 
        description: "Player added successfully"
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add player"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addTierAssignment,
    addPlayer,
    isLoading
  };
}
