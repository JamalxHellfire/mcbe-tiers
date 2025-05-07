
import { useState } from 'react';
import { playerService, PlayerRegion, DeviceType, GameMode, TierLevel } from '@/services/playerService';
import { adminService } from '@/services/adminService';
import { toast } from "sonner";

export function useAdminPanel() {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(adminService.isAdmin());
  const [pinInputValue, setPinInputValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
        adminService.logAdminActivity(`Failed login attempt with PIN: ${pinInputValue}`);
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
  
  // Player management functions
  const massRegisterPlayers = async (playersList: string) => {
    try {
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
      
      const result = await playerService.massCreatePlayers(playerDataList);
      
      // Log admin activity
      adminService.logAdminActivity(`Mass registered ${result} players`);
      
      return result;
    } catch (error) {
      console.error('Mass registration error:', error);
      toast.error('Failed to register players');
      return 0;
    }
  };
  
  const submitPlayerResult = async (
    ign: string,
    javaUsername: string | undefined,
    device: DeviceType | undefined,
    region: PlayerRegion | undefined,
    gamemode: GameMode,
    tier: TierLevel
  ) => {
    try {
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
      
      // Log admin activity
      adminService.logAdminActivity(`Assigned ${ign} to ${tier} in ${gamemode}`);
      
      return !!result;
    } catch (error) {
      console.error('Result submission error:', error);
      toast.error('Failed to submit result');
      return false;
    }
  };
  
  const generateFakePlayers = async (count: number) => {
    const result = await playerService.generateFakePlayers(count);
    
    // Log admin activity if successful
    if (result > 0) {
      adminService.logAdminActivity(`Generated ${result} fake players`);
    }
    
    return result;
  };
  
  const wipeAllData = async () => {
    const result = await playerService.wipeAllData();
    
    // Log admin activity if successful
    if (result) {
      adminService.logAdminActivity(`Wiped all data from the database`);
    }
    
    return result;
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
