
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Trophy } from 'lucide-react';
import { Player, GameMode } from '@/services/playerService';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MinecraftPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
}

export const MinecraftPlayerModal: React.FC<MinecraftPlayerModalProps> = ({
  isOpen,
  onClose,
  player
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  useEffect(() => {
    if (player && isOpen) {
      // Use Visage Bust API for higher quality avatar
      setAvatarUrl(`https://visage.surgeplay.com/bust/128/${player.ign}`);
    }
  }, [player, isOpen]);

  if (!player) return null;

  const getCombatRank = (points: number) => {
    if (points >= 300) return { 
      title: 'Combat Master', 
      color: 'text-yellow-400', 
      icon: '💎',
      bgColor: 'bg-yellow-600'
    };
    if (points >= 200) return { 
      title: 'Combat Ace', 
      color: 'text-red-400', 
      icon: '🔸',
      bgColor: 'bg-red-600'
    };
    return { 
      title: 'Fighter', 
      color: 'text-gray-400', 
      icon: '⚔️',
      bgColor: 'bg-gray-600'
    };
  };

  const getRegionFullName = (region: string) => {
    switch (region) {
      case 'NA': return 'North America';
      case 'EU': return 'Europe';
      case 'ASIA': return 'Asia';
      case 'SA': return 'South America';
      case 'AF': return 'Africa';
      case 'OCE': return 'Oceania';
      default: return 'Unknown';
    }
  };

  const combatRank = getCombatRank(player.global_points || 0);
  const position = 1; // This would be calculated from the leaderboard position

  // Mock tier data - in a real app, this would come from the backend
  const mockTiers = [
    { gamemode: 'Crystal', tier: 'HT1', icon: '🔮' },
    { gamemode: 'Sword', tier: 'HT1', icon: '⚔️' },
    { gamemode: 'Axe', tier: 'HT1', icon: '🪓' },
    { gamemode: 'UHC', tier: 'LT1', icon: '❤️' },
    { gamemode: 'Pot', tier: 'LT1', icon: '🧪' },
    { gamemode: 'NethPot', tier: 'LT1', icon: '🌋' },
    { gamemode: 'SMP', tier: 'LT2', icon: '🏠' },
    { gamemode: 'Vanilla', tier: 'LT1', icon: '🍦' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-md p-0 overflow-hidden">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>

          {/* Header with avatar */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative inline-block mb-4"
            >
              <div className="w-24 h-24 rounded-full border-4 border-yellow-500 overflow-hidden bg-gray-700">
                <img
                  src={avatarUrl}
                  alt={player.ign}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/default-avatar.png';
                  }}
                />
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-2">{player.ign}</h2>
            
            <div className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2",
              combatRank.bgColor,
              "text-white"
            )}>
              <span className="mr-1">{combatRank.icon}</span>
              {combatRank.title}
            </div>

            <p className="text-gray-300 text-sm">
              {getRegionFullName(player.region || 'NA')}
            </p>
          </div>

          {/* Position section */}
          <div className="px-6 py-4 bg-gray-800/50">
            <h3 className="text-gray-400 text-sm font-medium mb-2">POSITION</h3>
            <div className="flex items-center justify-between bg-yellow-600 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-black mr-2">{position}.</span>
                <Trophy className="w-5 h-5 text-black" />
                <span className="text-black font-bold ml-2">OVERALL</span>
              </div>
              <span className="text-black font-medium">
                ({player.global_points || 0} points)
              </span>
            </div>
          </div>

          {/* Tiers section */}
          <div className="px-6 py-4">
            <h3 className="text-gray-400 text-sm font-medium mb-3">TIERS</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-4 gap-2">
                {mockTiers.map((tier, index) => (
                  <motion.div
                    key={tier.gamemode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mb-1">
                      <span className="text-lg">{tier.icon}</span>
                    </div>
                    <span className={cn(
                      "text-xs font-bold px-2 py-1 rounded",
                      tier.tier.startsWith('HT') ? 'bg-yellow-600 text-white' : 'bg-orange-600 text-white'
                    )}>
                      {tier.tier}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
