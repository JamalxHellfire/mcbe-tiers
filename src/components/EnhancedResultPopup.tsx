
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Star, Crown, Shield, Sword } from 'lucide-react';
import { GameModeIcon } from './GameModeIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePopup } from '@/contexts/PopupContext';
import { GameMode } from '@/services/playerService';
import { toDisplayGameMode } from '@/utils/gamemodeUtils';

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

// Enhanced rank-based visual effects matching the new rank system
const getRankEffects = (points: number) => {
  if (points >= 400) {
    return {
      rank: 'Combat Grandmaster',
      bgGradient: 'from-purple-600/50 via-violet-500/40 to-indigo-600/50',
      borderColor: 'border-purple-400',
      shadowEffect: 'shadow-[0_0_60px_rgba(147,51,234,0.9)]',
      iconColor: 'text-purple-300',
      icon: Crown,
      particles: 'purple',
      animation: 'animate-pulse',
      badgeStyle: 'bg-gradient-to-r from-purple-600 to-violet-500',
      textGlow: 'text-purple-100 drop-shadow-[0_0_20px_rgba(147,51,234,1)]',
      avatarGlow: 'shadow-[0_0_40px_rgba(147,51,234,0.9)]'
    };
  } else if (points >= 250) {
    return {
      rank: 'Combat Master',
      bgGradient: 'from-yellow-600/50 via-amber-500/40 to-orange-600/50',
      borderColor: 'border-yellow-400',
      shadowEffect: 'shadow-[0_0_50px_rgba(251,191,36,0.8)]',
      iconColor: 'text-yellow-300',
      icon: Crown,
      particles: 'gold',
      animation: 'animate-pulse',
      badgeStyle: 'bg-gradient-to-r from-yellow-600 to-amber-500',
      textGlow: 'text-yellow-100 drop-shadow-[0_0_15px_rgba(251,191,36,1)]',
      avatarGlow: 'shadow-[0_0_30px_rgba(251,191,36,0.8)]'
    };
  } else if (points >= 100) {
    return {
      rank: 'Combat Ace',
      bgGradient: 'from-blue-600/35 via-cyan-500/25 to-indigo-600/35',
      borderColor: 'border-blue-400',
      shadowEffect: 'shadow-[0_0_30px_rgba(59,130,246,0.6)]',
      iconColor: 'text-blue-300',
      icon: Star,
      particles: 'blue',
      animation: 'animate-pulse',
      badgeStyle: 'bg-gradient-to-r from-blue-600 to-cyan-500',
      textGlow: 'text-blue-100 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]',
      avatarGlow: 'shadow-[0_0_20px_rgba(59,130,246,0.6)]'
    };
  } else if (points >= 50) {
    return {
      rank: 'Combat Specialist',
      bgGradient: 'from-green-600/30 via-emerald-500/20 to-teal-600/30',
      borderColor: 'border-green-400',
      shadowEffect: 'shadow-[0_0_25px_rgba(34,197,94,0.5)]',
      iconColor: 'text-green-300',
      icon: Shield,
      particles: 'green',
      animation: 'animate-pulse',
      badgeStyle: 'bg-gradient-to-r from-green-600 to-emerald-500',
      textGlow: 'text-green-100 drop-shadow-[0_0_8px_rgba(34,197,94,0.7)]',
      avatarGlow: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]'
    };
  } else if (points >= 20) {
    return {
      rank: 'Combat Cadet',
      bgGradient: 'from-orange-600/30 via-amber-500/20 to-yellow-600/30',
      borderColor: 'border-orange-400',
      shadowEffect: 'shadow-[0_0_25px_rgba(249,115,22,0.5)]',
      iconColor: 'text-orange-300',
      icon: Sword,
      particles: 'orange',
      animation: 'animate-pulse',
      badgeStyle: 'bg-gradient-to-r from-orange-600 to-amber-500',
      textGlow: 'text-orange-100 drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]',
      avatarGlow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]'
    };
  } else if (points >= 10) {
    return {
      rank: 'Combat Novice',
      bgGradient: 'from-slate-600/20 via-gray-500/15 to-slate-700/20',
      borderColor: 'border-slate-500',
      shadowEffect: 'shadow-[0_0_20px_rgba(100,116,139,0.4)]',
      iconColor: 'text-slate-400',
      icon: Trophy,
      particles: 'silver',
      animation: '',
      badgeStyle: 'bg-gradient-to-r from-slate-600 to-gray-500',
      textGlow: 'text-slate-200',
      avatarGlow: 'shadow-[0_0_10px_rgba(100,116,139,0.4)]'
    };
  } else {
    return {
      rank: 'Rookie',
      bgGradient: 'from-gray-600/20 via-slate-500/15 to-gray-700/20',
      borderColor: 'border-gray-500',
      shadowEffect: 'shadow-[0_0_20px_rgba(107,114,128,0.4)]',
      iconColor: 'text-gray-400',
      icon: Trophy,
      particles: 'gray',
      animation: '',
      badgeStyle: 'bg-gradient-to-r from-gray-600 to-slate-500',
      textGlow: 'text-gray-200',
      avatarGlow: 'shadow-[0_0_10px_rgba(107,114,128,0.4)]'
    };
  }
};

// Enhanced floating particles effect
const FloatingParticles = ({ type, isVisible }: { type: string, isVisible: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
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
      angle: number;
    }> = [];

    const colors = {
      purple: ['#a855f7', '#c084fc', '#d8b4fe', '#8b5cf6'],
      gold: ['#ffd700', '#ffec8b', '#fff9c4', '#ffc107'],
      blue: ['#4dabf7', '#74c0fc', '#a5d8ff', '#3182ce'],
      green: ['#22c55e', '#4ade80', '#86efac', '#16a34a'],
      orange: ['#ff922b', '#ffb366', '#ffc947', '#ed8936'],
      silver: ['#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b'],
      gray: ['#adb5bd', '#ced4da', '#868e96', '#718096']
    };

    const particleColors = colors[type as keyof typeof colors] || colors.gray;

    const createParticle = () => {
      if (particles.length > 30) return;
      
      const x = Math.random() * canvas.width;
      const y = canvas.height + 10;
      
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1,
        vy: -Math.random() * 2 - 1,
        life: 0,
        maxLife: 120 + Math.random() * 60,
        size: Math.random() * 4 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        opacity: 0.8 + Math.random() * 0.2,
        angle: Math.random() * Math.PI * 2
      });
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.1) {
        createParticle();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.angle += 0.02;

        const fadeAlpha = Math.max(0, 1 - (p.life / p.maxLife));
        const alpha = p.opacity * fadeAlpha;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect for certain particles
        if (type === 'gold' || type === 'purple' || type === 'blue') {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
        
        ctx.restore();

        if (p.life >= p.maxLife || p.y < -10) {
          particles.splice(i, 1);
        }
      }

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

// Format tier display to match reference image
const formatTierDisplay = (tier: string): { code: string, label: string, color: string } => {
  if (tier === 'Retired') return { code: 'RT', label: '', color: 'text-gray-500' };
  if (tier === 'Not Ranked') return { code: 'NR', label: '', color: 'text-gray-600' };
  
  let code = 'T?';
  let label = '';
  let color = 'text-white';
  
  if (tier.includes('T1')) {
    code = tier.includes('H') ? 'HT1' : 'LT1';
    color = tier.includes('H') ? 'text-yellow-300' : 'text-yellow-400';
  } else if (tier.includes('T2')) {
    code = tier.includes('H') ? 'HT2' : 'LT2';
    color = tier.includes('H') ? 'text-orange-300' : 'text-orange-400';
  } else if (tier.includes('T3')) {
    code = tier.includes('H') ? 'HT3' : 'LT3';
    color = tier.includes('H') ? 'text-blue-300' : 'text-blue-400';
  } else if (tier.includes('T4')) {
    code = tier.includes('H') ? 'HT4' : 'LT4';
    color = tier.includes('H') ? 'text-green-300' : 'text-green-400';
  } else if (tier.includes('T5')) {
    code = tier.includes('H') ? 'HT5' : 'LT5';
    color = tier.includes('H') ? 'text-purple-300' : 'text-purple-400';
  }
  
  return { code, label, color };
};

// Position section matching reference design
const PositionSection = ({ position, points, rankEffects }: { position: number, points: number, rankEffects: any }) => {
  return (
    <motion.div 
      className={`relative p-4 rounded-xl border-2 ${rankEffects.borderColor} backdrop-blur-sm bg-slate-800/60 ${rankEffects.shadowEffect}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg ${rankEffects.badgeStyle} flex items-center justify-center text-white font-black text-xl ${rankEffects.animation} shadow-lg`}>
            {position}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className={`font-bold text-sm ${rankEffects.textGlow}`}>OVERALL</span>
            </div>
            <span className="text-xs text-slate-300">({points} points)</span>
          </div>
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

  // Ordered gamemode layout matching reference
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
          className="fixed inset-0 bg-black/85 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={`relative rounded-2xl w-full max-w-sm border-2 ${rankEffects.borderColor} ${rankEffects.shadowEffect} overflow-hidden`}
            style={{ 
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
            }}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Particles */}
            <FloatingParticles type={rankEffects.particles} isVisible={showPopup} />

            {/* Animated Background Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${rankEffects.bgGradient} ${rankEffects.animation} opacity-60`} />

            {/* Close Button */}
            <motion.button
              onClick={closePopup}
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors z-30 backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-white/80" />
            </motion.button>

            {/* Content */}
            <div className="relative z-20 p-6 text-center">
              {/* Avatar Section */}
              <motion.div 
                className="mb-6"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className={`relative w-20 h-20 mx-auto mb-4 rounded-full border-4 ${rankEffects.borderColor} ${rankEffects.avatarGlow} ${rankEffects.animation}`}>
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
                  
                  {/* Rank icon overlay */}
                  <motion.div
                    className={`absolute -bottom-1 -right-1 w-8 h-8 ${rankEffects.badgeStyle} rounded-full border-2 ${rankEffects.borderColor} flex items-center justify-center shadow-lg`}
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    <RankIcon className="w-4 h-4 text-white" />
                  </motion.div>
                </div>

                {/* Player Name */}
                <motion.h3 
                  className={`text-xl font-bold mb-2 ${rankEffects.textGlow}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {popupData.player.ign}
                </motion.h3>

                {/* Rank Badge */}
                <motion.div 
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${rankEffects.badgeStyle} shadow-lg border border-white/20 backdrop-blur-sm mb-2`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <RankIcon className="w-3 h-3 text-white" />
                  <span className="text-white font-bold text-xs">{rankEffects.rank}</span>
                </motion.div>

                {/* Region */}
                <motion.div 
                  className="text-slate-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {regionInfo.name}
                </motion.div>
              </motion.div>

              {/* Position Section */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-semibold">
                  POSITION
                </h4>
                <PositionSection position={position} points={playerPoints} rankEffects={rankEffects} />
              </motion.div>

              {/* Tiers Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-3 font-semibold">
                  TIERS
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {orderedGamemodes.map((mode, index) => {
                    const assignment = popupData.tierAssignments.find(a => a.gamemode === mode);
                    const tier = assignment?.tier || 'Not Ranked';
                    const { code, color } = formatTierDisplay(tier);
                    
                    return (
                      <motion.div
                        key={mode}
                        className="flex flex-col items-center p-2 bg-slate-700/40 rounded-lg border border-slate-600/40 hover:border-slate-500/60 transition-all backdrop-blur-sm"
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
                                  <GameModeIcon mode={mode.toLowerCase()} className="w-4 h-4" />
                                </div>
                                <div className="text-center">
                                  <span className={`text-xs font-bold ${color}`}>{code}</span>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-center">
                                <p className="font-medium">{toDisplayGameMode(mode)}</p>
                                {tier !== 'Not Ranked' ? (
                                  <p className="text-sm">{assignment?.score || 0} points</p>
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
