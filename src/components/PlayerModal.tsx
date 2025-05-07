
import React from 'react';
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

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: any;
}

export function PlayerModal({ isOpen, onClose, player }: PlayerModalProps) {
  // Function to get device icon
  const getDeviceIcon = (device: string) => {
    switch(device) {
      case 'PC': return <Monitor size={16} className="mr-1" />;
      case 'Mobile': return <Smartphone size={16} className="mr-1" />;
      case 'Console': return <Gamepad size={16} className="mr-1" />;
      default: return <Monitor size={16} className="mr-1" />;
    }
  };
  
  // Mock tiers data for different game modes
  const gameModes = [
    { mode: 'Crystal', tier: Math.ceil(Math.random() * 5), subtier: Math.random() > 0.5 ? 'High' : 'Low' },
    { mode: 'Sword', tier: Math.ceil(Math.random() * 5), subtier: Math.random() > 0.5 ? 'High' : 'Low' },
    { mode: 'SMP', tier: Math.ceil(Math.random() * 5), subtier: Math.random() > 0.5 ? 'High' : 'Low' },
    { mode: 'UHC', tier: Math.ceil(Math.random() * 5), subtier: Math.random() > 0.5 ? 'High' : 'Low' },
    { mode: 'Axe', tier: Math.ceil(Math.random() * 5), subtier: Math.random() > 0.5 ? 'High' : 'Low' },
    { mode: 'NethPot', tier: Math.ceil(Math.random() * 5), subtier: Math.random() > 0.5 ? 'High' : 'Low' },
    { mode: 'Bedwars', tier: Math.ceil(Math.random() * 5), subtier: Math.random() > 0.5 ? 'High' : 'Low' },
    { mode: 'Mace', tier: Math.ceil(Math.random() * 5), subtier: Math.random() > 0.5 ? 'High' : 'Low' },
  ];
  
  // Determine badge based on rank/points
  const getBadge = () => {
    const position = player.position || Math.ceil(Math.random() * 100); // Fallback to random position
    
    if (position <= 5) return { name: 'Combat Master', color: 'text-yellow-400' };
    if (position <= 20) return { name: 'Combat Ace', color: 'text-orange-400' };
    if (position <= 50) return { name: 'Combat Cadet', color: 'text-purple-400' };
    return { name: 'Combat Rookie', color: 'text-blue-400' };
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
          
          <div className="flex flex-col items-center pt-2">
            <Avatar className="h-24 w-24 border-4 border-white/10">
              <AvatarImage src={player.avatar} alt={player.name} />
              <AvatarFallback>{player.name?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-bold mt-3">{player.displayName || player.name}</h2>
            
            <div className="flex items-center mt-1 space-x-2">
              <span className={cn(
                "text-sm px-2 py-0.5 rounded-full",
                player.region === 'NA' ? 'bg-red-900/30 text-red-400' : 
                player.region === 'EU' ? 'bg-green-900/30 text-green-400' :
                player.region === 'ASIA' ? 'bg-blue-900/30 text-blue-400' : 
                'bg-purple-900/30 text-purple-400'
              )}>
                {player.region}
              </span>
              
              <span className="text-white/60 text-sm flex items-center">
                <Trophy size={14} className="mr-1 text-yellow-400" />
                {player.points || 0} points
              </span>
            </div>
            
            <div className="mt-1 flex items-center">
              <Award size={16} className={cn("mr-1", badge.color)} />
              <span className={cn("text-sm font-medium", badge.color)}>
                {badge.name}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/5 rounded-lg p-3 flex flex-col">
              <span className="text-xs text-white/40">Rank</span>
              <span className="text-lg font-bold">#{player.position || '?'}</span>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 flex flex-col">
              <span className="text-xs text-white/40">Device</span>
              <span className="text-lg font-bold flex items-center">
                {getDeviceIcon(player.device || 'PC')}
                {player.device || 'PC'}
              </span>
            </div>
          </div>
          
          <div className="mt-5">
            <h3 className="text-md font-medium mb-3">Gamemode Rankings</h3>
            <div className="grid grid-cols-2 gap-3">
              {gameModes.map((modeData, index) => (
                <motion.div 
                  key={modeData.mode}
                  className="bg-white/5 p-3 rounded flex items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="text-sm">{modeData.mode}</span>
                  <div className="flex flex-col items-end">
                    <span className={cn(
                      "text-sm font-bold",
                      `text-tier-${modeData.tier}`
                    )}>
                      T{modeData.tier}
                    </span>
                    <span className="text-xs text-white/50">
                      {modeData.subtier}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
