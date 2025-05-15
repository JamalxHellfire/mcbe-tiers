import { useState, useEffect } from 'react';
import { playerService, PlayerRegion, DeviceType, GameMode, TierLevel, Player } from '@/services/playerService';
import { adminService } from '@/services/adminService';
import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase, NewsArticle } from '@/integrations/supabase/client';

export { NewsArticle };

export function useAdminPanel() {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(adminService.isAdmin());
  const [pinInputValue, setPinInputValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Player search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // News state
  const [newsFormData, setNewsFormData] = useState<{
    title: string;
    description: string;
    author: string;
  }>({
    title: '',
    description: '',
    author: ''
  });
  
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
        // Use type assertion to ensure types match
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
        toast.success(`Successfully registered ${count} players`);
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
  
  const updatePlayerMutation = useMutation({
    mutationFn: async ({
      playerId,
      javaUsername,
      region,
      device,
    }: {
      playerId: string,
      javaUsername?: string,
      region?: PlayerRegion,
      device?: DeviceType
    }) => {
      return await playerService.updatePlayer(playerId, {
        java_username: javaUsername,
        region,
        device
      });
    },
    onSuccess: (success, variables) => {
      if (success) {
        toast.success('Player updated successfully');
        loadPlayerDetails(variables.playerId);
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      } else {
        toast.error('Failed to update player');
      }
    }
  });
  
  const updatePlayerTierMutation = useMutation({
    mutationFn: async ({
      playerId,
      gamemode,
      tier
    }: {
      playerId: string,
      gamemode: GameMode,
      tier: TierLevel
    }) => {
      return await playerService.assignTier({
        playerId,
        gamemode,
        tier
      });
    },
    onSuccess: (success, variables) => {
      if (success) {
        toast.success(`Updated ${variables.gamemode} tier to ${variables.tier}`);
        loadPlayerDetails(variables.playerId);
        queryClient.invalidateQueries({ queryKey: ['tierData', variables.gamemode] });
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      } else {
        toast.error(`Failed to update ${variables.gamemode} tier`);
      }
    }
  });
  
  const deletePlayerMutation = useMutation({
    mutationFn: async (playerId: string) => {
      return await playerService.deletePlayer(playerId);
    },
    onSuccess: (success, playerId) => {
      if (success) {
        toast.success('Player deleted successfully');
        setSelectedPlayer(null);
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      } else {
        toast.error('Failed to delete player');
      }
    }
  });
  
  const banPlayerMutation = useMutation({
    mutationFn: async (player: Player) => {
      return await playerService.banPlayer(player);
    },
    onSuccess: (success, player) => {
      if (success) {
        toast.success(`${player.ign} has been banned`);
        setSelectedPlayer(null);
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      } else {
        toast.error(`Failed to ban ${player.ign}`);
      }
    }
  });
  
  const generateFakePlayersMutation = useMutation({
    mutationFn: (count: number) => playerService.generateFakePlayers(count),
    onSuccess: (count) => {
      if (count > 0) {
        queryClient.invalidateQueries();
        toast.success(`Successfully generated ${count} fake players`);
      }
    }
  });
  
  const generateRealisticPlayersMutation = useMutation({
    mutationFn: (count: number) => playerService.generateRealisticPlayers(count),
    onSuccess: (count) => {
      if (count > 0) {
        queryClient.invalidateQueries();
        toast.success(`Successfully generated ${count} realistic players`);
      }
    }
  });
  
  const wipeAllDataMutation = useMutation({
    mutationFn: () => playerService.wipeAllData(),
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries();
        toast.success('All player data has been wiped');
      }
    }
  });
  
  // News mutations
  const submitNewsMutation = useMutation({
    mutationFn: async (newsData: NewsArticle) => {
      // Use raw query to work with tables not defined in types
      const { error } = await supabase
        .from('news')
        .insert({
          title: newsData.title,
          description: newsData.description,
          author: newsData.author
        } as any); // Use type assertion as any to bypass TypeScript checking
        
      if (error) {
        console.error('Error submitting news:', error);
        throw new Error('Failed to submit news article');
      }
      
      return true;
    },
    onSuccess: () => {
      toast.success('News article published successfully');
      setNewsFormData({
        title: '',
        description: '',
        author: ''
      });
      queryClient.invalidateQueries({ queryKey: ['news'] });
    }
  });
  
  // Fetch news articles
  const { data: newsArticles = [] } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      // Use raw query to work with tables not defined in types
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false }) as any;
        
      if (error) {
        console.error('Error fetching news:', error);
        throw new Error('Failed to fetch news articles');
      }
      
      return (data as NewsArticle[]) || [];
    },
    staleTime: 60000, // 1 minute
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
  
  const updatePlayer = (
    playerId: string,
    javaUsername?: string,
    region?: PlayerRegion,
    device?: DeviceType
  ) => {
    return updatePlayerMutation.mutateAsync({
      playerId,
      javaUsername,
      region,
      device
    });
  };
  
  const updatePlayerTier = (
    playerId: string,
    gamemode: GameMode,
    tier: TierLevel
  ) => {
    return updatePlayerTierMutation.mutateAsync({
      playerId,
      gamemode,
      tier
    });
  };
  
  const deletePlayer = (playerId: string) => {
    return deletePlayerMutation.mutateAsync(playerId);
  };
  
  const banPlayer = (player: Player) => {
    return banPlayerMutation.mutateAsync(player);
  };
  
  const generateFakePlayers = (count: number) => {
    return generateFakePlayersMutation.mutateAsync(count);
  };
  
  const generateRealisticPlayers = (count: number) => {
    return generateRealisticPlayersMutation.mutateAsync(count);
  };
  
  const wipeAllData = () => {
    return wipeAllDataMutation.mutateAsync();
  };
  
  const submitNews = () => {
    return submitNewsMutation.mutateAsync(newsFormData);
  };
  
  // Handle news form input changes
  const handleNewsInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewsFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    generateRealisticPlayers,
    wipeAllData,
    // Player search and edit
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    selectedPlayer,
    setSelectedPlayer,
    loadPlayerDetails,
    clearSelectedPlayer,
    updatePlayer,
    updatePlayerTier,
    deletePlayer,
    banPlayer,
    // News
    newsFormData,
    handleNewsInputChange,
    submitNews,
    newsArticles
  };
}
