
import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, MapPin, Monitor } from 'lucide-react';
import { Player, GameMode } from '@/services/playerService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GameModeIcon } from './GameModeIcon';
import { Badge } from '@/components/ui/badge';

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

  // Mock tier data for demonstration
  const mockTiers = {
    Crystal: 'HT1',
    Sword: 'LT2', 
    Mace: 'HT3',
    Axe: 'LT1',
    SMP: 'HT2',
    UHC: 'LT3',
    NethPot: 'HT4',
    Bedwars: 'LT2'
  };

  const gameModes: GameMode[] = ['Crystal', 'Sword', 'Mace', 'Axe', 'SMP', 'UHC', 'NethPot', 'Bedwars'];

  const getRankInfo = (points: number) => {
    if (points >= 300) return { title: 'Combat Master', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: '💎' };
    if (points >= 200) return { title: 'Combat Marshal', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: '⚔️' };
    if (points >= 100) return { title: 'Combat Ace', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: '🏆' };
    return { title: 'Combat Cadet', color: 'text-gray-400', bg: 'bg-gray-500/20', icon: '🛡️' };
  };

  const rankInfo = getRankInfo(player.global_points || 0);

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-slate-800/95 backdrop-blur-md rounded-2xl border border-slate-600/50 w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-slate-900/80 px-6 py-4 border-b border-slate-600/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Player Avatar - Centered */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-500/80 shadow-lg bg-slate-700 mx-auto">
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
            <h3 className="text-xl font-bold text-white mb-2">{player.ign}</h3>

            {/* Combat Rank Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${rankInfo.bg} ${rankInfo.color} border border-current/30 mb-3`}>
              <span className="text-lg">{rankInfo.icon}</span>
              <span className="font-semibold">{rankInfo.title}</span>
            </div>

            {/* Region */}
            <div className="text-slate-400 mb-4">{player.region || 'North America'}</div>
          </div>

          {/* Position Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">POSITION</h4>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-600 text-white rounded-lg px-3 py-1 font-bold text-lg">
                  {Math.floor(Math.random() * 10) + 1}.
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">OVERALL</span>
                </div>
              </div>
              <div className="text-white/80 text-sm">
                ({player.global_points || 380} points)
              </div>
            </div>
          </div>

          {/* Tiers Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">TIERS</h4>
            <div className="grid grid-cols-4 gap-2">
              {gameModes.map((mode) => {
                const tier = mockTiers[mode as keyof typeof mockTiers];
                const isHighTier = tier?.includes('HT');
                
                return (
                  <div
                    key={mode}
                    className="flex flex-col items-center p-2 bg-slate-700/50 rounded-lg border border-slate-600/30"
                  >
                    <GameModeIcon mode={mode.toLowerCase()} className="w-6 h-6 mb-1" />
                    <Badge
                      variant={isHighTier ? "default" : "secondary"}
                      className={`text-xs px-2 py-0.5 ${
                        isHighTier 
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                          : 'bg-slate-600/20 text-slate-400 border-slate-600/30'
                      }`}
                    >
                      {tier}
                    </Badge>
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
