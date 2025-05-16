
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { toast } from "sonner";
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  PlayerRegion, 
  DeviceType, 
  GameMode, 
  TierLevel, 
  Player 
} from '@/services/playerService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, Search, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';

const AdminPanel = () => {
  const {
    isAdminMode,
    pinInputValue,
    setPinInputValue,
    isSubmitting,
    handlePinSubmit,
    handleLogout,
    submitPlayerResult,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    selectedPlayer,
    loadPlayerDetails,
    clearSelectedPlayer,
    updatePlayer,
    updatePlayerTier,
    deletePlayer,
    banPlayer
  } = useAdminPanel();

  // State for player form
  const [playerForm, setPlayerForm] = useState({
    ign: '',
    javaUsername: '',
    region: 'NA' as PlayerRegion,
    device: 'PC' as DeviceType,
  });

  // State for tier selection
  const [tierSelections, setTierSelections] = useState<{[key in GameMode]?: TierLevel | "NA"}>({
    'Crystal': 'NA',
    'Sword': 'NA',
    'SMP': 'NA',
    'UHC': 'NA',
    'Axe': 'NA',
    'NethPot': 'NA',
    'Bedwars': 'NA',
    'Mace': 'NA'
  });

  // State for player edit form
  const [playerEditForm, setPlayerEditForm] = useState({
    javaUsername: '',
    region: '' as PlayerRegion,
    device: '' as DeviceType,
  });

  // State for tier edit
  const [editingGamemode, setEditingGamemode] = useState<GameMode | ''>('');
  const [editingTier, setEditingTier] = useState<TierLevel | ''>('');

  // Available regions
  const regions: PlayerRegion[] = ['NA', 'EU', 'ASIA', 'OCE', 'SA', 'AF'];
  
  // Available device types
  const devices: DeviceType[] = ['Mobile', 'PC', 'Console'];
  
  // Available gamemodes
  const gamemodes: GameMode[] = [
    'Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'
  ];
  
  // Available tiers
  const tiers: (TierLevel | "NA")[] = [
    'NA', 'LT5', 'HT5', 'LT4', 'HT4', 'LT3', 'HT3', 'LT2', 'HT2', 'LT1', 'HT1', 'Retired'
  ];

  // Map tier values to display names
  const tierNames: Record<string, string> = {
    'NA': 'Not Ranked',
    'LT5': 'Low Tier 5',
    'HT5': 'High Tier 5',
    'LT4': 'Low Tier 4',
    'HT4': 'High Tier 4',
    'LT3': 'Low Tier 3',
    'HT3': 'High Tier 3',
    'LT2': 'Low Tier 2',
    'HT2': 'High Tier 2',
    'LT1': 'Low Tier 1',
    'HT1': 'High Tier 1',
    'Retired': 'Retired'
  };

  // Get tier color based on tier level
  const getTierColor = (tier: TierLevel | 'NA'): string => {
    switch(tier) {
      case 'HT1': return 'text-red-500';
      case 'LT1': return 'text-red-400';
      case 'HT2': return 'text-orange-500';
      case 'LT2': return 'text-orange-400';
      case 'HT3': return 'text-yellow-500';
      case 'LT3': return 'text-yellow-400';
      case 'HT4': return 'text-green-500';
      case 'LT4': return 'text-green-400';
      case 'HT5': return 'text-blue-500';
      case 'LT5': return 'text-blue-400';
      case 'Retired': return 'text-purple-500';
      case 'NA': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  // Handle form input changes for player creation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerForm({
      ...playerForm,
      [e.target.name]: e.target.value
    });
  };

  // Handle tier selection for a gamemode
  const handleTierChange = (gamemode: GameMode, tier: TierLevel | "NA") => {
    setTierSelections({
      ...tierSelections,
      [gamemode]: tier
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!playerForm.ign) {
      toast.error('Player IGN is required');
      return;
    }
    
    if (!playerForm.javaUsername) {
      toast.error('Java username is required');
      return;
    }
    
    if (!playerForm.region) {
      toast.error('Player region is required');
      return;
    }
    
    // Submit results for each selected gamemode
    let successCount = 0;
    const totalSelected = Object.entries(tierSelections).filter(([, tier]) => tier !== undefined).length;
    
    for (const [gamemode, tier] of Object.entries(tierSelections)) {
      if (tier) {
        const success = await submitPlayerResult(
          playerForm.ign,
          playerForm.javaUsername,
          playerForm.device,
          playerForm.region,
          gamemode as GameMode,
          tier
        );
        
        if (success) {
          successCount++;
        }
      }
    }
    
    if (successCount > 0) {
      if (successCount === totalSelected) {
        toast.success(`Successfully submitted all results for ${playerForm.ign}`);
        // Reset form after successful submission
        setPlayerForm({
          ign: '',
          javaUsername: '',
          region: 'NA' as PlayerRegion,
          device: 'PC' as DeviceType,
        });
        
        // Reset tier selections
        setTierSelections({
          'Crystal': 'NA',
          'Sword': 'NA',
          'SMP': 'NA',
          'UHC': 'NA',
          'Axe': 'NA',
          'NethPot': 'NA',
          'Bedwars': 'NA',
          'Mace': 'NA'
        });
      } else {
        toast.info(`Submitted ${successCount}/${totalSelected} results for ${playerForm.ign}`);
      }
    } else {
      toast.error('Failed to submit any results');
    }
  };

  // Handle player edit form submission
  const handlePlayerEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlayer) return;
    
    const success = await updatePlayer(
      selectedPlayer.id,
      playerEditForm.javaUsername || selectedPlayer.java_username || '',
      playerEditForm.region as PlayerRegion || selectedPlayer.region as PlayerRegion || 'NA',
      playerEditForm.device as DeviceType || selectedPlayer.device as DeviceType || 'PC'
    );
    
    if (success) {
      setPlayerEditForm({
        javaUsername: '',
        region: '' as PlayerRegion,
        device: '' as DeviceType,
      });
    }
  };

  // Handle tier update
  const handleTierUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlayer || !editingGamemode || !editingTier) {
      toast.error('Please select both gamemode and tier');
      return;
    }
    
    await updatePlayerTier(
      selectedPlayer.id,
      editingGamemode as GameMode,
      editingTier as TierLevel
    );
    
    // Reset form after submission
    setEditingGamemode('');
    setEditingTier('');
  };

  // Handle player deletion with confirmation
  const handlePlayerDelete = async () => {
    if (!selectedPlayer) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedPlayer.ign}? This action cannot be undone.`)) {
      await deletePlayer(selectedPlayer.id);
    }
  };

  // Handle player ban with confirmation
  const handlePlayerBan = async () => {
    if (!selectedPlayer) return;
    
    if (window.confirm(`Are you sure you want to ban ${selectedPlayer.ign}? This will remove them from all rankings.`)) {
      await banPlayer(selectedPlayer);
    }
  };

  // Prepare player edit form when a player is selected
  React.useEffect(() => {
    if (selectedPlayer) {
      setPlayerEditForm({
        javaUsername: selectedPlayer.java_username || '',
        region: selectedPlayer.region as PlayerRegion || 'NA',
        device: selectedPlayer.device as DeviceType || 'PC',
      });
    }
  }, [selectedPlayer]);

  // Create empty props for Navbar to satisfy TypeScript
  const navbarProps = {
    selectedMode: '',
    onSelectMode: () => {},
    navigate: () => {}
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar {...navbarProps} />
      
      <div className="container mx-auto py-8 px-4">
        <motion.h1 
          className="text-3xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Admin Panel
        </motion.h1>
        
        {!isAdminMode ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Enter your admin PIN to access the panel</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                handlePinSubmit();
              }}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pin">Admin PIN</Label>
                    <Input 
                      id="pin"
                      type="password"
                      value={pinInputValue}
                      onChange={(e) => setPinInputValue(e.target.value)}
                      placeholder="Enter admin PIN"
                      required
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePinSubmit} 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Verifying...' : 'Login'}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Tabs defaultValue="submit" className="max-w-5xl mx-auto">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="submit">Submit Results</TabsTrigger>
              <TabsTrigger value="manage">Manage Players</TabsTrigger>
            </TabsList>
            
            <TabsContent value="submit">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Player Results</CardTitle>
                  <CardDescription>Add new player rankings or update existing ones</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ign" className="text-sm font-medium">
                            Player IGN <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="ign"
                            name="ign"
                            value={playerForm.ign}
                            onChange={handleInputChange}
                            placeholder="Enter player IGN"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="javaUsername" className="text-sm font-medium">
                            Java Username <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="javaUsername"
                            name="javaUsername"
                            value={playerForm.javaUsername}
                            onChange={handleInputChange}
                            placeholder="Enter Java username"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="region" className="text-sm font-medium">
                            Region <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={playerForm.region}
                            onValueChange={(value) => setPlayerForm({...playerForm, region: value as PlayerRegion})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="device" className="text-sm font-medium">
                            Device
                          </Label>
                          <Select
                            value={playerForm.device}
                            onValueChange={(value) => setPlayerForm({...playerForm, device: value as DeviceType})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select device" />
                            </SelectTrigger>
                            <SelectContent>
                              {devices.map((device) => (
                                <SelectItem key={device} value={device}>
                                  {device}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Label className="text-lg font-medium">Tier Rankings</Label>
                        
                        <div className="space-y-6">
                          {gamemodes.map((gamemode) => (
                            <div key={gamemode} className="space-y-2">
                              <Label className="text-sm font-medium">{gamemode}</Label>
                              <RadioGroup
                                value={tierSelections[gamemode] || 'NA'}
                                onValueChange={(value) => handleTierChange(gamemode, value as TierLevel | "NA")}
                                className="flex flex-wrap items-center gap-2"
                              >
                                {tiers.map((tier) => (
                                  <div key={`${gamemode}-${tier}`} className="flex items-center space-x-1">
                                    <RadioGroupItem 
                                      value={tier} 
                                      id={`${gamemode}-${tier}`}
                                      className={`${tier !== 'NA' ? `border-${tier.toLowerCase()}` : ''}`}
                                    />
                                    <Label 
                                      htmlFor={`${gamemode}-${tier}`}
                                      className={`text-xs ${getTierColor(tier as TierLevel | 'NA')}`}
                                    >
                                      {tier}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button type="submit">Submit Results</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Players</CardTitle>
                  <CardDescription>Search for players and manage their information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 relative">
                    <Input
                      placeholder="Search players by IGN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isSearching ? (
                        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                      ) : (
                        <Search className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Search Results</h3>
                      <ScrollArea className="h-40 rounded border">
                        <div className="p-4 grid gap-2">
                          {searchResults.map((player) => (
                            <Button
                              key={player.id}
                              variant="outline"
                              className="justify-start"
                              onClick={() => loadPlayerDetails(player.id)}
                            >
                              {player.ign} {player.banned && <span className="ml-2 text-red-500">(Banned)</span>}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                  
                  {selectedPlayer && (
                    <Dialog>
                      <div className="bg-muted/40 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold">{selectedPlayer.ign}</h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={clearSelectedPlayer}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Java Username</p>
                            <p>{selectedPlayer.java_username || 'Not set'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Region</p>
                            <p>{selectedPlayer.region || 'Not set'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Device</p>
                            <p>{selectedPlayer.device || 'Not set'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Global Points</p>
                            <p>{selectedPlayer.global_points || 0}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-lg font-medium mb-2">Tier Rankings</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {gamemodes.map((gamemode) => {
                              const tierInfo = selectedPlayer.tiers?.[gamemode];
                              return (
                                <div key={gamemode} className="flex items-center justify-between bg-background/70 p-2 rounded">
                                  <span>{gamemode}</span>
                                  <span className={tierInfo ? getTierColor(tierInfo.tier) : 'text-gray-400'}>
                                    {tierInfo ? tierInfo.tier : 'NA'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">Edit Player</Button>
                          </DialogTrigger>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={handlePlayerDelete}
                          >
                            Delete Player
                          </Button>
                          {!selectedPlayer.banned && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={handlePlayerBan}
                            >
                              Ban Player
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Player</DialogTitle>
                          <DialogDescription>
                            Update player information or tier rankings
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Tabs defaultValue="info">
                          <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="info">Player Info</TabsTrigger>
                            <TabsTrigger value="tiers">Tier Rankings</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="info" className="mt-4">
                            <form onSubmit={handlePlayerEditSubmit}>
                              <div className="grid gap-4">
                                <div>
                                  <Label htmlFor="edit-javaUsername">Java Username</Label>
                                  <Input
                                    id="edit-javaUsername"
                                    value={playerEditForm.javaUsername}
                                    onChange={(e) => setPlayerEditForm({...playerEditForm, javaUsername: e.target.value})}
                                    placeholder={selectedPlayer.java_username || 'Enter Java Username'}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-region">Region</Label>
                                  <Select
                                    value={playerEditForm.region}
                                    onValueChange={(value) => setPlayerEditForm({...playerEditForm, region: value as PlayerRegion})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder={selectedPlayer.region || 'Select Region'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {regions.map((region) => (
                                        <SelectItem key={region} value={region}>
                                          {region}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="edit-device">Device</Label>
                                  <Select
                                    value={playerEditForm.device}
                                    onValueChange={(value) => setPlayerEditForm({...playerEditForm, device: value as DeviceType})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder={selectedPlayer.device || 'Select Device'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {devices.map((device) => (
                                        <SelectItem key={device} value={device}>
                                          {device}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="flex justify-end mt-6">
                                <Button type="submit">Update Player</Button>
                              </div>
                            </form>
                          </TabsContent>
                          
                          <TabsContent value="tiers" className="mt-4">
                            <form onSubmit={handleTierUpdateSubmit}>
                              <div className="grid gap-4">
                                <div>
                                  <Label htmlFor="edit-gamemode">Gamemode</Label>
                                  <Select
                                    value={editingGamemode}
                                    onValueChange={(value) => setEditingGamemode(value as GameMode)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Gamemode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {gamemodes.map((gamemode) => (
                                        <SelectItem key={gamemode} value={gamemode}>
                                          {gamemode}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <Label htmlFor="edit-tier">Tier</Label>
                                  <Select
                                    value={editingTier}
                                    onValueChange={(value) => setEditingTier(value as TierLevel)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Tier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {tiers.filter(tier => tier !== 'NA').map((tier) => (
                                        <SelectItem 
                                          key={tier} 
                                          value={tier}
                                          className={getTierColor(tier as TierLevel)}
                                        >
                                          {tier} - {tierNames[tier]}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="flex justify-end mt-6">
                                <Button 
                                  type="submit" 
                                  disabled={!editingGamemode || !editingTier}
                                >
                                  Update Tier
                                </Button>
                              </div>
                            </form>
                          </TabsContent>
                        </Tabs>
                        
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    {searchResults.length} players found
                  </span>
                  <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
