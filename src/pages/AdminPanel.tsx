
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { GameMode, TierLevel, PlayerRegion, DeviceType } from '@/services/playerService';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { addTierAssignment, addPlayer, isLoading } = useAdminPanel();
  
  // Player form state
  const [playerForm, setPlayerForm] = useState({
    ign: '',
    java_username: '',
    region: '' as PlayerRegion,
    device: '' as DeviceType,
    global_points: 0
  });

  // Tier assignment form state
  const [tierForm, setTierForm] = useState({
    playerId: '',
    gamemode: '' as GameMode,
    tier: '' as TierLevel,
    score: 0
  });

  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPlayer(playerForm);
  };

  const handleTierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTierAssignment(tierForm);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Player Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Player</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePlayerSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="ign">IGN</Label>
                    <Input
                      id="ign"
                      value={playerForm.ign}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, ign: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="java_username">Java Username</Label>
                    <Input
                      id="java_username"
                      value={playerForm.java_username}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, java_username: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select value={playerForm.region} onValueChange={(value: PlayerRegion) => setPlayerForm(prev => ({ ...prev, region: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NA">North America</SelectItem>
                        <SelectItem value="EU">Europe</SelectItem>
                        <SelectItem value="ASIA">Asia</SelectItem>
                        <SelectItem value="SA">South America</SelectItem>
                        <SelectItem value="AF">Africa</SelectItem>
                        <SelectItem value="OCE">Oceania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="device">Device</Label>
                    <Select value={playerForm.device} onValueChange={(value: DeviceType) => setPlayerForm(prev => ({ ...prev, device: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select device" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PC">PC</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="Console">Console</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="global_points">Global Points</Label>
                    <Input
                      id="global_points"
                      type="number"
                      value={playerForm.global_points}
                      onChange={(e) => setPlayerForm(prev => ({ ...prev, global_points: parseInt(e.target.value) }))}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Player'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Add Tier Assignment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Tier Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTierSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="playerId">Player ID</Label>
                    <Input
                      id="playerId"
                      value={tierForm.playerId}
                      onChange={(e) => setTierForm(prev => ({ ...prev, playerId: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gamemode">Gamemode</Label>
                    <Select value={tierForm.gamemode} onValueChange={(value: GameMode) => setTierForm(prev => ({ ...prev, gamemode: value }))}>
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
                  
                  <div>
                    <Label htmlFor="tier">Tier</Label>
                    <Select value={tierForm.tier} onValueChange={(value: TierLevel) => setTierForm(prev => ({ ...prev, tier: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tier" />
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
                  </div>
                  
                  <div>
                    <Label htmlFor="score">Score</Label>
                    <Input
                      id="score"
                      type="number"
                      value={tierForm.score}
                      onChange={(e) => setTierForm(prev => ({ ...prev, score: parseInt(e.target.value) }))}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Tier Assignment'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPanel;
