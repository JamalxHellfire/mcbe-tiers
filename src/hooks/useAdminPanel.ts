
import { useState, useEffect } from 'react';
import { PlayerRegion, DeviceType, GameMode, TierLevel, Player, playerService } from '@/services/playerService';
import { adminService } from '@/services/adminService';
import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { injectTestPlayers, getPlayerCount } from '@/utils/testDataGenerator';
import { usePopup } from '@/contexts/PopupContext';

export function useAdminPanel() {
  const { setPopupDataFromPlayer } = usePopup();
  const [isAdminMode, setIsAdminMode] = useState<boolean>(adminService.isAdmin());
  const [pinInputValue, setPinInputValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGeneratingData, setIsGeneratingData] = useState<boolean>(false);
  const [playerCount, setPlayerCount] = useState<number>(0);
  
  // Player search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Form state for player submission
  const [ign, setIgn] = useState('');
  const [javaUsername, setJavaUsername] = useState('');
  const [region, setRegion] = useState<PlayerRegion | undefined>(undefined);
  const [device, setDevice] = useState<DeviceType | undefined>(undefined);
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    ign: false,
    javaUsername: false,
    region: false
  });
  
  // Track selected tiers for each gamemode
  const [tierSelections, setTierSelections] = useState<Record<GameMode, TierLevel | "NA">>({
    'Crystal': "NA",
    'Sword': "NA",
    'SMP': "NA",
    'UHC': "NA",
    'Axe': "NA",
    'NethPot': "NA",
    'Bedwars': "NA",
    'Mace': "NA"
  } as Record<GameMode, TierLevel | "NA">);
  
  const queryClient = useQueryClient();

  // Check admin expiration on mount
  useEffect(() => {
    const isStillAdmin = adminService.checkExpiration();
    if (isAdminMode !== isStillAdmin) {
      setIsAdminMode(isStillAdmin);
    }
    
    // Get current player count on mount
    if (isStillAdmin) {
      getPlayerCount().then(count => setPlayerCount(count));
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
      const isValid = await adminService.verifyAdminPIN(pinInputValue);
      
      if (isValid) {
        adminService.setAdmin(true);
        setIsAdminMode(true);
        toast.success('Admin access granted');
        
        // Get current player count
        const count = await getPlayerCount();
        setPlayerCount(count);
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
  
  // Generate test data function
  const generateTestData = async (count: number) => {
    if (!isAdminMode) {
      toast.error('Admin access required to generate test data');
      return false;
    }
    
    setIsGeneratingData(true);
    
    try {
      const success = await injectTestPlayers(count);
      
      if (success) {
        toast.success(`Successfully generated test data`);
        // Invalidate queries to update UI
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        queryClient.invalidateQueries({ queryKey: ['tierData'] });
        
        // Update player count
        const newCount = await getPlayerCount();
        setPlayerCount(newCount);
        
        return true;
      } else {
        toast.error('Failed to generate test data');
        return false;
      }
    } catch (error) {
      console.error('Error generating test data:', error);
      toast.error('An error occurred while generating test data');
      return false;
    } finally {
      setIsGeneratingData(false);
    }
  };

  // Calculate points based on tier level
  const calculatePointsFromTier = (tier: TierLevel | "NA"): number => {
    switch(tier) {
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
      case "NA": return 0;
      default: return 0;
    }
  };

  // Search for players by IGN
  const searchPlayerByIGN = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .ilike('ign', `%${query}%`)
        .limit(10);
        
      if (error) {
        console.error('Error searching for players:', error);
        toast.error('Failed to search for players');
        setSearchResults([]);
      } else {
        setSearchResults(data as unknown as Player[] || []);
      }
    } catch (error) {
      console.error('Player search error:', error);
      toast.error('An error occurred during player search');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Load player details
  const loadPlayerDetails = async (playerId: string) => {
    try {
      const player = await playerService.getPlayerById(playerId);
      if (player) {
        const tiers = await playerService.getPlayerTiers(playerId);
        setSelectedPlayer({ ...player, tiers });
      } else {
        toast.error('Player not found');
        setSelectedPlayer(null);
      }
    } catch (error) {
      console.error('Error loading player details:', error);
      toast.error('Failed to load player details');
    }
  };
  
  // Clear selected player
  const clearSelectedPlayer = () => {
    setSelectedPlayer(null);
  };

  // Handle search input changes with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchPlayerByIGN(searchQuery);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Validate form before submission
  const validateForm = () => {
    const errors = {
      ign: !ign.trim(),
      javaUsername: !javaUsername.trim(),
      region: !region
    };
    
    setFormErrors(errors);
    
    return !Object.values(errors).some(isError => isError);
  };
  
  // Handle tier selection change
  const handleTierChange = (gamemode: GameMode, tier: TierLevel | "NA") => {
    setTierSelections(prev => ({
      ...prev,
      [gamemode]: tier
    }));
  };

  // Handle multiple gamemode submissions at once
  const handleSubmitAllSelectedTiers = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    let successCount = 0;
    let hasAttempts = false;
    
    try {
      // First, get or create the player
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
          return;
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
      
      // Create the tier assignments for the popup
      const tierAssignments: Array<{
        gamemode: GameMode;
        tier: TierLevel;
        points: number;
      }> = [];

      // Submit all selected tiers
      for (const gamemode of Object.keys(tierSelections) as GameMode[]) {
        const tier = tierSelections[gamemode];
        if (tier !== "NA") {
          hasAttempts = true;
          try {
            const success = await playerService.assignTier({
              playerId: player.id,
              gamemode,
              tier: tier as TierLevel
            });
            
            if (success) {
              successCount++;
              
              // Add to tier assignments for the popup
              const points = calculatePointsFromTier(tier);
              tierAssignments.push({
                gamemode,
                tier: tier as TierLevel,
                points,
              });
            }
          } catch (err) {
            console.error(`Error submitting ${gamemode} player:`, err);
          }
        }
      }
      
      // Show the result popup if there's at least one successful submission
      if (successCount > 0 && player) {
        // Refresh player data to ensure we have the latest
        const updatedPlayer = await playerService.getPlayerById(player.id);
        if (updatedPlayer) {
          // Trigger the popup
          setPopupDataFromPlayer(updatedPlayer, tierAssignments);
        }
      }
    } catch (err) {
      console.error('Error during result submission:', err);
      toast.error('An error occurred during submission');
    }
    
    if (!hasAttempts) {
      toast.info('No tiers were selected for submission');
      return;
    }
    
    if (successCount > 0) {
      toast.success(`Successfully submitted ${successCount} tier rankings for ${ign}`);
      // Reset tier selections
      setTierSelections({
        'Crystal': "NA",
        'Sword': "NA",
        'SMP': "NA",
        'UHC': "NA",
        'Axe': "NA",
        'NethPot': "NA",
        'Bedwars': "NA",
        'Mace': "NA"
      } as Record<GameMode, TierLevel | "NA">);
      
      // Reset form
      setIgn('');
      setJavaUsername('');
      setRegion(undefined);
      setDevice(undefined);
    } else {
      toast.error('Failed to submit any tier rankings');
    }
  };

  // Reset tier selections
  const resetTierSelections = () => {
    setTierSelections({
      'Crystal': "NA",
      'Sword': "NA",
      'SMP': "NA",
      'UHC': "NA",
      'Axe': "NA",
      'NethPot': "NA",
      'Bedwars': "NA",
      'Mace': "NA"
    } as Record<GameMode, TierLevel | "NA">);
  };

  return {
    isAdminMode,
    pinInputValue,
    setPinInputValue,
    isSubmitting,
    handlePinSubmit,
    handleLogout,
    // Player search and edit
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    selectedPlayer,
    setSelectedPlayer,
    loadPlayerDetails,
    clearSelectedPlayer,
    // Test data generation
    generateTestData,
    isGeneratingData,
    playerCount,
    // Form state
    ign, setIgn,
    javaUsername, setJavaUsername,
    region, setRegion,
    device, setDevice,
    formErrors, setFormErrors,
    tierSelections, setTierSelections,
    validateForm,
    handleTierChange,
    // Process the form submission
    handleSubmitAllSelectedTiers,
    resetTierSelections
  };
}
