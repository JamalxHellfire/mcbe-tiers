import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player, GameMode, TierLevel } from '@/services/playerService';
import { useToast } from '@/hooks/use-toast';

export interface NewsArticle {
  id: string;
  headline: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
}

export interface PlayerUpdate {
  id: string;
  ign: string;
  region: string;
  device?: string;
  global_points: number;
  overall_rank: number;
  tier?: TierLevel;
}

export function useAdminPanel() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlayers();
    fetchNews();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('global_points', { ascending: false });

      if (error) throw error;

      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
      setError('Failed to fetch players');
      toast({
        title: "Error",
        description: "Failed to fetch players",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedNews = (data || []).map(item => ({
        id: item.id,
        headline: item.title,
        excerpt: item.description || item.content.substring(0, 150) + '...',
        content: item.content,
        author: item.author,
        published_at: item.created_at
      }));

      setNews(mappedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news');
      toast({
        title: "Error",
        description: "Failed to fetch news",
        variant: "destructive",
      });
    }
  };

  const createNewsArticle = async (article: Omit<NewsArticle, 'id'>) => {
    try {
      const { error } = await supabase
        .from('news_articles')
        .insert([{
          title: article.headline,
          content: article.content,
          excerpt: article.excerpt,
          author: article.author
        }]);

      if (error) throw error;

      fetchNews();
      toast({
        title: "Success",
        description: "News article created successfully",
      });
    } catch (error) {
      console.error('Error creating news article:', error);
      toast({
        title: "Error",
        description: "Failed to create news article",
        variant: "destructive",
      });
    }
  };

  const updateNewsArticle = async (id: string, updates: Partial<NewsArticle>) => {
    try {
      const { error } = await supabase
        .from('news_articles')
        .update({
          title: updates.headline,
          content: updates.content,
          excerpt: updates.excerpt,
          author: updates.author
        })
        .eq('id', id);

      if (error) throw error;

      fetchNews();
      toast({
        title: "Success",
        description: "News article updated successfully",
      });
    } catch (error) {
      console.error('Error updating news article:', error);
      toast({
        title: "Error",
        description: "Failed to update news article",
        variant: "destructive",
      });
    }
  };

  const deleteNewsArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchNews();
      toast({
        title: "Success",
        description: "News article deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting news article:', error);
      toast({
        title: "Error",
        description: "Failed to delete news article",
        variant: "destructive",
      });
    }
  };

  const updatePlayer = async (updatedPlayer: Player) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({
          ign: updatedPlayer.ign,
          region: updatedPlayer.region as any,
          device: updatedPlayer.device as any,
          global_points: updatedPlayer.global_points
        })
        .eq('id', updatedPlayer.id);

      if (error) throw error;

      setPlayers(prev => prev.map(p => 
        p.id === updatedPlayer.id ? updatedPlayer : p
      ));

      toast({
        title: "Success",
        description: "Player updated successfully",
      });
    } catch (error) {
      console.error('Error updating player:', error);
      toast({
        title: "Error",
        description: "Failed to update player",
        variant: "destructive",
      });
    }
  };

  const createPlayer = async (newPlayer: Omit<Player, 'id' | 'overall_rank'>) => {
    try {
      const { error } = await supabase
        .from('players')
        .insert([{
          ign: newPlayer.ign,
          region: newPlayer.region as any,
          device: newPlayer.device as any,
          global_points: newPlayer.global_points
        }]);

      if (error) throw error;

      fetchPlayers();
      toast({
        title: "Success",
        description: "Player created successfully",
      });
    } catch (error) {
      console.error('Error creating player:', error);
      toast({
        title: "Error",
        description: "Failed to create player",
        variant: "destructive",
      });
    }
  };

  const deletePlayer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchPlayers();
      toast({
        title: "Success",
        description: "Player deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting player:', error);
      toast({
        title: "Error",
        description: "Failed to delete player",
        variant: "destructive",
      });
    }
  };

  const assignTiersBulk = async (playerIds: string[], gamemode: GameMode, tier: TierLevel, points: number) => {
    try {
      // Filter out invalid tiers for the database
      const validTiers = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT5', 'LT5', 'Retired'];
      if (!validTiers.includes(tier)) {
        throw new Error(`Invalid tier: ${tier}. Must be one of ${validTiers.join(', ')}`);
      }

      const assignments = playerIds.map(playerId => ({
        player_id: playerId,
        gamemode,
        display_tier: tier as "HT1" | "LT1" | "HT2" | "LT2" | "HT3" | "LT3" | "HT4" | "LT4" | "HT5" | "LT5" | "Retired",
        internal_tier: tier as "HT1" | "LT1" | "HT2" | "LT2" | "HT3" | "LT3" | "HT4" | "LT4" | "HT5" | "LT5" | "Retired",
        points
      }));

      const { error } = await supabase
        .from('gamemode_scores')
        .upsert(assignments);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Assigned ${tier} tier to ${playerIds.length} players for ${gamemode}`,
      });

      fetchPlayers();
    } catch (error) {
      console.error('Error assigning tiers:', error);
      toast({
        title: "Error",
        description: "Failed to assign tiers",
        variant: "destructive",
      });
    }
  };

  const submitPlayerResults = async (formData: { ign: string; java_username?: string; region: string; device?: string; tiers: Record<GameMode, TierLevel> }) => {
    const { ign, java_username, region, device, tiers } = formData;
    if (!ign) {
      toast({ title: "Error", description: "Player IGN is required.", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const { data: playerData, error: playerUpsertError } = await supabase
        .from('players')
        .upsert([{ ign, region, device, java_username: java_username || null }], { onConflict: 'ign' })
        .select()
        .single();

      if (playerUpsertError) throw playerUpsertError;
      if (!playerData) throw new Error("Failed to get player data after upsert.");

      const playerId = playerData.id;
      type DatabaseTier = "HT1" | "LT1" | "HT2" | "LT2" | "HT3" | "LT3" | "HT4" | "LT4" | "HT5" | "LT5" | "Retired";
      const scoresToUpsert = Object.entries(tiers)
        .filter(([, tier]) => tier !== 'Not Ranked')
        .map(([gamemode, tier]) => ({
          player_id: playerId,
          gamemode: gamemode as GameMode,
          display_tier: tier as DatabaseTier,
          internal_tier: tier as DatabaseTier,
          points: 0, // Points are not in the form, default to 0
        }));

      if (scoresToUpsert.length > 0) {
        const { error: scoresError } = await supabase
          .from('gamemode_scores')
          .upsert(scoresToUpsert, { onConflict: 'player_id, gamemode' });

        if (scoresError) throw scoresError;
      }

      toast({
        title: "Success",
        description: `Results for ${ign} submitted successfully.`,
      });
      fetchPlayers();
    } catch (error) {
      console.error('Error submitting player results:', error);
      toast({
        title: "Error",
        description: `Failed to submit results. ${error instanceof Error ? error.message : ''}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    players,
    news,
    loading,
    error,
    fetchPlayers,
    fetchNews,
    createNewsArticle,
    updateNewsArticle,
    deleteNewsArticle,
    updatePlayer,
    createPlayer,
    deletePlayer,
    assignTiersBulk,
    submitPlayerResults,
    showEditDialog,
    setShowEditDialog,
    editingPlayer,
    setEditingPlayer,
  };
}
