
import React, { useState, useEffect } from 'react';
import { wipeAllPlayerData, generateDummyPlayers, registerPlayers } from '@/api/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Trash, Database, Upload, RefreshCw } from 'lucide-react';

interface PlayerManagementProps {
  activeTab: "mass-register" | "database-tools";
}

export const PlayerManagement = ({ activeTab }: PlayerManagementProps) => {
  const [massRegisterData, setMassRegisterData] = useState('');
  const [isProcessing, setIsProcessing] = useState({
    wipe: false,
    dummy: false,
    register: false
  });

  const handleWipeData = async () => {
    if (window.confirm('WARNING: This will delete ALL player data. This action cannot be undone. Continue?')) {
      setIsProcessing(prev => ({ ...prev, wipe: true }));
      try {
        await wipeAllPlayerData();
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
    } catch (error) {
      console.error('Error registering players:', error);
      toast.error('Failed to register players');
    } finally {
      setIsProcessing(prev => ({ ...prev, register: false }));
    }
  };

  if (activeTab === "mass-register") {
    return (
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
            className="min-h-[200px] bg-dark-surface/40 border-white/10"
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
    );
  }

  if (activeTab === "database-tools") {
    return (
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
                <Database className="mr-2 h-4 w-4" />
                Generate 100 Dummy Players
              </>
            )}
          </Button>
        </motion.div>
      </div>
    );
  }

  return null;
};
