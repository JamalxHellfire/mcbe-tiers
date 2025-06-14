
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Star, Crown, Shield, Sword, Award, Gem } from 'lucide-react';
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

// Ultra enhanced rank-based visual effects with high graphics
const getRankEffects = (points: number) => {
  if (points >= 400) {
    return {
      rank: 'Combat Grandmaster',
      bgGradient: 'from-purple-900/60 via-violet-800/50 to-fuchsia-900/60',
      borderColor: 'border-purple-300',
      shadowEffect: 'shadow-[0_0_80px_rgba(147,51,234,1),0_0_120px_rgba(168,85,247,0.7),0_0_160px_rgba(196,181,253,0.5)]',
      iconColor: 'text-purple-200',
      icon: Gem,
      particles: 'legendary',
      animation: 'animate-[pulse_1.5s_ease-in-out_infinite,bounce_2s_ease-in-out_infinite_alternate]',
      badgeStyle: 'bg-gradient-to-br from-purple-600 via-violet-500 to-fuchsia-600 shadow-[0_0_30px_rgba(147,51,234,0.8)] border-2 border-purple-300',
      textGlow: 'text-purple-100 drop-shadow-[0_0_25px_rgba(147,51,234,1)] font-black tracking-wider',
      avatarGlow: 'shadow-[0_0_50px_rgba(147,51,234,1),0_0_100px_rgba(168,85,247,0.6)] ring-4 ring-purple-400/50',
      particleColors: ['#a855f7', '#c084fc', '#d8b4fe', '#8b5cf6', '#7c3aed', '#6d28d9'],
      special: 'legendary-aura'
    };
  } else if (points >= 250) {
    return {
      rank: 'Combat Master',
      bgGradient: 'from-yellow-800/60 via-amber-700/50 to-orange-800/60',
      borderColor: 'border-yellow-300',
      shadowEffect: 'shadow-[0_0_70px_rgba(251,191,36,1),0_0_100px_rgba(245,158,11,0.7),0_0_140px_rgba(252,211,77,0.5)]',
      iconColor: 'text-yellow-200',
      icon: Crown,
      particles: 'royal',
      animation: 'animate-[pulse_1.8s_ease-in-out_infinite,bounce_2.5s_ease-in-out_infinite_alternate]',
      badgeStyle: 'bg-gradient-to-br from-yellow-600 via-amber-500 to-orange-600 shadow-[0_0_25px_rgba(251,191,36,0.8)] border-2 border-yellow-300',
      textGlow: 'text-yellow-100 drop-shadow-[0_0_20px_rgba(251,191,36,1)] font-black tracking-wide',
      avatarGlow: 'shadow-[0_0_40px_rgba(251,191,36,1),0_0_80px_rgba(245,158,11,0.6)] ring-4 ring-yellow-400/50',
      particleColors: ['#ffd700', '#ffec8b', '#fff9c4', '#ffc107', '#ffb300', '#ff8f00'],
      special: 'royal-crown'
    };
  } else if (points >= 100) {
    return {
      rank: 'Combat Ace',
      bgGradient: 'from-blue-800/50 via-cyan-700/40 to-indigo-800/50',
      borderColor: 'border-blue-300',
      shadowEffect: 'shadow-[0_0_60px_rgba(59,130,246,0.9),0_0_90px_rgba(56,189,248,0.6),0_0_120px_rgba(147,197,253,0.4)]',
      iconColor: 'text-blue-200',
      icon: Star,
      particles: 'stellar',
      animation: 'animate-[pulse_2s_ease-in-out_infinite,spin_8s_linear_infinite]',
      badgeStyle: 'bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.7)] border-2 border-blue-300',
      textGlow: 'text-blue-100 drop-shadow-[0_0_15px_rgba(59,130,246,0.9)] font-bold tracking-wide',
      avatarGlow: 'shadow-[0_0_30px_rgba(59,130,246,0.8),0_0_60px_rgba(56,189,248,0.5)] ring-3 ring-blue-400/40',
      particleColors: ['#4dabf7', '#74c0fc', '#a5d8ff', '#3182ce', '#2c5aa0', '#1e3a8a'],
      special: 'stellar-shine'
    };
  } else if (points >= 50) {
    return {
      rank: 'Combat Specialist',
      bgGradient: 'from-green-800/45 via-emerald-700/35 to-teal-800/45',
      borderColor: 'border-green-300',
      shadowEffect: 'shadow-[0_0_50px_rgba(34,197,94,0.8),0_0_75px_rgba(16,185,129,0.5),0_0_100px_rgba(110,231,183,0.3)]',
      iconColor: 'text-green-200',
      icon: Shield,
      particles: 'guardian',
      animation: 'animate-[pulse_2.2s_ease-in-out_infinite]',
      badgeStyle: 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 shadow-[0_0_18px_rgba(34,197,94,0.6)] border-2 border-green-300',
      textGlow: 'text-green-100 drop-shadow-[0_0_12px_rgba(34,197,94,0.8)] font-bold tracking-normal',
      avatarGlow: 'shadow-[0_0_25px_rgba(34,197,94,0.7),0_0_50px_rgba(16,185,129,0.4)] ring-3 ring-green-400/35',
      particleColors: ['#22c55e', '#4ade80', '#86efac', '#16a34a', '#15803d', '#166534'],
      special: 'guardian-shield'
    };
  } else if (points >= 20) {
    return {
      rank: 'Combat Cadet',
      bgGradient: 'from-orange-800/40 via-amber-700/30 to-yellow-800/40',
      borderColor: 'border-orange-300',
      shadowEffect: 'shadow-[0_0_40px_rgba(249,115,22,0.7),0_0_65px_rgba(245,158,11,0.4),0_0_90px_rgba(252,211,77,0.3)]',
      iconColor: 'text-orange-200',
      icon: Sword,
      particles: 'warrior',
      animation: 'animate-[pulse_2.5s_ease-in-out_infinite]',
      badgeStyle: 'bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-600 shadow-[0_0_15px_rgba(249,115,22,0.6)] border-2 border-orange-300',
      textGlow: 'text-orange-100 drop-shadow-[0_0_10px_rgba(249,115,22,0.7)] font-semibold',
      avatarGlow: 'shadow-[0_0_20px_rgba(249,115,22,0.6),0_0_40px_rgba(245,158,11,0.4)] ring-2 ring-orange-400/30',
      particleColors: ['#ff922b', '#ffb366', '#ffc947', '#ed8936', '#dd6b20', '#c05621'],
      special: 'warrior-blade'
    };
  } else if (points >= 10) {
    return {
      rank: 'Combat Novice',
      bgGradient: 'from-slate-700/35 via-gray-600/25 to-slate-800/35',
      borderColor: 'border-slate-400',
      shadowEffect: 'shadow-[0_0_35px_rgba(100,116,139,0.6),0_0_55px_rgba(148,163,184,0.3)]',
      iconColor: 'text-slate-300',
      icon: Award,
      particles: 'apprentice',
      animation: 'animate-pulse',
      badgeStyle: 'bg-gradient-to-br from-slate-600 via-gray-500 to-slate-700 shadow-[0_0_12px_rgba(100,116,139,0.5)] border-2 border-slate-400',
      textGlow: 'text-slate-200 drop-shadow-[0_0_8px_rgba(100,116,139,0.6)] font-medium',
      avatarGlow: 'shadow-[0_0_15px_rgba(100,116,139,0.5),0_0_30px_rgba(148,163,184,0.3)] ring-2 ring-slate-400/25',
      particleColors: ['#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155'],
      special: 'apprentice-glow'
    };
  } else {
    return {
      rank: 'Rookie',
      bgGradient: 'from-gray-700/30 via-slate-600/20 to-gray-800/30',
      borderColor: 'border-gray-400',
      shadowEffect: 'shadow-[0_0_30px_rgba(107,114,128,0.5),0_0_50px_rgba(156,163,175,0.3)]',
      iconColor: 'text-gray-300',
      icon: Trophy,
      particles: 'novice',
      animation: '',
      badgeStyle: 'bg-gradient-to-br from-gray-600 via-slate-500 to-gray-700 shadow-[0_0_10px_rgba(107,114,128,0.4)] border border-gray-400',
      textGlow: 'text-gray-200 drop-shadow-[0_0_6px_rgba(107,114,128,0.5)]',
      avatarGlow: 'shadow-[0_0_12px_rgba(107,114,128,0.4),0_0_25px_rgba(156,163,175,0.2)] ring-1 ring-gray-400/20',
      particleColors: ['#adb5bd', '#ced4da', '#868e96', '#718096', '#4a5568', '#2d3748'],
      special: 'rookie-spark'
    };
  }
};

// Ultra enhanced floating particles effect with special animations
const UltraFloatingParticles = ({ type, isVisible, special }: { type: string, isVisible: boolean, special: string }) => {
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
      trail: Array<{x: number, y: number, opacity: number}>;
      special?: string;
    }> = [];

    const colors = {
      legendary: ['#a855f7', '#c084fc', '#d8b4fe', '#8b5cf6', '#7c3aed', '#6d28d9'],
      royal: ['#ffd700', '#ffec8b', '#fff9c4', '#ffc107', '#ffb300', '#ff8f00'],
      stellar: ['#4dabf7', '#74c0fc', '#a5d8ff', '#3182ce', '#2c5aa0', '#1e3a8a'],
      guardian: ['#22c55e', '#4ade80', '#86efac', '#16a34a', '#15803d', '#166534'],
      warrior: ['#ff922b', '#ffb366', '#ffc947', '#ed8936', '#dd6b20', '#c05621'],
      apprentice: ['#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155'],
      novice: ['#adb5bd', '#ced4da', '#868e96', '#718096', '#4a5568', '#2d3748']
    };

    const particleColors = colors[type as keyof typeof colors] || colors.novice;

    const createParticle = () => {
      if (particles.length > (special === 'legendary-aura' ? 50 : 35)) return;
      
      const x = Math.random() * canvas.width;
      const y = canvas.height + 10;
      
      const baseSize = special === 'legendary-aura' ? 3 : special === 'royal-crown' ? 2.5 : 2;
      
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * (special === 'legendary-aura' ? 2 : 1.5),
        vy: -Math.random() * (special === 'legendary-aura' ? 3 : 2) - 1,
        life: 0,
        maxLife: special === 'legendary-aura' ? 180 : 140 + Math.random() * 60,
        size: Math.random() * baseSize + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        opacity: 0.9 + Math.random() * 0.1,
        angle: Math.random() * Math.PI * 2,
        trail: [],
        special: special
      });
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < (special === 'legendary-aura' ? 0.15 : 0.08)) {
        createParticle();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Add to trail
        p.trail.push({x: p.x, y: p.y, opacity: p.opacity});
        if (p.trail.length > 8) p.trail.shift();
        
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.angle += 0.03;

        // Special movement patterns
        if (special === 'legendary-aura') {
          p.x += Math.sin(p.life * 0.05) * 0.5;
          p.vy *= 0.998; // Slight deceleration for floating effect
        } else if (special === 'royal-crown') {
          p.x += Math.cos(p.life * 0.04) * 0.3;
        } else if (special === 'stellar-shine') {
          p.x += Math.sin(p.life * 0.06) * 0.8;
          p.size += Math.sin(p.life * 0.1) * 0.02;
        }

        const fadeAlpha = Math.max(0, 1 - (p.life / p.maxLife));
        const alpha = p.opacity * fadeAlpha;

        // Draw trail for special effects
        if (special === 'legendary-aura' || special === 'royal-crown') {
          for (let j = 0; j < p.trail.length; j++) {
            const trailPoint = p.trail[j];
            const trailAlpha = alpha * (j / p.trail.length) * 0.3;
            
            ctx.save();
            ctx.globalAlpha = trailAlpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(trailPoint.x, trailPoint.y, p.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Main particle
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        
        // Special shapes for different ranks
        if (special === 'legendary-aura') {
          // Diamond shape for legendary
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size, 0);
          ctx.closePath();
          ctx.fill();
        } else if (special === 'royal-crown') {
          // Star shape for royal
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            ctx.lineTo(Math.cos((j * 2 * Math.PI) / 5) * p.size, Math.sin((j * 2 * Math.PI) / 5) * p.size);
            ctx.lineTo(Math.cos(((j + 0.5) * 2 * Math.PI) / 5) * p.size * 0.5, Math.sin(((j + 0.5) * 2 * Math.PI) / 5) * p.size * 0.5);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Circle for others with glow
          ctx.shadowBlur = special === 'stellar-shine' ? 8 : 5;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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
  }, [type, isVisible, special]);

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

// Enhanced position section with ultra graphics
const UltraPositionSection = ({ position, points, rankEffects }: { position: number, points: number, rankEffects: any }) => {
  const RankIcon = rankEffects.icon;
  
  return (
    <motion.div 
      className={`relative p-5 rounded-2xl border-3 ${rankEffects.borderColor} backdrop-blur-lg bg-slate-900/80 ${rankEffects.shadowEffect} overflow-hidden`}
      initial={{ scale: 0.9, opacity: 0, rotateX: -15 }}
      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
      style={{
        background: `linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.85) 50%, rgba(15,23,42,0.9) 100%)`,
      }}
    >
      {/* Ultra background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${rankEffects.bgGradient} ${rankEffects.animation} opacity-40`} />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            className={`w-16 h-16 rounded-2xl ${rankEffects.badgeStyle} flex items-center justify-center text-white font-black text-2xl ${rankEffects.animation} relative overflow-hidden`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {/* Ultra glow effect inside badge */}
            <div className={`absolute inset-0 bg-gradient-to-br ${rankEffects.bgGradient} opacity-60 blur-sm`} />
            <span className="relative z-10">{position}</span>
            
            {/* Rank icon overlay */}
            <motion.div 
              className="absolute -top-1 -right-1 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <RankIcon className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
              </motion.div>
              <span className={`font-black text-lg ${rankEffects.textGlow} uppercase tracking-widest`}>
                OVERALL RANK
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300 font-medium">Total Combat Points:</span>
              <span className={`font-bold text-lg ${rankEffects.textGlow}`}>{points}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ultra decorative elements */}
      <div className="absolute top-2 right-2 w-3 h-3 bg-white/20 rounded-full animate-ping" />
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/15 rounded-full animate-pulse" />
    </motion.div>
  );
};

export function EnhancedResultPopup() {
  const { popupData, showPopup, closePopup } = usePopup();
  
  if (!showPopup || !popupData) return null;

  const playerPoints = popupData.player.global_points || 0;
  const rankEffects = getRankEffects(playerPoints);
  const position = popupData.player.overall_rank || 1;
  const region = popupData.player.region || 'NA';
  const regionInfo = getRegionInfo(region);

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
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={`relative rounded-3xl w-full max-w-sm border-3 overflow-hidden`}
            style={{ 
              background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1e293b 75%, #0f172a 100%)',
              borderColor: rankEffects.borderColor.replace('border-', ''),
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px ${rankEffects.borderColor.replace('border-', '')}`
            }}
            initial={{ scale: 0.7, opacity: 0, y: 100, rotateX: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 100, rotateX: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              onClick={closePopup}
              className="absolute top-4 right-4 p-2.5 bg-black/60 hover:bg-black/80 rounded-xl transition-all z-30 backdrop-blur-md border border-white/20"
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <X className="w-5 h-5 text-white/90" />
            </motion.button>

            {/* Content */}
            <div className="relative z-20 p-6 text-center">
              {/* Avatar Section */}
              <motion.div 
                className="mb-6"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Avatar className="w-full h-full rounded-full border-4 border-white/30 overflow-hidden">
                    <AvatarImage 
                      src={`https://visage.surgeplay.com/bust/128/${popupData.player.ign}`}
                      alt={popupData.player.ign}
                      className="object-cover object-center scale-110"
                    />
                    <AvatarFallback className="bg-slate-700 text-white font-bold text-xl">
                      {popupData.player.ign.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Player Name */}
                <motion.h3 
                  className="text-2xl font-black mb-3 text-white uppercase tracking-wider"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {popupData.player.ign}
                </motion.h3>

                {/* Rank Title */}
                <motion.div 
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl border border-white/30 backdrop-blur-md mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${rankEffects.bgGradient.replace('from-', '').replace('via-', '').replace('to-', '')})`
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-white font-black text-sm uppercase tracking-wider">{rankEffects.rank}</span>
                </motion.div>

                {/* Region */}
                <motion.div 
                  className="text-slate-300 text-sm font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  🌍 {regionInfo.name}
                </motion.div>
              </motion.div>

              {/* Position Section */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h4 className="text-slate-400 text-xs uppercase tracking-widest mb-4 font-bold">
                  🏆 COMBAT POSITION
                </h4>
                <UltraPositionSection position={position} points={playerPoints} rankEffects={rankEffects} />
              </motion.div>

              {/* Tiers Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h4 className="text-slate-400 text-xs uppercase tracking-widest mb-4 font-bold">
                  ⚔️ GAMEMODE TIERS
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
