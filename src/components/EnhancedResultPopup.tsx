
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

// Rank-based visual effects
const getRankEffects = (rank: string) => {
  switch (rank) {
    case 'Combat General':
      return {
        bgEffect: 'bg-gradient-to-br from-yellow-400/30 via-orange-500/20 to-red-500/30',
        borderEffect: 'border-yellow-400 shadow-yellow-400/50',
        iconColor: 'text-yellow-400',
        icon: Crown,
        particles: 'gold',
        animation: 'animate-pulse'
      };
    case 'Combat Marshal':
      return {
        bgEffect: 'bg-gradient-to-br from-red-500/30 via-pink-500/20 to-purple-500/30',
        borderEffect: 'border-red-400 shadow-red-400/50',
        iconColor: 'text-red-400',
        icon: Sword,
        particles: 'red',
        animation: 'animate-bounce'
      };
    case 'Combat Ace':
      return {
        bgEffect: 'bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-indigo-500/30',
        borderEffect: 'border-blue-400 shadow-blue-400/50',
        iconColor: 'text-blue-400',
        icon: Star,
        particles: 'blue',
        animation: 'animate-pulse'
      };
    case 'Combat Sargent':
      return {
        bgEffect: 'bg-gradient-to-br from-orange-500/30 via-amber-500/20 to-yellow-500/30',
        borderEffect: 'border-orange-400 shadow-orange-400/50',
        iconColor: 'text-orange-400',
        icon: Shield,
        particles: 'orange',
        animation: 'animate-pulse'
      };
    default: // Combat Rookie
      return {
        bgEffect: 'bg-gradient-to-br from-gray-500/30 via-slate-500/20 to-gray-600/30',
        borderEffect: 'border-gray-400 shadow-gray-400/50',
        iconColor: 'text-gray-400',
        icon: Trophy,
        particles: 'gray',
        animation: ''
      };
  }
};

// Particle effect component
const ParticleEffect = ({ type, isVisible }: { type: string, isVisible: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 500;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
    }> = [];

    const colors = {
      gold: ['#ffd700', '#ffec8b', '#fff176'],
      red: ['#ff4444', '#ff6b6b', '#ff8a8a'],
      blue: ['#4dabf7', '#74c0fc', '#a5d8ff'],
      orange: ['#ff922b', '#ffb366', '#ffc947'],
      gray: ['#868e96', '#adb5bd', '#ced4da']
    };

    const particleColors = colors[type as keyof typeof colors] || colors.gray;

    const createParticle = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * -2 - 1,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        size: Math.random() * 3 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)]
      });
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new particles
      if (Math.random() < 0.3) {
        createParticle(200 + (Math.random() - 0.5) * 100, 250 + (Math.random() - 0.5) * 50);
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const alpha = 1 - p.life / p.maxLife;
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
const formatTierDisplay = (tier: string): { code: string, label: string } => {
  if (tier === 'Retired') return { code: 'RT', label: '' };
  if (tier === 'Not Ranked') return { code: 'NR', label: '' };
  
  let code = 'T?';
  let label = '';
  
  if (tier.includes('T1')) code = 'T1';
  else if (tier.includes('T2')) code = 'T2';
  else if (tier.includes('T3')) code = 'T3';
  else if (tier.includes('T4')) code = 'T4';
  else if (tier.includes('T5')) code = 'T5';
  
  if (tier.includes('H')) label = 'High';
  else if (tier.includes('L')) label = 'Low';
  
  return { code, label };
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
            className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl w-full max-w-md border-4 ${rankEffects.borderEffect} shadow-2xl overflow-hidden`}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Particle Effects */}
            <ParticleEffect type={rankEffects.particles} isVisible={showPopup} />

            {/* Background gradient overlay */}
            <div className={`absolute inset-0 ${rankEffects.bgEffect} ${rankEffects.animation}`} />

            {/* Close Button */}
            <motion.button
              onClick={closePopup}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-20"
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
                  <div className={`w-24 h-24 rounded-full border-4 ${rankEffects.borderEffect} overflow-hidden mx-auto shadow-xl ${rankEffects.animation}`}>
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
                    className={`absolute -bottom-2 -right-2 w-10 h-10 ${rankEffects.bgEffect} ${rankEffects.iconColor} rounded-full border-3 ${rankEffects.borderEffect} flex items-center justify-center shadow-lg ${rankEffects.animation}`}
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <RankIcon className="w-5 h-5" />
                  </motion.div>
                </motion.div>

                {/* Player Name */}
                <motion.h3 
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {popupData.player.ign}
                </motion.h3>

                {/* Region Badge */}
                <motion.div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                  style={{ backgroundColor: `${regionInfo.color}40`, borderColor: regionInfo.color }}
                  className="border"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: regionInfo.color }}
                  />
                  <span className="text-white font-medium text-sm">{regionInfo.name}</span>
                </motion.div>
              </div>

              {/* Position Section */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h4 className="text-slate-300 text-sm uppercase tracking-wider mb-3 font-bold text-center">
                  POSITION
                </h4>
                <div className={`${rankEffects.bgEffect} rounded-xl p-4 border-2 ${rankEffects.borderEffect} shadow-xl ${rankEffects.animation}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${rankEffects.bgEffect} ${rankEffects.iconColor} rounded-full border-2 ${rankEffects.borderEffect} flex items-center justify-center font-bold text-lg shadow-lg`}>
                        #{popupData.player.overall_rank || 1}
                      </div>
                      <div>
                        <div className={`${rankEffects.iconColor} font-bold text-lg`}>
                          {playerRank.title}
                        </div>
                        <div className="text-white/80 text-sm">
                          {playerPoints} points
                        </div>
                      </div>
                    </div>
                    <div className={`${rankEffects.iconColor} ${rankEffects.animation}`}>
                      <RankIcon className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tiers Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h4 className="text-slate-300 text-sm uppercase tracking-wider mb-3 font-bold text-center">
                  TIERS
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {orderedGamemodes.map((mode, index) => {
                    const assignment = popupData.tierAssignments.find(a => a.gamemode === mode);
                    const tier = assignment?.tier || 'Not Ranked';
                    const { code, label } = formatTierDisplay(tier);
                    
                    return (
                      <motion.div
                        key={mode}
                        className="flex flex-col items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col items-center cursor-help">
                                <div className="mb-2">
                                  <GameModeIcon mode={mode.toLowerCase()} className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                  {tier !== 'Not Ranked' ? (
                                    <div className="flex flex-col items-center">
                                      <span className="text-white font-bold text-sm">{code}</span>
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
