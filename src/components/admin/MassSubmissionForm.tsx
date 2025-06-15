
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useAdminPanel } from '@/hooks/useAdminPanel';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { GameMode, TierLevel } from '@/services/playerService';
import { deepSeekService } from '@/services/deepSeekService';

interface BulkPlayerData {
  ign: string;
  region: string;
  device: string;
  java_username?: string;
  results: {
    gamemode: GameMode;
    tier: TierLevel;
    points: number;
  }[];
}

export const MassSubmissionForm: React.FC = () => {
  const [csvData, setCsvData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    successful: number;
    failed: number;
    errors: string[];
  }>({ successful: 0, failed: 0, errors: [] });

  const { submitPlayerResults } = useAdminPanel();
  const { toast } = useToast();

  const sampleFormat = `IGN,Region,Device,Java_Username,Crystal_Tier,Crystal_Points,Sword_Tier,Sword_Points,Mace_Tier,Mace_Points
PlayerOne,NA,PC,JavaUser1,HT1,50,LT2,35,Not Ranked,0
PlayerTwo,EU,Mobile,,HT2,40,HT3,30,LT1,45`;

  const parseCsvData = (csvText: string): BulkPlayerData[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const players: BulkPlayerData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < 4) continue;

      const player: BulkPlayerData = {
        ign: values[0],
        region: values[1] || 'NA',
        device: values[2] || 'PC',
        java_username: values[3] || undefined,
        results: []
      };

      // Parse gamemode results
      const gamemodes: GameMode[] = ['Crystal', 'Sword', 'Mace', 'Axe', 'SMP', 'UHC', 'NethPot', 'Bedwars'];
      gamemodes.forEach(gamemode => {
        const tierIndex = headers.findIndex(h => h.toLowerCase().includes(gamemode.toLowerCase()) && h.toLowerCase().includes('tier'));
        const pointsIndex = headers.findIndex(h => h.toLowerCase().includes(gamemode.toLowerCase()) && h.toLowerCase().includes('points'));
        
        if (tierIndex !== -1 && pointsIndex !== -1 && values[tierIndex] && values[pointsIndex]) {
          const tier = values[tierIndex] as TierLevel;
          const points = parseInt(values[pointsIndex]) || 0;
          
          if (tier !== 'Not Ranked') {
            player.results.push({ gamemode, tier, points });
          }
        }
      });

      if (player.ign) {
        players.push(player);
      }
    }

    return players;
  };

  const processBulkSubmission = async () => {
    if (!csvData.trim()) {
      toast({
        title: "Error",
        description: "Please enter CSV data to process",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setResults({ successful: 0, failed: 0, errors: [] });

    try {
      const players = parseCsvData(csvData);
      console.log(`Processing ${players.length} players for bulk submission`);
      deepSeekService.logApiCall('POST', '/admin/mass-submission', { playerCount: players.length });

      if (players.length === 0) {
        throw new Error('No valid player data found in CSV');
      }

      let successful = 0;
      let failed = 0;
      const errors: string[] = [];

      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        setProgress(((i + 1) / players.length) * 100);

        try {
          console.log(`Processing player ${i + 1}/${players.length}: ${player.ign}`);
          
          const result = await submitPlayerResults(
            player.ign,
            player.region,
            player.device,
            player.java_username,
            player.results
          );

          if (result?.success) {
            successful++;
            deepSeekService.logApiCall('POST', `/players/${player.ign}/submit`, player, result);
          } else {
            failed++;
            errors.push(`${player.ign}: ${result?.error || 'Unknown error'}`);
            deepSeekService.logError(new Error(result?.error || 'Submission failed'), { player });
          }
        } catch (error: any) {
          failed++;
          errors.push(`${player.ign}: ${error.message}`);
          deepSeekService.logError(error, { player });
        }

        // Small delay to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setResults({ successful, failed, errors });
      
      toast({
        title: "Bulk Submission Complete",
        description: `Successfully processed ${successful} players, ${failed} failed`,
        variant: successful > 0 ? "default" : "destructive"
      });

      console.log(`Bulk submission completed: ${successful} successful, ${failed} failed`);
    } catch (error: any) {
      console.error('Bulk submission error:', error);
      deepSeekService.logError(error, { csvDataLength: csvData.length });
      toast({
        title: "Bulk Submission Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Mass Player Submission
          </CardTitle>
          <CardDescription className="text-gray-400">
            Upload multiple player results at once using CSV format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CSV Data
            </label>
            <Textarea
              placeholder="Paste your CSV data here..."
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              className="min-h-[200px] bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400"
            />
          </div>

          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Sample Format
            </h4>
            <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre">
              {sampleFormat}
            </pre>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {results.successful > 0 || results.failed > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Successful</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{results.successful}</div>
                </div>
                <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Failed</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{results.failed}</div>
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Errors</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {results.errors.map((error, index) => (
                      <div key={index} className="text-xs text-gray-300">{error}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <Button
            onClick={processBulkSubmission}
            disabled={isProcessing || !csvData.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isProcessing ? 'Processing...' : 'Submit Bulk Data'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
