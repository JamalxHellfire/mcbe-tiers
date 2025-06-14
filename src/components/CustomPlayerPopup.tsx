
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePopup } from '@/contexts/PopupContext';

// Tier icon components
const TierIcon = ({ type, color }: { type: string; color: string }) => {
  const getIcon = () => {
    switch (type) {
      case 'HT1':
        return (
          <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white" style={{ borderColor: color, backgroundColor: color }}>
            ◆
          </div>
        );
      case 'HT2':
        return (
          <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white" style={{ borderColor: color, backgroundColor: color }}>
            ✓
          </div>
        );
      case 'LT1':
        return (
          <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white" style={{ borderColor: color, backgroundColor: color }}>
            🔫
          </div>
        );
      case 'LT2':
        return (
          <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white" style={{ borderColor: color, backgroundColor: color }}>
            ⚡
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white" style={{ borderColor: color, backgroundColor: color }}>
            ♥
          </div>
        );
    }
  };

  return getIcon();
};

export function CustomPlayerPopup() {
  const { popupData, showPopup, closePopup } = usePopup();
  
  if (!showPopup || !popupData) return null;

  const playerPoints = popupData.player.global_points || 390;
  const position = popupData.player.overall_rank || 1;

  // Mock tier data exactly as shown in image
  const tiers = [
    { type: 'HT1', color: '#800080' }, // Purple
    { type: 'HT1', color: '#800080' }, // Purple  
    { type: 'HT1', color: '#800080' }, // Purple
    { type: 'LT1', color: '#0000FF' }, // Blue
    { type: 'LT1', color: '#0000FF' }, // Blue
    { type: 'LT1', color: '#0000FF' }, // Blue
    { type: 'HT2', color: '#FF0000' }, // Red
    { type: 'LT1', color: '#FF69B4' }  // Pink
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
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="relative w-full max-w-[320px] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: '#1A1A2E',
              border: '1px solid #2D2D42'
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
              className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="p-6 text-center">
              {/* Avatar Section */}
              <div className="mb-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div 
                    className="w-full h-full rounded-full border-3 overflow-hidden"
                    style={{ borderColor: '#FFD700' }}
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

                {/* Player Name */}
                <h3 className="text-xl font-bold mb-3 text-white" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
                  {popupData.player.ign}
                </h3>

                {/* Combat Master Badge */}
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-sm font-medium"
                  style={{ 
                    background: '#FFD700',
                    color: '#1A1A2E',
                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
                  }}
                >
                  <span className="text-sm">♦</span>
                  <span className="font-bold">Combat Master</span>
                </div>

                {/* Region */}
                <div className="text-gray-400 text-xs mb-3" style={{ color: '#A0A0A0' }}>
                  North America
                </div>

                {/* NameMC Link */}
                <div className="flex items-center justify-center gap-1.5 mb-6">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">n</span>
                  </div>
                  <span className="text-gray-400 text-xs cursor-pointer hover:text-blue-400 transition-colors">NameMC ↗</span>
                </div>
              </div>

              {/* Position Section */}
              <div className="mb-6">
                <h4 className="text-white text-sm font-medium mb-3 text-left uppercase tracking-wider">
                  POSITION
                </h4>
                <div 
                  className="rounded-lg p-3 flex items-center justify-between"
                  style={{ background: '#FFC107' }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-lg"
                      style={{ background: '#FF8F00' }}
                    >
                      {position}
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-white" />
                      <span className="text-white font-bold text-sm">OVERALL</span>
                    </div>
                  </div>
                  <span className="text-white text-sm">
                    ({playerPoints} points)
                  </span>
                </div>
              </div>

              {/* Tiers Section */}
              <div>
                <h4 className="text-white text-sm font-medium mb-3 text-left uppercase tracking-wider">
                  TIERS
                </h4>
                <div 
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(45, 45, 66, 0.6)' }}
                >
                  <div className="flex justify-center gap-2 flex-wrap">
                    {tiers.map((tier, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <TierIcon type={tier.type} color={tier.color} />
                        <span className="text-xs mt-1 font-bold" style={{ color: tier.color }}>
                          {tier.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
