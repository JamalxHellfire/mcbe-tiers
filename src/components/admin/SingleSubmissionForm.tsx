
import React, { useState, useEffect } from 'react';
import { playerService, GameMode, TierLevel, PlayerRegion, DeviceType } from '@/services/playerService';
import { usePlayerSearch } from '@/hooks/usePlayerSearch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, Copy, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';

const gamemodes: GameMode[] = ['SMP', 'Bedwars', 'Mace', 'Crystal', 'Sword', 'UHC', 'Axe', 'NethPot'];
const regions: PlayerRegion[] = ['NA', 'EU', 'ASIA', 'OCE'];
const devices: DeviceType[] = ['Mobile', 'PC', 'Console'];

// Tier mapping for display
const tierMapping: Record<TierLevel, { label: string, points: number }> = {
  'LT5': { label: 'Low Tier 5', points: 5 },
  'HT5': { label: 'High Tier 5', points: 10 },
  'LT4': { label: 'Low Tier 4', points: 15 },
  'HT4': { label: 'High Tier 4', points: 20 },
  'LT3': { label: 'Low Tier 3', points: 25 },
  'HT3': { label: 'High Tier 3', points: 30 },
  'LT2': { label: 'Low Tier 2', points: 35 },
  'HT2': { label: 'High Tier 2', points: 40 },
  'LT1': { label: 'Low Tier 1', points: 45 },
  'HT1': { label: 'High Tier 1', points: 50 }
};

const tiers = Object.entries(tierMapping).map(([key, value]) => ({
  value: key as TierLevel,
  label: value.label,
  points: value.points
}));

const SingleSubmissionForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    ign: '',
    gamemode: 'SMP' as GameMode,
    tier: 'LT5' as TierLevel,
    javaUsername: '',
    region: '' as PlayerRegion | '',
    device: '' as DeviceType | '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isPlayerComboOpen, setIsPlayerComboOpen] = useState<boolean>(false);
  
  // Player search functionality
  const playerSearch = usePlayerSearch();
  
  // Fill form with player data
  const fillFormWithPlayer = (player: any) => {
    if (!player) return;
    
    setFormData({
      ...formData,
      ign: player.ign,
      javaUsername: player.java_username || '',
      region: player.region as PlayerRegion || '',
      device: player.device as DeviceType || '',
    });
  };
  
  // Copy IGN to clipboard
  const handleCopyIGN = () => {
    if (!formData.ign) {
      toast.error('No IGN to copy');
      return;
    }
    
    navigator.clipboard.writeText(formData.ign)
      .then(() => toast.success(`Copied "${formData.ign}" to clipboard`))
      .catch(() => toast.error('Failed to copy IGN'));
  };
  
  // Form validation
  const validateForm = (): boolean => {
    if (!formData.ign.trim()) {
      toast.error('IGN (In-Game Name) is required');
      return false;
    }
    
    if (formData.ign.length > 16) {
      toast.error('IGN cannot be longer than 16 characters');
      return false;
    }
    
    // Check for special characters (only allow letters, numbers, and underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(formData.ign)) {
      toast.error('IGN can only contain letters, numbers, and underscores');
      return false;
    }
    
    return true;
  };
  
  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await playerService.submitPlayerResult(
        formData.ign,
        formData.gamemode,
        formData.tier,
        {
          javaUsername: formData.javaUsername || undefined,
          region: formData.region as PlayerRegion || undefined,
          device: formData.device as DeviceType || undefined,
          notes: formData.notes
        }
      );
      
      if (success) {
        // Log admin activity
        adminService.logAdminActivity(
          `Assigned ${formData.ign} to ${formData.tier} in ${formData.gamemode}`
        );
        
        toast.success(`Successfully submitted result for ${formData.ign}`);
        
        // Reset form
        setFormData({
          ign: '',
          gamemode: 'SMP' as GameMode,
          tier: 'LT5' as TierLevel,
          javaUsername: '',
          region: '' as PlayerRegion | '',
          device: '' as DeviceType | '',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Update form data
  const updateFormData = (key: string, value: any) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit New Match Result</CardTitle>
        <CardDescription>
          Submit or update a player's tier and information in a specific gamemode
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* IGN Field with Player Search and Copy button */}
        <div className="space-y-2">
          <Label htmlFor="ign">IGN (In-Game Name) *</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Popover open={isPlayerComboOpen} onOpenChange={setIsPlayerComboOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isPlayerComboOpen}
                    className="w-full justify-between"
                  >
                    {formData.ign || "Search for a player..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search players..."
                      value={playerSearch.searchTerm}
                      onValueChange={playerSearch.setSearchTerm}
                    />
                    <CommandList>
                      <CommandEmpty>No players found</CommandEmpty>
                      <CommandGroup>
                        {playerSearch.loading ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          playerSearch.players.map((player) => (
                            <CommandItem
                              key={player.id}
                              value={player.ign}
                              onSelect={() => {
                                fillFormWithPlayer(player);
                                setIsPlayerComboOpen(false);
                              }}
                            >
                              <div className="flex items-center">
                                {player.avatar_url && (
                                  <img 
                                    src={player.avatar_url} 
                                    alt={player.ign}
                                    className="h-6 w-6 mr-2 rounded"
                                  />
                                )}
                                <span>{player.ign}</span>
                              </div>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  formData.ign === player.ign ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Button variant="outline" size="icon" onClick={handleCopyIGN} disabled={!formData.ign}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy IGN</span>
            </Button>
          </div>
          <Input
            id="ign"
            placeholder="Enter IGN"
            value={formData.ign}
            onChange={(e) => updateFormData('ign', e.target.value)}
            className="mt-2"
            maxLength={16}
          />
          <p className="text-xs text-muted-foreground">
            Max 16 characters, no special characters
          </p>
        </div>

        {/* Gamemode Selector */}
        <div className="space-y-2">
          <Label htmlFor="gamemode">Gamemode *</Label>
          <Select
            value={formData.gamemode}
            onValueChange={(value) => updateFormData('gamemode', value as GameMode)}
          >
            <SelectTrigger id="gamemode">
              <SelectValue placeholder="Select Gamemode" />
            </SelectTrigger>
            <SelectContent>
              {gamemodes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tier Selector */}
        <div className="space-y-2">
          <Label htmlFor="tier">Tier *</Label>
          <Select
            value={formData.tier}
            onValueChange={(value) => updateFormData('tier', value as TierLevel)}
          >
            <SelectTrigger id="tier">
              <SelectValue placeholder="Select Tier" />
            </SelectTrigger>
            <SelectContent>
              {tiers.map((tier) => (
                <SelectItem key={tier.value} value={tier.value}>
                  {tier.label} ({tier.points} points)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Optional Fields Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Java Username */}
          <div className="space-y-2">
            <Label htmlFor="javaUsername">Java Username (Optional)</Label>
            <Input
              id="javaUsername"
              placeholder="Java Username for Avatar"
              value={formData.javaUsername || ''}
              onChange={(e) => updateFormData('javaUsername', e.target.value)}
            />
          </div>

          {/* Region Selector */}
          <div className="space-y-2">
            <Label htmlFor="region">Region (Optional)</Label>
            <Select
              value={formData.region || ''}
              onValueChange={(value) => updateFormData('region', value as PlayerRegion)}
            >
              <SelectTrigger id="region">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Device Type */}
          <div className="space-y-2">
            <Label htmlFor="device">Device (Optional)</Label>
            <Select
              value={formData.device || ''}
              onValueChange={(value) => updateFormData('device', value as DeviceType)}
            >
              <SelectTrigger id="device">
                <SelectValue placeholder="Select Device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {devices.map((device) => (
                  <SelectItem key={device} value={device}>
                    {device}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes Field */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Additional notes (max 300 characters)"
            value={formData.notes || ''}
            onChange={(e) => updateFormData('notes', e.target.value)}
            maxLength={300}
            rows={3}
          />
          <div className="text-xs text-right text-muted-foreground">
            {(formData.notes?.length || 0)}/300
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          className="w-full" 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : "Submit Result"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SingleSubmissionForm;
