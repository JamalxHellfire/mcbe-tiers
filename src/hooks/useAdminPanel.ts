
import { useState, useEffect } from 'react';
import { playerService, PlayerRegion, DeviceType, GameMode, TierLevel, Player } from '@/services/playerService';
import { adminService } from '@/services/adminService';
import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces for news articles
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  author: string;
  created_at: string;
  updated_at?: string | null;
}

// Add a new interface for article creation that doesn't require id and created_at
export type NewsArticleCreate = {
  title: string;
  description: string;
  author: string;
};

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
  const [newsFormData, setNewsFormData] = useState<NewsArticleCreate>({
    title: '',
    description: '',
    author: ''
  });

  // News editing state
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  
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
      tier: TierLevel | "NA"
    }) => {
      // Validate required fields
      if (!ign) {
        toast.error('Player IGN is required');
        return false;
      }

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
      
      // If tier is "NA" (unranked), no need to assign tier
      if (tier === "NA") {
        return true;
      }
      
      // Assign the tier to the player
      const result = await playerService.assignTier({
        playerId: player.id,
        gamemode,
        tier: tier as TierLevel // Safe cast as we've checked it's not "NA"
      });
      
      return !!result;
    },
    onSuccess: (success, variables) => {
      if (success) {
        if (variables.tier !== "NA") {
          queryClient.invalidateQueries({ queryKey: ['tierData', variables.gamemode] });
        }
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
  
  // News mutations - updated to use NewsArticleCreate instead of NewsArticle
  const submitNewsMutation = useMutation({
    mutationFn: async (newsData: NewsArticleCreate) => {
      // Validate required fields
      if (!newsData.title.trim()) {
        toast.error('News title is required');
        return false;
      }
      
      if (!newsData.description.trim()) {
        toast.error('News description is required');
        return false;
      }
      
      if (!newsData.author.trim()) {
        toast.error('Author name is required');
        return false;
      }
      
      // Use raw query to work with tables not defined in types
      const { error } = await supabase
        .from('news')
        .insert({
          title: newsData.title,
          description: newsData.description,
          author: newsData.author
        } as any);
        
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
  
  // Update news mutation
  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, newsData }: { id: string, newsData: NewsArticleCreate }) => {
      // Validate required fields
      if (!newsData.title.trim()) {
        toast.error('News title is required');
        return false;
      }
      
      if (!newsData.description.trim()) {
        toast.error('News description is required');
        return false;
      }
      
      if (!newsData.author.trim()) {
        toast.error('Author name is required');
        return false;
      }
      
      // Use raw query to update the news article
      const { error } = await supabase
        .from('news')
        .update({
          title: newsData.title,
          description: newsData.description,
          author: newsData.author,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating news:', error);
        throw new Error('Failed to update news article');
      }
      
      return true;
    },
    onSuccess: () => {
      toast.success('News article updated successfully');
      setNewsFormData({
        title: '',
        description: '',
        author: ''
      });
      setEditingNewsId(null);
      queryClient.invalidateQueries({ queryKey: ['news'] });
    }
  });
  
  // Delete news mutation
  const deleteNewsMutation = useMutation({
    mutationFn: async (newsId: string) => {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', newsId);
        
      if (error) {
        console.error('Error deleting news:', error);
        throw new Error('Failed to delete news article');
      }
      
      return true;
    },
    onSuccess: () => {
      toast.success('News article deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['news'] });
    }
  });
  
  // Fetch news articles
  const { data: newsArticles = [], isLoading: loadingNews } = useQuery({
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
  
  // Start editing a news article
  const startEditingNews = (article: NewsArticle) => {
    setNewsFormData({
      title: article.title,
      description: article.description,
      author: article.author
    });
    setEditingNewsId(article.id);
  };
  
  // Cancel editing a news article
  const cancelEditingNews = () => {
    setNewsFormData({
      title: '',
      description: '',
      author: ''
    });
    setEditingNewsId(null);
  };
  
  const submitPlayerResult = (
    ign: string,
    javaUsername: string | undefined,
    device: DeviceType | undefined,
    region: PlayerRegion | undefined,
    gamemode: GameMode,
    tier: TierLevel | "NA"
  ) => {
    // Validate mandatory fields
    if (!ign) {
      toast.error('Player IGN is required');
      return Promise.resolve(false);
    }
    
    if (!region) {
      toast.error('Player region is required');
      return Promise.resolve(false);
    }
    
    if (!javaUsername) {
      toast.error('Java username is required');
      return Promise.resolve(false);
    }
    
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
    // Validate mandatory fields for updates
    if (!javaUsername) {
      toast.error('Java username is required');
      return Promise.resolve(false);
    }
    
    if (!region) {
      toast.error('Player region is required');
      return Promise.resolve(false);
    }
    
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
  
  const submitNews = () => {
    // Server-side validation
    if (!newsFormData.title.trim()) {
      toast.error('News title is required');
      return Promise.resolve(false);
    }
    
    if (!newsFormData.description.trim()) {
      toast.error('News description is required');
      return Promise.resolve(false);
    }
    
    if (!newsFormData.author.trim()) {
      toast.error('Author name is required');
      return Promise.resolve(false);
    }
    
    return submitNewsMutation.mutateAsync(newsFormData);
  };
  
  const updateNews = () => {
    if (!editingNewsId) {
      toast.error('No news article selected for editing');
      return Promise.resolve(false);
    }
    
    return updateNewsMutation.mutateAsync({
      id: editingNewsId,
      newsData: newsFormData
    });
  };
  
  const deleteNews = (newsId: string) => {
    return deleteNewsMutation.mutateAsync(newsId);
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
    submitPlayerResult,
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
    updateNews,
    deleteNews,
    startEditingNews,
    cancelEditingNews,
    editingNewsId,
    newsArticles,
    loadingNews
  };
}
