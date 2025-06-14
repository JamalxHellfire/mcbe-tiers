
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

  // Gamemode order matching the image layout
  const orderedGamemodes: GameMode[] = [
    'Mace', 'Sword', 'Crystal', 'Axe', 
    'SMP', 'UHC', 'NethPot', 'Bedwars'
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
          className="popup-overlay fixed inset-0 z-[1000] flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="popup-container relative max-w-sm w-full rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e, #2e2e48)',
              color: '#ffffff',
              padding: '20px'
            }}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-2.5 right-2.5 bg-none border-none text-white cursor-pointer transition-opacity duration-300 hover:opacity-70 z-10"
              style={{ fontSize: '20px' }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Section */}
            <div className="text-center mb-6">
              {/* Avatar */}
              <div className="mb-4">
                <div 
                  className="w-24 h-24 mx-auto rounded-full overflow-hidden"
                  style={{ border: '4px solid #ffd700' }}
                >
                  <Avatar className="w-full h-full">
                    <AvatarImage 
                      src={`https://visage.surgeplay.com/bust/128/${popupData.player.ign}`}
                      alt={popupData.player.ign}
                      className="object-cover object-center scale-110"
                    />
                    <AvatarFallback className="bg-slate-700 text-white font-bold">
                      {popupData.player.ign.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Username */}
              <h3 
                className="font-bold mb-3"
                style={{ 
                  fontSize: '24px', 
                  lineHeight: '1.2',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                {/* Insert dynamic username here */}
                {popupData.player.ign}
              </h3>

              {/* Combat Master Badge */}
              <div 
                className="inline-flex items-center gap-2 mb-2"
                style={{
                  padding: '5px 10px',
                  background: 'rgba(255, 215, 0, 0.2)',
                  borderRadius: '8px'
                }}
              >
                <span style={{ color: '#ffd700', fontSize: '18px' }}>⚜</span>
                <span style={{ color: '#ffd700', fontSize: '16px', fontWeight: '500' }}>
                  Combat Master
                </span>
              </div>

              {/* Region */}
              <div 
                className="mb-4"
                style={{ 
                  fontSize: '14px', 
                  fontStyle: 'italic', 
                  color: '#a0a0a0',
                  marginTop: '5px' 
                }}
              >
                North America
              </div>
            </div>

            {/* Position Section */}
            <div 
              className="mb-4"
              style={{
                background: '#2e2e48',
                padding: '10px',
                borderRadius: '10px'
              }}
            >
              <h4 
                className="text-xs uppercase tracking-wider mb-2 font-semibold"
                style={{ color: '#a0a0a0' }}
              >
                POSITION
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span 
                    className="inline-block rounded"
                    style={{
                      background: '#ffcc00',
                      color: '#000',
                      padding: '5px 10px',
                      fontSize: '28px',
                      fontWeight: '700',
                      borderRadius: '5px'
                    }}
                  >
                    {position}.
                  </span>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '20px' }}>🏆</span>
                    <span 
                      style={{ 
                        fontSize: '16px', 
                        fontWeight: '400',
                        color: '#e0e0e0'
                      }}
                    >
                      OVERALL
                    </span>
                  </div>
                </div>
                <span 
                  style={{ 
                    fontSize: '14px',
                    color: '#e0e0e0'
                  }}
                >
                  ({playerPoints} points) {/* Connect to backend for points data */}
                </span>
              </div>
            </div>

            {/* Tiers Section */}
            <div>
              <h4 
                className="text-xs uppercase tracking-wider mb-2 font-semibold"
                style={{ color: '#a0a0a0' }}
              >
                TIERS
              </h4>
              <div 
                className="flex justify-center items-center"
                style={{
                  background: '#25253a',
                  padding: '10px',
                  borderRadius: '10px',
                  gap: '5px'
                }}
              >
                {orderedGamemodes.map((mode, index) => {
                  // Mock tier data matching image
                  const tierMap: Record<string, { code: string, color: string }> = {
                    'Mace': { code: 'HT1', color: '#ffd700' },
                    'Sword': { code: 'HT1', color: '#ffd700' }, 
                    'Crystal': { code: 'HT1', color: '#ffd700' },
                    'Axe': { code: 'LT1', color: '#ffcc66' },
                    'SMP': { code: 'LT1', color: '#ffcc66' },
                    'UHC': { code: 'LT1', color: '#ffcc66' },
                    'NethPot': { code: 'HT2', color: '#9966ff' },
                    'Bedwars': { code: 'LT1', color: '#ffcc66' }
                  };
                  
                  const tier = tierMap[mode] || { code: 'LT1', color: '#ffcc66' };
                  
                  return (
                    <div
                      key={mode}
                      className="flex flex-col items-center relative"
                      style={{ width: '30px', height: '30px' }}
                    >
                      <GameModeIcon mode={mode.toLowerCase()} className="w-6 h-6" />
                      <div 
                        className="absolute -bottom-1 text-xs font-bold rounded px-1"
                        style={{ 
                          color: tier.color,
                          background: 'rgba(0, 0, 0, 0.7)',
                          fontSize: '8px',
                          lineHeight: '1'
                        }}
                      >
                        {tier.code}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
