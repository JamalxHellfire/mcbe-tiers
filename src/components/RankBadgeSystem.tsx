
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Crown, Star, Shield, Sword, Award, Trophy } from 'lucide-react';

export interface RankInfo {
  title: string;
  minPoints: number;
  icon: React.ComponentType<any>;
  gradient: string;
  shadowColor: string;
  glowColor: string;
  particleColor: string;
  effectType: 'grandmaster' | 'master' | 'ace' | 'specialist' | 'cadet' | 'novice' | 'rookie';
}

export const RANK_TIERS: RankInfo[] = [
  {
    title: "Combat Grandmaster",
    minPoints: 400,
    icon: Gem,
    gradient: "from-yellow-400 via-purple-500 to-yellow-600",
    shadowColor: "rgba(255, 215, 0, 0.8)",
    glowColor: "rgba(147, 51, 234, 0.6)",
    particleColor: "#ffd700",
    effectType: 'grandmaster'
  },
  {
    title: "Combat Master", 
    minPoints: 250,
    icon: Crown,
    gradient: "from-red-600 via-orange-500 to-red-700",
    shadowColor: "rgba(220, 38, 38, 0.8)",
    glowColor: "rgba(239, 68, 68, 0.6)",
    particleColor: "#dc2626",
    effectType: 'master'
  },
  {
    title: "Combat Ace",
    minPoints: 100,
    icon: Star,
    gradient: "from-blue-500 via-cyan-400 to-blue-600",
    shadowColor: "rgba(59, 130, 246, 0.8)",
    glowColor: "rgba(56, 189, 248, 0.6)",
    particleColor: "#3b82f6",
    effectType: 'ace'
  },
  {
    title: "Combat Specialist",
    minPoints: 50,
    icon: Shield,
    gradient: "from-green-500 via-emerald-400 to-green-600",
    shadowColor: "rgba(34, 197, 94, 0.8)",
    glowColor: "rgba(16, 185, 129, 0.6)",
    particleColor: "#22c55e",
    effectType: 'specialist'
  },
  {
    title: "Combat Cadet",
    minPoints: 20,
    icon: Sword,
    gradient: "from-orange-500 via-yellow-400 to-orange-600",
    shadowColor: "rgba(249, 115, 22, 0.8)",
    glowColor: "rgba(245, 158, 11, 0.6)",
    particleColor: "#f97316",
    effectType: 'cadet'
  },
  {
    title: "Combat Novice",
    minPoints: 10,
    icon: Award,
    gradient: "from-slate-400 via-gray-300 to-slate-500",
    shadowColor: "rgba(100, 116, 139, 0.8)",
    glowColor: "rgba(148, 163, 184, 0.6)",
    particleColor: "#64748b",
    effectType: 'novice'
  },
  {
    title: "Rookie",
    minPoints: 0,
    icon: Trophy,
    gradient: "from-gray-400 via-slate-300 to-gray-500",
    shadowColor: "rgba(107, 114, 128, 0.8)",
    glowColor: "rgba(156, 163, 175, 0.6)",
    particleColor: "#6b7280",
    effectType: 'rookie'
  }
];

export function getRankByPoints(points: number): RankInfo {
  for (const rank of RANK_TIERS) {
    if (points >= rank.minPoints) {
      return rank;
    }
  }
  return RANK_TIERS[RANK_TIERS.length - 1];
}

interface RankBadgeProps {
  rank: RankInfo;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export function RankBadge({ 
  rank, 
  size = 'md', 
  showGlow = true, 
  animated = true,
  className = '',
  onClick
}: RankBadgeProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8' },
    xl: { container: 'w-20 h-20', icon: 'w-10 h-10' }
  };

  const IconComponent = rank.icon;
  const sizeConfig = sizes[size];

  return (
    <motion.div
      className={`relative ${sizeConfig.container} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: 1 } : undefined}
      whileHover={animated ? { scale: 1.1 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {/* Glow effect */}
      {showGlow && (
        <div 
          className="absolute inset-0 rounded-full blur-lg opacity-75"
          style={{
            background: `linear-gradient(135deg, ${rank.gradient})`,
            boxShadow: `0 0 30px ${rank.shadowColor}`
          }}
        />
      )}
      
      {/* Badge container */}
      <div 
        className={`relative ${sizeConfig.container} rounded-full border-2 border-white/30 flex items-center justify-center overflow-hidden backdrop-blur-sm`}
        style={{
          background: `linear-gradient(135deg, ${rank.gradient})`
        }}
      >
        {/* Shimmer effect */}
        {animated && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
        )}
        
        {/* Icon */}
        <IconComponent 
          className={`${sizeConfig.icon} text-white drop-shadow-lg z-10`}
        />
      </div>
    </motion.div>
  );
}

// Particle System Component
interface ParticleSystemProps {
  rank: RankInfo;
  isActive: boolean;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ rank, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      opacity: number;
      color: string;
      type: 'particle' | 'spark' | 'glow';
    }> = [];

    const createParticle = (x: number, y: number, type: 'particle' | 'spark' | 'glow' = 'particle') => {
      const effectIntensity = rank.minPoints >= 400 ? 5 : rank.minPoints >= 250 ? 3 : rank.minPoints >= 100 ? 2 : 1;
      
      for (let i = 0; i < effectIntensity; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 30,
          y: y + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 0,
          maxLife: type === 'glow' ? 200 : type === 'spark' ? 60 : 120,
          size: Math.random() * (type === 'glow' ? 8 : type === 'spark' ? 3 : 4) + 1,
          opacity: 1,
          color: rank.particleColor,
          type
        });
      }
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create particles from center with rank-specific frequency
      const frequency = rank.minPoints >= 400 ? 0.4 : rank.minPoints >= 250 ? 0.3 : 0.15;
      if (Math.random() < frequency) {
        createParticle(canvas.width / 2, canvas.height / 2, 'particle');
        if (rank.minPoints >= 250 && Math.random() < 0.5) {
          createParticle(canvas.width / 2, canvas.height / 2, 'spark');
        }
        if (rank.minPoints >= 400 && Math.random() < 0.3) {
          createParticle(canvas.width / 2, canvas.height / 2, 'glow');
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.opacity = Math.max(0, 1 - (p.life / p.maxLife));

        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (p.type === 'glow') {
          // Glow effect
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'spark') {
          // Spark effect
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size, p.y);
          ctx.lineTo(p.x + p.size, p.y);
          ctx.moveTo(p.x, p.y - p.size);
          ctx.lineTo(p.x, p.y + p.size);
          ctx.stroke();
        } else {
          // Regular particle
          ctx.fillStyle = p.color;
          if (rank.effectType === 'grandmaster') {
            // Diamond shape for Combat Grandmaster
            ctx.translate(p.x, p.y);
            ctx.rotate(p.life * 0.1);
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.lineTo(p.size, 0);
            ctx.lineTo(0, p.size);
            ctx.lineTo(-p.size, 0);
            ctx.closePath();
            ctx.fill();
          } else if (rank.effectType === 'master') {
            // Star shape for Combat Master
            ctx.translate(p.x, p.y);
            ctx.rotate(p.life * 0.05);
            ctx.beginPath();
            for (let j = 0; j < 5; j++) {
              ctx.lineTo(Math.cos((j * 2 * Math.PI) / 5) * p.size, Math.sin((j * 2 * Math.PI) / 5) * p.size);
              ctx.lineTo(Math.cos(((j + 0.5) * 2 * Math.PI) / 5) * p.size * 0.5, Math.sin(((j + 0.5) * 2 * Math.PI) / 5) * p.size * 0.5);
            }
            ctx.closePath();
            ctx.fill();
          } else {
            // Circle for other ranks
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [rank, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Rank Popup Component
interface RankPopupProps {
  rank: RankInfo;
  playerName: string;
  points: number;
  isOpen: boolean;
  onClose: () => void;
}

export const RankPopup: React.FC<RankPopupProps> = ({
  rank,
  playerName,
  points,
  isOpen,
  onClose
}) => {
  const getPopupVariants = () => {
    switch (rank.effectType) {
      case 'grandmaster':
        return {
          initial: { scale: 0, rotate: -180, opacity: 0 },
          animate: { 
            scale: [0, 1.3, 1], 
            rotate: [0, 15, 0], 
            opacity: 1,
            transition: { 
              duration: 1.5, 
              times: [0, 0.6, 1],
              type: "spring",
              stiffness: 150
            }
          },
          exit: { scale: 0, opacity: 0, rotate: 180 }
        };
      case 'master':
        return {
          initial: { scale: 0, y: -100, opacity: 0 },
          animate: { 
            scale: [0, 1.2, 1], 
            y: [0, -15, 0], 
            opacity: 1,
            transition: { duration: 1.0, type: "spring" }
          },
          exit: { scale: 0, y: 100, opacity: 0 }
        };
      case 'ace':
        return {
          initial: { scale: 0, x: -200, opacity: 0 },
          animate: { 
            scale: 1, 
            x: 0, 
            opacity: 1,
            transition: { duration: 0.8, type: "spring" }
          },
          exit: { scale: 0, x: 200, opacity: 0 }
        };
      case 'specialist':
        return {
          initial: { scale: 0, opacity: 0, filter: "blur(10px)" },
          animate: { 
            scale: 1, 
            opacity: 1,
            filter: "blur(0px)",
            transition: { duration: 0.6 }
          },
          exit: { scale: 0, opacity: 0, filter: "blur(10px)" }
        };
      case 'cadet':
        return {
          initial: { scale: 0, rotate: -90, opacity: 0 },
          animate: { 
            scale: [0, 1.1, 1], 
            rotate: [0, 10, 0], 
            opacity: 1,
            transition: { duration: 0.7, type: "spring" }
          },
          exit: { scale: 0, rotate: 90, opacity: 0 }
        };
      case 'novice':
        return {
          initial: { scale: 0.5, opacity: 0 },
          animate: { 
            scale: 1, 
            opacity: 1,
            transition: { duration: 0.5 }
          },
          exit: { scale: 0.5, opacity: 0 }
        };
      default: // rookie
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { 
            scale: 1, 
            opacity: 1,
            transition: { duration: 0.4 }
          },
          exit: { scale: 0.8, opacity: 0 }
        };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-slate-900/95 rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20 overflow-hidden"
            {...getPopupVariants()}
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: `0 25px 50px -12px ${rank.shadowColor}, 0 0 40px ${rank.glowColor}`
            }}
          >
            {/* Particle System */}
            <ParticleSystem rank={rank} isActive={isOpen} />
            
            {/* Background gradient */}
            <div 
              className="absolute inset-0 opacity-20 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${rank.gradient})`
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <motion.div
                className="mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <RankBadge rank={rank} size="xl" className="mx-auto" />
              </motion.div>
              
              <motion.h2
                className="text-3xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ textShadow: `0 0 20px ${rank.glowColor}` }}
              >
                {rank.title}
              </motion.h2>
              
              <motion.p
                className="text-white/80 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Congratulations, {playerName}!
              </motion.p>
              
              <motion.div
                className="text-2xl font-bold text-white/90 mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
              >
                {points} Combat Points
              </motion.div>
              
              <motion.button
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 transition-colors backdrop-blur-sm"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
