
import React, { useEffect, useState } from 'react';
import { Player, GameMode, TierLevel } from '@/services/playerService';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Search, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GAME_MODES, TIER_LEVELS, REGIONS, DEVICES } from '@/lib/constants';

export function ManagePlayersTab() {
  const {
    players,
    loading,
    error,
    updatePlayerTier,
    refreshPlayers,
    deletePlayer
  } = useAdminPanel();

  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<number | null>(null);
  const [editingGamemode, setEditingGamemode] = useState<{
    playerId: number;
    gamemode: GameMode;
    currentTier: TierLevel;
  } | null>(null);

  useEffect(() => {
    refreshPlayers();
  }, []);

  const filteredPlayers = players.filter(player =>
    player.ign.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (player.java_username && player.java_username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeletePlayer = async (playerId: number) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      await deletePlayer(playerId);
    }
  };

  const handleUpdateTier = async (playerId: number, gamemode: GameMode, newTier: TierLevel) => {
    await updatePlayerTier(playerId, gamemode, newTier);
    setEditingGamemode(null);
    await refreshPlayers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Loading players...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        <p>Error: {error}</p>
        <Button onClick={refreshPlayers} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Player Management</CardTitle>
          <CardDescription>
            Manage player accounts, tiers, and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Actions */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search players by IGN or Java username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={refreshPlayers} variant="outline">
                Refresh
              </Button>
            </div>

            {/* Players Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IGN</TableHead>
                    <TableHead>Java Username</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Global Points</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Gamemode Tiers</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.ign}</TableCell>
                      <TableCell>{player.java_username || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{player.region}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{player.device}</Badge>
                      </TableCell>
                      <TableCell>{player.global_points || 0}</TableCell>
                      <TableCell>#{player.overall_rank || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {GAME_MODES.map((gamemode) => {
                            const isEditing = editingGamemode?.playerId === player.id && 
                                            editingGamemode?.gamemode === gamemode;
                            
                            return (
                              <div key={gamemode} className="flex items-center gap-1">
                                {isEditing ? (
                                  <div className="flex items-center gap-1">
                                    <Select
                                      value={editingGamemode.currentTier}
                                      onValueChange={(value) => 
                                        setEditingGamemode({
                                          ...editingGamemode,
                                          currentTier: value as TierLevel
                                        })
                                      }
                                    >
                                      <SelectTrigger className="w-20 h-6 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {TIER_LEVELS.filter(tier => tier !== 'Not Ranked').map((tier) => (
                                          <SelectItem key={tier} value={tier}>
                                            {tier}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={() => handleUpdateTier(
                                        player.id, 
                                        gamemode, 
                                        editingGamemode.currentTier
                                      )}
                                    >
                                      <Save className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={() => setEditingGamemode(null)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-xs cursor-pointer hover:bg-gray-100"
                                    onClick={() => setEditingGamemode({
                                      playerId: player.id,
                                      gamemode,
                                      currentTier: 'HT1' // Default tier for editing
                                    })}
                                  >
                                    {gamemode}
                                    <Edit className="h-2 w-2 ml-1" />
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePlayer(player.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredPlayers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No players found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
