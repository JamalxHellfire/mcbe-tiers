
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

  const getTierData = (mode: GameMode) => {
    // Mock tier data matching image with better styling
    const tierMap: Record<string, { code: string, color: string, bgColor: string }> = {
      'Mace': { code: 'HT1', color: '#ffd700', bgColor: 'rgba(255, 215, 0, 0.15)' },
      'Sword': { code: 'HT1', color: '#ffd700', bgColor: 'rgba(255, 215, 0, 0.15)' }, 
      'Crystal': { code: 'HT1', color: '#ffd700', bgColor: 'rgba(255, 215, 0, 0.15)' },
      'Axe': { code: 'LT1', color: '#ffcc66', bgColor: 'rgba(255, 204, 102, 0.15)' },
      'SMP': { code: 'LT1', color: '#ffcc66', bgColor: 'rgba(255, 204, 102, 0.15)' },
      'UHC': { code: 'LT1', color: '#ffcc66', bgColor: 'rgba(255, 204, 102, 0.15)' },
      'NethPot': { code: 'HT2', color: '#9966ff', bgColor: 'rgba(153, 102, 255, 0.15)' },
      'Bedwars': { code: 'LT1', color: '#ffcc66', bgColor: 'rgba(255, 204, 102, 0.15)' }
    };
    
    return tierMap[mode] || { code: 'LT1', color: '#ffcc66', bgColor: 'rgba(255, 204, 102, 0.15)' };
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ 
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
      >
        <motion.div
          className="relative max-w-md w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #2e2e48 100%)',
            color: '#ffffff',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
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
            className="absolute top-4 right-4 bg-none border-none text-white cursor-pointer transition-all duration-300 hover:opacity-70 hover:scale-110 z-10 p-2 rounded-full hover:bg-white/10"
            style={{ fontSize: '20px' }}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Section */}
          <div className="text-center mb-8">
            {/* Avatar */}
            <div className="mb-6">
              <div 
                className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-lg"
                style={{ 
                  border: '4px solid #ffd700',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
                }}
              >
                <Avatar className="w-full h-full">
                  <AvatarImage 
                    src={`https://visage.surgeplay.com/bust/128/${popupData.player.ign}`}
                    alt={popupData.player.ign}
                    className="object-cover object-center scale-110"
                  />
                  <AvatarFallback className="bg-slate-700 text-white font-bold text-2xl">
                    {popupData.player.ign.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Username */}
            <h3 
              className="font-bold mb-4"
              style={{ 
                fontSize: '28px', 
                lineHeight: '1.2',
                fontFamily: 'Arial, Helvetica, sans-serif',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              {popupData.player.ign}
            </h3>

            {/* Combat Master Badge */}
            <div 
              className="inline-flex items-center gap-3 mb-3 px-4 py-2 rounded-lg"
              style={{
                background: 'rgba(255, 215, 0, 0.2)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.1)'
              }}
            >
              <span style={{ color: '#ffd700', fontSize: '20px' }}>⚜</span>
              <span style={{ color: '#ffd700', fontSize: '18px', fontWeight: '600' }}>
                Combat Master
              </span>
            </div>

            {/* Region */}
            <div 
              className="mb-6"
              style={{ 
                fontSize: '15px', 
                fontStyle: 'italic', 
                color: '#a0a0a0',
                marginTop: '8px' 
              }}
            >
              North America
            </div>
          </div>

          {/* Position Section */}
          <div 
            className="mb-6 p-4 rounded-xl"
            style={{
              background: 'rgba(46, 46, 72, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h4 
              className="text-xs uppercase tracking-wider mb-3 font-semibold"
              style={{ color: '#a0a0a0' }}
            >
              POSITION
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span 
                  className="inline-block rounded-lg shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #ffcc00, #ffd700)',
                    color: '#000',
                    padding: '8px 12px',
                    fontSize: '32px',
                    fontWeight: '700',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {position}.
                </span>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '24px' }}>🏆</span>
                  <span 
                    style={{ 
                      fontSize: '18px', 
                      fontWeight: '500',
                      color: '#e0e0e0'
                    }}
                  >
                    OVERALL
                  </span>
                </div>
              </div>
              <span 
                style={{ 
                  fontSize: '15px',
                  color: '#e0e0e0',
                  fontWeight: '500'
                }}
              >
                ({playerPoints} points)
              </span>
            </div>
          </div>

          {/* Tiers Section */}
          <div>
            <h4 
              className="text-xs uppercase tracking-wider mb-4 font-semibold"
              style={{ color: '#a0a0a0' }}
            >
              TIERS
            </h4>
            <div 
              className="grid grid-cols-4 gap-3 p-4 rounded-xl"
              style={{
                background: 'rgba(37, 37, 58, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {orderedGamemodes.map((mode, index) => {
                const tier = getTierData(mode);
                
                return (
                  <motion.div
                    key={mode}
                    className="flex flex-col items-center relative group cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg p-2 mb-2 transition-all duration-300"
                      style={{ 
                        background: tier.bgColor,
                        border: `1px solid ${tier.color}30`,
                        boxShadow: `0 2px 8px ${tier.color}20`
                      }}
                    >
                      <GameModeIcon mode={mode.toLowerCase()} className="w-full h-full object-contain" />
                    </div>
                    <div 
                      className="text-xs font-bold rounded px-2 py-1 min-w-[32px] text-center"
                      style={{ 
                        color: tier.color,
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: `1px solid ${tier.color}40`,
                        fontSize: '10px',
                        lineHeight: '1',
                        boxShadow: `0 1px 4px ${tier.color}20`
                      }}
                    >
                      {tier.code}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
