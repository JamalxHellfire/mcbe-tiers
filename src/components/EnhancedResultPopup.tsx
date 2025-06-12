
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
    'NA': { name: 'North America', color: '#3b82f6' },
    'EU': { name: 'Europe', color: '#16a34a' },
    'ASIA': { name: 'Asia', color: '#dc2626' },
    'SA': { name: 'South America', color: '#ca8a04' },
    'AF': { name: 'Africa', color: '#9333ea' },
    'OCE': { name: 'Oceania', color: '#0891b2' }
  };
  
  return regions[regionCode] || regions['NA'];
};

// Enhanced rank-based visual effects
const getRankEffects = (points: number) => {
  if (points >= 200) {
    return {
      rank: 'Combat General',
      bgGradient: 'from-yellow-400/40 via-orange-500/30 to-amber-600/40',
      borderColor: 'border-yellow-400/80',
      shadowColor: 'shadow-yellow-400/60',
      iconColor: 'text-yellow-300',
      icon: Crown,
      particles: 'gold',
      glowEffect: 'shadow-[0_0_40px_rgba(251,191,36,0.8)]',
      animation: 'animate-pulse',
      badgeGlow: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      textGlow: 'text-yellow-200 drop-shadow-[0_0_10px_rgba(251,191,36,1)]'
    };
  } else if (points >= 150) {
    return {
      rank: 'Combat Marshal',
      bgGradient: 'from-red-500/35 via-pink-500/25 to-rose-600/35',
      borderColor: 'border-red-400/75',
      shadowColor: 'shadow-red-400/55',
      iconColor: 'text-red-300',
      icon: Sword,
      particles: 'red',
      glowEffect: 'shadow-[0_0_30px_rgba(239,68,68,0.7)]',
      animation: 'animate-bounce',
      badgeGlow: 'bg-gradient-to-r from-red-500 to-pink-500',
      textGlow: 'text-red-200 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]'
    };
  } else if (points >= 120) {
    return {
      rank: 'Combat Ace',
      bgGradient: 'from-blue-500/30 via-cyan-500/20 to-indigo-600/30',
      borderColor: 'border-blue-400/70',
      shadowColor: 'shadow-blue-400/50',
      iconColor: 'text-blue-300',
      icon: Star,
      particles: 'blue',
      glowEffect: 'shadow-[0_0_25px_rgba(59,130,246,0.6)]',
      animation: 'animate-pulse',
      badgeGlow: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      textGlow: 'text-blue-200 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]'
    };
  } else if (points >= 70) {
    return {
      rank: 'Combat Sargent',
      bgGradient: 'from-orange-500/25 via-amber-500/15 to-yellow-600/25',
      borderColor: 'border-orange-400/65',
      shadowColor: 'shadow-orange-400/45',
      iconColor: 'text-orange-300',
      icon: Shield,
      particles: 'orange',
      glowEffect: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]',
      animation: 'animate-pulse',
      badgeGlow: 'bg-gradient-to-r from-orange-500 to-amber-500',
      textGlow: 'text-orange-200 drop-shadow-[0_0_4px_rgba(249,115,22,0.7)]'
    };
  } else {
    return {
      rank: 'Combat Rookie',
      bgGradient: 'from-gray-500/15 via-slate-500/10 to-gray-600/15',
      borderColor: 'border-gray-400/40',
      shadowColor: 'shadow-gray-400/25',
      iconColor: 'text-gray-400',
      icon: Trophy,
      particles: 'gray',
      glowEffect: 'shadow-[0_0_15px_rgba(107,114,128,0.3)]',
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

    canvas.width = 500;
    canvas.height = 600;

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
        x: x + (Math.random() - 0.5) * 80,
        y: y + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * -2 - 0.5,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        size: Math.random() * 3 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        opacity: 0.7 + Math.random() * 0.3
      });
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new particles around avatar area
      if (Math.random() < 0.3) {
        createParticle(250, 180); // Center around avatar position
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
    code = 'HT1';
    color = 'text-yellow-400';
  } else if (tier.includes('T2')) {
    code = 'LT1'; 
    color = 'text-orange-400';
  } else if (tier.includes('T3')) {
    code = 'HT2';
    color = 'text-blue-400';
  } else if (tier.includes('T4')) {
    code = 'LT2';
    color = 'text-green-400';
  } else if (tier.includes('T5')) {
    code = 'HT3';
    color = 'text-purple-400';
  }
  
  if (tier.includes('H')) {
    label = '';
    color = color.replace('400', '300'); // Brighter for high tiers
  } else if (tier.includes('L')) {
    label = '';
  }
  
  return { code, label, color };
};

// Position badge component with custom styling
const PositionBadge = ({ position, points, rankEffects }: { position: number, points: number, rankEffects: any }) => {
  return (
    <motion.div 
      className={`relative flex items-center justify-between p-4 rounded-xl border-2 ${rankEffects.borderColor} ${rankEffects.glowEffect} backdrop-blur-sm bg-black/60`}
      initial={{ scale: 0, rotate: -5 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
    >
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-16 h-16 rounded-xl ${rankEffects.badgeGlow} ${rankEffects.animation} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          <span className="text-2xl font-black text-white relative z-10">
            {position}
          </span>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className={`text-xl font-bold ${rankEffects.textGlow}`}>OVERALL</span>
          </div>
          <span className="text-sm text-white/80 font-medium">{points} points</span>
        </div>
      </div>
    </motion.div>
  );
};

export function EnhancedResultPopup() {
  const { popupData, showPopup, closePopup } = usePopup();
  
  if (!showPopup || !popupData) return null;

  const playerPoints = popupData.player.global_points || 0;
  const rankEffects = getRankEffects(playerPoints);
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
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={`relative rounded-2xl w-full max-w-md border-3 ${rankEffects.borderColor} ${rankEffects.glowEffect} overflow-hidden bg-slate-900/95`}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Particle Effects */}
            <ParticleEffect type={rankEffects.particles} isVisible={showPopup} />

            {/* Animated Background Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${rankEffects.bgGradient} ${rankEffects.animation}`} />

            {/* Close Button */}
            <motion.button
              onClick={closePopup}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>

            {/* Content */}
            <div className="relative z-20 p-6">
              {/* Header with Avatar */}
              <div className="text-center mb-6">
                <motion.div 
                  className="relative mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <div className={`w-24 h-24 rounded-full border-4 ${rankEffects.borderColor} overflow-hidden mx-auto shadow-xl ${rankEffects.animation}`}>
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
                  
                  {/* Rank icon overlay */}
                  <motion.div
                    className={`absolute -bottom-2 -right-2 w-10 h-10 ${rankEffects.badgeGlow} rounded-full border-3 ${rankEffects.borderColor} flex items-center justify-center shadow-lg ${rankEffects.animation}`}
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <RankIcon className="w-5 h-5 text-white" />
                  </motion.div>
                </motion.div>

                {/* Player Name */}
                <motion.h3 
                  className={`text-2xl font-bold mb-3 ${rankEffects.textGlow}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {popupData.player.ign}
                </motion.h3>

                {/* Rank Badge */}
                <motion.div 
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${rankEffects.badgeGlow} shadow-xl border-2 border-white/20 backdrop-blur-sm ${rankEffects.animation}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <RankIcon className="w-4 h-4 text-white" />
                  <span className="text-white font-bold text-sm">{rankEffects.rank}</span>
                </motion.div>

                {/* Region Badge */}
                <motion.div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mt-3 border border-white/20 backdrop-blur-sm"
                  style={{ backgroundColor: `${regionInfo.color}40` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: regionInfo.color }}
                  />
                  <span className="text-white font-medium text-xs">{regionInfo.name}</span>
                </motion.div>
              </div>

              {/* Position Section */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h4 className="text-slate-300 text-xs uppercase tracking-wider mb-3 font-bold text-center">
                  POSITION
                </h4>
                <PositionBadge position={position} points={playerPoints} rankEffects={rankEffects} />
              </motion.div>

              {/* Tiers Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h4 className="text-slate-300 text-xs uppercase tracking-wider mb-3 font-bold text-center">
                  TIERS
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {orderedGamemodes.map((mode, index) => {
                    const assignment = popupData.tierAssignments.find(a => a.gamemode === mode);
                    const tier = assignment?.tier || 'Not Ranked';
                    const { code, label, color } = formatTierDisplay(tier);
                    
                    return (
                      <motion.div
                        key={mode}
                        className="flex flex-col items-center p-2 bg-slate-800/50 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col items-center cursor-help">
                                <div className="mb-1">
                                  <GameModeIcon mode={mode.toLowerCase()} className="w-5 h-5" />
                                </div>
                                <div className="text-center">
                                  {tier !== 'Not Ranked' ? (
                                    <div className="flex flex-col items-center">
                                      <span className={`text-xs font-bold ${color}`}>{code}</span>
                                      {label && <span className="text-xs text-white/60">{label}</span>}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500 text-xs">NR</span>
                                  )}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-center">
                                <p className="font-medium">{toDisplayGameMode(mode)}</p>
                                {tier !== 'Not Ranked' ? (
                                  <p className="text-sm">{assignment?.points || 0} points</p>
                                ) : (
                                  <p className="text-sm">Not Ranked</p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>
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
