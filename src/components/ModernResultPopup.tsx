import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GameModeIcon } from './GameModeIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePopup } from '@/contexts/PopupContext';
import { GameMode } from '@/services/playerService';

export function ModernResultPopup() {
  const { popupData, showPopup, closePopup } = usePopup();
  
  if (!showPopup || !popupData) return null;

  const playerPoints = popupData.player.global_points || 390;
  const position = popupData.player.overall_rank || 1;

  // Order matches the "overall" style
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
    // Artistic tier data, more vibrant and 3D
    const tierMap: Record<string, { code: string, color: string, gradient: string, iconOutline: string }> = {
      'Mace': { code: 'HT1', color: '#fde047', gradient: 'linear-gradient(135deg, #fde047 0%, #fbbf24 100%)', iconOutline: 'shadow-[0_2px_8px_rgba(253,224,71,0.25)]' },
      'Sword': { code: 'HT1', color: '#f472b6', gradient: 'linear-gradient(135deg, #f472b6 0%, #be185d 100%)', iconOutline: 'shadow-[0_2px_8px_rgba(244,114,182,0.15)]' },
      'Crystal': { code: 'HT1', color: '#38bdf8', gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)', iconOutline: 'shadow-[0_2px_8px_rgba(56,189,248,0.15)]' },
      'Axe': { code: 'LT1', color: '#a8ff78', gradient: 'linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)', iconOutline: 'shadow-[0_2px_8px_rgba(168,255,120,0.10)]' },
      'SMP': { code: 'LT1', color: '#fde68a', gradient: 'linear-gradient(135deg, #fde68a 0%, #fcd34d 100%)', iconOutline: 'shadow-[0_2px_8px_rgba(253,230,138,0.10)]' },
      'UHC': { code: 'LT1', color: '#f87171', gradient: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)', iconOutline: 'shadow-[0_2px_8px_rgba(248,113,113,0.10)]' },
      'NethPot': { code: 'HT2', color: '#a78bfa', gradient: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)', iconOutline: 'shadow-[0_2px_8px_rgba(167,139,250,0.10)]' },
      'Bedwars': { code: 'LT1', color: '#fbbf24', gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e42 100%)', iconOutline: 'shadow-[0_2px_8px_rgba(251,191,36,0.10)]' },
    };
    return tierMap[mode] || { code: 'LT1', color: '#e5e7eb', gradient: 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)', iconOutline: '' };
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(11px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="relative w-full max-w-[360px] sm:max-w-[400px] rounded-3xl overflow-hidden border-[2.5px] border-yellow-300/30 shadow-[0_12px_32px_0_rgba(253,224,71,0.24)] bg-[rgba(26,26,46,0.98)]"
            style={{
              boxShadow: '0 8px 48px 8px rgba(255, 255, 150, 0.10), 0 2px 12px rgba(255, 255, 255, 0.09)',
              border: '1.5px solid #fde047bf'
            }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 340, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 z-10 bg-gradient-to-br from-yellow-300/70 to-yellow-500/70 text-black hover:bg-yellow-400 p-1.5 rounded-full shadow-[0_6px_20px_0_rgba(251,191,36,0.32)] transition-all hover:scale-105"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Content */}
            <div className="flex flex-col items-center p-6 sm:p-7">
              {/* Avatar */}
              <div
                className="relative mb-2 drop-shadow-[0_8px_24px_rgba(255,225,80,0.3)]"
              >
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-[6px] border-yellow-300 bg-gradient-to-br from-yellow-100/80 to-yellow-300/50 shadow-lg"
                  style={{ boxShadow: '0 0 40px #fbbf24a3, 0 2px 16px #fde0471a' }}
                >
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={`https://visage.surgeplay.com/bust/128/${popupData.player.ign}`}
                      alt={popupData.player.ign}
                      className="object-cover object-center scale-110"
                    />
                    <AvatarFallback className="bg-yellow-300 text-white font-bold text-2xl">
                      {popupData.player.ign.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {/* Gold glow effect around avatar */}
                <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                  boxShadow: '0 0 32px 10px #fde04777, 0 1px 4px #fff9',
                  zIndex: 0
                }} />
              </div>

              {/* Ign and Rank badge */}
              <div className="flex flex-col items-center gap-0.5 mt-2 mb-3 w-full">
                <div className="font-bold text-[1.5rem] text-yellow-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.14)] w-full text-center" style={{textShadow:'0 2px 10px #fff9'}}>
                  {popupData.player.ign}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-br from-yellow-200 to-yellow-500/70 border border-yellow-100/50 shadow-md mb-1 mt-1">
                  <span className="text-lg font-bold text-yellow-700 drop-shadow-sm">⚜</span>
                  <span className="font-semibold text-yellow-700 tracking-wider shadow-md">Combat Master</span>
                </div>
                {/* Region, Position, Points */}
                <div className="flex items-center gap-3 text-xs text-yellow-100/80 mt-1">
                  <div className="px-2 py-0.5 rounded-xl bg-black/10 border border-yellow-200/40">{popupData.player.region ?? 'NA'}</div>
                  <div>#{position} overall</div>
                  <div>
                    <span className="font-bold">{playerPoints}</span> points
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full my-4 h-[0.5px] bg-gradient-to-r from-transparent via-yellow-200 to-transparent opacity-50" />

              {/* Tiers */}
              <div className="w-full">
                <div className="uppercase text-[0.75rem] mb-3 text-yellow-400 tracking-widest font-bold text-center">Gamemode Tiers</div>
                <div className="grid grid-cols-4 gap-3">
                  {orderedGamemodes.map((mode, index) => {
                    const tier = getTierData(mode);
                    return (
                      <motion.div
                        key={mode}
                        className="group flex flex-col items-center gap-1 relative hover:scale-105 transition-transform"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.055 }}
                      >
                        <div
                          className={`w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg bg-white/5 border-2`}
                          style={{
                            background: tier.gradient,
                            borderColor: tier.color,
                            boxShadow: tier.iconOutline,
                          }}
                        >
                          <GameModeIcon mode={mode.toLowerCase()} className="h-9 w-9 drop-shadow-[0_2px_4px_rgba(0,0,0,0.22)]" />
                        </div>
                        <div
                          className="text-xs font-extrabold rounded py-0.5 px-2 bg-black/20 border border-yellow-50/20 shadow-sm"
                          style={{
                            color: tier.color,
                            fontSize: '0.7rem',
                            letterSpacing: '0.06em'
                          }}
                        >
                          {tier.code}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Timestamp and close tip */}
              <div className="w-full mt-6 text-xs text-center text-yellow-50/60 pt-2 border-t border-yellow-100/10">
                <span>Click anywhere outside to close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
