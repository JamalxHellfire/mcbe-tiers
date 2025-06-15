
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Users, Search, Ban, UserCheck, UserX, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminPanel } from '@/hooks/useAdminPanel';

interface BannedPlayer {
  id: string;
  player_id: string;
  ign: string;
  banned_at: string;
  reason: string | null;
}

interface PlayerWithBanStatus {
  id: string;
  ign: string;
  region: string;
  device?: string;
  global_points: number;
  overall_rank: number;
  java_username?: string;
  avatar_url?: string;
  banned: boolean;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bannedPlayers, setBannedPlayers] = useState<BannedPlayer[]>([]);
  const [playersWithBanStatus, setPlayersWithBanStatus] = useState<PlayerWithBanStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const { toast } = useToast();
  const { players, refreshPlayers } = useAdminPanel();

  useEffect(() => {
    loadBannedPlayers();
    loadPlayersWithBanStatus();
  }, []);

  const loadPlayersWithBanStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('global_points', { ascending: false });

      if (error) throw error;
      
      const playersWithBan: PlayerWithBanStatus[] = (data || []).map(player => ({
        id: player.id,
        ign: player.ign,
        region: player.region || 'NA',
        device: player.device || 'PC',
        global_points: player.global_points || 0,
        overall_rank: player.overall_rank || 999999,
        java_username: player.java_username,
        avatar_url: player.avatar_url,
        banned: player.banned || false
      }));
      
      setPlayersWithBanStatus(playersWithBan);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load players: ${error.message}`,
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
      toast({
        title: "Error",
        description: `Failed to load banned players: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleBanPlayer = async (playerId: string, ign: string) => {
    if (!banReason.trim()) {
      toast({
        title: "Ban Reason Required",
        description: "Please provide a reason for banning this player.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update player banned status
      const { error: playerError } = await supabase
        .from('players')
        .update({ banned: true })
        .eq('id', playerId);

      if (playerError) throw playerError;

      // Add to banned players table
      const { error: banError } = await supabase
        .from('banned_players')
        .insert({
          player_id: playerId,
          ign: ign,
          reason: banReason.trim()
        });

      if (banError) throw banError;

      toast({
        title: "Player Banned",
        description: `${ign} has been banned successfully.`,
      });

      setBanReason('');
      setSelectedPlayer(null);
      await loadBannedPlayers();
      await loadPlayersWithBanStatus();
      await refreshPlayers();
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

  const handleUnbanPlayer = async (playerId: string, ign: string) => {
    setIsLoading(true);
    try {
      // Update player banned status
      const { error: playerError } = await supabase
        .from('players')
        .update({ banned: false })
        .eq('id', playerId);

      if (playerError) throw playerError;

      // Remove from banned players table
      const { error: unbanError } = await supabase
        .from('banned_players')
        .delete()
        .eq('player_id', playerId);

      if (unbanError) throw unbanError;

      toast({
        title: "Player Unbanned",
        description: `${ign} has been unbanned successfully.`,
      });

      await loadBannedPlayers();
      await loadPlayersWithBanStatus();
      await refreshPlayers();
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

  const filteredPlayers = playersWithBanStatus.filter(player =>
    player.ign.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (player.java_username && player.java_username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center space-x-2">
        <Shield className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg md:text-xl font-bold text-white">User Management</h3>
      </div>

      {/* Search */}
      <Card className="admin-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base text-white flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Search Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by IGN or Java username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input"
          />
        </CardContent>
      </Card>

      {/* Active Players */}
      <Card className="admin-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base text-white flex items-center">
            <UserCheck className="h-4 w-4 mr-2" />
            Active Players ({filteredPlayers.filter(p => !p.banned).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {filteredPlayers.filter(p => !p.banned).map((player) => (
              <div key={player.id} className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg border border-gray-700/30">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{player.ign}</p>
                  <p className="text-xs text-gray-400">Points: {player.global_points}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedPlayer === player.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Ban reason..."
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        className="admin-input w-32 text-xs"
                        size="sm"
                      />
                      <Button
                        onClick={() => handleBanPlayer(player.id, player.ign)}
                        disabled={isLoading || !banReason.trim()}
                        className="admin-button bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 px-2 py-1"
                        size="sm"
                      >
                        <Ban className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedPlayer(null);
                          setBanReason('');
                        }}
                        className="admin-button bg-gray-600/20 border border-gray-500/50 text-gray-400 hover:bg-gray-600/30 px-2 py-1"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSelectedPlayer(player.id)}
                      className="admin-button bg-yellow-600/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-600/30 px-2 py-1"
                      size="sm"
                    >
                      <AlertTriangle className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {filteredPlayers.filter(p => !p.banned).length === 0 && (
              <p className="text-gray-400 text-center py-4">No active players found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Banned Players */}
      <Card className="admin-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base text-white flex items-center">
            <UserX className="h-4 w-4 mr-2" />
            Banned Players ({bannedPlayers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {bannedPlayers.map((bannedPlayer) => (
              <div key={bannedPlayer.id} className="flex items-center justify-between p-2 bg-red-900/20 rounded-lg border border-red-700/30">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{bannedPlayer.ign}</p>
                  <p className="text-xs text-gray-400">
                    Banned: {new Date(bannedPlayer.banned_at).toLocaleDateString()}
                  </p>
                  {bannedPlayer.reason && (
                    <p className="text-xs text-red-400 truncate">Reason: {bannedPlayer.reason}</p>
                  )}
                </div>
                <Button
                  onClick={() => handleUnbanPlayer(bannedPlayer.player_id, bannedPlayer.ign)}
                  disabled={isLoading}
                  className="admin-button bg-green-600/20 border border-green-500/50 text-green-400 hover:bg-green-600/30 px-2 py-1"
                  size="sm"
                >
                  <UserCheck className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {bannedPlayers.length === 0 && (
              <p className="text-gray-400 text-center py-4">No banned players</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
