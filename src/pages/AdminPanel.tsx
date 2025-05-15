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
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('Crystal');
  const [selectedTier, setSelectedTier] = useState<TierLevel>('LT5');
  const [massPlayersText, setMassPlayersText] = useState('');
  const [fakePlayerCount, setFakePlayerCount] = useState<number>(200);
  
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
  
  // Handle player submission
  const handleSubmitPlayer = async () => {
    if (!ign) {
      toast.error('Player IGN is required');
      return;
    }
    
    try {
      const success = await submitPlayerResult(
        ign,
        javaUsername || undefined,
        device,
        region,
        selectedGameMode,
        selectedTier
      );
      
      if (success) {
        toast.success(`Successfully set ${ign}'s ${selectedGameMode} tier to ${selectedTier}`);
        // Don't clear IGN and Java username to allow for quick multi-mode submissions
      } else {
        toast.error('Failed to submit player result');
      }
    } catch (err) {
      console.error('Error submitting player:', err);
      toast.error('An error occurred while submitting player data');
    }
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
  
  // Generate players for testing
  const handleGenerateRealisticPlayers = async () => {
    if (fakePlayerCount < 1 || fakePlayerCount > 1000) {
      toast.error('Please enter a valid number between 1 and 1000');
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
  
  // Main Admin Interface
  return (
    <motion.div 
      className="min-h-screen p-4 md:p-8 bg-gradient-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex space-x-4">
            <Button onClick={() => navigate('/')}>Return to Main Site</Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
        
        <Tabs defaultValue="player-results" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="player-results">Submit Results</TabsTrigger>
            <TabsTrigger value="player-search">Search/Edit Players</TabsTrigger>
            <TabsTrigger value="news">News Management</TabsTrigger>
            <TabsTrigger value="mass-register">Mass Register</TabsTrigger>
            <TabsTrigger value="danger-zone">Danger Zone</TabsTrigger>
          </TabsList>
          
          {/* Player Results Submission */}
          <TabsContent value="player-results">
            <Card>
              <CardHeader>
                <CardTitle>Submit Player Result</CardTitle>
                <CardDescription>Assign tiers to players for specific gamemodes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Player Info */}
                  <div className="space-y-4">
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
                  
                  {/* Tier Selection */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="gamemode">Gamemode *</Label>
                      <Select 
                        value={selectedGameMode} 
                        onValueChange={(value) => setSelectedGameMode(value as GameMode)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gamemode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Crystal">Crystal</SelectItem>
                          <SelectItem value="Sword">Sword</SelectItem>
                          <SelectItem value="SMP">SMP</SelectItem>
                          <SelectItem value="UHC">UHC</SelectItem>
                          <SelectItem value="Axe">Axe</SelectItem>
                          <SelectItem value="NethPot">NethPot</SelectItem>
                          <SelectItem value="Bedwars">Bedwars</SelectItem>
                          <SelectItem value="Mace">Mace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Tier Level *</Label>
                      <RadioGroup 
                        value={selectedTier}
                        onValueChange={(value) => setSelectedTier(value as TierLevel)}
                        className="grid grid-cols-2 gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="HT1" id="ht1" />
                          <Label htmlFor="ht1" className="text-tier-1">High Tier 1</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="LT1" id="lt1" />
                          <Label htmlFor="lt1" className="text-tier-1">Low Tier 1</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="HT2" id="ht2" />
                          <Label htmlFor="ht2" className="text-tier-2">High Tier 2</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="LT2" id="lt2" />
                          <Label htmlFor="lt2" className="text-tier-2">Low Tier 2</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="HT3" id="ht3" />
                          <Label htmlFor="ht3" className="text-tier-3">High Tier 3</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="LT3" id="lt3" />
                          <Label htmlFor="lt3" className="text-tier-3">Low Tier 3</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="HT4" id="ht4" />
                          <Label htmlFor="ht4" className="text-tier-4">High Tier 4</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="LT4" id="lt4" />
                          <Label htmlFor="lt4" className="text-tier-4">Low Tier 4</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="HT5" id="ht5" />
                          <Label htmlFor="ht5" className="text-tier-5">High Tier 5</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="LT5" id="lt5" />
                          <Label htmlFor="lt5" className="text-tier-5">Low Tier 5</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Retired" id="retired" />
                          <Label htmlFor="retired" className="text-gray-400">Retired</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSubmitPlayer} 
                  disabled={!ign || !selectedGameMode || !selectedTier || isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Submit Result'}
                </Button>
              </CardFooter>
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
                          
                          {/* Loop through game modes */}
                          {['Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'].map((gamemode) => {
                            const tiers = selectedPlayer.tiers || {};
                            const currentTier = tiers[gamemode as GameMode]?.tier || 'Not Ranked';
                            
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
                                  onValueChange={(value) => handleUpdateTier(gamemode as GameMode, value as TierLevel)}
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
          </TabsContent>
          
          {/* Danger Zone Tab */}
          <TabsContent value="danger-zone">
            <Card className="border-red-800">
              <CardHeader className="text-red-500">
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>
                  Actions here can permanently delete data or make automated changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Generate 200+ Dummy Players */}
                  <div className="border border-yellow-600/30 rounded-lg p-4 bg-yellow-950/10">
                    <h3 className="text-lg font-medium mb-2">Generate Realistic Players</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create realistic Minecraft players with Java usernames, avatars from Crafatar API, random tiers, and other details.
                    </p>
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <Label htmlFor="fakePlayerCount">Number of Players (1-1000)</Label>
                        <Input
                          id="fakePlayerCount"
                          type="number"
                          min={1}
                          max={1000}
                          value={fakePlayerCount}
                          onChange={(e) => setFakePlayerCount(parseInt(e.target.value) || 200)}
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        onClick={handleGenerateRealisticPlayers} 
                        disabled={isSubmitting}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Generating...' : 'Generate Players'}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Wipe All Data */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Wipe All Player Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete all players and their tier data from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleWipeAllData}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Wiping...' : 'Yes, Delete Everything'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
