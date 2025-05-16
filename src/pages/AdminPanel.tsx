
import React, { useState } from 'react';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent,
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeviceType, PlayerRegion, GameMode, TierLevel, Player } from '@/services/playerService';

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
  
  // Player form state
  const [playerIGN, setPlayerIGN] = useState<string>('');
  const [playerJavaName, setPlayerJavaName] = useState<string>('');
  const [playerRegion, setPlayerRegion] = useState<PlayerRegion | ''>('');
  const [playerDevice, setPlayerDevice] = useState<DeviceType | ''>('');
  const [selectedGamemode, setSelectedGamemode] = useState<GameMode | ''>('');
  const [selectedTier, setSelectedTier] = useState<TierLevel | 'NA' | ''>('');
  
  // Player edit state
  const [editPlayerJavaName, setEditPlayerJavaName] = useState<string>('');
  const [editPlayerRegion, setEditPlayerRegion] = useState<PlayerRegion | ''>('');
  const [editPlayerDevice, setEditPlayerDevice] = useState<DeviceType | ''>('');
  const [isPlayerEditDialogOpen, setIsPlayerEditDialogOpen] = useState<boolean>(false);
  const [isTierEditDialogOpen, setIsTierEditDialogOpen] = useState<boolean>(false);
  const [editGamemode, setEditGamemode] = useState<GameMode | ''>('');
  const [editTier, setEditTier] = useState<TierLevel | ''>('');
  
  // Submit player form
  const handlePlayerSubmit = async () => {
    if (!playerIGN.trim()) {
      return;
    }
    
    if (!playerJavaName.trim()) {
      return;
    }
    
    if (!playerRegion) {
      return;
    }
    
    if (!selectedGamemode) {
      return;
    }
    
    if (!selectedTier) {
      return;
    }
    
    const success = await submitPlayerResult(
      playerIGN.trim(),
      playerJavaName.trim(),
      playerDevice as DeviceType || undefined,
      playerRegion as PlayerRegion,
      selectedGamemode as GameMode,
      selectedTier as TierLevel | "NA"
    );
    
    if (success) {
      // Reset form on success
      setPlayerIGN('');
      setPlayerJavaName('');
      setPlayerRegion('');
      setPlayerDevice('');
      setSelectedGamemode('');
      setSelectedTier('');
    }
  };
  
  // Open edit dialog
  const handleEditPlayer = (player: Player) => {
    setEditPlayerJavaName(player.java_username || '');
    setEditPlayerRegion(player.region || '');
    setEditPlayerDevice(player.device || '');
    setIsPlayerEditDialogOpen(true);
  };
  
  // Submit player edit
  const handlePlayerEditSubmit = async () => {
    if (!selectedPlayer) return;
    
    const success = await updatePlayer(
      selectedPlayer.id,
      editPlayerJavaName,
      editPlayerRegion as PlayerRegion,
      editPlayerDevice as DeviceType
    );
    
    if (success) {
      setIsPlayerEditDialogOpen(false);
    }
  };
  
  // Open tier edit dialog
  const handleEditTier = () => {
    setEditGamemode('');
    setEditTier('');
    setIsTierEditDialogOpen(true);
  };
  
  // Submit tier edit
  const handleTierEditSubmit = async () => {
    if (!selectedPlayer || !editGamemode || !editTier) return;
    
    const success = await updatePlayerTier(
      selectedPlayer.id,
      editGamemode as GameMode,
      editTier as TierLevel
    );
    
    if (success) {
      setIsTierEditDialogOpen(false);
    }
  };
  
  // Handle delete player
  const handleDeletePlayer = async () => {
    if (!selectedPlayer) return;
    await deletePlayer(selectedPlayer.id);
  };
  
  // Handle ban player
  const handleBanPlayer = async () => {
    if (!selectedPlayer) return;
    await banPlayer(selectedPlayer);
  };
  
  const regions: PlayerRegion[] = ['NA', 'EU', 'ASIA', 'OCE', 'SA', 'AF'];
  const devices: DeviceType[] = ['Mobile', 'PC', 'Console'];
  const gameModes: GameMode[] = ['Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'];
  const tiers: (TierLevel | 'NA')[] = ['HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3', 'HT4', 'LT4', 'HT5', 'LT5', 'Retired', 'NA'];
  
  const navbarProps = {
    selectedMode: '',
    onSelectMode: () => {},
    navigate: (path: string) => navigate(path)
  };
  
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar {...navbarProps} />
      
      <div className="container mx-auto py-8 px-4">
        <motion.h1 
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Admin Panel
        </motion.h1>
        
        {!isAdminMode ? (
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Enter your admin PIN to access the admin panel</CardDescription>
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
                        placeholder="Enter PIN"
                        autoComplete="off"
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting || !pinInputValue}>
                      {isSubmitting ? 'Verifying...' : 'Login'}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/')}
                >
                  Return to Homepage
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Welcome, Admin</h2>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
            
            <Tabs defaultValue="submit">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="submit">Submit Result</TabsTrigger>
                <TabsTrigger value="search">Search & Edit</TabsTrigger>
              </TabsList>
              
              {/* Submit Results Tab */}
              <TabsContent value="submit">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Player Result</CardTitle>
                    <CardDescription>
                      Add a new player or update an existing player's tier
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="playerIGN">In-Game Name*</Label>
                          <Input
                            id="playerIGN"
                            value={playerIGN}
                            onChange={(e) => setPlayerIGN(e.target.value)}
                            placeholder="Player's Minecraft IGN"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="playerJavaName">Java Username*</Label>
                          <Input
                            id="playerJavaName"
                            value={playerJavaName}
                            onChange={(e) => setPlayerJavaName(e.target.value)}
                            placeholder="Player's Java username"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="playerRegion">Region*</Label>
                          <Select
                            value={playerRegion}
                            onValueChange={(value) => setPlayerRegion(value as PlayerRegion)}
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
                          <Label htmlFor="playerDevice">Device</Label>
                          <Select
                            value={playerDevice}
                            onValueChange={(value) => setPlayerDevice(value as DeviceType)}
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gamemode">Gamemode*</Label>
                          <Select
                            value={selectedGamemode}
                            onValueChange={(value) => setSelectedGamemode(value as GameMode)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gamemode" />
                            </SelectTrigger>
                            <SelectContent>
                              {gameModes.map((mode) => (
                                <SelectItem key={mode} value={mode}>
                                  {mode}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Tier*</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <RadioGroup 
                              className="flex flex-wrap gap-2" 
                              value={selectedTier}
                              onValueChange={(value) => setSelectedTier(value as TierLevel | 'NA')}
                            >
                              {tiers.map((tier) => (
                                <div key={tier} className="flex items-center space-x-1">
                                  <RadioGroupItem value={tier} id={`tier-${tier}`} />
                                  <Label htmlFor={`tier-${tier}`} className="text-sm">{tier}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handlePlayerSubmit}
                      disabled={!playerIGN || !playerJavaName || !playerRegion || !selectedGamemode || !selectedTier}
                      className="w-full"
                    >
                      Submit Result
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Search & Edit Tab */}
              <TabsContent value="search">
                <Card>
                  <CardHeader>
                    <CardTitle>Search & Edit Players</CardTitle>
                    <CardDescription>
                      Search for players by IGN and edit their information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="searchQuery">Search Player</Label>
                        <Input
                          id="searchQuery"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Enter IGN to search..."
                        />
                      </div>
                      
                      {isSearching ? (
                        <div className="text-center py-4">Searching...</div>
                      ) : searchResults.length > 0 ? (
                        <div className="space-y-4">
                          <h3 className="font-medium">Search Results</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {searchResults.map((player) => (
                              <Card 
                                key={player.id} 
                                className="cursor-pointer hover:bg-accent/50 transition-colors"
                                onClick={() => loadPlayerDetails(player.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium">{player.ign}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {player.region} • {player.device || 'Unknown Device'}
                                      </p>
                                    </div>
                                    <div className="text-sm bg-primary/10 px-2 py-1 rounded">
                                      {player.global_points || 0} pts
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ) : searchQuery.length > 0 ? (
                        <div className="text-center py-4">No players found</div>
                      ) : null}
                      
                      {selectedPlayer && (
                        <div className="space-y-4 pt-4 border-t">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl font-medium">
                              {selectedPlayer.ign}
                            </h3>
                            <Button variant="ghost" size="sm" onClick={clearSelectedPlayer}>
                              Close
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Player Details</h4>
                              <dl className="space-y-1">
                                <div className="flex justify-between">
                                  <dt className="text-muted-foreground">Java Username</dt>
                                  <dd>{selectedPlayer.java_username || 'Not set'}</dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="text-muted-foreground">Region</dt>
                                  <dd>{selectedPlayer.region || 'Not set'}</dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="text-muted-foreground">Device</dt>
                                  <dd>{selectedPlayer.device || 'Not set'}</dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="text-muted-foreground">Global Points</dt>
                                  <dd>{selectedPlayer.global_points || 0}</dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="text-muted-foreground">Status</dt>
                                  <dd className={selectedPlayer.banned ? "text-destructive" : "text-primary"}>
                                    {selectedPlayer.banned ? 'Banned' : 'Active'}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Tiers</h4>
                              {selectedPlayer.tiers && Object.keys(selectedPlayer.tiers).length > 0 ? (
                                <dl className="space-y-1">
                                  {Object.entries(selectedPlayer.tiers).map(([gamemode, tierData]) => (
                                    <div key={gamemode} className="flex justify-between">
                                      <dt className="text-muted-foreground">{gamemode}</dt>
                                      <dd>{tierData.tier}</dd>
                                    </div>
                                  ))}
                                </dl>
                              ) : (
                                <p className="text-sm text-muted-foreground">No tiers assigned</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditPlayer(selectedPlayer)}>
                              Edit Player
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleEditTier}>
                              Edit Tier
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-destructive">
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete player?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {selectedPlayer.ign}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDeletePlayer} className="bg-destructive hover:bg-destructive/90">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-destructive">
                                  Ban
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Ban player?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to ban {selectedPlayer.ign}? They will be removed from all rankings.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleBanPlayer} className="bg-destructive hover:bg-destructive/90">
                                    Ban Player
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
      
      {/* Player Edit Dialog */}
      <Dialog open={isPlayerEditDialogOpen} onOpenChange={setIsPlayerEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>
              Update player profile information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editJavaName">Java Username</Label>
              <Input
                id="editJavaName"
                value={editPlayerJavaName}
                onChange={(e) => setEditPlayerJavaName(e.target.value)}
                placeholder="Player's Java username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editRegion">Region</Label>
              <Select
                value={editPlayerRegion}
                onValueChange={(value) => setEditPlayerRegion(value as PlayerRegion)}
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
              <Label htmlFor="editDevice">Device</Label>
              <Select
                value={editPlayerDevice}
                onValueChange={(value) => setEditPlayerDevice(value as DeviceType)}
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
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setIsPlayerEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePlayerEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Tier Edit Dialog */}
      <Dialog open={isTierEditDialogOpen} onOpenChange={setIsTierEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tier</DialogTitle>
            <DialogDescription>
              Update player tier for a specific gamemode
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editGamemode">Gamemode</Label>
              <Select
                value={editGamemode}
                onValueChange={(value) => setEditGamemode(value as GameMode)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gamemode" />
                </SelectTrigger>
                <SelectContent>
                  {gameModes.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tier</Label>
              <RadioGroup 
                className="flex flex-wrap gap-2 mt-2" 
                value={editTier}
                onValueChange={(value) => setEditTier(value as TierLevel)}
              >
                {tiers.filter(tier => tier !== 'NA').map((tier) => (
                  <div key={tier} className="flex items-center space-x-1">
                    <RadioGroupItem value={tier} id={`edit-tier-${tier}`} />
                    <Label htmlFor={`edit-tier-${tier}`} className="text-sm">{tier}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setIsTierEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleTierEditSubmit}
              disabled={!editGamemode || !editTier}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
