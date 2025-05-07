
import React, { useState } from 'react';
import { GameMode, TierLevel, PlayerRegion, playerService } from '@/services/playerService';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, FileSpreadsheet, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

const gamemodes: GameMode[] = ['SMP', 'Bedwars', 'Mace', 'Crystal', 'Sword', 'UHC', 'Axe', 'NethPot'];
const regions: PlayerRegion[] = ['NA', 'EU', 'ASIA', 'OCE'];

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

const BulkSubmissionForm: React.FC = () => {
  // Form state
  const [bulkData, setBulkData] = useState({
    igns: '',
    gamemode: 'SMP' as GameMode,
    tier: 'LT5' as TierLevel,
    region: '' as PlayerRegion | '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Update form data
  const updateFormData = (key: string, value: any) => {
    setBulkData({
      ...bulkData,
      [key]: value
    });
  };

  // Import CSV/Text data
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        if (content) {
          // Extract player IGNs from the content
          const lines = content.split(/\r?\n/).filter(line => line.trim());
          
          // Parse for IGNs (simple CSV format - take first column)
          const ignList = lines.map(line => {
            const columns = line.split(',');
            return columns[0]?.trim() || '';
          }).filter(ign => ign !== '');
          
          if (ignList.length === 0) {
            toast.error('No valid IGNs found in the file');
            return;
          }
          
          setBulkData({
            ...bulkData,
            igns: ignList.join('\n')
          });
          
          toast.success(`Imported ${ignList.length} IGNs from file`);
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to parse the imported file');
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    e.target.value = '';
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!bulkData.igns.trim()) {
      toast.error('Please enter at least one IGN');
      return false;
    }
    
    // Check each IGN in the bulk list
    const igns = bulkData.igns
      .split('\n')
      .map(ign => ign.trim())
      .filter(ign => ign !== '');
    
    if (igns.length === 0) {
      toast.error('Please enter at least one valid IGN');
      return false;
    }
    
    for (const ign of igns) {
      if (ign.length > 16) {
        toast.error(`IGN "${ign}" is too long (max 16 characters)`);
        return false;
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(ign)) {
        toast.error(`IGN "${ign}" contains invalid characters`);
        return false;
      }
    }
    
    return true;
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const igns = bulkData.igns
        .split('\n')
        .map(ign => ign.trim())
        .filter(ign => ign !== '');
      
      const submissionData = igns.map(ign => ({
        ign,
        gamemode: bulkData.gamemode,
        tier: bulkData.tier,
        region: bulkData.region as PlayerRegion || undefined
      }));
      
      const results = await playerService.bulkSubmitResults(submissionData);
      
      // Log admin activity
      adminService.logAdminActivity(
        `Bulk submitted ${results.success} players to ${bulkData.tier} in ${bulkData.gamemode}`
      );
      
      toast.success(`Bulk submission complete: ${results.success} succeeded, ${results.failed} failed`);
      
      if (results.success > 0) {
        // Reset form if at least one submission succeeded
        setBulkData({
          ...bulkData,
          igns: '',
        });
      }
    } catch (error) {
      console.error('Bulk submission error:', error);
      toast.error('Failed to process bulk submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mass Result Submission</CardTitle>
        <CardDescription>
          Submit tier results for multiple players at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input (Hidden but accessible via button) */}
        <div className="space-y-2">
          <Label>Import from File</Label>
          <div className="flex gap-2">
            <input 
              type="file" 
              accept=".csv,.txt" 
              onChange={handleImport}
              className="hidden"
              id="bulk-file-import"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('bulk-file-import')?.click()}
              className="w-full flex gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Import CSV/TXT File
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Import a CSV or text file with one IGN per line or in the first column
          </p>
        </div>

        {/* Player IGNs List */}
        <div className="space-y-2">
          <Label htmlFor="igns">Player IGNs (One per line) *</Label>
          <Textarea
            id="igns"
            placeholder="Enter player IGNs, one per line"
            value={bulkData.igns}
            onChange={(e) => updateFormData('igns', e.target.value)}
            rows={8}
          />
          <p className="text-xs text-muted-foreground">
            Enter each player IGN on a new line. Paste from spreadsheet or CSV.
          </p>
        </div>

        {/* Bulk Gamemode and Tier Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Gamemode Selector */}
          <div className="space-y-2">
            <Label htmlFor="bulk-gamemode">Gamemode *</Label>
            <Select
              value={bulkData.gamemode}
              onValueChange={(value) => updateFormData('gamemode', value as GameMode)}
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
              value={bulkData.tier}
              onValueChange={(value) => updateFormData('tier', value as TierLevel)}
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

          {/* Region Selector */}
          <div className="space-y-2">
            <Label htmlFor="bulk-region">Region (Optional)</Label>
            <Select
              value={bulkData.region || ''}
              onValueChange={(value) => updateFormData('region', value as PlayerRegion)}
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
        </div>

        {/* Submit Button */}
        <Button 
          className="w-full flex gap-2" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              Submit Bulk Results
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkSubmissionForm;
