
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit, X, Trash, RefreshCw, Save } from "lucide-react";
import { searchPlayersByIGN, fetchPlayerWithGamemodeScores, updatePlayer, deletePlayerTier } from '@/api/supabase';
import { Player, GamemodeScore } from '@/types';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

export const PlayerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<{player: Player, scores: GamemodeScore[]} | null>(null);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form state for player editing
  const [editForm, setEditForm] = useState({
    ign: '',
    javaUsername: '',
    device: '',
    region: '',
    gamemode: '',
    tier: ''
  });
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const results = await searchPlayersByIGN(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching players:', error);
      toast.error('Failed to search players');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handlePlayerSelect = async (player: Player) => {
    setIsLoadingPlayer(true);
    setSelectedPlayer(null);
    
    try {
      const playerWithScores = await fetchPlayerWithGamemodeScores(player.id);
      setSelectedPlayer(playerWithScores);
      
      // Initialize edit form with player data
      setEditForm({
        ign: playerWithScores.player.ign,
        javaUsername: playerWithScores.player.java_username || '',
        device: playerWithScores.player.device || '',
        region: playerWithScores.player.region || '',
        gamemode: '',
        tier: ''
      });
    } catch (error) {
      console.error('Error fetching player details:', error);
      toast.error('Failed to load player details');
    } finally {
      setIsLoadingPlayer(false);
    }
  };
  
  const handleEditClick = () => {
    if (!selectedPlayer) return;
    setIsEditModalOpen(true);
  };
  
  const handleSaveChanges = async () => {
    if (!selectedPlayer) return;
    
    setIsSaving(true);
    
    try {
      const updates: any = {};
      
      if (editForm.javaUsername && editForm.javaUsername !== selectedPlayer.player.java_username) {
        updates.java_username = editForm.javaUsername;
        updates.avatar_url = `https://crafatar.com/avatars/${editForm.javaUsername}?overlay`;
      }
      
      if (editForm.device && editForm.device !== selectedPlayer.player.device) {
        updates.device = editForm.device;
      }
      
      if (editForm.region && editForm.region !== selectedPlayer.player.region) {
        updates.region = editForm.region;
      }
      
      // Check if there's a gamemode tier update
      if (editForm.gamemode && editForm.tier) {
        updates.gamemode = editForm.gamemode;
        updates.tier = editForm.tier;
      }
      
      if (Object.keys(updates).length > 0) {
        await updatePlayer(selectedPlayer.player.id, updates);
        
        // Refresh player data
        const updatedPlayer = await fetchPlayerWithGamemodeScores(selectedPlayer.player.id);
        setSelectedPlayer(updatedPlayer);
        
        toast.success('Player updated successfully');
      }
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating player:', error);
      toast.error('Failed to update player');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteTier = async (gamemode: string) => {
    if (!selectedPlayer) return;
    
    if (!confirm(`Are you sure you want to delete the ${gamemode} tier for this player?`)) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await deletePlayerTier(selectedPlayer.player.id, gamemode);
      
      // Refresh player data
      const updatedPlayer = await fetchPlayerWithGamemodeScores(selectedPlayer.player.id);
      setSelectedPlayer(updatedPlayer);
      
      toast.success(`${gamemode} tier deleted successfully`);
    } catch (error) {
      console.error('Error deleting tier:', error);
      toast.error('Failed to delete tier');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const getRegionColor = (region: string) => {
    switch(region) {
      case 'NA': return 'bg-red-900/30 text-red-400';
      case 'EU': return 'bg-green-900/30 text-green-400';
      case 'ASIA': return 'bg-blue-900/30 text-blue-400';
      case 'OCE': return 'bg-purple-900/30 text-purple-400';
      case 'AF': return 'bg-yellow-900/30 text-yellow-400';
      default: return 'bg-gray-900/30 text-gray-400';
    }
  };
  
  const getDeviceIcon = (device: string) => {
    switch(device) {
      case 'PC': return '💻';
      case 'Mobile': return '📱';
      case 'Controller': return '🎮';
      default: return '🖥️';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search players by IGN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 bg-dark-surface/60 border-white/10"
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="bg-blue-600 hover:bg-blue-500"
        >
          {isSearching ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
      </div>
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <motion.div 
          className="bg-dark-surface/60 border border-white/10 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-medium mb-3">Search Results</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {searchResults.map((player) => (
              <motion.div 
                key={player.id}
                className="bg-dark-surface/40 hover:bg-dark-surface/70 p-3 rounded-md cursor-pointer flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => handlePlayerSelect(player)}
              >
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2 border border-white/10">
                    <AvatarImage src={player.avatar_url || '/default-avatar.png'} />
                    <AvatarFallback>{player.ign.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{player.ign}</span>
                </div>
                <Badge variant="outline" className="text-white/70">Select</Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Selected Player Details */}
      {isLoadingPlayer ? (
        <div className="bg-dark-surface/60 border border-white/10 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      ) : selectedPlayer && (
        <motion.div 
          className="bg-dark-surface/60 border border-white/10 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white/10">
                <AvatarImage src={selectedPlayer.player.avatar_url || '/default-avatar.png'} />
                <AvatarFallback>{selectedPlayer.player.ign.slice(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-xl font-bold">{selectedPlayer.player.ign}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPlayer.player.region && (
                    <Badge className={getRegionColor(selectedPlayer.player.region)}>
                      {selectedPlayer.player.region}
                    </Badge>
                  )}
                  {selectedPlayer.player.device && (
                    <Badge variant="outline">
                      {getDeviceIcon(selectedPlayer.player.device)} {selectedPlayer.player.device}
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    Points: {selectedPlayer.player.global_points || 0}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button onClick={handleEditClick} size="sm" variant="default" className="bg-blue-600 hover:bg-blue-500">
              <Edit className="mr-2 h-4 w-4" />
              Edit Player
            </Button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Gamemode Tiers</h3>
            {selectedPlayer.scores.length === 0 ? (
              <p className="text-white/50 italic">No gamemode tiers assigned</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedPlayer.scores.map((score) => (
                  <div 
                    key={score.id}
                    className="bg-dark-surface/40 border border-white/10 rounded-md p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{score.gamemode}</div>
                      <div className="text-sm text-white/70">
                        {score.internal_tier} ({score.display_tier}) - {score.score} Points
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={() => handleDeleteTier(score.gamemode)}
                      disabled={isDeleting}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-[#0B0B0F] border-white/10">
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>
              Update player information and tiers
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Player Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-white/70">IGN</label>
                  <Input
                    value={editForm.ign}
                    onChange={(e) => setEditForm({ ...editForm, ign: e.target.value })}
                    disabled
                    className="bg-dark-surface/40 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Java Username (Avatar)</label>
                  <Input
                    value={editForm.javaUsername}
                    onChange={(e) => setEditForm({ ...editForm, javaUsername: e.target.value })}
                    className="bg-dark-surface/40 border-white/10"
                    placeholder="Java username for avatar"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Device</label>
                  <Select
                    value={editForm.device}
                    onValueChange={(value) => setEditForm({ ...editForm, device: value })}
                  >
                    <SelectTrigger className="bg-dark-surface/40 border-white/10">
                      <SelectValue placeholder="Select device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PC">PC</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Controller">Controller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Region</label>
                  <Select
                    value={editForm.region}
                    onValueChange={(value) => setEditForm({ ...editForm, region: value })}
                  >
                    <SelectTrigger className="bg-dark-surface/40 border-white/10">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EU">EU</SelectItem>
                      <SelectItem value="NA">NA</SelectItem>
                      <SelectItem value="ASIA">ASIA</SelectItem>
                      <SelectItem value="OCE">OCE</SelectItem>
                      <SelectItem value="AF">AF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Add/Update Tier</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Gamemode</label>
                  <Select
                    value={editForm.gamemode}
                    onValueChange={(value) => setEditForm({ ...editForm, gamemode: value })}
                  >
                    <SelectTrigger className="bg-dark-surface/40 border-white/10">
                      <SelectValue placeholder="Select gamemode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMP">SMP</SelectItem>
                      <SelectItem value="Bedwars">Bedwars</SelectItem>
                      <SelectItem value="Mace">Mace</SelectItem>
                      <SelectItem value="UHC">UHC</SelectItem>
                      <SelectItem value="Axe">Axe</SelectItem>
                      <SelectItem value="Pot">Pot</SelectItem>
                      <SelectItem value="Sword">Sword</SelectItem>
                      <SelectItem value="Crystal">Crystal</SelectItem>
                      <SelectItem value="NetherPot">NetherPot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Tier</label>
                  <Select
                    value={editForm.tier}
                    onValueChange={(value) => setEditForm({ ...editForm, tier: value })}
                  >
                    <SelectTrigger className="bg-dark-surface/40 border-white/10">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HT1">HT1 (50pts)</SelectItem>
                      <SelectItem value="LT1">LT1 (45pts)</SelectItem>
                      <SelectItem value="HT2">HT2 (40pts)</SelectItem>
                      <SelectItem value="LT2">LT2 (35pts)</SelectItem>
                      <SelectItem value="HT3">HT3 (30pts)</SelectItem>
                      <SelectItem value="LT3">LT3 (25pts)</SelectItem>
                      <SelectItem value="HT4">HT4 (20pts)</SelectItem>
                      <SelectItem value="LT4">LT4 (15pts)</SelectItem>
                      <SelectItem value="HT5">HT5 (10pts)</SelectItem>
                      <SelectItem value="LT5">LT5 (5pts)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
              className="border-white/10"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-500"
            >
              {isSaving ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
