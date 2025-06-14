
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { GameMode, TierLevel } from '@/services/playerService';
import { TIER_LEVELS, REGIONS, DEVICES } from '@/lib/constants';

interface TierRankings {
  [key: string]: TierLevel;
}

const gameModes = [
  { key: 'crystal', name: 'Crystal', icon: '🔮', color: 'text-purple-400' },
  { key: 'sword', name: 'Sword', icon: '⚔️', color: 'text-blue-400' },
  { key: 'smp', name: 'SMP', icon: '🏠', color: 'text-green-400' },
  { key: 'uhc', name: 'UHC', icon: '❤️', color: 'text-red-400' },
  { key: 'axe', name: 'Axe', icon: '🪓', color: 'text-cyan-400' },
  { key: 'nethpot', name: 'NethPot', icon: '🧪', color: 'text-purple-400' },
  { key: 'bedwars', name: 'Bedwars', icon: '🛏️', color: 'text-orange-400' },
  { key: 'mace', name: 'Mace', icon: '🔨', color: 'text-gray-400' }
];

export function SubmitResultsForm() {
  const { submitPlayerResults, loading } = useAdminPanel();
  
  const [playerData, setPlayerData] = useState({
    ign: '',
    region: 'NA' as string,
    device: 'PC' as string,
    java_username: ''
  });
  
  const [tierRankings, setTierRankings] = useState<TierRankings>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerData.ign.trim()) {
      alert('IGN is required');
      return;
    }

    // Convert tier rankings to results format
    const results = Object.entries(tierRankings)
      .filter(([_, tier]) => tier && tier !== 'Not Ranked')
      .map(([gamemode, tier]) => ({
        gamemode: gamemode as GameMode,
        tier: tier as TierLevel,
        points: 0 // Points will be calculated based on tier
      }));

    const response = await submitPlayerResults(
      playerData.ign,
      playerData.region,
      playerData.device,
      playerData.java_username || undefined,
      results
    );

    if (response.success) {
      // Reset form
      setPlayerData({
        ign: '',
        region: 'NA',
        device: 'PC',
        java_username: ''
      });
      setTierRankings({});
    }
  };

  const handleTierChange = (gamemode: string, tier: string) => {
    setTierRankings(prev => ({
      ...prev,
      [gamemode]: tier as TierLevel
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#1A1B2A] border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Submit Player Results</CardTitle>
          <CardDescription className="text-gray-400">
            Add or update player tier rankings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ign" className="text-white">Player IGN *</Label>
                <Input
                  id="ign"
                  value={playerData.ign}
                  onChange={(e) => setPlayerData({...playerData, ign: e.target.value})}
                  placeholder="Minecraft username"
                  className="bg-[#0F111A] border-gray-600 text-white placeholder-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="java_username" className="text-white">Java Username</Label>
                <Input
                  id="java_username"
                  value={playerData.java_username}
                  onChange={(e) => setPlayerData({...playerData, java_username: e.target.value})}
                  placeholder="For avatar lookup"
                  className="bg-[#0F111A] border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region" className="text-white">Region *</Label>
                <Select
                  value={playerData.region}
                  onValueChange={(value) => setPlayerData({...playerData, region: value})}
                >
                  <SelectTrigger className="bg-[#0F111A] border-gray-600 text-white">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1B2A] border-gray-600">
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region} className="text-white hover:bg-gray-600">
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="device" className="text-white">Device</Label>
                <Select
                  value={playerData.device}
                  onValueChange={(value) => setPlayerData({...playerData, device: value})}
                >
                  <SelectTrigger className="bg-[#0F111A] border-gray-600 text-white">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1B2A] border-gray-600">
                    {DEVICES.map((device) => (
                      <SelectItem key={device} value={device} className="text-white hover:bg-gray-600">
                        {device}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tier Rankings */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white text-center">Tier Rankings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {gameModes.map((mode) => (
                  <div key={mode.key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{mode.icon}</span>
                      <Label className={`font-medium ${mode.color}`}>
                        {mode.name}
                      </Label>
                    </div>
                    <Select
                      value={tierRankings[mode.key] || 'Not Ranked'}
                      onValueChange={(value) => handleTierChange(mode.key, value)}
                    >
                      <SelectTrigger className="bg-[#0F111A] border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1B2A] border-gray-600">
                        {TIER_LEVELS.map((tier) => (
                          <SelectItem 
                            key={tier} 
                            value={tier} 
                            className="text-white hover:bg-gray-600"
                          >
                            {tier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-3 flex items-center justify-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              {loading ? 'Submitting...' : 'Submit Player Results'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
