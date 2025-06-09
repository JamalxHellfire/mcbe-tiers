
import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Player } from '@/services/playerService';
import { GameModeIcon } from './GameModeIcon';

interface MinecraftPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player;
}

export function MinecraftPlayerModal({ isOpen, onClose, player }: MinecraftPlayerModalProps) {
  if (!player) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#2a2d3a] border-gray-600 max-w-md p-0 overflow-hidden">
        <div className="relative">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="p-8 text-center">
            {/* Avatar with golden border */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mx-auto mb-4"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-1">
                <Avatar className="w-full h-full">
                  <AvatarImage 
                    src={`https://visage.surgeplay.com/bust/128/${player.ign}`}
                    alt={player.ign}
                  />
                  <AvatarFallback className="bg-gray-700 text-white text-2xl">
                    {player.ign.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </motion.div>

            {/* Player name */}
            <h2 className="text-2xl font-bold text-white mb-2">{player.ign}</h2>
            
            {/* Combat rank badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-700 px-4 py-2 rounded-full mb-4">
              <span className="text-yellow-100 text-sm">◆</span>
              <span className="text-yellow-100 font-medium">
                Combat {player.global_points >= 300 ? 'Master' : player.global_points >= 200 ? 'Marshal' : player.global_points >= 100 ? 'Ace' : 'Cadet'}
              </span>
            </div>

            {/* Region */}
            <p className="text-gray-400 mb-6">{player.region === 'NA' ? 'North America' : player.region}</p>

            {/* Position section */}
            <div className="mb-6">
              <h3 className="text-gray-400 text-sm font-medium mb-2">POSITION</h3>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-6 bg-yellow-600 rounded text-black font-bold flex items-center justify-center text-sm">
                    1.
                  </div>
                  <span className="text-black font-bold">🏆 OVERALL</span>
                </div>
                <span className="text-black font-bold">({player.global_points || 0} points)</span>
              </div>
            </div>

            {/* Tiers section */}
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-3">TIERS</h3>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {[
                    { mode: 'crystal', tier: 'HT1' },
                    { mode: 'sword', tier: 'HT1' },
                    { mode: 'crystal', tier: 'HT1' },
                    { mode: 'axe', tier: 'LT1' },
                    { mode: 'uhc', tier: 'LT1' },
                    { mode: 'smp', tier: 'LT1' },
                    { mode: 'nethpot', tier: 'LT2' },
                    { mode: 'bedwars', tier: 'LT1' }
                  ].map((item, index) => (
                    <div key={index} className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-600 border-2 border-gray-500 flex items-center justify-center">
                        <GameModeIcon mode={item.mode} className="w-5 h-5" />
                      </div>
                      <div className={`
                        absolute -bottom-1 -right-1 w-6 h-5 rounded text-xs flex items-center justify-center font-bold
                        ${item.tier.startsWith('HT') ? 'bg-yellow-500 text-black' : 'bg-gray-500 text-white'}
                      `}>
                        {item.tier}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
