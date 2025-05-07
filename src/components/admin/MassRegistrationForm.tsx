
import React, { useState } from 'react';
import { playerService } from '@/services/playerService';
import { adminService } from '@/services/adminService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, FileSpreadsheet, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const MassRegistrationForm: React.FC = () => {
  const [playersData, setPlayersData] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  // Import CSV/Text data
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        if (content) {
          setPlayersData(content);
          toast.success('File imported successfully');
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
  const validateData = (): boolean => {
    if (!playersData.trim()) {
      toast.error('Please enter player data');
      return false;
    }
    
    return true;
  };

  // Form submission
  const handleRegister = async () => {
    if (!validateData()) return;
    
    setIsRegistering(true);
    
    try {
      const count = await playerService.massRegisterPlayers(playersData);
      
      if (count > 0) {
        // Log admin activity
        adminService.logAdminActivity(
          `Mass registered ${count} players`
        );
        
        // Clear form
        setPlayersData('');
        
        toast.success(`Successfully registered ${count} players`);
      } else {
        toast.error('Failed to register any players');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register players');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mass Player Registration</CardTitle>
        <CardDescription>
          Register multiple players at once using a CSV-style format.
          Format: IGN,JavaUsername (optional)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Import */}
        <div className="space-y-2">
          <Label>Import from File</Label>
          <div className="flex gap-2">
            <input 
              type="file" 
              accept=".csv,.txt" 
              onChange={handleImport}
              className="hidden"
              id="register-file-import"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('register-file-import')?.click()}
              className="w-full flex gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Import CSV/TXT File
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Import a CSV or text file with format: IGN,JavaUsername
          </p>
        </div>

        {/* Player Data Textarea */}
        <div className="space-y-2">
          <Label htmlFor="players-data">Players Data</Label>
          <Textarea
            id="players-data"
            placeholder="Player1,JavaUsername1&#10;Player2,JavaUsername2&#10;Player3"
            value={playersData}
            onChange={(e) => setPlayersData(e.target.value)}
            rows={12}
          />
          <p className="text-xs text-muted-foreground">
            Enter players in format: IGN,JavaUsername (JavaUsername is optional)
          </p>
        </div>

        {/* Register Button */}
        <Button 
          onClick={handleRegister}
          disabled={isRegistering || !playersData.trim()} 
          className="w-full flex gap-2"
        >
          {isRegistering ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              Register Players
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MassRegistrationForm;
