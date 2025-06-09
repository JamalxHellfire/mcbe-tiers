import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { GameMode, TierLevel, PlayerRegion, DeviceType } from '@/services/playerService';
import { GameModeIcon } from '@/components/GameModeIcon';
import { toDisplayGameMode } from '@/utils/gamemodeCasing';
import { AlertCircle, Search, Trash2, Ban, UserPlus, Trophy, RefreshCw, Bug } from 'lucide-react';
import { AdminLogViewer } from '@/components/AdminLogViewer';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  
  const {
    isAdminMode,
    pinInputValue,
    setPinInputValue,
    isSubmitting,
    handlePinSubmit,
    handleLogout,
    // Player search
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
    banPlayer,
    // Test data
    generateTestData,
    isGeneratingData,
    playerCount,
    // Form state
    ign, setIgn,
    javaUsername, setJavaUsername,
    region, setRegion,
    device, setDevice,
    formErrors,
    tierSelections, setTierSelections,
    handleTierChange,
    handleSubmitAllSelectedTiers
  } = useAdminPanel();
  
  // Define all game modes with proper casing
  const gameModes: GameMode[] = [
    'Crystal', 'Sword', 'SMP', 'UHC', 'Axe', 'NethPot', 'Bedwars', 'Mace'
  ];
  
  // Define all tier levels
  const tierLevels: (TierLevel | "NA")[] = [
    "NA", "LT5", "HT5", "LT4", "HT4", "LT3", "HT3", "LT2", "HT2", "LT1", "HT1", "Retired"
  ];
  
  // Define regions
  const regions: PlayerRegion[] = ["NA", "EU", "ASIA", "OCE", "SA", "AF"];
  
  // Define devices
  const devices: DeviceType[] = ["PC", "Mobile", "Console"];
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePinSubmit();
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode="overall" 
        onSelectMode={() => {}} 
        navigate={navigate} 
      />
      
      <main className="flex-grow">
        <div className="content-container py-6">
          <motion.h1 
            className="section-heading mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Admin Panel
          </motion.h1>
          
          {!isAdminMode ? (
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Enter your admin PIN to access the admin panel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pin">Admin PIN</Label>
                    <Input 
                      id="pin" 
                      type="password" 
                      placeholder="Enter PIN" 
                      value={pinInputValue}
                      onChange={(e) => setPinInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handlePinSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Verifying...' : 'Login'}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Admin Controls</h2>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
              </div>
              
              <Tabs defaultValue="submit" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="submit">Submit Results</TabsTrigger>
                  <TabsTrigger value="manage">Manage Players</TabsTrigger>
                  <TabsTrigger value="tools">Admin Tools</TabsTrigger>
                  <TabsTrigger value="logs">
                    <Bug className="h-4 w-4 mr-1" />
                    System Logs
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="submit">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit Player Results</CardTitle>
                      <CardDescription>Add or update player tier rankings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="ign" className={formErrors.ign ? 'text-red-500' : ''}>
                              Player IGN *
                            </Label>
                            <Input 
                              id="ign" 
                              placeholder="Minecraft username" 
                              value={ign}
                              onChange={(e) => setIgn(e.target.value)}
                              className={formErrors.ign ? 'border-red-500' : ''}
                            />
                            {formErrors.ign && (
                              <p className="text-red-500 text-xs">IGN is required</p>
                            )}
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="java_username">Java Username</Label>
                            <Input 
                              id="java_username" 
                              placeholder="For avatar lookup" 
                              value={javaUsername}
                              onChange={(e) => setJavaUsername(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="region" className={formErrors.region ? 'text-red-500' : ''}>
                              Region *
                            </Label>
                            <Select 
                              value={region} 
                              onValueChange={(value) => setRegion(value as PlayerRegion)}
                            >
                              <SelectTrigger className={formErrors.region ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                              <SelectContent>
                                {regions.map(r => (
                                  <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {formErrors.region && (
                              <p className="text-red-500 text-xs">Region is required</p>
                            )}
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="device">Device</Label>
                            <Select 
                              value={device} 
                              onValueChange={(value) => setDevice(value as DeviceType)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select device" />
                              </SelectTrigger>
                              <SelectContent>
                                {devices.map(d => (
                                  <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-3">Tier Rankings</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {gameModes.map((mode) => (
                              <div key={mode} className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <GameModeIcon mode={mode.toLowerCase()} className="h-5 w-5" />
                                  <Label>{toDisplayGameMode(mode)}</Label>
                                </div>
                                <Select 
                                  value={tierSelections[mode]} 
                                  onValueChange={(value) => handleTierChange(mode, value as TierLevel | "NA")}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Not Ranked" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {tierLevels.map(tier => (
                                      <SelectItem key={`${mode}-${tier}`} value={tier}>
                                        {tier === "NA" ? "Not Ranked" : tier}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        onClick={handleSubmitAllSelectedTiers}
                      >
                        <Trophy className="mr-2 h-4 w-4" />
                        Submit Player Results
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="manage">
                  <Card>
                    <CardHeader>
                      <CardTitle>Manage Players</CardTitle>
                      <CardDescription>Search, edit, or remove players</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search players by IGN..."
                              className="pl-8"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        {isSearching ? (
                          <div className="text-center py-4">
                            <p className="text-muted-foreground">Searching...</p>
                          </div>
                        ) : searchResults.length > 0 ? (
                          <div className="border rounded-md divide-y">
                            {searchResults.map(player => (
                              <div 
                                key={player.id} 
                                className="p-3 flex justify-between items-center hover:bg-white/5 cursor-pointer"
                                onClick={() => loadPlayerDetails(player.id)}
                              >
                                <div>
                                  <p className="font-medium">{player.ign}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {player.region || 'Unknown region'} • {player.global_points || 0} points
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : searchQuery ? (
                          <div className="text-center py-4">
                            <p className="text-muted-foreground">No players found</p>
                          </div>
                        ) : null}
                        
                        {selectedPlayer && (
                          <div className="mt-6 border rounded-md p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-bold">{selectedPlayer.ign}</h3>
                                <p className="text-sm text-muted-foreground">ID: {selectedPlayer.id}</p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={clearSelectedPlayer}
                              >
                                Close
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label htmlFor="edit-java">Java Username</Label>
                                <Input 
                                  id="edit-java" 
                                  defaultValue={selectedPlayer.java_username || ''}
                                  placeholder="Java username"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="edit-region">Region</Label>
                                <Select defaultValue={selectedPlayer.region}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select region" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {regions.map(r => (
                                      <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="edit-device">Device</Label>
                                <Select defaultValue={selectedPlayer.device}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select device" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {devices.map(d => (
                                      <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label>Global Points</Label>
                                <Input 
                                  value={selectedPlayer.global_points || 0}
                                  disabled
                                />
                              </div>
                            </div>
                            
                            <h4 className="font-medium mb-2">Gamemode Tiers</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                              {gameModes.map(mode => {
                                const tierData = selectedPlayer.tiers?.[mode];
                                return (
                                  <div key={mode} className="border rounded p-2 text-center">
                                    <div className="flex items-center justify-center space-x-1 mb-1">
                                      <GameModeIcon mode={mode.toLowerCase()} className="h-4 w-4" />
                                      <span className="text-sm">{toDisplayGameMode(mode)}</span>
                                    </div>
                                    <p className="font-medium">
                                      {tierData?.tier || 'Not Ranked'}
                                    </p>
                                    {tierData && (
                                      <p className="text-xs text-muted-foreground">
                                        {tierData.score} points
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="flex space-x-2 justify-end">
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete ${selectedPlayer.ign}?`)) {
                                    deletePlayer(selectedPlayer.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                              
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to ban ${selectedPlayer.ign}?`)) {
                                    banPlayer(selectedPlayer);
                                  }
                                }}
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Ban
                              </Button>
                              
                              <Button>
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Update
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="tools">
                  <Card>
                    <CardHeader>
                      <CardTitle>Admin Tools</CardTitle>
                      <CardDescription>Advanced admin functionality</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>System Status</AlertTitle>
                          <AlertDescription>
                            Current player count: {playerCount}
                          </AlertDescription>
                        </Alert>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Test Data Generation</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Generate test players with random tiers for development and testing.
                          </p>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => generateTestData(10)}
                              disabled={isGeneratingData}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Generate 10 Players
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => generateTestData(50)}
                              disabled={isGeneratingData}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Generate 50 Players
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="logs">
                  <AdminLogViewer />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
