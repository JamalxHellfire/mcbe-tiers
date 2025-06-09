import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { useNavigate } from 'react-router-dom';
import { GameMode, TierLevel, PlayerRegion, DeviceType } from '@/services/playerService';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { assignTier, createPlayer, isLoading, error } = useAdminPanel();
  
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedGamemode, setSelectedGamemode] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const [newPlayerIGN, setNewPlayerIGN] = useState('');
  const [newPlayerJavaUsername, setNewPlayerJavaUsername] = useState('');
  const [newPlayerRegion, setNewPlayerRegion] = useState('');
  const [newPlayerDevice, setNewPlayerDevice] = useState('');
  
  const handleModeChange = (mode: string) => {
    if (mode === 'overall') {
      navigate('/');
    } else {
      navigate(`/${mode.toLowerCase()}`);
    }
  };

  const handleAssignTier = async () => {
    if (!selectedPlayer || !selectedGamemode || !selectedTier) {
      setMessage('Please fill in all fields');
      return;
    }

    const success = await assignTier(selectedPlayer, selectedGamemode as GameMode, selectedTier as TierLevel);
    
    if (success) {
      setMessage('Tier assigned successfully!');
      setSelectedPlayer('');
      setSelectedGamemode('');
      setSelectedTier('');
    }
  };

  const handleCreatePlayer = async () => {
    if (!newPlayerIGN) {
      setMessage('Please enter a player IGN');
      return;
    }

    const playerData = {
      ign: newPlayerIGN,
      java_username: newPlayerJavaUsername || undefined,
      region: newPlayerRegion as PlayerRegion || undefined,
      device: newPlayerDevice as DeviceType || undefined
    };

    const result = await createPlayer(playerData);
    
    if (result) {
      setMessage('Player created successfully!');
      setNewPlayerIGN('');
      setNewPlayerJavaUsername('');
      setNewPlayerRegion('');
      setNewPlayerDevice('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dark">
      <Navbar 
        selectedMode="overall" 
        onSelectMode={handleModeChange} 
        navigate={navigate} 
      />
      
      <main className="flex-grow">
        <div className="content-container py-6">
          <Card>
            <CardHeader>
              <CardTitle>Assign Tier</CardTitle>
              <CardDescription>Assign a tier to a player for a specific gamemode.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  type="text" 
                  placeholder="Player ID" 
                  value={selectedPlayer} 
                  onChange={(e) => setSelectedPlayer(e.target.value)} 
                />
                <Select onValueChange={(value) => setSelectedGamemode(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Gamemode" />
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
              <Select onValueChange={(value) => setSelectedTier(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HT1">HT1</SelectItem>
                  <SelectItem value="LT1">LT1</SelectItem>
                  <SelectItem value="HT2">HT2</SelectItem>
                  <SelectItem value="LT2">LT2</SelectItem>
                  <SelectItem value="HT3">HT3</SelectItem>
                  <SelectItem value="LT3">LT3</SelectItem>
                  <SelectItem value="HT4">HT4</SelectItem>
                  <SelectItem value="LT4">LT4</SelectItem>
                  <SelectItem value="HT5">HT5</SelectItem>
                  <SelectItem value="LT5">LT5</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAssignTier} disabled={isLoading}>
                {isLoading ? 'Assigning...' : 'Assign Tier'}
              </Button>
              {error && (
                <Alert>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Create Player</CardTitle>
              <CardDescription>Create a new player with IGN, Java username, region, and device.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <Input 
                type="text" 
                placeholder="IGN" 
                value={newPlayerIGN} 
                onChange={(e) => setNewPlayerIGN(e.target.value)} 
              />
              <Input 
                type="text" 
                placeholder="Java Username (optional)" 
                value={newPlayerJavaUsername} 
                onChange={(e) => setNewPlayerJavaUsername(e.target.value)} 
              />
              <Select onValueChange={(value) => setNewPlayerRegion(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Region (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NA">North America</SelectItem>
                  <SelectItem value="EU">Europe</SelectItem>
                  <SelectItem value="ASIA">Asia</SelectItem>
                  <SelectItem value="OCE">Oceania</SelectItem>
                  <SelectItem value="SA">South America</SelectItem>
                  <SelectItem value="AF">Africa</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setNewPlayerDevice(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Device (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PC">PC</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Console">Console</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreatePlayer} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Player'}
              </Button>
              {error && (
                <Alert>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
