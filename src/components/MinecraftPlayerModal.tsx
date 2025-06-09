
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
    crystal: 'HT1',
    sword: 'LT2', 
    mace: 'HT3',
    axe: 'LT1',
    smp: 'HT2',
    uhc: 'LT3',
    nethpot: 'HT4',
    bedwars: 'LT2'
  };

  const gameModes: GameMode[] = ['crystal', 'sword', 'mace', 'axe', 'smp', 'uhc', 'nethpot', 'bedwars'];

  const getRankInfo = (points: number) => {
    if (points >= 300) return { title: 'Combat Master', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (points >= 200) return { title: 'Combat Marshal', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (points >= 100) return { title: 'Combat Ace', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    return { title: 'Combat Cadet', color: 'text-gray-400', bg: 'bg-gray-500/20' };
  };

  const rankInfo = getRankInfo(player.global_points || 0);

  return (
    <motion.div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-800/80 to-gray-900/80 px-6 py-4 border-b border-gray-700/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>
          <h2 className="text-xl font-bold text-white">Player Profile</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
          {/* Player Info Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar - Centered and Prominent */}
            <div className="relative">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-gray-600/50 shadow-lg bg-gray-800">
                <img
                  src={`https://visage.surgeplay.com/bust/128/${player.ign}`}
                  alt={`${player.ign}'s skin`}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.src = `https://crafatar.com/avatars/${player.ign}?size=128&overlay=true`;
                  }}
                />
              </div>
              {/* Rank Badge */}
              <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-lg text-xs font-bold ${rankInfo.bg} ${rankInfo.color} border border-current/20`}>
                #{Math.floor(Math.random() * 100) + 1}
              </div>
            </div>

            {/* Player Details */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{player.ign}</h3>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${rankInfo.bg} ${rankInfo.color}`}>
                  <Trophy className="w-4 h-4" />
                  <span className="font-semibold">{rankInfo.title}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{player.region || 'NA'}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Monitor className="w-4 h-4" />
                  <span className="text-sm">{player.device || 'PC'}</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">{player.global_points || 0} points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Mode Rankings */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white/90">Game Mode Rankings</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gameModes.map((mode) => {
                const tier = mockTiers[mode as keyof typeof mockTiers];
                const isHighTier = tier?.includes('HT');
                
                return (
                  <div
                    key={mode}
                    className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30 hover:border-gray-600/50 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <GameModeIcon mode={mode} className="w-8 h-8" />
                      <div className="text-center">
                        <div className="text-xs text-white/60 capitalize mb-1">{mode}</div>
                        <Badge
                          variant={isHighTier ? "default" : "secondary"}
                          className={`text-xs font-bold ${
                            isHighTier 
                              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' 
                              : 'bg-gray-600/20 text-gray-400 border-gray-600/30'
                          }`}
                        >
                          {tier}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{player.global_points || 0}</div>
                <div className="text-sm text-white/60">Total Points</div>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">#{Math.floor(Math.random() * 100) + 1}</div>
                <div className="text-sm text-white/60">Global Rank</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
