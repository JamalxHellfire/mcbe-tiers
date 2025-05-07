
import React, { useState } from 'react';
import { playerService } from '@/services/playerService';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const AdminTools: React.FC = () => {
  const [fakePlayers, setFakePlayers] = useState<number>(100);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isWiping, setIsWiping] = useState<boolean>(false);
  const [wipeConfirmation, setWipeConfirmation] = useState<string>('');

  // Generate fake players for testing
  const handleGenerateFakePlayers = async () => {
    if (fakePlayers <= 0 || fakePlayers > 1000) {
      toast.error('Please enter a number between 1 and 1000');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const count = await playerService.generateFakePlayers(fakePlayers);
      
      if (count > 0) {
        // Log admin activity
        adminService.logAdminActivity(
          `Generated ${count} fake players for testing`
        );
        
        toast.success(`Generated ${count} fake players for testing`);
      } else {
        toast.error('Failed to generate fake players');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate fake players');
    } finally {
      setIsGenerating(false);
    }
  };

  // Wipe all data (danger zone)
  const handleWipeData = async () => {
    if (wipeConfirmation !== 'WIPE ALL DATA') {
      toast.error('Please enter the confirmation text exactly as shown');
      return;
    }
    
    setIsWiping(true);
    
    try {
      const success = await playerService.wipeAllData();
      
      if (success) {
        // Log admin activity
        adminService.logAdminActivity(
          'Wiped all data from the database'
        );
        
        setWipeConfirmation('');
        toast.success('All data has been wiped successfully');
      } else {
        toast.error('Failed to wipe data');
      }
    } catch (error) {
      console.error('Wipe error:', error);
      toast.error('Failed to wipe data');
    } finally {
      setIsWiping(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Fake Players Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Fake Players</CardTitle>
          <CardDescription>
            Create random players with random tiers for testing purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="fake-players">Number of Players</Label>
              <Input
                id="fake-players"
                type="number"
                value={fakePlayers}
                onChange={(e) => setFakePlayers(parseInt(e.target.value) || 100)}
                min="1"
                max="1000"
              />
              <p className="text-xs text-muted-foreground">
                Generate 1-1000 players with random tiers
              </p>
            </div>
            <Button
              onClick={handleGenerateFakePlayers}
              disabled={isGenerating}
              className="mt-8"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Players'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Wipe (Dangerous) */}
      <Card className="border-destructive">
        <CardHeader className="text-destructive">
          <CardTitle className="flex gap-2 items-center">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-destructive/80">
            These actions cannot be undone. Be very careful.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-destructive/10 p-4">
            <h3 className="font-semibold text-destructive mb-2">
              Wipe All Data
            </h3>
            <p className="text-sm mb-4 text-destructive/90">
              This will permanently delete all players and scores from the
              database. Type "WIPE ALL DATA" to confirm.
            </p>
            <div className="flex items-center gap-4">
              <Input
                value={wipeConfirmation}
                onChange={(e) => setWipeConfirmation(e.target.value)}
                placeholder="WIPE ALL DATA"
                className="border-destructive/50 focus-visible:ring-destructive"
              />
              <Button
                variant="destructive"
                onClick={handleWipeData}
                disabled={isWiping || wipeConfirmation !== 'WIPE ALL DATA'}
              >
                {isWiping ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wiping...
                  </>
                ) : (
                  'Wipe All Data'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-destructive/5 border-t border-destructive/20 text-xs text-destructive/70 px-4 py-2">
          Warning: This action bypasses all safety measures and permanently deletes all data.
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminTools;
