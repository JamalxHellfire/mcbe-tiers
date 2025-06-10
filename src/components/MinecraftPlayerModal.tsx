
import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, MapPin, Monitor, Star, Sword, Shield } from 'lucide-react';
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
    if (points >= 300) return { 
      title: 'Combat Master', 
      color: 'text-yellow-300', 
      bg: 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30', 
      icon: Star,
      borderColor: 'border-yellow-400/50'
    };
    if (points >= 200) return { 
      title: 'Combat Marshal', 
      color: 'text-purple-300', 
      bg: 'bg-gradient-to-r from-purple-500/30 to-pink-500/30', 
      icon: Sword,
      borderColor: 'border-purple-400/50'
    };
    if (points >= 100) return { 
      title: 'Combat Ace', 
      color: 'text-blue-300', 
      bg: 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30', 
      icon: Trophy,
      borderColor: 'border-blue-400/50'
    };
    return { 
      title: 'Combat Cadet', 
      color: 'text-gray-300', 
      bg: 'bg-gradient-to-r from-gray-500/30 to-slate-500/30', 
      icon: Shield,
      borderColor: 'border-gray-400/50'
    };
  };

  const rankInfo = getRankInfo(player.global_points || 0);
  const IconComponent = rankInfo.icon;

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-slate-800/95 via-slate-700/95 to-slate-800/95 backdrop-blur-xl rounded-3xl border-2 border-slate-500/30 w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl relative"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              initial={{ 
                x: Math.random() * 400, 
                y: Math.random() * 600,
                opacity: 0 
              }}
              animate={{ 
                x: Math.random() * 400, 
                y: Math.random() * 600,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 px-6 py-4 border-b border-slate-600/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 z-10"
          >
            <X className="w-5 h-5 text-white/80 hover:text-white" />
          </button>
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white text-center">Player Profile</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 relative z-10">
          {/* Player Avatar - Enhanced */}
          <div className="flex flex-col items-center text-center">
            <motion.div 
              className="relative mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              {/* Glowing ring effect */}
              <div className={`absolute inset-0 w-24 h-24 rounded-full ${rankInfo.bg} blur-xl animate-pulse`} />
              
              {/* Main avatar container */}
              <div className={`relative w-24 h-24 rounded-full overflow-hidden border-4 ${rankInfo.borderColor} shadow-2xl bg-slate-700`}>
                <img
                  src={`https://visage.surgeplay.com/bust/128/${player.ign}`}
                  alt={`${player.ign}'s skin`}
                  className="w-full h-full object-cover object-center scale-110"
                  onError={(e) => {
                    e.currentTarget.src = `https://crafatar.com/avatars/${player.ign}?size=128&overlay=true`;
                  }}
                />
              </div>
              
              {/* Rank indicator with icon */}
              <motion.div 
                className={`absolute -bottom-2 -right-2 ${rankInfo.bg} ${rankInfo.color} rounded-full p-2 border-2 ${rankInfo.borderColor} shadow-lg`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
              >
                <IconComponent className="w-4 h-4" />
              </motion.div>
            </motion.div>

            {/* Player Name with glow effect */}
            <motion.h3 
              className="text-2xl font-bold text-white mb-2 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {player.ign}
            </motion.h3>

            {/* Combat Rank Badge - Enhanced */}
            <motion.div 
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${rankInfo.bg} ${rankInfo.color} border-2 ${rankInfo.borderColor} mb-4 shadow-xl backdrop-blur-sm`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              <IconComponent className="w-5 h-5" />
              <span className="font-bold text-lg">{rankInfo.title}</span>
            </motion.div>

            {/* Region with icon */}
            <motion.div 
              className="flex items-center gap-2 text-slate-300 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <MapPin className="w-4 h-4" />
              <span>{player.region || 'North America'}</span>
            </motion.div>
          </div>

          {/* Stats Section - Enhanced */}
          <motion.div 
            className="grid grid-cols-2 gap-4 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 text-center backdrop-blur-sm">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <span className="text-yellow-300 text-xs block mb-1 font-medium">Global Points</span>
              <span className="text-white text-xl font-bold">{player.global_points || 380}</span>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4 text-center backdrop-blur-sm">
              <Monitor className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <span className="text-blue-300 text-xs block mb-1 font-medium">Device</span>
              <span className="text-white text-lg font-bold">{player.device || 'PC'}</span>
            </div>
          </motion.div>

          {/* Position Section - Enhanced */}
          <motion.div 
            className="space-y-3 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              OVERALL POSITION
            </h4>
            <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl p-5 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-600 text-white rounded-xl px-4 py-2 font-bold text-xl shadow-lg">
                  #{Math.floor(Math.random() * 10) + 1}
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-white" />
                  <span className="text-white font-bold text-lg">LEADERBOARD</span>
                </div>
              </div>
              <div className="text-white/90 text-sm font-medium">
                ({player.global_points || 380} pts)
              </div>
            </div>
          </motion.div>

          {/* Tiers Section - Enhanced */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h4 className="text-sm font-medium text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sword className="w-4 h-4" />
              GAMEMODE TIERS
            </h4>
            <div className="grid grid-cols-4 gap-3">
              {gameModes.map((mode, index) => {
                const tier = mockTiers[mode as keyof typeof mockTiers];
                const isHighTier = tier?.includes('HT');
                
                return (
                  <motion.div
                    key={mode}
                    className="flex flex-col items-center p-3 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="mb-2 p-2 rounded-lg bg-slate-600/30">
                      <GameModeIcon mode={mode.toLowerCase()} className="w-8 h-8" />
                    </div>
                    <Badge
                      variant={isHighTier ? "default" : "secondary"}
                      className={`text-xs px-3 py-1 font-bold ${
                        isHighTier 
                          ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-300 border-yellow-500/40' 
                          : 'bg-gradient-to-r from-slate-600/30 to-slate-700/30 text-slate-300 border-slate-600/40'
                      } backdrop-blur-sm`}
                    >
                      {tier}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
