
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Users, Search, UserPlus, Trash2, Shield, ShieldOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/services/playerService';

const UserManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchPlayers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('overall_rank', { ascending: true });

      if (error) throw error;

      setPlayers(data || []);
    } catch (error: any) {
      toast({
        title: "Fetch Failed",
        description: `Failed to fetch players: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDeletePlayer = async (playerId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);

      if (error) throw error;

      await fetchPlayers();
      toast({
        title: "Player Deleted",
        description: "Player has been removed from the system.",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: `Failed to delete player: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBan = async (playerId: string, currentBanned: boolean) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('players')
        .update({ 
          banned: !currentBanned
        })
        .eq('id', playerId);

      if (error) throw error;

      await fetchPlayers();
      toast({
        title: currentBanned ? "Player Unbanned" : "Player Banned",
        description: `Player has been ${currentBanned ? 'unbanned' : 'banned'} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Ban Toggle Failed",
        description: `Failed to ${currentBanned ? 'unban' : 'ban'} player: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlayers = players.filter(player =>
    player.ign?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center space-x-2">
        <Users className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg md:text-xl font-bold text-white">User Management</h3>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input pl-10"
          />
        </div>
        <Button
          className="admin-button bg-green-600/20 border border-green-500/50 text-green-400 hover:bg-green-600/30"
          size="sm"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Player
        </Button>
      </div>

      {/* Players List */}
      <Card className="admin-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm md:text-base text-white">
            Players ({filteredPlayers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredPlayers.map((player) => (
              <div 
                key={player.id} 
                className="flex items-center justify-between p-2 md:p-3 bg-gray-800/40 rounded-lg border border-gray-700/40"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {player.ign?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">
                      {player.ign || 'Unknown Player'}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Rank: #{player.overall_rank || 'Unranked'}
                      {player.banned && (
                        <span className="ml-2 text-red-400 font-medium">BANNED</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
                  <Button
                    onClick={() => handleToggleBan(player.id, player.banned || false)}
                    disabled={isLoading}
                    className={`admin-button ${
                      player.banned
                        ? 'bg-green-600/20 border border-green-500/50 text-green-400 hover:bg-green-600/30'
                        : 'bg-yellow-600/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-600/30'
                    }`}
                    size="sm"
                  >
                    {player.banned ? (
                      <Shield className="h-3 w-3 md:h-4 md:w-4" />
                    ) : (
                      <ShieldOff className="h-3 w-3 md:h-4 md:w-4" />
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => handleDeletePlayer(player.id)}
                    disabled={isLoading}
                    className="admin-button bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30"
                    size="sm"
                  >
                    <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredPlayers.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                {searchTerm ? 'No players found matching your search.' : 'No players found.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
