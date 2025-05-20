
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { PlayerRegion, DeviceType, GameMode, TierLevel, Player } from '@/services/playerService';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, User, X, Edit, UserX, Trash2, Save, Pencil, Check, XCircle } from 'lucide-react';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toDatabaseGameMode, asGameModeArray } from '@/utils/gamemodeCasing';

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
    // Test data generation
    generateTestData,
    isGeneratingData,
    playerCount
  } = useAdminPanel();
  
  // Form state for player submission
  const [ign, setIgn] = useState('');
  const [javaUsername, setJavaUsername] = useState('');
  const [region, setRegion] = useState<PlayerRegion | undefined>(undefined);
  const [device, setDevice] = useState<DeviceType | undefined>(undefined);
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    ign: false,
    javaUsername: false,
    region: false
  });
  
  // Track selected tiers for each gamemode
  const [tierSelections, setTierSelections] = useState<Record<GameMode, TierLevel | "NA">>({
    'crystal': "NA",
    'sword': "NA",
    'smp': "NA",
    'uhc': "NA",
    'axe': "NA",
    'nethpot': "NA",
    'bedwars': "NA",
    'mace': "NA"
  });
  
  // Player edit state
  const [editPlayerForm, setEditPlayerForm] = useState({
    ign: '',
    java_username: '',
    region: undefined as PlayerRegion | undefined,
    device: undefined as DeviceType | undefined
  });

  // Define tier options
  const tierOptions: (TierLevel | "NA")[] = [
    "NA", "LT5", "HT5", "LT4", "HT4", "LT3", "HT3", "LT2", "HT2", "LT1", "HT1", "Retired"
  ];
  
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
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {
      ign: !ign.trim(),
      javaUsername: !javaUsername.trim(),
      region: !region
    };
    
    setFormErrors(errors);
    
    return !Object.values(errors).some(isError => isError);
  };
  
  // Helper to get tier color class
  const getTierColorClass = (tier: TierLevel | "NA") => {
    switch (tier) {
      case "HT1":
      case "LT1":
        return "text-tier-1";
      case "HT2":
      case "LT2":
        return "text-tier-2";
      case "HT3":
      case "LT3":
        return "text-tier-3";
      case "HT4":
      case "LT4":
        return "text-tier-4";
      case "HT5":
      case "LT5":
        return "text-tier-5";
      case "Retired":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };
  
  // Handle multiple gamemode submissions at once
  const handleSubmitAllSelectedTiers = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    let successCount = 0;
    let hasAttempts = false;
    
    for (const gamemode of Object.keys(tierSelections) as GameMode[]) {
      const tier = tierSelections[gamemode];
      // Submit for all gamemodes, using "NA" as default
      hasAttempts = true;
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
    
    if (!hasAttempts) {
      toast.info('No tiers were selected for submission');
      return;
    }
    
    if (successCount > 0) {
      toast.success(`Successfully submitted ${successCount} tier rankings for ${ign}`);
      // Reset tier selections
      setTierSelections({
        'Crystal': "NA",
        'Sword': "NA",
        'SMP': "NA",
        'UHC': "NA",
        'Axe': "NA",
        'NethPot': "NA",
        'Bedwars': "NA",
        'Mace': "NA"
      });
      
      // Reset form
      setIgn('');
      setJavaUsername('');
      setRegion(undefined);
      setDevice(undefined);
    } else {
      toast.error('Failed to submit any tier rankings');
    }
  };
  
  // Handle tier selection change
  const handleTierChange = (gamemode: GameMode, tier: TierLevel | "NA") => {
    setTierSelections(prev => ({
      ...prev,
      [gamemode]: tier
    }));
  };
  
  // Handle player update
  const handleUpdatePlayer = async () => {
    if (!selectedPlayer) return;
    
    // Validate form
    if (!editPlayerForm.java_username.trim()) {
      toast.error('Java username is required');
      return;
    }
    
    if (!editPlayerForm.region) {
      toast.error('Region is required');
      return;
    }
    
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
  
  // Handle test data generation
  const handleGenerateTestData = async () => {
    if (isGeneratingData) return;
    
    try {
      // Check how many players to generate to reach target of 200
      const playersToGenerate = Math.max(0, 200 - playerCount);
      
      if (playersToGenerate <= 0) {
        toast.info('Already have 200 or more players in the database');
        return;
      }
      
      // Generate test data
      await generateTestData(playersToGenerate);
      toast.success(`Generating ${playersToGenerate} test players`);
    } catch (err) {
      console.error('Error generating test data:', err);
      toast.error('An error occurred while generating test data');
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
        
        {/* Database Stats */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Database Stats</CardTitle>
            <CardDescription>Current database status and test data generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Player Count:</p>
                <p className="text-2xl font-bold">{playerCount}</p>
              </div>
              <Button 
                onClick={handleGenerateTestData} 
                disabled={isGeneratingData || playerCount >= 200}
                className="flex items-center gap-2"
              >
                {isGeneratingData ? 'Generating...' : `Generate Test Data (${Math.max(0, 200 - playerCount)} players)`}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="player-results" className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="player-results">Submit Results</TabsTrigger>
            <TabsTrigger value="player-search">Search/Edit Players</TabsTrigger>
          </TabsList>
          
          {/* Player Results Submission - Completely redesigned for horizontal radio buttons */}
          <TabsContent value="player-results">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Submit Player Results</CardTitle>
                <CardDescription>Assign tiers to players for multiple gamemodes at once</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Player Info with validation */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ign" className={formErrors.ign ? "text-destructive" : ""}>
                        IGN (In-Game Name) *
                      </Label>
                      <Input 
                        id="ign" 
                        value={ign} 
                        onChange={(e) => {
                          setIgn(e.target.value);
                          setFormErrors(prev => ({ ...prev, ign: false }));
                        }}
                        placeholder="Player's in-game name"
                        className={formErrors.ign ? "border-destructive" : ""}
                      />
                      {formErrors.ign && (
                        <p className="text-xs text-destructive">IGN is required</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="javaUsername" className={formErrors.javaUsername ? "text-destructive" : ""}>
                        Java Username (for avatar) *
                      </Label>
                      <Input 
                        id="javaUsername" 
                        value={javaUsername} 
                        onChange={(e) => {
                          setJavaUsername(e.target.value);
                          setFormErrors(prev => ({ ...prev, javaUsername: false }));
                        }}
                        placeholder="Java edition username"
                        className={formErrors.javaUsername ? "border-destructive" : ""}
                      />
                      {formErrors.javaUsername && (
                        <p className="text-xs text-destructive">Java username is required</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="region" className={formErrors.region ? "text-destructive" : ""}>
                        Region *
                      </Label>
                      <Select 
                        value={region} 
                        onValueChange={(value) => {
                          setRegion(value as PlayerRegion);
                          setFormErrors(prev => ({ ...prev, region: false }));
                        }}
                      >
                        <SelectTrigger className={formErrors.region ? "border-destructive" : ""}>
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
                      {formErrors.region && (
                        <p className="text-xs text-destructive">Region is required</p>
                      )}
                    </div>
                    
                    <div className="space-y-2 md:col-span-3">
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
                  
                  {/* Game Mode Tier Selection - Horizontal Radio Buttons */}
                  <div className="mt-6 space-y-6">
                    <h3 className="text-lg font-medium">Game Mode Tier Selection</h3>
                    
                    {/* Loop through game modes */}
                    {asGameModeArray(['Crystal', 'Sword', 'Axe', 'Mace', 'SMP', 'NethPot', 'Bedwars', 'UHC']).map((gamemode) => (
                      <div key={gamemode} className="pt-2 pb-4 border-b border-gray-700/50">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="w-24 font-medium">{gamemode}:</h4>
                          
                          <RadioGroup 
                            className="flex flex-wrap items-center gap-x-4 gap-y-3"
                            value={tierSelections[gamemode]}
                            onValueChange={(value) => handleTierChange(gamemode, value as TierLevel | "NA")}
                          >
                            {tierOptions.map((tier) => (
                              <div key={`${gamemode}-${tier}`} className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value={tier} 
                                  id={`${gamemode}-${tier}`}
                                  className={tier !== "NA" ? getTierColorClass(tier as TierLevel) : ""}
                                />
                                <Label 
                                  htmlFor={`${gamemode}-${tier}`} 
                                  className={`text-sm ${tier !== "NA" ? getTierColorClass(tier as TierLevel) : ""}`}
                                >
                                  {tier === "NA" ? "Not Ranked" : tier}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    ))}
                    
                    {/* Submit button for all selected tiers */}
                    <div className="mt-6 flex justify-end">
                      <Button 
                        onClick={handleSubmitAllSelectedTiers}
                        disabled={!ign || isSubmitting}
                        className="px-6"
                      >
                        {isSubmitting ? 'Processing...' : 'Submit Player Results'}
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
                              <Label htmlFor="edit-java">Java Username *</Label>
                              <Input
                                id="edit-java"
                                value={editPlayerForm.java_username}
                                onChange={(e) => setEditPlayerForm(prev => ({ ...prev, java_username: e.target.value }))}
                                placeholder="Java edition username"
                                className={!editPlayerForm.java_username ? "border-destructive" : ""}
                              />
                              {!editPlayerForm.java_username && (
                                <p className="text-xs text-destructive">Java username is required</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="edit-region">Region *</Label>
                              <Select
                                value={editPlayerForm.region}
                                onValueChange={(value) => setEditPlayerForm(prev => ({ ...prev, region: value as PlayerRegion }))}
                              >
                                <SelectTrigger className={!editPlayerForm.region ? "border-destructive" : ""}>
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
                              {!editPlayerForm.region && (
                                <p className="text-xs text-destructive">Region is required</p>
                              )}
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
                              disabled={isSubmitting || !editPlayerForm.java_username || !editPlayerForm.region}
                            >
                              <Save className="mr-2 h-4 w-4" />
                              Update Player Info
                            </Button>
                          </div>
                        </div>
                        
                        {/* Tier Management */}
                        <div className="space-y-4">
                          <h3 className="font-semibold">Manage Tiers</h3>
                          
                          <div className="grid grid-cols-1 gap-4">
                            {/* Loop through game modes */}
                            {asGameModeArray(['Crystal', 'Sword', 'Axe', 'Mace', 'SMP', 'NethPot', 'Bedwars', 'UHC']).map((gamemode) => {
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
        </Tabs>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
