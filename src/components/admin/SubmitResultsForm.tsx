import React, { useState } from 'react';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GameMode, TierLevel, Player } from '@/services/playerService';
import { Trophy } from 'lucide-react';
import { GAMEMODES, TIER_LEVELS } from '@/lib/constants';

const SubmitResultsForm = () => {
  const { submitPlayerResults } = useAdminPanel();
  const [formData, setFormData] = useState({
    ign: '',
    java_username: '',
    region: 'NA' as Player['region'],
    device: 'PC' as Player['device'],
    tiers: GAMEMODES.reduce((acc, gm) => ({ ...acc, [gm.name]: 'Not Ranked' }), {} as Record<GameMode, TierLevel>),
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTierChange = (gamemode: GameMode, tier: TierLevel) => {
    setFormData(prev => ({
      ...prev,
      tiers: {
        ...prev.tiers,
        [gamemode]: tier,
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPlayerResults(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#1A1B2A] p-8 rounded-lg border border-gray-700 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-center text-white">Submit Player Results</h2>
        <p className="text-center text-gray-400">Add or update player tier rankings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <Label htmlFor="ign" className="text-white">Player IGN *</Label>
          <Input id="ign" placeholder="Minecraft username" value={formData.ign} onChange={e => handleInputChange('ign', e.target.value)} className="bg-gray-900 border-gray-700 text-white mt-2" required />
        </div>
        <div>
          <Label htmlFor="java_username" className="text-white">Java Username</Label>
          <Input id="java_username" placeholder="For avatar lookup" value={formData.java_username} onChange={e => handleInputChange('java_username', e.target.value)} className="bg-gray-900 border-gray-700 text-white mt-2" />
        </div>
        <div>
          <Label htmlFor="region" className="text-white">Region *</Label>
          <Select value={formData.region} onValueChange={value => handleInputChange('region', value)}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="NA">North America</SelectItem>
              <SelectItem value="EU">Europe</SelectItem>
              <SelectItem value="ASIA">Asia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="device" className="text-white">Device</Label>
          <Select value={formData.device} onValueChange={value => handleInputChange('device', value)}>
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white mt-2"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PC">PC</SelectItem>
              <SelectItem value="Mobile">Mobile</SelectItem>
              <SelectItem value="Console">Console</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-center text-white mb-6">Tier Rankings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {GAMEMODES.map(({ name, icon: Icon }) => (
            <div key={name}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-gray-400" />
                <Label className="text-white font-semibold">{name}</Label>
              </div>
              <Select value={formData.tiers[name]} onValueChange={value => handleTierChange(name, value as TierLevel)}>
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIER_LEVELS.map(tier => <SelectItem key={tier} value={tier}>{tier}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button type="submit" size="lg" className="bg-white text-black font-bold hover:bg-gray-200 w-full max-w-sm">
          <Trophy className="w-5 h-5 mr-2" />
          Submit Player Results
        </Button>
      </div>
    </form>
  );
};

export default SubmitResultsForm;
