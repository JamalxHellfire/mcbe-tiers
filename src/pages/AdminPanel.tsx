
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminPanel, NewsArticle } from '@/hooks/useAdminPanel';
import { PlayerRegion, DeviceType, GameMode, TierLevel, Player } from '@/services/playerService';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, User, X, Edit, UserX, Trash2, Save, RefreshCw } from 'lucide-react';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { 
    isAdminMode,
    pinInputValue,
    setPinInputValue,
    isSubmitting,
    handlePinSubmit,
    handleLogout,
    submitPlayerResult,
    massRegisterPlayers,
    // Don't include generateFakePlayers as we're removing it
    generateRealisticPlayers,
    wipeAllData,
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
    newsArticles
  } = useAdminPanel();
  
  // Form state for player submission
  const [ign, setIgn] = useState('');
  const [javaUsername, setJavaUsername] = useState('');
  const [region, setRegion] = useState<PlayerRegion | undefined>(undefined);
  const [device, setDevice] = useState<DeviceType | undefined>(undefined);
  
  // Track selected tiers for each gamemode
  const [tierSelections, setTierSelections] = useState<Record<GameMode, TierLevel | null>>({
    'Crystal': null,
    'Sword': null,
    'SMP': null,
    'UHC': null,
    'Axe': null,
    'NethPot': null,
    'Bedwars': null,
    'Mace': null
  });
  
  const [massPlayersText, setMassPlayersText] = useState('');
  const [fakePlayerCount, setFakePlayerCount] = useState<number>(250);
  
  // Player edit state
  const [editPlayerForm, setEditPlayerForm] = useState({
    ign: '',
    java_username: '',
    region: undefined as PlayerRegion | undefined,
    device: undefined as DeviceType | undefined
  });
  
  // Update edit form when a player is selected
  useEffect(() => {
    if (selectedPlayer) {
      setEditPlayerForm({
        ign: selectedPlayer.ign,
        java_username: selectedPlayer.java_username || '',
        region: selectedPlayer.region as PlayerRegion | undefined,
        device: selectedPlayer.device as DeviceType | undefined
      });
    } else {
      setEditPlayerForm({
        ign: '',
        java_username: '',
        region: undefined,
        device: undefined
      });
    }
  }, [selectedPlayer]);
  
  // Redirect if not admin mode
  useEffect(() => {
    if (!isAdminMode) {
      return;
    }
  }, [isAdminMode, navigate]);
  
  // Handle player submission for a specific gamemode
  const handleSubmitPlayerForGamemode = async (gamemode: GameMode) => {
    const selectedTier = tierSelections[gamemode];
    
    if (!ign) {
      toast.error('Player IGN is required');
      return;
    }
    
    if (!selectedTier) {
      toast.error(`Please select a tier for ${gamemode}`);
      return;
    }
    
    try {
      const success = await submitPlayerResult(
        ign,
        javaUsername || undefined,
        device,
        region,
        gamemode,
        selectedTier
      );
      
      if (success) {
        toast.success(`Successfully set ${ign}'s ${gamemode} tier to ${selectedTier}`);
      } else {
        toast.error(`Failed to submit ${gamemode} result`);
      }
    } catch (err) {
      console.error(`Error submitting ${gamemode} player:`, err);
      toast.error(`An error occurred while submitting player ${gamemode} data`);
    }
  };
  
  // Handle multiple gamemode submissions at once
  const handleSubmitAllSelectedTiers = async () => {
    if (!ign) {
      toast.error('Player IGN is required');
      return;
    }
    
    const selectedGamemodes = Object.entries(tierSelections)
      .filter(([_, tier]) => tier !== null)
      .map(([gamemode]) => gamemode as GameMode);
      
    if (selectedGamemodes.length === 0) {
      toast.error('Please select at least one tier');
      return;
    }
    
    let successCount = 0;
    
    for (const gamemode of selectedGamemodes) {
      const tier = tierSelections[gamemode];
      if (tier) {
        try {
          const success = await submitPlayerResult(
            ign,
            javaUsername || undefined,
            device,
            region,
            gamemode,
            tier
          );
          
          if (success) {
            successCount++;
          }
        } catch (err) {
          console.error(`Error submitting ${gamemode} player:`, err);
        }
      }
    }
    
    if (successCount > 0) {
      toast.success(`Successfully submitted ${successCount} tier rankings for ${ign}`);
      // Reset tier selections
      setTierSelections({
        'Crystal': null,
        'Sword': null,
        'SMP': null,
        'UHC': null,
        'Axe': null,
        'NethPot': null,
        'Bedwars': null,
        'Mace': null
      });
    } else {
      toast.error('Failed to submit any tier rankings');
    }
  };
  
  // Handle tier selection change
  const handleTierChange = (gamemode: GameMode, tier: TierLevel | null) => {
    setTierSelections(prev => ({
      ...prev,
      [gamemode]: tier
    }));
  };
  
  // Handle player update
  const handleUpdatePlayer = async () => {
    if (!selectedPlayer) return;
    
    try {
      await updatePlayer(
        selectedPlayer.id,
        editPlayerForm.java_username || undefined,
        editPlayerForm.region,
        editPlayerForm.device
      );
    } catch (err) {
      console.error('Error updating player:', err);
      toast.error('An error occurred while updating player data');
    }
  };
  
  // Handle tier update
  const handleUpdateTier = async (gamemode: GameMode, tier: TierLevel) => {
    if (!selectedPlayer) return;
    
    try {
      await updatePlayerTier(
        selectedPlayer.id,
        gamemode,
        tier
      );
    } catch (err) {
      console.error('Error updating tier:', err);
      toast.error(`An error occurred while updating ${gamemode} tier`);
    }
  };
  
  // Handle player delete
  const handleDeletePlayer = async () => {
    if (!selectedPlayer) return;
    
    try {
      await deletePlayer(selectedPlayer.id);
    } catch (err) {
      console.error('Error deleting player:', err);
      toast.error('An error occurred while deleting player');
    }
  };
  
  // Handle player ban
  const handleBanPlayer = async () => {
    if (!selectedPlayer) return;
    
    try {
      await banPlayer(selectedPlayer);
    } catch (err) {
      console.error('Error banning player:', err);
      toast.error('An error occurred while banning player');
    }
  };
  
  // Handle mass player registration
  const handleMassRegister = async () => {
    if (!massPlayersText.trim()) {
      toast.error('Please enter player data');
      return;
    }
    
    try {
      await massRegisterPlayers(massPlayersText);
      setMassPlayersText('');
    } catch (err) {
      console.error('Error registering players:', err);
      toast.error('An error occurred during player registration');
    }
  };
  
  // Generate realistic players for testing
  const handleGenerateRealisticPlayers = async () => {
    if (fakePlayerCount < 200 || fakePlayerCount > 300) {
      toast.error('Please enter a valid number between 200 and 300');
      return;
    }
    
    try {
      await generateRealisticPlayers(fakePlayerCount);
    } catch (err) {
      console.error('Error generating players:', err);
      toast.error('An error occurred while generating players');
    }
  };
  
  // Handle data wipe
  const handleWipeAllData = async () => {
    try {
      await wipeAllData();
    } catch (err) {
      console.error('Error wiping data:', err);
      toast.error('An error occurred while wiping data');
    }
  };
  
  // Handle news submission
  const handleSubmitNews = async () => {
    if (!newsFormData.title.trim()) {
      toast.error('News title is required');
      return;
    }
    
    if (!newsFormData.description.trim()) {
      toast.error('News description is required');
      return;
    }
    
    if (!newsFormData.author.trim()) {
      toast.error('Author name is required');
      return;
    }
    
    try {
      await submitNews();
    } catch (err) {
      console.error('Error submitting news:', err);
      toast.error('An error occurred while publishing news');
    }
  };
  
  // Admin Login Form
  if (!isAdminMode) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-dark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
            <CardDescription className="text-center">Enter your admin PIN to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                value={pinInputValue}
                onChange={(e) => setPinInputValue(e.target.value)}
                placeholder="Enter admin PIN"
                className="text-center text-xl tracking-widest"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePinSubmit();
                  }
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={handlePinSubmit} 
              className="w-full"
              disabled={!pinInputValue || pinInputValue.length < 4 || isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }
  
  // Main Admin Interface - Using full width layout
  return (
    <motion.div 
      className="min-h-screen w-full p-2 md:p-6 bg-gradient-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex space-x-4">
            <Button onClick={() => navigate('/')}>Return to Main Site</Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
        
        <Tabs defaultValue="player-results" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="player-results">Submit Results</TabsTrigger>
            <TabsTrigger value="player-search">Search/Edit Players</TabsTrigger>
            <TabsTrigger value="news">News Management</TabsTrigger>
            <TabsTrigger value="mass-register">Mass Register</TabsTrigger>
          </TabsList>
          
          {/* Player Results Submission - Completely redesigned for multiple gamemode selection */}
          <TabsContent value="player-results">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Submit Player Results</CardTitle>
                <CardDescription>Assign tiers to players for multiple gamemodes at once</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  {/* Player Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ign">IGN (In-Game Name) *</Label>
                      <Input 
                        id="ign" 
                        value={ign} 
                        onChange={(e) => setIgn(e.target.value)}
                        placeholder="Player's in-game name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="javaUsername">Java Username (for avatar)</Label>
                      <Input 
                        id="javaUsername" 
                        value={javaUsername} 
                        onChange={(e) => setJavaUsername(e.target.value)}
                        placeholder="Java edition username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select 
                        value={region} 
                        onValueChange={(value) => setRegion(value as PlayerRegion)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NA">North America (NA)</SelectItem>
                          <SelectItem value="EU">Europe (EU)</SelectItem>
                          <SelectItem value="ASIA">Asia</SelectItem>
                          <SelectItem value="OCE">Oceania (OCE)</SelectItem>
                          <SelectItem value="SA">South America (SA)</SelectItem>
                          <SelectItem value="AF">Africa (AF)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="device">Device</Label>
                      <Select 
                        value={device} 
                        onValueChange={(value) => setDevice(value as DeviceType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select device type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mobile">Mobile</SelectItem>
                          <SelectItem value="PC">PC</SelectItem>
                          <SelectItem value="Console">Console</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Game Mode Tier Selection */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Game Mode Tier Selection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Loop through game modes */}
                      {(['Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'] as GameMode[]).map((gamemode) => (
                        <Card key={gamemode} className="overflow-hidden">
                          <CardHeader className="bg-muted/30 py-3 px-4">
                            <CardTitle className="text-md">{gamemode}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="flex flex-col gap-2">
                              {/* Tier options as checkboxes */}
                              {(['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT5', 'LT5', 'Retired'] as TierLevel[]).map((tier) => (
                                <div key={`${gamemode}-${tier}`} className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    id={`${gamemode}-${tier}`}
                                    name={`tier-${gamemode}`}
                                    checked={tierSelections[gamemode] === tier}
                                    onChange={() => handleTierChange(gamemode, tier)}
                                    className={`h-4 w-4 rounded border border-gray-300 focus:ring-2 focus:ring-primary ${
                                      tier.includes('T1') ? 'accent-yellow-500' :
                                      tier.includes('T2') ? 'accent-orange-500' :
                                      tier.includes('T3') ? 'accent-red-500' :
                                      tier.includes('T4') ? 'accent-blue-500' :
                                      tier.includes('T5') ? 'accent-indigo-500' :
                                      'accent-gray-400'
                                    }`}
                                  />
                                  <label htmlFor={`${gamemode}-${tier}`} className={`text-sm ${
                                    tier.includes('T1') ? 'text-tier-1' :
                                    tier.includes('T2') ? 'text-tier-2' :
                                    tier.includes('T3') ? 'text-tier-3' :
                                    tier.includes('T4') ? 'text-tier-4' :
                                    tier.includes('T5') ? 'text-tier-5' :
                                    'text-gray-400'
                                  }`}>
                                    {tier}
                                  </label>
                                </div>
                              ))}
                              {/* Option to clear selection */}
                              <button
                                onClick={() => handleTierChange(gamemode, null)}
                                className="text-xs text-muted-foreground hover:text-primary mt-2"
                              >
                                Clear
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Submit button for all selected tiers */}
                    <div className="mt-6 flex justify-end">
                      <Button 
                        onClick={handleSubmitAllSelectedTiers}
                        disabled={!ign || Object.values(tierSelections).every(tier => tier === null) || isSubmitting}
                        className="px-6"
                      >
                        {isSubmitting ? 'Processing...' : 'Submit All Selected Tiers'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Player Search and Edit Tab */}
          <TabsContent value="player-search">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Search Players</CardTitle>
                <CardDescription>Find players by IGN to edit their information or manage tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by IGN..."
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-3"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                
                {isSearching ? (
                  <div className="mt-4 py-4 text-center text-sm text-muted-foreground">
                    <div className="animate-pulse">Searching...</div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="mt-4 border rounded-md divide-y">
                    {searchResults.map((player) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer"
                        onClick={() => loadPlayerDetails(player.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage 
                              src={getAvatarUrl(player.avatar_url, player.java_username)} 
                              alt={player.ign}
                              onError={handleAvatarError}
                            />
                            <AvatarFallback>{player.ign.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{player.ign}</p>
                            <p className="text-sm text-muted-foreground">
                              {player.java_username ? `Java: ${player.java_username}` : 'No Java username'}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="mt-4 py-4 text-center text-sm text-muted-foreground">
                    No players found matching "{searchQuery}"
                  </div>
                ) : null}
              </CardContent>
            </Card>
            
            {/* Player Edit Form */}
            <AnimatePresence mode="wait">
              {selectedPlayer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle>Editing Player: {selectedPlayer.ign}</CardTitle>
                        <CardDescription>Update player information and tier rankings</CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={clearSelectedPlayer}>
                        <X className="h-5 w-5" />
                      </Button>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Player Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage 
                                src={getAvatarUrl(selectedPlayer.avatar_url, selectedPlayer.java_username)}
                                alt={selectedPlayer.ign} 
                                onError={handleAvatarError}
                              />
                              <AvatarFallback className="text-lg">
                                {selectedPlayer.ign.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-lg">{selectedPlayer.ign}</h3>
                              <p className="text-muted-foreground text-sm">
                                ID: {selectedPlayer.id}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                Points: {selectedPlayer.global_points || 0}
                              </p>
                            </div>
                          </div>
                          
                          {/* Player Details Form */}
                          <div className="space-y-3 pt-3">
                            <div className="space-y-2">
                              <Label htmlFor="edit-java">Java Username</Label>
                              <Input
                                id="edit-java"
                                value={editPlayerForm.java_username}
                                onChange={(e) => setEditPlayerForm(prev => ({ ...prev, java_username: e.target.value }))}
                                placeholder="Java edition username"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-region">Region</Label>
                              <Select
                                value={editPlayerForm.region}
                                onValueChange={(value) => setEditPlayerForm(prev => ({ ...prev, region: value as PlayerRegion }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="NA">North America (NA)</SelectItem>
                                  <SelectItem value="EU">Europe (EU)</SelectItem>
                                  <SelectItem value="ASIA">Asia</SelectItem>
                                  <SelectItem value="OCE">Oceania (OCE)</SelectItem>
                                  <SelectItem value="SA">South America (SA)</SelectItem>
                                  <SelectItem value="AF">Africa (AF)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-device">Device</Label>
                              <Select
                                value={editPlayerForm.device}
                                onValueChange={(value) => setEditPlayerForm(prev => ({ ...prev, device: value as DeviceType }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select device" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Mobile">Mobile</SelectItem>
                                  <SelectItem value="PC">PC</SelectItem>
                                  <SelectItem value="Console">Console</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <Button 
                              className="w-full mt-2" 
                              onClick={handleUpdatePlayer}
                              disabled={isSubmitting}
                            >
                              <Save className="mr-2 h-4 w-4" />
                              Update Player Info
                            </Button>
                          </div>
                        </div>
                        
                        {/* Tier Management */}
                        <div className="space-y-4">
                          <h3 className="font-semibold">Manage Tiers</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Loop through game modes */}
                            {(['Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'] as GameMode[]).map((gamemode) => {
                              const tiers = selectedPlayer.tiers || {};
                              const currentTier = tiers[gamemode]?.tier || 'Not Ranked';
                              
                              return (
                                <div key={gamemode} className="border rounded-md p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">{gamemode}</h4>
                                    <span className={`text-sm ${
                                      currentTier.includes('T1') ? 'text-tier-1' :
                                      currentTier.includes('T2') ? 'text-tier-2' :
                                      currentTier.includes('T3') ? 'text-tier-3' :
                                      currentTier.includes('T4') ? 'text-tier-4' :
                                      currentTier.includes('T5') ? 'text-tier-5' :
                                      'text-gray-400'
                                    }`}>
                                      Current: {currentTier}
                                    </span>
                                  </div>
                                  
                                  <Select
                                    onValueChange={(value) => handleUpdateTier(gamemode, value as TierLevel)}
                                    defaultValue={currentTier !== 'Not Ranked' ? currentTier : undefined}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select tier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="HT1">High Tier 1</SelectItem>
                                      <SelectItem value="LT1">Low Tier 1</SelectItem>
                                      <SelectItem value="HT2">High Tier 2</SelectItem>
                                      <SelectItem value="LT2">Low Tier 2</SelectItem>
                                      <SelectItem value="HT3">High Tier 3</SelectItem>
                                      <SelectItem value="LT3">Low Tier 3</SelectItem>
                                      <SelectItem value="HT4">High Tier 4</SelectItem>
                                      <SelectItem value="LT4">Low Tier 4</SelectItem>
                                      <SelectItem value="HT5">High Tier 5</SelectItem>
                                      <SelectItem value="LT5">Low Tier 5</SelectItem>
                                      <SelectItem value="Retired">Retired</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between border-t pt-6">
                      <div className="flex space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="flex items-center">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Player
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Player</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {selectedPlayer.ign}? This will permanently remove all their data and cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeletePlayer} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="flex items-center">
                              <UserX className="mr-2 h-4 w-4" />
                              Ban Player
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ban Player</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to ban {selectedPlayer.ign}? This will remove them from public rankings.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleBanPlayer} className="bg-red-600 hover:bg-red-700">
                                Ban
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={clearSelectedPlayer}>
                          Close
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
          
          {/* News Management Tab */}
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle>News Management</CardTitle>
                <CardDescription>Create and publish news articles for the site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="news-title">Title</Label>
                    <Input
                      id="news-title"
                      name="title"
                      value={newsFormData.title}
                      onChange={handleNewsInputChange}
                      placeholder="News title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="news-description">Description</Label>
                    <Textarea
                      id="news-description"
                      name="description"
                      value={newsFormData.description}
                      onChange={handleNewsInputChange}
                      placeholder="News content"
                      className="min-h-[200px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="news-author">Author</Label>
                    <Input
                      id="news-author"
                      name="author"
                      value={newsFormData.author}
                      onChange={handleNewsInputChange}
                      placeholder="Author name"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSubmitNews} 
                  disabled={!newsFormData.title || !newsFormData.description || !newsFormData.author || isSubmitting}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish News'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Published News */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-4">Published News</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {newsArticles.length > 0 ? (
                  newsArticles.map((article: NewsArticle) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border rounded-md p-4"
                    >
                      <h4 className="font-medium">{article.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {article.description}
                      </p>
                      <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                        <span>By: {article.author}</span>
                        <span>
                          {new Date(article.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No news articles published yet
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Mass Register Tab */}
          <TabsContent value="mass-register">
            <Card>
              <CardHeader>
                <CardTitle>Mass Register Players</CardTitle>
                <CardDescription>
                  Add multiple players at once. Format: IGN,JavaUsername (one per line)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={massPlayersText}
                  onChange={(e) => setMassPlayersText(e.target.value)}
                  placeholder="Player1,JavaPlayer1&#10;Player2,JavaPlayer2&#10;Player3,JavaPlayer3"
                  className="min-h-[200px]"
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleMassRegister} 
                  disabled={!massPlayersText.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Register Players'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Testing Data Generation - Modified to only include realistic players */}
            <Card className="mt-6 border-amber-600/30">
              <CardHeader className="bg-amber-950/10">
                <CardTitle>Generate Test Data</CardTitle>
                <CardDescription>
                  Create realistic test data for the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label htmlFor="fakePlayerCount">Number of Test Players (200-300)</Label>
                    <Input
                      id="fakePlayerCount"
                      type="number"
                      min={200}
                      max={300}
                      value={fakePlayerCount}
                      onChange={(e) => setFakePlayerCount(parseInt(e.target.value) || 250)}
                      className="mt-1"
                    />
                  </div>
                  <Button 
                    onClick={handleGenerateRealisticPlayers} 
                    disabled={isSubmitting}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Generating...' : 'Generate Test Data'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
