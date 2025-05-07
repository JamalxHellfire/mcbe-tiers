
import React, { useState, useEffect } from 'react';
import { usePlayerSearch } from '@/hooks/usePlayerSearch';
import { playerService, GameMode, TierLevel, PlayerRegion, DeviceType } from '@/services/playerService';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, ChevronsUpDown, Loader2, Edit2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const gamemodes: GameMode[] = ['SMP', 'Bedwars', 'Mace', 'Crystal', 'Sword', 'UHC', 'Axe', 'NethPot'];
const regions: PlayerRegion[] = ['NA', 'EU', 'ASIA', 'OCE'];
const devices: DeviceType[] = ['Mobile', 'PC', 'Console'];

// Tier mapping for display
const tierMapping: Record<TierLevel, { label: string, points: number }> = {
  'LT5': { label: 'Low Tier 5', points: 5 },
  'HT5': { label: 'High Tier 5', points: 10 },
  'LT4': { label: 'Low Tier 4', points: 15 },
  'HT4': { label: 'High Tier 4', points: 20 },
  'LT3': { label: 'Low Tier 3', points: 25 },
  'HT3': { label: 'High Tier 3', points: 30 },
  'LT2': { label: 'Low Tier 2', points: 35 },
  'HT2': { label: 'High Tier 2', points: 40 },
  'LT1': { label: 'Low Tier 1', points: 45 },
  'HT1': { label: 'High Tier 1', points: 50 }
};

const tiers = Object.entries(tierMapping).map(([key, value]) => ({
  value: key as TierLevel,
  label: value.label,
  points: value.points
}));

const PlayerEditForm: React.FC = () => {
  // Player search
  const playerSearch = usePlayerSearch();
  const [isPlayerComboOpen, setIsPlayerComboOpen] = useState<boolean>(false);
  
  // Selected player and their gamemode scores
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [playerScores, setPlayerScores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [currentEditingScore, setCurrentEditingScore] = useState<any>(null);
  const [editedTier, setEditedTier] = useState<TierLevel | ''>('');
  
  // Player profile edit state
  const [editedProfile, setEditedProfile] = useState<{
    javaUsername: string;
    region: PlayerRegion | '';
    device: DeviceType | '';
  }>({
    javaUsername: '',
    region: '',
    device: '',
  });
  
  // Load player scores when a player is selected
  useEffect(() => {
    const loadPlayerScores = async () => {
      if (!selectedPlayer) {
        setPlayerScores([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const scores = await playerService.getPlayerGamemodeScores(selectedPlayer.id);
        setPlayerScores(scores);
        
        // Set initial profile data
        setEditedProfile({
          javaUsername: selectedPlayer.java_username || '',
          region: selectedPlayer.region as PlayerRegion || '',
          device: selectedPlayer.device as DeviceType || '',
        });
      } catch (error) {
        console.error('Error loading player scores:', error);
        toast.error('Failed to load player data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlayerScores();
  }, [selectedPlayer]);
  
  // Select a player from search results
  const handleSelectPlayer = (player: any) => {
    setSelectedPlayer(player);
    playerSearch.setSelectedPlayer(player);
    setIsPlayerComboOpen(false);
  };
  
  // Open edit dialog for a gamemode score
  const handleEditGamemode = (score: any) => {
    setCurrentEditingScore(score);
    setEditedTier(score.internal_tier as TierLevel);
    setIsEditDialogOpen(true);
  };
  
  // Save edited tier
  const handleSaveTier = async () => {
    if (!currentEditingScore || !editedTier || !selectedPlayer) {
      toast.error('Invalid edit data');
      return;
    }
    
    try {
      const result = await playerService.assignTier({
        playerId: selectedPlayer.id,
        gamemode: currentEditingScore.gamemode as GameMode,
        tier: editedTier as TierLevel
      });
      
      if (result) {
        // Log activity
        adminService.logAdminActivity(
          `Updated ${selectedPlayer.ign}'s ${currentEditingScore.gamemode} tier from ${currentEditingScore.internal_tier} to ${editedTier}`
        );
        
        // Refresh scores
        const scores = await playerService.getPlayerGamemodeScores(selectedPlayer.id);
        setPlayerScores(scores);
        
        toast.success('Tier updated successfully');
      } else {
        toast.error('Failed to update tier');
      }
    } catch (error) {
      console.error('Error updating tier:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsEditDialogOpen(false);
      setCurrentEditingScore(null);
      setEditedTier('');
    }
  };
  
  // Save profile changes
  const handleSaveProfile = async () => {
    if (!selectedPlayer) {
      toast.error('No player selected');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updatedData: any = {};
      
      // Only include fields that changed
      if (editedProfile.javaUsername !== selectedPlayer.java_username) {
        updatedData.java_username = editedProfile.javaUsername || null;
        
        // Update avatar URL if Java username changed
        if (editedProfile.javaUsername) {
          updatedData.avatar_url = `https://crafthead.net/avatar/${editedProfile.javaUsername}`;
        }
      }
      
      if (editedProfile.region !== selectedPlayer.region) {
        updatedData.region = editedProfile.region || null;
      }
      
      if (editedProfile.device !== selectedPlayer.device) {
        updatedData.device = editedProfile.device || null;
      }
      
      // Only update if there are changes
      if (Object.keys(updatedData).length === 0) {
        toast.info('No changes to save');
        return;
      }
      
      const result = await playerService.updatePlayer(selectedPlayer.id, updatedData);
      
      if (result) {
        // Update selected player with new data
        setSelectedPlayer({
          ...selectedPlayer,
          ...updatedData
        });
        
        // Log activity
        adminService.logAdminActivity(
          `Updated ${selectedPlayer.ign}'s profile information`
        );
        
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to save profile changes');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Player Data</CardTitle>
        <CardDescription>
          Search for a player to edit their information and gamemode tiers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Player Search */}
        <div className="space-y-2">
          <Label>Search for Player</Label>
          <Popover open={isPlayerComboOpen} onOpenChange={setIsPlayerComboOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isPlayerComboOpen}
                className="w-full justify-between"
              >
                {selectedPlayer ? selectedPlayer.ign : "Search for a player..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search players..."
                  value={playerSearch.searchTerm}
                  onValueChange={playerSearch.setSearchTerm}
                />
                <CommandList>
                  <CommandEmpty>No players found</CommandEmpty>
                  <CommandGroup>
                    {playerSearch.loading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      playerSearch.players.map((player) => (
                        <CommandItem
                          key={player.id}
                          value={player.ign}
                          onSelect={() => handleSelectPlayer(player)}
                        >
                          <div className="flex items-center">
                            {player.avatar_url && (
                              <img 
                                src={player.avatar_url} 
                                alt={player.ign}
                                className="h-6 w-6 mr-2 rounded"
                              />
                            )}
                            <span>{player.ign}</span>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedPlayer?.id === player.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {isLoading && (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {selectedPlayer && !isLoading && (
          <>
            {/* Player Profile Edit */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Player Profile</h3>
                <div className="flex items-center">
                  {selectedPlayer.avatar_url && (
                    <img 
                      src={selectedPlayer.avatar_url} 
                      alt={selectedPlayer.ign}
                      className="h-8 w-8 mr-3 rounded"
                    />
                  )}
                  <span className="text-lg font-medium">{selectedPlayer.ign}</span>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Java Username */}
                <div className="space-y-2">
                  <Label htmlFor="edit-java-username">Java Username</Label>
                  <Input
                    id="edit-java-username"
                    value={editedProfile.javaUsername}
                    onChange={(e) => setEditedProfile({...editedProfile, javaUsername: e.target.value})}
                    placeholder="Java username"
                  />
                </div>
                
                {/* Region */}
                <div className="space-y-2">
                  <Label htmlFor="edit-region">Region</Label>
                  <Select
                    value={editedProfile.region}
                    onValueChange={(value) => setEditedProfile({...editedProfile, region: value as PlayerRegion})}
                  >
                    <SelectTrigger id="edit-region">
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Device */}
                <div className="space-y-2">
                  <Label htmlFor="edit-device">Device</Label>
                  <Select
                    value={editedProfile.device}
                    onValueChange={(value) => setEditedProfile({...editedProfile, device: value as DeviceType})}
                  >
                    <SelectTrigger id="edit-device">
                      <SelectValue placeholder="Select Device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {devices.map((device) => (
                        <SelectItem key={device} value={device}>
                          {device}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Save Profile Button */}
              <Button 
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="flex gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Profile Changes
                  </>
                )}
              </Button>
            </div>
            
            {/* Gamemode Scores */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Gamemode Tiers</h3>
              
              {playerScores.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  This player has no gamemode tiers assigned
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {playerScores.map((score) => (
                    <Card key={score.id} className="overflow-hidden">
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{score.gamemode}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{score.display_tier}</span>
                            <span className="text-sm text-muted-foreground">({score.score} pts)</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEditGamemode(score)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {currentEditingScore?.gamemode} Tier</DialogTitle>
            <DialogDescription>
              Update the tier for {selectedPlayer?.ign} in {currentEditingScore?.gamemode}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="edit-tier">Select Tier</Label>
            <Select
              value={editedTier}
              onValueChange={(value) => setEditedTier(value as TierLevel)}
            >
              <SelectTrigger id="edit-tier">
                <SelectValue placeholder="Select Tier" />
              </SelectTrigger>
              <SelectContent>
                {tiers.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    {tier.label} ({tier.points} points)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTier} disabled={!editedTier || editedTier === currentEditingScore?.internal_tier}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PlayerEditForm;
