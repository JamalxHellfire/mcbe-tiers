
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GameModeIcon } from './GameModeIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePopup } from '@/contexts/PopupContext';
import { GameMode } from '@/services/playerService';
import { getAvatarUrl, handleAvatarError } from '@/utils/avatarUtils';
import { useIsMobile } from '@/hooks/use-mobile';

export function ModernResultPopup() {
  const { popupData, showPopup, closePopup } = usePopup();
  const isMobile = useIsMobile();

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
    // Find the actual tier for this gamemode from player data
    const playerTier = popupData.tierAssignments.find(assignment => 
      assignment.gamemode === mode
    );
    
    if (playerTier) {
      const tierMap: Record<string, { code: string, color: string, gradient: string }> = {
        'HT1': { code: 'HT1', color: '#fde047', gradient: 'linear-gradient(135deg, #fef9c3 0%, #fde047 90%)' },
        'LT1': { code: 'LT1', color: '#7cffad', gradient: 'linear-gradient(135deg, #e6fff6 0%, #7cffad 90%)' },
        'HT2': { code: 'HT2', color: '#a78bfa', gradient: 'linear-gradient(135deg, #f5f3ff 0%, #a78bfa 90%)' },
        'LT2': { code: 'LT2', color: '#fda4af', gradient: 'linear-gradient(135deg, #fff1fc 0%, #fda4af 100%)' },
        'HT3': { code: 'HT3', color: '#f472b6', gradient: 'linear-gradient(135deg, #fff1fa 0%, #f472b6 90%)' },
        'LT3': { code: 'LT3', color: '#38bdf8', gradient: 'linear-gradient(135deg, #f0faff 0%, #38bdf8 90%)' },
      };
      return tierMap[playerTier.tier] || { code: 'NR', color: '#e5e7eb', gradient: 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)' };
    }
    
    return { code: 'NR', color: '#e5e7eb', gradient: 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)' };
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.90)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={`relative w-full rounded-2xl overflow-hidden shadow-2xl ${
              isMobile ? 'max-w-[340px] mx-2' : 'max-w-[360px]'
            }`}
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)',
              border: '2px solid rgba(255, 224, 102, 0.6)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 224, 102, 0.3)'
            }}
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className={`absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 rounded-full z-30 transition-all duration-200 flex items-center justify-center shadow-lg hover:scale-110 ${
                isMobile ? 'w-10 h-10' : 'w-8 h-8'
              }`}
              aria-label="Close"
            >
              <X className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
            </button>
            
            {/* Main Content */}
            <div className={`flex flex-col items-center pb-4 pt-5 ${isMobile ? 'px-4' : 'px-5'}`}>
              {/* Avatar */}
              <div className="relative mb-3">
                <div
                  className={`rounded-full overflow-hidden flex items-center justify-center shadow-xl ${
                    isMobile ? 'w-20 h-20' : 'w-18 h-18'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #ffe066 0%, #fff4a3 100%)',
                    border: '3px solid rgba(255, 224, 102, 0.8)'
                  }}
                >
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={popupData.player.avatar_url || getAvatarUrl(popupData.player.ign, popupData.player.java_username)}
                      alt={popupData.player.ign}
                      className="object-cover object-center scale-110"
                      onError={(e) => handleAvatarError(e, popupData.player.ign, popupData.player.java_username)}
                    />
                    <AvatarFallback className="bg-yellow-200 text-yellow-800 font-bold text-lg">
                      {popupData.player.ign.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              {/* Username and badge */}
              <div className="flex flex-col items-center gap-1 mb-4 w-full">
                <div className={`font-bold text-white drop-shadow-lg text-center ${
                  isMobile ? 'text-lg' : 'text-xl'
                }`}>
                  {popupData.player.ign}
                </div>
                <div className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-300 to-yellow-400 border border-yellow-200/60 shadow-lg ${
                  isMobile ? 'px-2.5 py-1' : 'px-3 py-1.5'
                }`}>
                  <span className={`font-semibold text-yellow-800 tracking-wide ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    {popupData.combatRank?.title || "Combat Master"}
                  </span>
                </div>
                <div className={`flex items-center gap-2 text-yellow-100/90 mt-2 ${
                  isMobile ? 'text-xs flex-wrap justify-center' : 'text-sm gap-3'
                }`}>
                  <div className={`rounded-lg bg-black/20 border border-yellow-200/30 ${
                    isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'
                  }`}>
                    {popupData.player.region ?? 'NA'}
                  </div>
                  <div className="text-yellow-200">#{position} overall</div>
                  <div className="text-yellow-200">
                    <span className="font-bold">{playerPoints}</span> pts
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="w-full my-3 h-px bg-gradient-to-r from-transparent via-yellow-200/50 to-transparent" />
              
              {/* Tiers */}
              <div className="w-full">
                <div className={`uppercase tracking-widest font-bold text-center text-yellow-300 mb-3 ${
                  isMobile ? 'text-xs' : 'text-xs'
                }`}>
                  Gamemode Tiers
                </div>
                <div className={`grid gap-2 ${
                  isMobile ? 'grid-cols-4 gap-1.5' : 'grid-cols-4 gap-2.5'
                }`}>
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
                            width: isMobile ? 36 : 44,
                            height: isMobile ? 36 : 44,
                            border: `2px solid ${tier.color}`,
                            background: `rgba(255,255,255,0.1)`,
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          <GameModeIcon mode={mode.toLowerCase()} className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
                        </div>
                        <div
                          className={`font-bold rounded-md py-1 px-2 bg-white/10 border border-white/20 shadow-sm backdrop-blur-sm ${
                            isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1'
                          }`}
                          style={{
                            color: tier.color,
                            fontSize: isMobile ? '0.6rem' : '0.65rem',
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
              <div className={`w-full text-center text-yellow-50/70 pt-3 border-t border-yellow-100/20 mt-4 ${
                isMobile ? 'text-xs' : 'text-xs'
              }`}>
                <span>Tap outside to close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
