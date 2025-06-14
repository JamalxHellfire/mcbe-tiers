
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { UltraRankBadge } from './UltraRankBadge';

interface RankPopupSystemProps {
  rank: string;
  isVisible: boolean;
  onClose: () => void;
  playerName?: string;
  points?: number;
  previousRank?: string;
}

const RANK_MESSAGES = {
  'Combat Grandmaster': {
    title: 'LEGENDARY ACHIEVEMENT!',
    message: 'You have ascended to the pinnacle of combat mastery!',
    subtitle: 'Only the elite few reach this legendary status.',
    bgEffect: 'legendary-explosion'
  },
  'Combat Master': {
    title: 'MASTER ACHIEVED!',
    message: 'Your tactical brilliance has been recognized!',
    subtitle: 'Command respect on every battlefield.',
    bgEffect: 'royal-flames'
  },
  'Combat Ace': {
    title: 'ACE STATUS!',
    message: 'Your precision and skill shine bright!',
    subtitle: 'Soar above the competition.',
    bgEffect: 'stellar-burst'
  },
  'Combat Specialist': {
    title: 'SPECIALIST RANK!',
    message: 'Your expertise has been acknowledged!',
    subtitle: 'Tactical prowess recognized.',
    bgEffect: 'tactical-grid'
  },
  'Combat Cadet': {
    title: 'CADET PROMOTION!',
    message: 'Your training has paid off!',
    subtitle: 'Ready for greater challenges.',
    bgEffect: 'energy-burst'
  },
  'Combat Novice': {
    title: 'NOVICE ACHIEVED!',
    message: 'Your journey begins here!',
    subtitle: 'First steps into combat mastery.',
    bgEffect: 'gentle-glow'
  },
  'Rookie': {
    title: 'WELCOME ROOKIE!',
    message: 'Your adventure starts now!',
    subtitle: 'Every master was once a rookie.',
    bgEffect: 'subtle-shine'
  }
};

export function RankPopupSystem({ 
  rank, 
  isVisible, 
  onClose, 
  playerName, 
  points, 
  previousRank 
}: RankPopupSystemProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const rankData = RANK_MESSAGES[rank as keyof typeof RANK_MESSAGES] || RANK_MESSAGES['Rookie'];

  useEffect(() => {
    if (isVisible) {
      // Delay badge popup to create sequence
      const timer = setTimeout(() => {
        setShowBadgePopup(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowBadgePopup(false);
    }
  }, [isVisible]);

  // Simulated sound effects (in a real implementation, you'd use actual audio files)
  const playRankSound = (rankName: string) => {
    if (!soundEnabled) return;
    
    // This would play actual audio files in a real implementation
    console.log(`Playing sound for rank: ${rankName}`);
    
    // You can implement actual audio here:
    // const audio = new Audio(`/sounds/${rankName.toLowerCase().replace(' ', '-')}.mp3`);
    // audio.play().catch(console.error);
  };

  useEffect(() => {
    if (isVisible) {
      playRankSound(rank);
    }
  }, [isVisible, rank, soundEnabled]);

  const getBgEffectClass = (effect: string) => {
    switch (effect) {
      case 'legendary-explosion':
        return 'bg-gradient-radial from-purple-900/80 via-violet-800/60 to-black/90';
      case 'royal-flames':
        return 'bg-gradient-radial from-orange-900/80 via-red-800/60 to-black/90';
      case 'stellar-burst':
        return 'bg-gradient-radial from-blue-900/80 via-cyan-800/60 to-black/90';
      case 'tactical-grid':
        return 'bg-gradient-radial from-green-900/80 via-emerald-800/60 to-black/90';
      case 'energy-burst':
        return 'bg-gradient-radial from-orange-800/80 via-yellow-700/60 to-black/90';
      case 'gentle-glow':
        return 'bg-gradient-radial from-slate-800/80 via-gray-700/60 to-black/90';
      default:
        return 'bg-gradient-radial from-gray-800/80 via-slate-700/60 to-black/90';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed inset-0 z-[9999] flex items-center justify-center ${getBgEffectClass(rankData.bgEffect)}`}
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Ultra background effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0">
              {Array.from({ length: 50 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>

            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/60" />
          </div>

          {/* Main popup content */}
          <motion.div
            className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 p-8 max-w-md w-full mx-4 text-center overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 50px rgba(255, 255, 255, 0.1)'
            }}
            initial={{ scale: 0.5, opacity: 0, rotateX: -15 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateX: 15 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.8 
            }}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white/80" />
            </motion.button>

            {/* Sound toggle */}
            <motion.button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-white/80" />
              ) : (
                <VolumeX className="w-5 h-5 text-white/80" />
              )}
            </motion.button>

            {/* Ultra rank badge */}
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <UltraRankBadge 
                rank={rank} 
                size="xl" 
                showPopup={showBadgePopup}
                onPopupComplete={() => console.log('Badge animation complete')}
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl font-black text-white mb-2 tracking-wider"
              style={{
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)',
                background: 'linear-gradient(45deg, #ffffff, #f0f0f0, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {rankData.title}
            </motion.h1>

            {/* Player name */}
            {playerName && (
              <motion.div
                className="text-xl font-bold text-blue-300 mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                {playerName}
              </motion.div>
            )}

            {/* Main message */}
            <motion.p
              className="text-lg text-white/90 mb-2 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              {rankData.message}
            </motion.p>

            {/* Subtitle */}
            <motion.p
              className="text-sm text-white/70 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              {rankData.subtitle}
            </motion.p>

            {/* Points display */}
            {points && (
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 }}
              >
                <div className="text-2xl font-black text-yellow-300 mb-1">
                  {points} Points
                </div>
                {previousRank && (
                  <div className="text-sm text-white/60">
                    Promoted from {previousRank}
                  </div>
                )}
              </motion.div>
            )}

            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/5 rounded-full blur-xl" />
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-white/5 rounded-full blur-xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
