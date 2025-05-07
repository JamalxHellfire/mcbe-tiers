
import React, { useState } from 'react';
import { useAdminSubmissionForm } from '@/hooks/useAdminSubmissionForm';
import { GameMode, TierLevel, PlayerRegion, DeviceType } from '@/services/playerService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

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

const AdminSubmissionForm = () => {
  const {
    formData,
    bulkFormData,
    isSubmitting,
    bulkSubmitting,
    updateFormData,
    updateBulkFormData,
    handleSubmit,
    handleBulkSubmit,
    playerSearch,
    fillFormWithPlayer
  } = useAdminSubmissionForm();
  
  const [isPlayerComboOpen, setIsPlayerComboOpen] = useState(false);

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="single">Single Submission</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Submission</TabsTrigger>
        </TabsList>
        
        {/* Single Player Submission Tab */}
        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>Submit Player Result</CardTitle>
              <CardDescription>
                Submit or update a player's tier and information in a specific gamemode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* IGN Field with Player Search */}
              <div className="space-y-2">
                <Label htmlFor="ign">IGN (In-Game Name) *</Label>
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
                          {playerSearch.players.map((player) => (
                            <CommandItem
                              key={player.id}
                              value={player.ign}
                              onSelect={() => {
                                fillFormWithPlayer(player);
                                setIsPlayerComboOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.ign === player.ign ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {player.ign}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </TabsContent>
        
        {/* Bulk Submission Tab */}
        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Submission</CardTitle>
              <CardDescription>
                Submit tier results for multiple players at once
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Player IGNs List */}
              <div className="space-y-2">
                <Label htmlFor="igns">Player IGNs (One per line) *</Label>
                <Textarea
                  id="igns"
                  placeholder="Enter player IGNs, one per line"
                  value={bulkFormData.igns}
                  onChange={(e) => updateBulkFormData('igns', e.target.value)}
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  Enter each player IGN on a new line. Paste from spreadsheet or CSV.
                </p>
              </div>

              {/* Bulk Gamemode and Tier Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gamemode Selector */}
                <div className="space-y-2">
                  <Label htmlFor="bulk-gamemode">Gamemode *</Label>
                  <Select
                    value={bulkFormData.gamemode}
                    onValueChange={(value) => updateBulkFormData('gamemode', value as GameMode)}
                  >
                    <SelectTrigger id="bulk-gamemode">
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
                  <Label htmlFor="bulk-tier">Tier *</Label>
                  <Select
                    value={bulkFormData.tier}
                    onValueChange={(value) => updateBulkFormData('tier', value as TierLevel)}
                  >
                    <SelectTrigger id="bulk-tier">
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
              </div>

              {/* Region Selector (Optional for bulk) */}
              <div className="space-y-2">
                <Label htmlFor="bulk-region">Region (Optional - Applied to all)</Label>
                <Select
                  value={bulkFormData.region || ''}
                  onValueChange={(value) => updateBulkFormData('region', value as PlayerRegion)}
                >
                  <SelectTrigger id="bulk-region">
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

              {/* Submit Button */}
              <Button 
                className="w-full" 
                onClick={handleBulkSubmit}
                disabled={bulkSubmitting}
              >
                {bulkSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : "Submit Bulk Results"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSubmissionForm;
