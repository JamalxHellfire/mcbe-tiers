
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
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2"
          style={{
            background: 'rgba(16,17,26,0.94)',
            backdropFilter: 'blur(15px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="relative w-full max-w-[355px] sm:max-w-[370px] rounded-2xl bg-white/10 border border-white/20 overflow-hidden"
            style={{
              background: 'rgba(26,26,46,0.86)',
              border: '1.8px solid #ffe066',
            }}
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 bg-white/80 text-yellow-700 hover:bg-yellow-300 p-2 rounded-full z-10 transition-all duration-150"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Main Content */}
            <div className="flex flex-col items-center px-5 pb-6 pt-7">
              {/* Avatar */}
              <div className="relative mb-2">
                <div
                  className="w-20 h-20 rounded-full border-[4px] border-yellow-200/80 overflow-hidden flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(130deg, #ffe066 10%, #fffbe7 100%)',
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
              <div className="flex flex-col items-center gap-0.5 mt-2 mb-1 w-full">
                <div className="font-bold text-[1.32rem] text-yellow-50 drop-shadow-[0_2px_7px_rgba(0,0,0,0.10)] w-full text-center" style={{textShadow:'0 2px 14px #ffe06635'}}>
                  {popupData.player.ign}
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-gradient-to-br from-yellow-200 to-yellow-400/70 border border-yellow-100/40 shadow-sm mb-1 mt-1">
                  <RankBadgeIcon rank={popupData.combatRank?.title || "Combat Master"} className="w-5 h-5 text-yellow-700" />
                  <span className="font-semibold text-yellow-600 tracking-wider">{popupData.combatRank?.title || "Combat Master"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-yellow-100/80 mt-0.5">
                  <div className="px-2 py-0.5 rounded-xl bg-black/10 border border-yellow-200/40">{popupData.player.region ?? 'NA'}</div>
                  <div>#{position} overall</div>
                  <div>
                    <span className="font-bold">{playerPoints}</span> pts
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="w-full my-3 h-[0.5px] bg-gradient-to-r from-transparent via-yellow-200 to-transparent opacity-40" />
              
              {/* Tiers */}
              <div className="w-full">
                <div className="uppercase text-[0.70rem] mb-2 text-yellow-400 tracking-widest font-bold text-center">Gamemode Tiers</div>
                <div className="grid grid-cols-4 gap-2.5">
                  {orderedGamemodes.map((mode, index) => {
                    const tier = getTierData(mode);
                    return (
                      <motion.div
                        key={mode}
                        className="group flex flex-col items-center gap-1 relative transition-transform hover:scale-110 duration-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.045 }}
                      >
                        <div
                          className="flex items-center justify-center rounded-full border"
                          style={{
                            width: 48,
                            height: 48,
                            border: `2px solid ${tier.color}`,
                            background: `rgba(255,255,255,0.12)`,
                          }}
                        >
                          <GameModeIcon mode={mode.toLowerCase()} className="h-7 w-7" />
                        </div>
                        <div
                          className="text-xs font-extrabold rounded py-0.5 px-2 bg-white/10 border border-yellow-50/10 shadow-sm"
                          style={{
                            color: tier.color,
                            fontSize: '0.68rem',
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
              
              {/* Timestamp & Tip */}
              <div className="w-full mt-4 text-xs text-center text-yellow-50/60 pt-1 border-t border-yellow-100/10">
                <span>Click outside popup to close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
