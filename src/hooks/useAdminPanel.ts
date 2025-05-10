
import { useState, useEffect } from 'react';
import { playerService, PlayerRegion, DeviceType, GameMode, TierLevel } from '@/services/playerService';
import { adminService } from '@/services/adminService';
import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAdminPanel() {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(adminService.isAdmin());
  const [pinInputValue, setPinInputValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const queryClient = useQueryClient();

  // Check admin expiration on mount
  useEffect(() => {
    const isStillAdmin = adminService.checkExpiration();
    if (isAdminMode !== isStillAdmin) {
      setIsAdminMode(isStillAdmin);
    }
  }, []);

  // Auth functions
  const handlePinSubmit = async () => {
    if (!pinInputValue) {
      toast.error('Please enter the admin PIN');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const isValid = await playerService.verifyAdminPIN(pinInputValue);
      
      if (isValid) {
        adminService.setAdmin(true);
        setIsAdminMode(true);
        toast.success('Admin access granted');
      } else {
        toast.error('Invalid PIN. Access denied.');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Failed to validate admin access');
    } finally {
      setIsSubmitting(false);
      setPinInputValue('');
    }
  };
  
  const handleLogout = () => {
    adminService.logoutAdmin();
    setIsAdminMode(false);
    toast.info('Admin session ended');
  };
  
  // Player management mutations
  const massRegisterPlayersMutation = useMutation({
    mutationFn: async (playersList: string) => {
      if (!playersList.trim()) {
        toast.error('Please enter player data');
        return 0;
      }
      
      const lines = playersList
        .trim()
        .split('\n')
        .filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        toast.error('No valid player data found');
        return 0;
      }
      
      const playerDataList = lines.map(line => {
        const [ign, javaUsername] = line.split(',').map(part => part.trim());
        return {
          ign,
          java_username: javaUsername || undefined
        };
      });
      
      return await playerService.massCreatePlayers(playerDataList);
    },
    onSuccess: (count) => {
      if (count > 0) {
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      }
    }
  });
  
  const submitPlayerResultMutation = useMutation({
    mutationFn: async ({
      ign,
      javaUsername,
      device,
      region,
      gamemode,
      tier
    }: {
      ign: string,
      javaUsername?: string,
      device?: DeviceType,
      region?: PlayerRegion,
      gamemode: GameMode,
      tier: TierLevel
    }) => {
      // First, check if the player exists
      let player = await playerService.getPlayerByIGN(ign);
      
      if (!player) {
        // Create the player if they don't exist
        player = await playerService.createPlayer({
          ign,
          java_username: javaUsername,
          device,
          region
        });
        
        if (!player) {
          toast.error(`Could not create player: ${ign}`);
          return false;
        }
      } else {
        // Update the player's info if needed
        if (
          (javaUsername && player.java_username !== javaUsername) ||
          (device && player.device !== device) ||
          (region && player.region !== region)
        ) {
          await playerService.updatePlayer(player.id, {
            java_username: javaUsername || player.java_username,
            device: device || player.device,
            region: region || player.region
          });
        }
      }
      
      // Assign the tier to the player
      const result = await playerService.assignTier({
        playerId: player.id,
        gamemode,
        tier
      });
      
      return !!result;
    },
    onSuccess: (success, variables) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['tierData', variables.gamemode] });
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      }
    }
  });
  
  const generateFakePlayersMutation = useMutation({
    mutationFn: (count: number) => playerService.generateFakePlayers(count),
    onSuccess: (count) => {
      if (count > 0) {
        queryClient.invalidateQueries();
      }
    }
  });
  
  const wipeAllDataMutation = useMutation({
    mutationFn: () => playerService.wipeAllData(),
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries();
      }
    }
  });
  
  // Wrapper functions for mutations
  const massRegisterPlayers = (playersList: string) => {
    return massRegisterPlayersMutation.mutateAsync(playersList);
  };
  
  const submitPlayerResult = (
    ign: string,
    javaUsername: string | undefined,
    device: DeviceType | undefined,
    region: PlayerRegion | undefined,
    gamemode: GameMode,
    tier: TierLevel
  ) => {
    return submitPlayerResultMutation.mutateAsync({
      ign,
      javaUsername,
      device,
      region,
      gamemode,
      tier
    });
  };
  
  const generateFakePlayers = (count: number) => {
    return generateFakePlayersMutation.mutateAsync(count);
  };
  
  const wipeAllData = () => {
    return wipeAllDataMutation.mutateAsync();
  };
  
  return {
    isAdminMode,
    pinInputValue,
    setPinInputValue,
    isSubmitting,
    handlePinSubmit,
    handleLogout,
    massRegisterPlayers,
    submitPlayerResult,
    generateFakePlayers,
    wipeAllData
  };
}
