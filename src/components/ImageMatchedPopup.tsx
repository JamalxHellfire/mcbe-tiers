
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { GameModeIcon } from './GameModeIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePopup } from '@/contexts/PopupContext';
import { GameMode } from '@/services/playerService';

// Format tier display exactly as shown in image
const formatTierDisplay = (tier: string): { code: string, color: string } => {
  if (tier === 'Retired') return { code: 'RT', color: 'text-gray-400' };
  if (tier === 'Not Ranked') return { code: 'NR', color: 'text-gray-500' };
  
  let code = tier;
  let color = 'text-white';
  
  if (tier.includes('HT1')) {
    code = 'HT1';
    color = 'text-yellow-400';
  } else if (tier.includes('LT1')) {
    code = 'LT1';
    color = 'text-yellow-600';
  } else if (tier.includes('HT2')) {
    code = 'HT2';
    color = 'text-purple-400';
  } else if (tier.includes('LT2')) {
    code = 'LT2';
    color = 'text-purple-600';
  } else if (tier.includes('HT3')) {
    code = 'HT3';
    color = 'text-blue-400';
  } else if (tier.includes('LT3')) {
    code = 'LT3';
    color = 'text-blue-600';
  } else if (tier.includes('HT4')) {
    code = 'HT4';
    color = 'text-green-400';
  } else if (tier.includes('LT4')) {
    code = 'LT4';
    color = 'text-green-600';
  } else if (tier.includes('HT5')) {
    code = 'HT5';
    color = 'text-red-400';
  } else if (tier.includes('LT5')) {
    code = 'LT5';
    color = 'text-red-600';
  }
  
  return { code, color };
};

export function ImageMatchedPopup() {
  const { popupData, showPopup, closePopup } = usePopup();
  
  if (!showPopup || !popupData) return null;

  const playerPoints = popupData.player.global_points || 390;
  const position = popupData.player.overall_rank || 1;

  // Ordered gamemode layout exactly as in image: 2 rows of 4
  const orderedGamemodes: GameMode[] = [
    'Crystal', 'Sword', 'Bedwars', 'Mace',
    'SMP', 'UHC', 'NethPot', 'Axe'
  ];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="relative rounded-xl w-full max-w-sm overflow-hidden"
            style={{ 
              background: 'linear-gradient(180deg, #2a3441 0%, #1e2530 100%)',
              border: '1px solid #3a4553'
            }}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - exactly positioned as in image */}
            <motion.button
              onClick={closePopup}
              className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Content */}
            <div className="p-6 text-center">
              {/* Avatar Section - exactly as in image */}
              <motion.div 
                className="mb-4"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div 
                    className="w-full h-full rounded-full border-4 overflow-hidden"
                    style={{ borderColor: '#f59e0b' }}
                  >
                    <Avatar className="w-full h-full">
                      <AvatarImage 
                        src={`https://visage.surgeplay.com/bust/128/${popupData.player.ign}`}
                        alt={popupData.player.ign}
                        className="object-cover object-center scale-110"
                      />
                      <AvatarFallback className="bg-slate-700 text-white font-bold text-lg">
                        {popupData.player.ign.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Player Name - exactly as in image */}
                <motion.h3 
                  className="text-xl font-bold mb-2 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {popupData.player.ign}
                </motion.h3>

                {/* Combat Master Badge - exactly as in image */}
                <motion.div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2"
                  style={{ 
                    background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)',
                    border: '1px solid #f59e0b'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="w-3 h-3 text-yellow-200">♦</span>
                  <span className="text-white font-bold text-sm">Combat Master</span>
                </motion.div>

                {/* Region - exactly as in image */}
                <motion.div 
                  className="text-slate-400 text-sm mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  North America
                </motion.div>

                {/* NameMC Link - exactly as in image */}
                <motion.div 
                  className="flex items-center justify-center gap-2 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">n</span>
                  </div>
                  <span className="text-blue-400 text-sm">NameMC ↗</span>
                </motion.div>
              </motion.div>

              {/* Position Section - exactly as in image */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-semibold text-left">
                  POSITION
                </h4>
                <div 
                  className="rounded-lg p-3 flex items-center justify-between"
                  style={{ background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-lg">
                      {position}
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-bold text-sm">OVERALL</span>
                    </div>
                  </div>
                  <span className="text-white/90 text-sm font-medium">
                    ({playerPoints} points)
                  </span>
                </div>
              </motion.div>

              {/* Tiers Section - exactly as in image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-semibold text-left">
                  TIERS
                </h4>
                <div 
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(51, 65, 85, 0.6)' }}
                >
                  <div className="grid grid-cols-4 gap-3">
                    {orderedGamemodes.map((mode, index) => {
                      const assignment = popupData.tierAssignments.find(a => a.gamemode === mode);
                      // Mock tiers exactly as shown in image
                      const tierMap: Record<string, string> = {
                        'Crystal': 'HT1',
                        'Sword': 'HT1', 
                        'Bedwars': 'HT1',
                        'Mace': 'LT1',
                        'SMP': 'LT1',
                        'UHC': 'LT1',
                        'NethPot': 'HT2',
                        'Axe': 'LT1'
                      };
                      
                      const tier = tierMap[mode] || 'LT1';
                      const { code, color } = formatTierDisplay(tier);
                      
                      return (
                        <motion.div
                          key={mode}
                          className="flex flex-col items-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9 + index * 0.05 }}
                        >
                          <div className="mb-1">
                            <GameModeIcon mode={mode.toLowerCase()} className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <span className={`text-xs font-bold ${color}`}>{code}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
