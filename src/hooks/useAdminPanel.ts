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
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;

      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news');
      toast({
        title: "Error",
        description: "Failed to fetch news",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewsArticle = async (article: Omit<NewsArticle, 'id'>) => {
    try {
      const { error } = await supabase
        .from('news')
        .insert([article]);

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
        .from('news')
        .update(updates)
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
        .from('news')
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

  // Fix the player update to remove 'tiers' property
  const updatePlayer = async (updatedPlayer: Player) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({
          ign: updatedPlayer.ign,
          region: updatedPlayer.region,
          device: updatedPlayer.device,
          global_points: updatedPlayer.global_points,
          tier: updatedPlayer.tier
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
        .insert([newPlayer]);

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

  // Fix the bulk tier assignment function
  const assignTiersBulk = async (playerIds: string[], gamemode: GameMode, tier: TierLevel, points: number) => {
    try {
      const assignments = playerIds.map(playerId => ({
        player_id: playerId,
        gamemode,
        internal_tier: tier,
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
    showEditDialog,
    setShowEditDialog,
    editingPlayer,
    setEditingPlayer,
  };
}
