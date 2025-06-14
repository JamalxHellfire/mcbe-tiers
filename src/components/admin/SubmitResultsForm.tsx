
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { GameMode, TierLevel } from '@/services/playerService';
import { GAME_MODES, TIER_LEVELS, REGIONS, DEVICES } from '@/lib/constants';

interface ResultEntry {
  gamemode: GameMode;
  tier: TierLevel;
  points: number;
}

export function SubmitResultsForm() {
  const { submitPlayerResults, loading } = useAdminPanel();
  
  const [playerData, setPlayerData] = useState({
    ign: '',
    region: 'NA' as string,
    device: 'PC' as string,
    java_username: ''
  });
  
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [currentResult, setCurrentResult] = useState<Partial<ResultEntry>>({
    gamemode: undefined,
    tier: undefined,
    points: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerData.ign.trim()) {
      alert('IGN is required');
      return;
    }

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
      setResults([]);
      setCurrentResult({
        gamemode: undefined,
        tier: undefined,
        points: 0
      });
    }
  };

  const addResult = () => {
    if (currentResult.gamemode && currentResult.tier && currentResult.tier !== 'Not Ranked') {
      const newResult: ResultEntry = {
        gamemode: currentResult.gamemode,
        tier: currentResult.tier,
        points: currentResult.points || 0
      };
      
      // Check if gamemode already exists
      const existingIndex = results.findIndex(r => r.gamemode === newResult.gamemode);
      if (existingIndex >= 0) {
        // Update existing
        const updatedResults = [...results];
        updatedResults[existingIndex] = newResult;
        setResults(updatedResults);
      } else {
        // Add new
        setResults([...results, newResult]);
      }
      
      // Reset current result
      setCurrentResult({
        gamemode: undefined,
        tier: undefined,
        points: 0
      });
    }
  };

  const removeResult = (index: number) => {
    setResults(results.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit Player Results</CardTitle>
          <CardDescription>
            Add new players or update existing player results and tier assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ign">IGN (Required)</Label>
                <Input
                  id="ign"
                  value={playerData.ign}
                  onChange={(e) => setPlayerData({...playerData, ign: e.target.value})}
                  placeholder="Enter player IGN"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="java_username">Java Username (Optional)</Label>
                <Input
                  id="java_username"
                  value={playerData.java_username}
                  onChange={(e) => setPlayerData({...playerData, java_username: e.target.value})}
                  placeholder="Enter Java username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select
                  value={playerData.region}
                  onValueChange={(value) => setPlayerData({...playerData, region: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="device">Device</Label>
                <Select
                  value={playerData.device}
                  onValueChange={(value) => setPlayerData({...playerData, device: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEVICES.map((device) => (
                      <SelectItem key={device} value={device}>
                        {device}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Gamemode Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gamemode Results</h3>
              
              {/* Add Result Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
                <div className="space-y-2">
                  <Label>Gamemode</Label>
                  <Select
                    value={currentResult.gamemode || ''}
                    onValueChange={(value) => setCurrentResult({...currentResult, gamemode: value as GameMode})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gamemode" />
                    </SelectTrigger>
                    <SelectContent>
                      {GAME_MODES.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tier</Label>
                  <Select
                    value={currentResult.tier || ''}
                    onValueChange={(value) => setCurrentResult({...currentResult, tier: value as TierLevel})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIER_LEVELS.filter(tier => tier !== 'Not Ranked').map((tier) => (
                        <SelectItem key={tier} value={tier}>
                          {tier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={currentResult.points || 0}
                    onChange={(e) => setCurrentResult({...currentResult, points: parseInt(e.target.value) || 0})}
                    placeholder="Points"
                    min="0"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addResult}
                    disabled={!currentResult.gamemode || !currentResult.tier || currentResult.tier === 'Not Ranked'}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Result
                  </Button>
                </div>
              </div>

              {/* Current Results */}
              {results.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Added Results:</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.map((result, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-2">
                        {result.gamemode} - {result.tier} ({result.points} pts)
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeResult(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Submit Button */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Submitting...' : 'Submit Player Results'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
