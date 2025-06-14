
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GameModeIcon } from './GameModeIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePopup } from '@/contexts/PopupContext';
import { GameMode } from '@/services/playerService';
import { RankBadgeIcon } from './RankBadgeIcon';

export function ModernResultPopup() {
  const { popupData, showPopup, closePopup } = usePopup();

  if (!showPopup || !popupData) return null;

  const playerPoints = popupData.player.global_points || 390;
  const position = popupData.player.overall_rank || 1;

  const orderedGamemodes: GameMode[] = [
    'Mace', 'Sword', 'Crystal', 'Axe',
    'SMP', 'UHC', 'NethPot', 'Bedwars'
  ];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  const getTierData = (mode: GameMode) => {
    const tierMap: Record<string, { code: string, color: string, gradient: string }> = {
      'Mace': { code: 'HT1', color: '#fde047', gradient: 'linear-gradient(135deg, #fef9c3 0%, #fde047 90%)' },
      'Sword': { code: 'HT1', color: '#f472b6', gradient: 'linear-gradient(135deg, #fff1fa 0%, #f472b6 90%)' },
      'Crystal': { code: 'HT1', color: '#38bdf8', gradient: 'linear-gradient(135deg, #f0faff 0%, #38bdf8 90%)' },
      'Axe': { code: 'LT1', color: '#7cffad', gradient: 'linear-gradient(135deg, #e6fff6 0%, #7cffad 90%)' },
      'SMP': { code: 'LT1', color: '#fde68a', gradient: 'linear-gradient(135deg, #fffbe7 0%, #fde68a 90%)' },
      'UHC': { code: 'LT1', color: '#fda4af', gradient: 'linear-gradient(135deg, #fff1fc 0%, #fda4af 100%)' },
      'NethPot': { code: 'HT2', color: '#a78bfa', gradient: 'linear-gradient(135deg, #f5f3ff 0%, #a78bfa 90%)' },
      'Bedwars': { code: 'LT1', color: '#fbbf24', gradient: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 90%)' },
    };
    return tierMap[mode] || { code: 'LT1', color: '#e5e7eb', gradient: 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)' };
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="relative w-full max-w-[380px] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(26,26,46,0.95) 0%, rgba(16,16,32,0.95) 100%)',
              border: '2px solid rgba(255, 224, 102, 0.8)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 224, 102, 0.1)'
            }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 w-8 h-8 bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 rounded-full z-20 transition-all duration-200 flex items-center justify-center shadow-lg hover:scale-110"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Main Content */}
            <div className="flex flex-col items-center px-6 pb-6 pt-8">
              {/* Avatar */}
              <div className="relative mb-3">
                <div
                  className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #ffe066 0%, #fff4a3 100%)',
                    border: '3px solid rgba(255, 224, 102, 0.6)'
                  }}
                >
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={`https://visage.surgeplay.com/bust/128/${popupData.player.ign}`}
                      alt={popupData.player.ign}
                      className="object-cover object-center scale-110"
                    />
                    <AvatarFallback className="bg-yellow-200 text-yellow-800 font-bold text-xl">
                      {popupData.player.ign.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              {/* Username and badge */}
              <div className="flex flex-col items-center gap-1 mb-4 w-full">
                <div className="font-bold text-2xl text-white drop-shadow-lg text-center">
                  {popupData.player.ign}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-300 to-yellow-400 border border-yellow-200/60 shadow-lg">
                  <RankBadgeIcon rank={popupData.combatRank?.title || "Combat Master"} className="w-4 h-4 text-yellow-800" />
                  <span className="font-semibold text-yellow-800 text-sm tracking-wide">{popupData.combatRank?.title || "Combat Master"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-yellow-100/90 mt-2">
                  <div className="px-2 py-1 rounded-lg bg-black/20 border border-yellow-200/30">
                    {popupData.player.region ?? 'NA'}
                  </div>
                  <div className="text-yellow-200">#{position} overall</div>
                  <div className="text-yellow-200">
                    <span className="font-bold">{playerPoints}</span> pts
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="w-full my-4 h-px bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent" />
              
              {/* Tiers */}
              <div className="w-full">
                <div className="uppercase text-xs mb-3 text-yellow-300 tracking-widest font-bold text-center">Gamemode Tiers</div>
                <div className="grid grid-cols-4 gap-3">
                  {orderedGamemodes.map((mode, index) => {
                    const tier = getTierData(mode);
                    return (
                      <motion.div
                        key={mode}
                        className="group flex flex-col items-center gap-1.5 relative transition-transform hover:scale-105 duration-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div
                          className="flex items-center justify-center rounded-full shadow-lg"
                          style={{
                            width: 50,
                            height: 50,
                            border: `2px solid ${tier.color}`,
                            background: `rgba(255,255,255,0.1)`,
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          <GameModeIcon mode={mode.toLowerCase()} className="h-7 w-7" />
                        </div>
                        <div
                          className="text-xs font-bold rounded-md py-1 px-2 bg-white/10 border border-white/20 shadow-sm backdrop-blur-sm"
                          style={{
                            color: tier.color,
                            fontSize: '0.7rem',
                            letterSpacing: '0.05em'
                          }}
                        >
                          {tier.code}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              {/* Footer */}
              <div className="w-full mt-5 text-xs text-center text-yellow-50/70 pt-3 border-t border-yellow-100/20">
                <span>Click outside to close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
