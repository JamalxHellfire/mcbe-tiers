
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Upload, RefreshCw } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { playerService } from '@/services/playerService';

const MassRegistrationForm: React.FC = () => {
  const [playersList, setPlayersList] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStats, setProcessingStats] = useState<{
    total: number;
    processed: number;
    success: number;
    failed: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playersList.trim()) {
      toast.error('Please enter player data');
      return;
    }
    
    setIsProcessing(true);
    setProcessingStats({
      total: 0,
      processed: 0,
      success: 0,
      failed: 0
    });
    
    try {
      // Execute the mass registration
      const result = await playerService.massCreatePlayers(
        playersList
          .trim()
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => {
            const [ign, javaUsername] = line.split(',').map(part => part.trim());
            return {
              ign,
              java_username: javaUsername || undefined
            };
          })
      );
      
      // Log activity
      adminService.logAdminActivity(`Mass registered ${result} players`);
      
      toast.success(`Successfully registered ${result} players`);
      setProcessingStats({
        total: result,
        processed: result,
        success: result,
        failed: 0
      });
      
      // Clear form if successful
      if (result > 0) {
        setPlayersList('');
      }
    } catch (error) {
      console.error('Mass registration error:', error);
      toast.error('Failed to register players');
      setProcessingStats(prev => prev ? {
        ...prev,
        failed: prev.total - prev.success
      } : null);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const clearForm = () => {
    setPlayersList('');
    setProcessingStats(null);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Mass Player Registration</h2>
        <Button variant="outline" size="sm" onClick={clearForm}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
      
      <div className="p-4 bg-muted/40 rounded-md">
        <p className="text-sm text-muted-foreground mb-2">
          Enter each player on a new line using the format: <strong>IGN,JavaUsername</strong> (JavaUsername is optional)
        </p>
        <p className="text-xs text-muted-foreground">
          Example:<br />
          PlayerOne,JavaPlayerOne<br />
          PlayerTwo<br />
          PlayerThree,JavaPlayerThree
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Textarea
          value={playersList}
          onChange={(e) => setPlayersList(e.target.value)}
          placeholder="Enter players list here..."
          className="min-h-[200px] font-mono text-sm"
        />
        
        {processingStats && (
          <div className="mt-4 p-3 bg-muted/30 rounded-md">
            <div className="text-sm">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="font-medium">Total</div>
                  <div>{processingStats.total}</div>
                </div>
                <div>
                  <div className="font-medium">Processed</div>
                  <div>{processingStats.processed}</div>
                </div>
                <div>
                  <div className="font-medium text-green-600">Success</div>
                  <div>{processingStats.success}</div>
                </div>
                <div>
                  <div className="font-medium text-red-600">Failed</div>
                  <div>{processingStats.failed}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Register Players
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MassRegistrationForm;
