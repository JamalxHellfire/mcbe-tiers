
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, Search, Ban, UserPlus, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/services/playerService';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [bannedPlayers, setBannedPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { toast } = useToast();

  // Load players and banned list
  useEffect(() => {
    loadPlayers();
    loadBannedPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedPlayers: Player[] = data.map(player => ({
        id: player.id,
        ign: player.ign,
        region: player.region,
        device: player.device,
        global_points: player.global_points || 0,
        overall_rank: player.overall_rank || 0,
        banned: player.banned || false
      }));

      setPlayers(formattedPlayers);
    } catch (error: any) {
      console.error('Error loading players:', error);
      toast({
        title: "Failed to load players",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const loadBannedPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('banned_players')
        .select('*')
        .order('banned_at', { ascending: false });

      if (error) throw error;
      setBannedPlayers(data || []);
    } catch (error: any) {
      console.error('Error loading banned players:', error);
    }
  };

  const handleBanPlayer = async (player: Player) => {
    if (!player.id) return;
    
    setIsLoading(true);
    try {
      // Update player banned status
      const { error: updateError } = await supabase
        .from('players')
        .update({ banned: true })
        .eq('id', player.id);

      if (updateError) throw updateError;

      // Add to banned_players table
      const { error: banError } = await supabase
        .from('banned_players')
        .insert({
          player_id: player.id,
          ign: player.ign,
          reason: 'Banned by admin'
        });

      if (banError) throw banError;

      toast({
        title: "Player Banned",
        description: `${player.ign} has been banned successfully.`,
      });

      await loadPlayers();
      await loadBannedPlayers();
    } catch (error: any) {
      toast({
        title: "Ban Failed",
        description: `Failed to ban player: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbanPlayer = async (bannedPlayer: any) => {
    setIsLoading(true);
    try {
      // Update player banned status
      const { error: updateError } = await supabase
        .from('players')
        .update({ banned: false })
        .eq('id', bannedPlayer.player_id);

      if (updateError) throw updateError;

      // Remove from banned_players table
      const { error: unbanError } = await supabase
        .from('banned_players')
        .delete()
        .eq('id', bannedPlayer.id);

      if (unbanError) throw unbanError;

      toast({
        title: "Player Unbanned",
        description: `${bannedPlayer.ign} has been unbanned successfully.`,
      });

      await loadPlayers();
      await loadBannedPlayers();
    } catch (error: any) {
      toast({
        title: "Unban Failed",
        description: `Failed to unban player: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchPlayers = async () => {
    if (!searchTerm.trim()) {
      await loadPlayers();
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .or(`ign.ilike.%${searchTerm}%,java_username.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;

      const formattedPlayers: Player[] = data.map(player => ({
        id: player.id,
        ign: player.ign,
        region: player.region,
        device: player.device,
        global_points: player.global_points || 0,
        overall_rank: player.overall_rank || 0,
        banned: player.banned || false
      }));

      setPlayers(formattedPlayers);
    } catch (error: any) {
      toast({
        title: "Search Failed",
        description: `Failed to search players: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlayers = players.filter(player =>
    player.ign.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center space-x-2">
        <UserCheck className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg md:text-xl font-bold text-white">User Management</h3>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
        <div className="md:col-span-2 flex space-x-2">
          <Input
            placeholder="Search by IGN or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input"
          />
          <Button
            onClick={searchPlayers}
            disabled={isLoading}
            className="admin-button bg-blue-600/20 border border-blue-500/50 text-blue-400 hover:bg-blue-600/30"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <Card className="admin-card p-3">
          <div className="text-center">
            <div className="text-lg md:text-xl font-bold text-white">{players.length}</div>
            <div className="text-xs text-gray-400">Total Players</div>
          </div>
        </Card>
        
        <Card className="admin-card p-3">
          <div className="text-center">
            <div className="text-lg md:text-xl font-bold text-red-400">{bannedPlayers.length}</div>
            <div className="text-xs text-gray-400">Banned Users</div>
          </div>
        </Card>
      </div>

      {/* Players List */}
      <Card className="admin-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base text-white">Active Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPlayers.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                {searchTerm ? 'No players found' : 'No players loaded'}
              </div>
            ) : (
              filteredPlayers.map((player) => (
                <div 
                  key={player.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2 md:p-3 bg-gray-900/30 rounded-lg border border-gray-700/30 space-y-2 sm:space-y-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-white text-sm md:text-base">{player.ign}</span>
                      {player.banned && (
                        <Badge variant="destructive" className="text-xs bg-red-600/20 text-red-400 border-red-500/50">
                          BANNED
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {player.region}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {player.device}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Points: {player.global_points} • Rank: #{player.overall_rank}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {player.banned ? (
                      <Button
                        onClick={() => {
                          const bannedEntry = bannedPlayers.find(bp => bp.player_id === player.id);
                          if (bannedEntry) handleUnbanPlayer(bannedEntry);
                        }}
                        disabled={isLoading}
                        className="admin-button bg-green-600/20 border border-green-500/50 text-green-400 hover:bg-green-600/30"
                        size="sm"
                      >
                        <UserPlus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Unban
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleBanPlayer(player)}
                        disabled={isLoading}
                        className="admin-button bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30"
                        size="sm"
                      >
                        <Ban className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Ban
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Banned Players List */}
      {bannedPlayers.length > 0 && (
        <Card className="admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base text-white flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
              Banned Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {bannedPlayers.map((bannedPlayer) => (
                <div 
                  key={bannedPlayer.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2 md:p-3 bg-red-900/20 rounded-lg border border-red-500/30 space-y-2 sm:space-y-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-red-400 text-sm md:text-base">{bannedPlayer.ign}</span>
                      <Badge variant="destructive" className="text-xs bg-red-600/20 text-red-400 border-red-500/50">
                        BANNED
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Banned: {new Date(bannedPlayer.banned_at).toLocaleDateString()}
                      {bannedPlayer.reason && ` • Reason: ${bannedPlayer.reason}`}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleUnbanPlayer(bannedPlayer)}
                    disabled={isLoading}
                    className="admin-button bg-green-600/20 border border-green-500/50 text-green-400 hover:bg-green-600/30"
                    size="sm"
                  >
                    <UserPlus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Unban
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
