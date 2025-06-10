
import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { Player, GameMode } from '@/services/playerService';
import { GameModeIcon } from './GameModeIcon';

interface MinecraftPlayerModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

export const MinecraftPlayerModal: React.FC<MinecraftPlayerModalProps> = ({
  player,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !player) return null;

  // Mock tier data to match the image exactly
  const mockTiers = {
    Crystal: 'HT1',
    Sword: 'HT1', 
    Mace: 'HT1',
    Axe: 'LT1',
    SMP: 'LT1',
    UHC: 'LT1',
    NethPot: 'LT2',
    Bedwars: 'LT1'
  };

  const gameModes: GameMode[] = ['Crystal', 'Sword', 'Mace', 'Axe', 'SMP', 'UHC', 'NethPot', 'Bedwars'];

  const getTierColor = (tier: string) => {
    if (tier.startsWith('HT')) return 'bg-yellow-600 text-yellow-100';
    return 'bg-gray-600 text-gray-100';
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-slate-800 rounded-lg w-full max-w-xs relative overflow-hidden shadow-2xl border border-slate-600"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-md transition-colors z-10"
        >
          <X className="w-4 h-4 text-white/80" />
        </button>

        {/* Content */}
        <div className="p-4 text-center">
          {/* Avatar */}
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full border-3 border-yellow-500 overflow-hidden bg-slate-700">
              <img
                src={`https://visage.surgeplay.com/bust/128/${player.ign}`}
                alt={`${player.ign}'s skin`}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.src = `https://crafatar.com/avatars/${player.ign}?size=128&overlay=true`;
                }}
              />
            </div>
          </div>

          {/* Player Name */}
          <h3 className="text-lg font-bold text-white mb-2">
            {player.ign}
          </h3>

          {/* Combat Master Badge */}
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-600 text-yellow-100 mb-3 text-xs font-medium">
            <div className="w-3 h-3 bg-yellow-400 rounded-sm flex items-center justify-center">
              <span className="text-yellow-800 text-xs font-bold">◆</span>
            </div>
            Combat Master
          </div>

          {/* Region */}
          <div className="flex items-center justify-center gap-1 text-slate-400 mb-4 text-xs">
            <MapPin className="w-3 h-3" />
            <span>{player.region || 'North America'}</span>
          </div>

          {/* Position Section */}
          <div className="mb-4">
            <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">
              POSITION
            </h4>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-md p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-600 text-white rounded-sm px-1 py-0.5 font-bold text-xs">
                  1.
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-white font-bold text-xs">OVERALL</span>
                </div>
              </div>
              <span className="text-white/90 text-xs">
                ({player.global_points || 380} points)
              </span>
            </div>
          </div>

          {/* Tiers Section */}
          <div>
            <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-medium">
              TIERS
            </h4>
            <div className="grid grid-cols-4 gap-1">
              {gameModes.map((mode) => {
                const tier = mockTiers[mode as keyof typeof mockTiers];
                
                return (
                  <div
                    key={mode}
                    className="flex flex-col items-center p-1 bg-slate-700/50 rounded-md"
                  >
                    <div className="mb-1">
                      <GameModeIcon mode={mode.toLowerCase()} className="w-4 h-4" />
                    </div>
                    <div className={`text-xs px-1 py-0.5 rounded text-xs font-bold ${getTierColor(tier)}`}>
                      {tier}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
