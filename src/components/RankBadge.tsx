
import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Crown, Star, Shield, Sword, Award, Trophy } from 'lucide-react';

export interface RankInfo {
  title: string;
  minPoints: number;
  icon: React.ComponentType<any>;
  gradient: string;
  shadowColor: string;
  glowColor: string;
  particleColor: string;
}

export const RANK_TIERS: RankInfo[] = [
  {
    title: "Combat Grandmaster",
    minPoints: 400,
    icon: Gem,
    gradient: "linear-gradient(135deg, #9333ea 0%, #8b5cf6 50%, #c026d3 100%)",
    shadowColor: "rgba(147, 51, 234, 0.8)",
    glowColor: "rgba(168, 85, 247, 0.6)",
    particleColor: "#a855f7"
  },
  {
    title: "Combat Master", 
    minPoints: 250,
    icon: Crown,
    gradient: "linear-gradient(135deg, #ca8a04 0%, #f59e0b 50%, #ea580c 100%)",
    shadowColor: "rgba(251, 191, 36, 0.8)",
    glowColor: "rgba(245, 158, 11, 0.6)",
    particleColor: "#fbbf24"
  },
  {
    title: "Combat Ace",
    minPoints: 100,
    icon: Star,
    gradient: "linear-gradient(135deg, #2563eb 0%, #06b6d4 50%, #6366f1 100%)",
    shadowColor: "rgba(59, 130, 246, 0.8)",
    glowColor: "rgba(56, 189, 248, 0.6)",
    particleColor: "#3b82f6"
  },
  {
    title: "Combat Specialist",
    minPoints: 50,
    icon: Shield,
    gradient: "linear-gradient(135deg, #16a34a 0%, #10b981 50%, #059669 100%)",
    shadowColor: "rgba(34, 197, 94, 0.8)",
    glowColor: "rgba(16, 185, 129, 0.6)",
    particleColor: "#22c55e"
  },
  {
    title: "Combat Cadet",
    minPoints: 20,
    icon: Sword,
    gradient: "linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #eab308 100%)",
    shadowColor: "rgba(249, 115, 22, 0.8)",
    glowColor: "rgba(245, 158, 11, 0.6)",
    particleColor: "#f97316"
  },
  {
    title: "Combat Novice",
    minPoints: 10,
    icon: Award,
    gradient: "linear-gradient(135deg, #64748b 0%, #6b7280 50%, #64748b 100%)",
    shadowColor: "rgba(100, 116, 139, 0.8)",
    glowColor: "rgba(148, 163, 184, 0.6)",
    particleColor: "#64748b"
  },
  {
    title: "Rookie",
    minPoints: 0,
    icon: Trophy,
    gradient: "linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #6b7280 100%)",
    shadowColor: "rgba(107, 114, 128, 0.8)",
    glowColor: "rgba(156, 163, 175, 0.6)",
    particleColor: "#6b7280"
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
      whileTap={onClick ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {/* Glow effect */}
      {showGlow && (
        <div 
          className="absolute inset-0 rounded-full blur-lg opacity-75"
          style={{
            background: rank.gradient,
            boxShadow: `0 0 30px ${rank.shadowColor}`
          }}
        />
      )}
      
      {/* Badge container */}
      <div 
        className={`relative ${sizeConfig.container} rounded-full border-2 border-white/30 flex items-center justify-center overflow-hidden backdrop-blur-sm`}
        style={{
          background: rank.gradient
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
