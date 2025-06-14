
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Star, Award, Trophy, Gem } from 'lucide-react';

export interface RankInfo {
  title: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  gradient: string;
  glowColor: string;
  shadowColor: string;
  borderColor: string;
  textColor: string;
  icon: React.ComponentType<any>;
  effectType: 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common' | 'basic';
}

export const RANK_TIERS: RankInfo[] = [
  {
    title: 'Combat Grandmaster',
    minPoints: 400,
    maxPoints: Infinity,
    color: 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800',
    gradient: 'from-purple-900/80 via-pink-800/70 to-purple-900/80',
    glowColor: '#a855f7',
    shadowColor: 'rgba(168, 85, 247, 0.5)',
    borderColor: 'border-purple-400',
    textColor: 'text-purple-100',
    icon: Gem,
    effectType: 'legendary'
  },
  {
    title: 'Combat Master',
    minPoints: 250,
    maxPoints: 399,
    color: 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600',
    gradient: 'from-yellow-800/80 via-orange-700/70 to-red-800/80',
    glowColor: '#f59e0b',
    shadowColor: 'rgba(245, 158, 11, 0.5)',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-100',
    icon: Crown,
    effectType: 'epic'
  },
  {
    title: 'Combat Ace',
    minPoints: 100,
    maxPoints: 249,
    color: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-700',
    gradient: 'from-blue-800/80 via-cyan-700/70 to-blue-900/80',
    glowColor: '#3b82f6',
    shadowColor: 'rgba(59, 130, 246, 0.5)',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-100',
    icon: Star,
    effectType: 'rare'
  },
  {
    title: 'Combat Specialist',
    minPoints: 50,
    maxPoints: 99,
    color: 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-700',
    gradient: 'from-green-800/80 via-emerald-700/70 to-green-900/80',
    glowColor: '#10b981',
    shadowColor: 'rgba(16, 185, 129, 0.5)',
    borderColor: 'border-green-400',
    textColor: 'text-green-100',
    icon: Award,
    effectType: 'uncommon'
  },
  {
    title: 'Combat Cadet',
    minPoints: 20,
    maxPoints: 49,
    color: 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600',
    gradient: 'from-orange-800/80 via-amber-700/70 to-yellow-800/80',
    glowColor: '#f97316',
    shadowColor: 'rgba(249, 115, 22, 0.5)',
    borderColor: 'border-orange-400',
    textColor: 'text-orange-100',
    icon: Trophy,
    effectType: 'common'
  },
  {
    title: 'Combat Novice',
    minPoints: 10,
    maxPoints: 19,
    color: 'bg-gradient-to-r from-slate-500 via-gray-500 to-slate-700',
    gradient: 'from-slate-800/80 via-gray-700/70 to-slate-900/80',
    glowColor: '#64748b',
    shadowColor: 'rgba(100, 116, 139, 0.5)',
    borderColor: 'border-slate-400',
    textColor: 'text-slate-200',
    icon: Award,
    effectType: 'basic'
  },
  {
    title: 'Rookie',
    minPoints: 0,
    maxPoints: 9,
    color: 'bg-gradient-to-r from-gray-500 via-slate-500 to-gray-700',
    gradient: 'from-gray-800/80 via-slate-700/70 to-gray-900/80',
    glowColor: '#6b7280',
    shadowColor: 'rgba(107, 114, 128, 0.5)',
    borderColor: 'border-gray-400',
    textColor: 'text-gray-200',
    icon: Trophy,
    effectType: 'basic'
  }
];

export function getRankByPoints(points: number): RankInfo {
  for (const rank of RANK_TIERS) {
    if (points >= rank.minPoints && points <= rank.maxPoints) {
      return rank;
    }
  }
  return RANK_TIERS[RANK_TIERS.length - 1]; // Default to Rookie
}

// Particle system for popup effects
const ParticleSystem: React.FC<{ effectType: string; isActive: boolean }> = ({ effectType, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

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
    }> = [];

    const colors = {
      legendary: ['#a855f7', '#ec4899', '#f59e0b', '#ef4444'],
      epic: ['#f59e0b', '#f97316', '#ef4444', '#eab308'],
      rare: ['#3b82f6', '#06b6d4', '#8b5cf6', '#0ea5e9'],
      uncommon: ['#10b981', '#059669', '#16a34a', '#15803d'],
      common: ['#f97316', '#eab308', '#f59e0b', '#d97706'],
      basic: ['#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb']
    };

    const particleColors = colors[effectType as keyof typeof colors] || colors.basic;
    const particleCount = effectType === 'legendary' ? 60 : effectType === 'epic' ? 45 : 30;

    const createParticle = () => {
      if (particles.length > particleCount) return;
      
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 3 - 1,
        life: 0,
        maxLife: 120 + Math.random() * 60,
        size: Math.random() * 3 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        opacity: 0.8 + Math.random() * 0.2
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

        const alpha = p.opacity * (1 - (p.life / p.maxLife));
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
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
  }, [effectType, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export const RankBadge: React.FC<{
  rank: RankInfo;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ 
  rank, 
  size = 'md', 
  showGlow = true, 
  animated = true, 
  className = '',
  onClick 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg'
  };

  const IconComponent = rank.icon;

  return (
    <motion.div
      className={`
        relative rounded-full ${rank.color} ${sizeClasses[size]} 
        flex items-center justify-center font-bold cursor-pointer
        border-2 ${rank.borderColor} ${rank.textColor}
        ${showGlow ? `shadow-lg` : ''}
        ${animated ? 'hover:scale-110 transition-all duration-300' : ''}
        ${className}
      `}
      style={{
        boxShadow: showGlow ? `0 0 20px ${rank.shadowColor}` : undefined
      }}
      onClick={onClick}
      whileHover={animated ? { scale: 1.1 } : undefined}
      whileTap={animated ? { scale: 0.95 } : undefined}
    >
      <IconComponent className="w-3/4 h-3/4" />
      
      {showGlow && (
        <div 
          className="absolute inset-0 rounded-full opacity-30 blur-sm"
          style={{ backgroundColor: rank.glowColor }}
        />
      )}
    </motion.div>
  );
};

export const RankPopup: React.FC<{
  rank: RankInfo;
  playerName: string;
  points: number;
  isOpen: boolean;
  onClose: () => void;
}> = ({ rank, playerName, points, isOpen, onClose }) => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowParticles(true), 200);
      return () => clearTimeout(timer);
    } else {
      setShowParticles(false);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={`
              relative bg-gradient-to-br ${rank.gradient} 
              rounded-2xl p-8 max-w-md w-full mx-4
              border-2 ${rank.borderColor}
              overflow-hidden
            `}
            style={{
              boxShadow: `0 25px 50px -12px ${rank.shadowColor}, 0 0 30px ${rank.glowColor}`
            }}
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.6
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Particle System */}
            <ParticleSystem effectType={rank.effectType} isActive={showParticles} />
            
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors z-20"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>

            {/* Content */}
            <div className="relative z-20 text-center">
              {/* Rank Achievement Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <h3 className="text-2xl font-bold text-white mb-2">RANK ACHIEVED!</h3>
                <div className="h-1 w-20 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-60" />
              </motion.div>

              {/* Rank Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.5, 
                  type: "spring", 
                  stiffness: 200,
                  duration: 0.8
                }}
                className="mb-6 flex justify-center"
              >
                <RankBadge 
                  rank={rank} 
                  size="xl" 
                  showGlow={true}
                  animated={true}
                />
              </motion.div>

              {/* Rank Title */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-4"
              >
                <h2 className={`text-3xl font-black ${rank.textColor} mb-2 tracking-wider`}>
                  {rank.title.toUpperCase()}
                </h2>
                <div className="text-white/80 text-lg font-semibold">
                  {playerName}
                </div>
              </motion.div>

              {/* Points Display */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-black/30 rounded-lg p-4 backdrop-blur-sm border border-white/20"
              >
                <div className="text-white/70 text-sm mb-1">Combat Points</div>
                <div className="text-2xl font-bold text-white">{points.toLocaleString()}</div>
              </motion.div>

              {/* Rank Progress */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="mt-6"
              >
                <div className="text-white/70 text-sm mb-2">Rank Progress</div>
                <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full ${rank.color} rounded-full`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1.2, duration: 1 }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Background Effects */}
            <div className={`absolute inset-0 bg-gradient-to-br ${rank.gradient} opacity-20 blur-3xl`} />
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${rank.glowColor}20 0%, transparent 70%)`
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
