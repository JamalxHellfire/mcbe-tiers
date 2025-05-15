
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { PlayerRegion, DeviceType, GameMode, TierLevel } from '@/services/playerService';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { 
    isAdminMode,
    pinInputValue,
    setPinInputValue,
    handlePinSubmit,
    handleLogout,
    submitPlayerResult,
    massRegisterPlayers,
    generateFakePlayers,
    wipeAllData
  } = useAdminPanel();
  
  // Form state for player submission
  const [ign, setIgn] = useState('');
  const [javaUsername, setJavaUsername] = useState('');
  const [region, setRegion] = useState<PlayerRegion | undefined>(undefined);
  const [device, setDevice] = useState<DeviceType | undefined>(undefined);
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('Crystal');
  const [selectedTier, setSelectedTier] = useState<TierLevel>('LT5');
  const [massPlayersText, setMassPlayersText] = useState('');
  const [fakePlayerCount, setFakePlayerCount] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    setIsSubmitting(true);
    
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
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle mass player registration
  const handleMassRegister = async () => {
    if (!massPlayersText.trim()) {
      toast.error('Please enter player data');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const count = await massRegisterPlayers(massPlayersText);
      if (count > 0) {
        toast.success(`Successfully registered ${count} players`);
        setMassPlayersText('');
      } else {
        toast.error('No players were registered');
      }
    } catch (err) {
      console.error('Error registering players:', err);
      toast.error('An error occurred during player registration');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate fake players for testing
  const handleGenerateFakePlayers = async () => {
    if (fakePlayerCount < 1 || fakePlayerCount > 100) {
      toast.error('Please enter a valid number between 1 and 100');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const count = await generateFakePlayers(fakePlayerCount);
      if (count > 0) {
        toast.success(`Successfully generated ${count} fake players with random tiers`);
      } else {
        toast.error('Failed to generate fake players');
      }
    } catch (err) {
      console.error('Error generating fake players:', err);
      toast.error('An error occurred while generating fake players');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle data wipe
  const handleWipeAllData = async () => {
    setIsSubmitting(true);
    
    try {
      const success = await wipeAllData();
      if (success) {
        toast.success('All player data has been wiped');
      } else {
        toast.error('Failed to wipe data');
      }
    } catch (err) {
      console.error('Error wiping data:', err);
      toast.error('An error occurred while wiping data');
    } finally {
      setIsSubmitting(false);
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
              disabled={!pinInputValue || pinInputValue.length < 4}
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }
  
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
          <TabsList className="grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="player-results">Submit Results</TabsTrigger>
            <TabsTrigger value="mass-register">Mass Register</TabsTrigger>
            <TabsTrigger value="test-data">Test Data</TabsTrigger>
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
          
          {/* Test Data Tab */}
          <TabsContent value="test-data">
            <Card>
              <CardHeader>
                <CardTitle>Generate Test Data</CardTitle>
                <CardDescription>
                  Create fake players with random tiers for testing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fakePlayerCount">Number of Players (1-100)</Label>
                    <Input
                      id="fakePlayerCount"
                      type="number"
                      min={1}
                      max={100}
                      value={fakePlayerCount}
                      onChange={(e) => setFakePlayerCount(parseInt(e.target.value) || 10)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleGenerateFakePlayers} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Generating...' : 'Generate Fake Players'}
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
                  Actions here can permanently delete data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
