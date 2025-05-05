
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Monitor, Smartphone, Gamepad } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  
  // Mock tiers data
  const tiers = [
    { mode: 'Overall', tier: player.tier || parseInt(player.tiers?.replace('T', '')) || 1 },
    { mode: 'Crystal', tier: Math.ceil(Math.random() * 5) },
    { mode: 'Sword', tier: Math.ceil(Math.random() * 5) },
    { mode: 'Axe', tier: Math.ceil(Math.random() * 5) },
    { mode: 'Mace', tier: Math.ceil(Math.random() * 5) },
    { mode: 'Bedwars', tier: Math.ceil(Math.random() * 5) },
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0B0B0F] border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Player Profile</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center pt-2">
          <Avatar className="h-24 w-24 border-2 border-white/20">
            <AvatarImage src={player.avatar} alt={player.name} />
            <AvatarFallback>{player.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold mt-3">{player.displayName || player.name}</h2>
          
          <div className="flex items-center mt-1">
            <span className={cn(
              "text-sm px-2 py-0.5 rounded-full",
              player.region === 'NA' ? 'bg-red-900/30 text-red-400' : 
              player.region === 'EU' ? 'bg-green-900/30 text-green-400' :
              player.region === 'ASIA' ? 'bg-blue-900/30 text-blue-400' : 
              'bg-purple-900/30 text-purple-400'
            )}>
              {player.region}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
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
          
          <div className="bg-white/5 rounded-lg p-3 flex flex-col">
            <span className="text-xs text-white/40">Points</span>
            <span className="text-lg font-bold flex items-center">
              <Trophy size={16} className="mr-1 text-yellow-500" />
              {player.points}
            </span>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 flex flex-col">
            <span className="text-xs text-white/40">Badge</span>
            <span className="text-lg font-bold">{player.badge}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Tier Rankings</h3>
          <div className="grid grid-cols-2 gap-2">
            {tiers.map((tierData, index) => (
              <div key={index} className="bg-white/5 p-2 rounded flex items-center justify-between">
                <span className="text-sm">{tierData.mode}</span>
                <span className={cn(
                  "text-sm font-bold",
                  `text-tier-${tierData.tier}`
                )}>
                  Tier {tierData.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
