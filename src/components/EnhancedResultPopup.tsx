
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Star, Crown, Shield, Sword } from 'lucide-react';
import { GameModeIcon } from './GameModeIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePopup } from '@/contexts/PopupContext';
import { GameMode } from '@/services/playerService';
import { toDisplayGameMode } from '@/utils/gamemodeUtils';
import { getPlayerRank } from '@/utils/rankUtils';

// Helper to get region full name and colors
const getRegionInfo = (regionCode: string = 'NA') => {
  const regions: Record<string, { name: string, color: string }> = {
    'NA': { name: 'North America', color: '#dc2626' },
    'EU': { name: 'Europe', color: '#16a34a' },
    'ASIA': { name: 'Asia', color: '#2563eb' },
    'SA': { name: 'South America', color: '#ca8a04' },
    'AF': { name: 'Africa', color: '#9333ea' },
    'OCE': { name: 'Oceania', color: '#0891b2' }
  };
  
  return regions[regionCode] || regions['NA'];
};

// Enhanced rank-based visual effects
const getRankEffects = (rank: string) => {
  switch (rank) {
    case 'Combat General':
      return {
        bgGradient: 'from-yellow-400/30 via-orange-500/20 to-amber-600/30',
        borderColor: 'border-yellow-400/70',
        shadowColor: 'shadow-yellow-400/50',
        iconColor: 'text-yellow-300',
        icon: Crown,
        particles: 'gold',
        glowEffect: 'shadow-[0_0_30px_rgba(251,191,36,0.6)]',
        animation: 'animate-pulse',
        badgeGlow: 'bg-gradient-to-r from-yellow-400 to-orange-500',
        textGlow: 'text-yellow-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
      };
    case 'Combat Marshal':
      return {
        bgGradient: 'from-red-500/30 via-pink-500/20 to-rose-600/30',
        borderColor: 'border-red-400/70',
        shadowColor: 'shadow-red-400/50',
        iconColor: 'text-red-300',
        icon: Sword,
        particles: 'red',
        glowEffect: 'shadow-[0_0_25px_rgba(239,68,68,0.6)]',
        animation: 'animate-bounce',
        badgeGlow: 'bg-gradient-to-r from-red-500 to-pink-500',
        textGlow: 'text-red-200 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]'
      };
    case 'Combat Ace':
      return {
        bgGradient: 'from-blue-500/30 via-cyan-500/20 to-indigo-600/30',
        borderColor: 'border-blue-400/70',
        shadowColor: 'shadow-blue-400/50',
        iconColor: 'text-blue-300',
        icon: Star,
        particles: 'blue',
        glowEffect: 'shadow-[0_0_20px_rgba(59,130,246,0.6)]',
        animation: 'animate-pulse',
        badgeGlow: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        textGlow: 'text-blue-200 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]'
      };
    case 'Combat Sargent':
      return {
        bgGradient: 'from-orange-500/30 via-amber-500/20 to-yellow-600/30',
        borderColor: 'border-orange-400/70',
        shadowColor: 'shadow-orange-400/50',
        iconColor: 'text-orange-300',
        icon: Shield,
        particles: 'orange',
        glowEffect: 'shadow-[0_0_15px_rgba(249,115,22,0.6)]',
        animation: 'animate-pulse',
        badgeGlow: 'bg-gradient-to-r from-orange-500 to-amber-500',
        textGlow: 'text-orange-200 drop-shadow-[0_0_4px_rgba(249,115,22,0.8)]'
      };
    default: // Combat Rookie
      return {
        bgGradient: 'from-gray-500/20 via-slate-500/15 to-gray-600/20',
        borderColor: 'border-gray-400/50',
        shadowColor: 'shadow-gray-400/30',
        iconColor: 'text-gray-400',
        icon: Trophy,
        particles: 'gray',
        glowEffect: 'shadow-[0_0_10px_rgba(107,114,128,0.4)]',
        animation: '',
        badgeGlow: 'bg-gradient-to-r from-gray-500 to-slate-500',
        textGlow: 'text-gray-300'
      };
  }
};

// Enhanced particle effect component
const ParticleEffect = ({ type, isVisible }: { type: string, isVisible: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 700;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      opacity: number;
    }> = [];

    const colors = {
      gold: ['#ffd700', '#ffec8b', '#fff176', '#ffc107'],
      red: ['#ff4444', '#ff6b6b', '#ff8a8a', '#e53e3e'],
      blue: ['#4dabf7', '#74c0fc', '#a5d8ff', '#3182ce'],
      orange: ['#ff922b', '#ffb366', '#ffc947', '#ed8936'],
      gray: ['#868e96', '#adb5bd', '#ced4da', '#718096']
    };

    const particleColors = colors[type as keyof typeof colors] || colors.gray;

    const createParticle = (x: number, y: number) => {
      particles.push({
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * -3 - 1,
        life: 0,
        maxLife: 80 + Math.random() * 60,
        size: Math.random() * 4 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        opacity: 0.8 + Math.random() * 0.2
      });
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new particles around avatar area
      if (Math.random() < 0.4) {
        createParticle(300, 200); // Center around avatar position
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const alpha = (1 - p.life / p.maxLife) * p.opacity;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [type, isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Format tier for display
const formatTierDisplay = (tier: string): { code: string, label: string, color: string } => {
  if (tier === 'Retired') return { code: 'RT', label: '', color: 'text-gray-500' };
  if (tier === 'Not Ranked') return { code: 'NR', label: '', color: 'text-gray-600' };
  
  let code = 'T?';
  let label = '';
  let color = 'text-white';
  
  if (tier.includes('T1')) {
    code = 'T1';
    color = 'text-yellow-400';
  } else if (tier.includes('T2')) {
    code = 'T2'; 
    color = 'text-orange-400';
  } else if (tier.includes('T3')) {
    code = 'T3';
    color = 'text-blue-400';
  } else if (tier.includes('T4')) {
    code = 'T4';
    color = 'text-green-400';
  } else if (tier.includes('T5')) {
    code = 'T5';
    color = 'text-purple-400';
  }
  
  if (tier.includes('H')) {
    label = 'High';
    color = color.replace('400', '300'); // Brighter for high tiers
  } else if (tier.includes('L')) {
    label = 'Low';
  }
  
  return { code, label, color };
};

// Position badge component with custom styling
const PositionBadge = ({ position, rankEffects }: { position: number, rankEffects: any }) => {
  const getPositionSuffix = (pos: number) => {
    if (pos === 1) return 'st';
    if (pos === 2) return 'nd';
    if (pos === 3) return 'rd';
    return 'th';
  };

  return (
    <motion.div 
      className={`relative flex items-center gap-3 p-4 rounded-xl border-2 ${rankEffects.borderColor} ${rankEffects.glowEffect} backdrop-blur-sm`}
      style={{ 
        background: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.5))`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
      }}
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
    >
      <div className={`flex items-center justify-center w-16 h-16 rounded-xl ${rankEffects.badgeGlow} ${rankEffects.animation} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <span className="text-2xl font-black text-white relative z-10">
          {position}
        </span>
        <span className="text-xs font-bold text-white/90 absolute bottom-1 right-1">
          {getPositionSuffix(position)}
        </span>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className={`text-xl font-bold ${rankEffects.textGlow}`}>OVERALL</span>
        </div>
        <span className="text-sm text-white/80 font-medium">Global Position</span>
      </div>
    </motion.div>
  );
};

export function EnhancedResultPopup() {
  const { popupData, showPopup, closePopup } = usePopup();
  
  if (!showPopup || !popupData) return null;

  const playerPoints = popupData.player.global_points || 0;
  const playerRank = getPlayerRank(playerPoints);
  const rankEffects = getRankEffects(playerRank.title);
  const RankIcon = rankEffects.icon;
  const region = popupData.player.region || 'NA';
  const regionInfo = getRegionInfo(region);
  const position = popupData.player.overall_rank || 1;

  // Ordered gamemode layout
  const orderedGamemodes: GameMode[] = [
    'Crystal', 'Sword', 'Bedwars',
    'Mace', 'SMP', 'UHC',
    'NethPot', 'Axe'
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
          className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={`relative rounded-3xl w-full max-w-lg border-3 ${rankEffects.borderColor} ${rankEffects.glowEffect} overflow-hidden`}
            style={{
              background: `linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f172a 100%)`,
              boxShadow: `0 25px 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)`
            }}
            initial={{ scale: 0.7, opacity: 0, y: 100, rotateX: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 100, rotateX: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.6 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Particle Effects */}
            <ParticleEffect type={rankEffects.particles} isVisible={showPopup} />

            {/* Animated Background Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${rankEffects.bgGradient} ${rankEffects.animation} opacity-40`} />
            
            {/* Glassmorphism Layer */}
            <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-b from-white/5 to-transparent" />

            {/* Close Button */}
            <motion.button
              onClick={closePopup}
              className="absolute top-6 right-6 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 z-30 group"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-6 h-6 text-white group-hover:text-red-400 transition-colors" />
            </motion.button>

            {/* Content */}
            <div className="relative z-20 p-8">
              {/* Header with Enhanced Avatar */}
              <div className="text-center mb-8">
                <motion.div 
                  className="relative mx-auto mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {/* Animated Avatar Ring */}
                  <div className={`absolute inset-0 w-32 h-32 rounded-full ${rankEffects.glowEffect} ${rankEffects.animation}`} 
                       style={{ background: `conic-gradient(${rankEffects.badgeGlow}, transparent, ${rankEffects.badgeGlow})` }} />
                  
                  <div className="relative w-28 h-28 rounded-full border-4 border-white/20 overflow-hidden mx-auto shadow-2xl backdrop-blur-sm">
                    <Avatar className="w-full h-full">
                      <AvatarImage 
                        src={`https://visage.surgeplay.com/bust/128/${popupData.player.ign}`}
                        alt={popupData.player.ign}
                        className="object-cover object-center scale-110 transition-transform duration-300 hover:scale-125"
                      />
                      <AvatarFallback className="bg-slate-700 text-white font-bold text-2xl">
                        {popupData.player.ign.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Enhanced Rank Icon */}
                  <motion.div
                    className={`absolute -bottom-2 -right-2 w-12 h-12 ${rankEffects.badgeGlow} ${rankEffects.iconColor} rounded-full border-4 border-white/30 flex items-center justify-center shadow-xl ${rankEffects.animation} backdrop-blur-sm`}
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                  >
                    <RankIcon className="w-6 h-6" />
                  </motion.div>
                </motion.div>

                {/* Player Name with Enhanced Typography */}
                <motion.h2 
                  className={`text-3xl font-black mb-3 ${rankEffects.textGlow}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {popupData.player.ign}
                </motion.h2>

                {/* Enhanced Rank Badge */}
                <motion.div 
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${rankEffects.badgeGlow} shadow-xl border-2 border-white/20 backdrop-blur-sm ${rankEffects.animation}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <RankIcon className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-lg">{playerRank.title}</span>
                </motion.div>

                {/* Region Badge */}
                <motion.div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-4 border border-white/20 backdrop-blur-sm"
                  style={{ backgroundColor: `${regionInfo.color}40` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: regionInfo.color }}
                  />
                  <span className="text-white font-medium text-sm">{regionInfo.name}</span>
                </motion.div>
              </div>

              {/* Enhanced Position Section */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-white/80 text-sm uppercase tracking-wider mb-4 font-bold text-center">
                  POSITION
                </h3>
                <PositionBadge position={position} rankEffects={rankEffects} />
              </motion.div>

              {/* Enhanced Tiers Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-white/80 text-sm uppercase tracking-wider mb-4 font-bold text-center">
                  TIERS
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {orderedGamemodes.map((mode, index) => {
                    const assignment = popupData.tierAssignments.find(a => a.gamemode === mode);
                    const tier = assignment?.tier || 'Not Ranked';
                    const { code, label, color } = formatTierDisplay(tier);
                    
                    return (
                      <motion.div
                        key={mode}
                        className="group relative"
                        initial={{ opacity: 0, scale: 0.7, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.05 }}
                        whileHover={{ scale: 1.1, y: -5 }}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col items-center p-4 bg-black/40 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm group-hover:bg-black/60 cursor-help">
                                <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                                  <GameModeIcon mode={mode.toLowerCase()} className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                  {tier !== 'Not Ranked' ? (
                                    <div className="flex flex-col items-center">
                                      <span className={`font-black text-sm ${color} drop-shadow-lg`}>{code}</span>
                                      {label && <span className="text-xs text-white/60 font-medium">{label}</span>}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 text-xs font-medium">NR</span>
                                  )}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-black/90 border-white/20">
                              <div className="text-center">
                                <p className="font-bold text-white">{toDisplayGameMode(mode)}</p>
                                {tier !== 'Not Ranked' ? (
                                  <p className="text-sm text-white/80">{assignment?.points || 0} points</p>
                                ) : (
                                  <p className="text-sm text-gray-400">Not Ranked</p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
