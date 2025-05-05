
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Monitor, Smartphone, Gamepad, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Player, GamemodeScore } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { fetchPlayerWithGamemodeScores } from '@/api/supabase';
import { toast } from 'sonner';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: {
    id: string;
    gamemode?: string; // Optional - if provided, will highlight this gamemode
  };
}

export function PlayerModal({ isOpen, onClose, player }: PlayerModalProps) {
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [gamemodeScores, setGamemodeScores] = useState<GamemodeScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!isOpen || !player.id) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { player: fetchedPlayer, scores } = await fetchPlayerWithGamemodeScores(player.id);
        setPlayerData(fetchedPlayer);
        setGamemodeScores(scores);
      } catch (error) {
        console.error("Error fetching player details:", error);
        toast.error("Failed to load player details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isOpen, player.id]);
  
  // Function to get device icon
  const getDeviceIcon = (device: string | undefined) => {
    switch(device) {
      case 'PC': return <Monitor size={16} className="mr-1" />;
      case 'Mobile': return <Smartphone size={16} className="mr-1" />;
      case 'Console': return <Gamepad size={16} className="mr-1" />;
      default: return <Monitor size={16} className="mr-1" />;
    }
  };
  
  // Determine badge based on global points
  const getBadge = () => {
    if (!playerData) return { name: 'Loading...', color: 'text-white/60' };
    
    const points = playerData.global_points || 0;
    const rank = points > 0 ? Math.floor(1000 / (points + 10)) : 999; // Mock calculation
    
    if (points > 300) return { name: 'Combat Master', color: 'text-yellow-400', rank };
    if (points > 200) return { name: 'Combat Ace', color: 'text-orange-400', rank };
    if (points > 100) return { name: 'Combat Cadet', color: 'text-purple-400', rank };
    return { name: 'Combat Rookie', color: 'text-blue-400', rank };
  };
  
  const badge = getBadge();
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0B0B0F] border-white/10 max-w-md">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={modalVariants}
          className="animate-fade-in"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Player Profile</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="py-8 flex flex-col items-center space-y-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2 w-full max-w-[200px]">
                <Skeleton className="h-6 w-full mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded" />
                ))}
              </div>
            </div>
          ) : playerData ? (
            <div className="flex flex-col items-center pt-2">
              <Avatar className="h-24 w-24 border-4 border-white/10">
                <AvatarImage 
                  src={playerData.avatar_url || `https://crafthead.net/avatar/${playerData.ign}`} 
                  alt={playerData.ign} 
                />
                <AvatarFallback>{playerData.ign?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-bold mt-3">{playerData.ign}</h2>
              
              <div className="flex items-center mt-1 space-x-2">
                <span className={cn(
                  "text-sm px-2 py-0.5 rounded-full",
                  playerData.region === 'NA' ? 'bg-red-900/30 text-red-400' : 
                  playerData.region === 'EU' ? 'bg-green-900/30 text-green-400' :
                  playerData.region === 'ASIA' ? 'bg-blue-900/30 text-blue-400' : 
                  'bg-purple-900/30 text-purple-400'
                )}>
                  {playerData.region || 'Unknown'}
                </span>
                
                <motion.span 
                  className="text-white/60 text-sm flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Trophy size={14} className="mr-1 text-yellow-400" />
                  {playerData.global_points || 0} points
                </motion.span>
              </div>
              
              <div className="mt-2 flex items-center">
                <motion.div
                  className="flex items-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <Award size={16} className={cn("mr-1", badge.color)} />
                  <span className={cn("text-sm font-medium", badge.color)}>
                    {badge.name}
                  </span>
                  <motion.span
                    className="ml-2 text-xs bg-yellow-600/20 text-yellow-400 px-1.5 rounded-sm flex items-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <Trophy size={10} className="mr-0.5" />
                    #{badge.rank}
                  </motion.span>
                </motion.div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                <motion.div 
                  className="bg-white/5 rounded-lg p-3 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-xs text-white/40">Global Rank</span>
                  <span className="text-lg font-bold">#{badge.rank}</span>
                </motion.div>
                
                <motion.div 
                  className="bg-white/5 rounded-lg p-3 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-xs text-white/40">Device</span>
                  <span className="text-lg font-bold flex items-center">
                    {getDeviceIcon(playerData.device)}
                    {playerData.device || 'PC'}
                  </span>
                </motion.div>
              </div>
              
              <div className="mt-5 w-full">
                <h3 className="text-md font-medium mb-3">Gamemode Rankings</h3>
                <div className="grid grid-cols-2 gap-3">
                  {gamemodeScores.length > 0 ? (
                    gamemodeScores.map((score, index) => (
                      <motion.div 
                        key={score.id}
                        className={cn(
                          "p-3 rounded flex items-center justify-between",
                          player.gamemode === score.gamemode ? "bg-blue-900/20 border border-blue-500/20" : "bg-white/5"
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                      >
                        <span className="text-sm">{score.gamemode}</span>
                        <div className="flex flex-col items-end">
                          <span className={cn(
                            "text-sm font-bold",
                            `text-tier-${score.display_tier.split(' ')[1]}`
                          )}>
                            {score.display_tier}
                          </span>
                          <span className="text-xs text-white/50">
                            {score.internal_tier}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-4 text-white/40">
                      No gamemode data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-red-400">
              Failed to load player details
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
