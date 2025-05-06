
import React, { useState, useEffect } from 'react';
import { fetchPlayers, fetchGamemodeScores, wipeAllPlayerData, generateDummyPlayers, registerPlayers } from '@/api/supabase';
import { Player, GamemodeScore } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Search, Trash, Database, Plus, Upload, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ResultSubmissionForm } from './ResultSubmissionForm';

export const PlayerManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [scores, setScores] = useState<GamemodeScore[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [massRegisterData, setMassRegisterData] = useState('');
  const [isProcessing, setIsProcessing] = useState({
    wipe: false,
    dummy: false,
    register: false
  });
  const [activeTab, setActiveTab] = useState('player-list');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [playersData, scoresData] = await Promise.all([
          fetchPlayers(),
          fetchGamemodeScores()
        ]);
        
        setPlayers(playersData);
        setScores(scoresData);
      } catch (error) {
        console.error('Error loading player data:', error);
        toast.error('Failed to load player data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Subscribe to realtime changes
    const playerSubscription = supabase
      .channel('player-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'players' 
      }, () => {
        loadData();
      })
      .subscribe();
      
    const scoresSubscription = supabase
      .channel('scores-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'gamemode_scores' 
      }, () => {
        loadData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(playerSubscription);
      supabase.removeChannel(scoresSubscription);
    };
  }, []);
  
  const filteredPlayers = searchQuery 
    ? players.filter(player => 
        player.ign.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : players;
  
  const handleWipeData = async () => {
    if (window.confirm('WARNING: This will delete ALL player data. This action cannot be undone. Continue?')) {
      setIsProcessing(prev => ({ ...prev, wipe: true }));
      try {
        await wipeAllPlayerData();
        setPlayers([]);
        setScores([]);
        toast.success('All player data has been wiped');
      } catch (error) {
        console.error('Error wiping data:', error);
        toast.error('Failed to wipe player data');
      } finally {
        setIsProcessing(prev => ({ ...prev, wipe: false }));
      }
    }
  };
  
  const handleGenerateDummies = async () => {
    setIsProcessing(prev => ({ ...prev, dummy: true }));
    try {
      await generateDummyPlayers(100);
      toast.success('Generated 100 dummy players');
      // Data will be refreshed via the realtime subscription
    } catch (error) {
      console.error('Error generating dummy data:', error);
      toast.error('Failed to generate dummy players');
    } finally {
      setIsProcessing(prev => ({ ...prev, dummy: false }));
    }
  };
  
  const handleMassRegister = async () => {
    if (!massRegisterData.trim()) {
      toast.error('Please enter player data');
      return;
    }
    
    setIsProcessing(prev => ({ ...prev, register: true }));
    try {
      const result = await registerPlayers(massRegisterData);
      toast.success(`Successfully registered ${result.success} players. Failed: ${result.failed}`);
      setMassRegisterData('');
      // Data will be refreshed via the realtime subscription
    } catch (error) {
      console.error('Error registering players:', error);
      toast.error('Failed to register players');
    } finally {
      setIsProcessing(prev => ({ ...prev, register: false }));
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="player-list" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-dark-surface/50">
          <TabsTrigger value="player-list">Player List</TabsTrigger>
          <TabsTrigger value="database-tools">Database Tools</TabsTrigger>
          <TabsTrigger value="result-submission">Result Submission</TabsTrigger>
        </TabsList>
        
        <TabsContent value="player-list" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Players Management</h2>
            
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-dark-surface/60 border-white/10"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-dark-surface/40">
                    <TableHead>IGN</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Global Points</TableHead>
                    <TableHead>Gamemodes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-white/60">
                        No players found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPlayers.map((player, i) => {
                      const playerScores = scores.filter(score => score.player_id === player.id);
                      
                      return (
                        <TableRow 
                          key={player.id}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          <TableCell className="font-semibold">
                            {player.ign}
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 text-xs rounded bg-opacity-20 text-white">
                              {player.region || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>{player.device || "N/A"}</TableCell>
                          <TableCell>{player.global_points || 0}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {playerScores.map((score) => (
                                <span 
                                  key={score.id} 
                                  className="px-2 py-0.5 text-xs rounded bg-blue-900/40 text-blue-300"
                                >
                                  {score.gamemode} ({score.internal_tier})
                                </span>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="database-tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wipe All Data */}
            <motion.div 
              className="bg-dark-surface/60 border border-white/10 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-900/30 p-2 rounded-lg">
                  <Trash className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-xl font-medium text-white">Wipe All Player Data</h3>
              </div>
              <p className="text-white/60 mb-4">
                This will delete ALL player data, including tiers, scores, and profiles. This action cannot be undone.
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleWipeData}
                disabled={isProcessing.wipe}
              >
                {isProcessing.wipe ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Wiping Data...
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Wipe All Player Data
                  </>
                )}
              </Button>
            </motion.div>

            {/* Generate Dummy Data */}
            <motion.div 
              className="bg-dark-surface/60 border border-white/10 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-900/30 p-2 rounded-lg">
                  <Database className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-medium text-white">Generate Dummy Players</h3>
              </div>
              <p className="text-white/60 mb-4">
                Create 100 dummy players with randomized data including IGNs, tiers, devices, and regions.
              </p>
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                onClick={handleGenerateDummies}
                disabled={isProcessing.dummy}
              >
                {isProcessing.dummy ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Players...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate 100 Dummy Players
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Mass Registration */}
          <motion.div 
            className="bg-dark-surface/60 border border-white/10 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-900/30 p-2 rounded-lg">
                <Upload className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-medium text-white">Mass Player Registration</h3>
            </div>
            <p className="text-white/60 mb-4">
              Register multiple players at once. Format: IGN, JavaUsername (one player per line)
            </p>
            <div className="space-y-4">
              <Textarea 
                placeholder="player1, java1&#10;player2, java2&#10;player3, java3"
                className="min-h-[150px] bg-dark-surface/40 border-white/10"
                value={massRegisterData}
                onChange={(e) => setMassRegisterData(e.target.value)}
              />
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500"
                onClick={handleMassRegister}
                disabled={isProcessing.register}
              >
                {isProcessing.register ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Registering Players...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Register Players
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="result-submission">
          <ResultSubmissionForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};
