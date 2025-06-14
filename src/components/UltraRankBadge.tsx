
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Shield, Sword, Award, Trophy, Gem, Zap } from 'lucide-react';

interface RankConfig {
  title: string;
  minPoints: number;
  icon: React.ComponentType<any>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
  particleConfig: {
    count: number;
    speed: number;
    colors: string[];
    shapes: ('circle' | 'star' | 'diamond' | 'triangle')[];
    size: { min: number; max: number };
  };
  animationConfig: {
    duration: number;
    intensity: 'low' | 'medium' | 'high' | 'extreme';
    specialEffect: string;
  };
}

const RANK_CONFIGS: Record<string, RankConfig> = {
  'Combat Grandmaster': {
    title: 'Combat Grandmaster',
    minPoints: 400,
    icon: Gem,
    colors: {
      primary: '#8b5cf6',
      secondary: '#a855f7',
      accent: '#c084fc',
      glow: '#d8b4fe'
    },
    particleConfig: {
      count: 100,
      speed: 2.5,
      colors: ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e879f9'],
      shapes: ['diamond', 'star'],
      size: { min: 3, max: 8 }
    },
    animationConfig: {
      duration: 4000,
      intensity: 'extreme',
      specialEffect: 'legendary-aura'
    }
  },
  'Combat Master': {
    title: 'Combat Master',
    minPoints: 250,
    icon: Crown,
    colors: {
      primary: '#f59e0b',
      secondary: '#f97316',
      accent: '#fb923c',
      glow: '#fed7aa'
    },
    particleConfig: {
      count: 80,
      speed: 2.0,
      colors: ['#f59e0b', '#f97316', '#fb923c', '#fed7aa', '#fcd34d'],
      shapes: ['star', 'circle'],
      size: { min: 2, max: 6 }
    },
    animationConfig: {
      duration: 3500,
      intensity: 'high',
      specialEffect: 'royal-flames'
    }
  },
  'Combat Ace': {
    title: 'Combat Ace',
    minPoints: 100,
    icon: Star,
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#60a5fa',
      glow: '#bfdbfe'
    },
    particleConfig: {
      count: 60,
      speed: 1.8,
      colors: ['#3b82f6', '#1d4ed8', '#60a5fa', '#bfdbfe', '#dbeafe'],
      shapes: ['star', 'triangle'],
      size: { min: 2, max: 5 }
    },
    animationConfig: {
      duration: 3000,
      intensity: 'high',
      specialEffect: 'stellar-burst'
    }
  },
  'Combat Specialist': {
    title: 'Combat Specialist',
    minPoints: 50,
    icon: Shield,
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      glow: '#a7f3d0'
    },
    particleConfig: {
      count: 50,
      speed: 1.5,
      colors: ['#10b981', '#059669', '#34d399', '#a7f3d0', '#d1fae5'],
      shapes: ['circle', 'triangle'],
      size: { min: 1.5, max: 4 }
    },
    animationConfig: {
      duration: 2500,
      intensity: 'medium',
      specialEffect: 'tactical-grid'
    }
  },
  'Combat Cadet': {
    title: 'Combat Cadet',
    minPoints: 20,
    icon: Sword,
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#fb923c',
      glow: '#fed7aa'
    },
    particleConfig: {
      count: 40,
      speed: 1.2,
      colors: ['#f97316', '#ea580c', '#fb923c', '#fed7aa', '#ffedd5'],
      shapes: ['circle', 'star'],
      size: { min: 1, max: 3 }
    },
    animationConfig: {
      duration: 2000,
      intensity: 'medium',
      specialEffect: 'energy-burst'
    }
  },
  'Combat Novice': {
    title: 'Combat Novice',
    minPoints: 10,
    icon: Award,
    colors: {
      primary: '#64748b',
      secondary: '#475569',
      accent: '#94a3b8',
      glow: '#e2e8f0'
    },
    particleConfig: {
      count: 30,
      speed: 1.0,
      colors: ['#64748b', '#475569', '#94a3b8', '#e2e8f0', '#f1f5f9'],
      shapes: ['circle'],
      size: { min: 1, max: 2.5 }
    },
    animationConfig: {
      duration: 1500,
      intensity: 'low',
      specialEffect: 'gentle-glow'
    }
  },
  'Rookie': {
    title: 'Rookie',
    minPoints: 0,
    icon: Trophy,
    colors: {
      primary: '#6b7280',
      secondary: '#4b5563',
      accent: '#9ca3af',
      glow: '#e5e7eb'
    },
    particleConfig: {
      count: 20,
      speed: 0.8,
      colors: ['#6b7280', '#4b5563', '#9ca3af', '#e5e7eb', '#f3f4f6'],
      shapes: ['circle'],
      size: { min: 0.5, max: 2 }
    },
    animationConfig: {
      duration: 1000,
      intensity: 'low',
      specialEffect: 'subtle-shine'
    }
  }
};

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: string;
  life: number;
  maxLife: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

interface UltraRankBadgeProps {
  rank: string;
  size?: 'small' | 'medium' | 'large' | 'xl';
  showPopup?: boolean;
  onPopupComplete?: () => void;
  className?: string;
}

export function UltraRankBadge({ 
  rank, 
  size = 'medium', 
  showPopup = false, 
  onPopupComplete,
  className = '' 
}: UltraRankBadgeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const config = RANK_CONFIGS[rank] || RANK_CONFIGS['Rookie'];
  const Icon = config.icon;

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const iconSizes = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Ultra-high quality particle system
  useEffect(() => {
    if (!showPopup || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newParticles: Particle[] = [];

    // Create particles with ultra-high quality
    for (let i = 0; i < config.particleConfig.count; i++) {
      const angle = (Math.PI * 2 * i) / config.particleConfig.count + Math.random() * 0.5;
      const distance = Math.random() * 50 + 20;
      const speed = config.particleConfig.speed;
      
      newParticles.push({
        id: i,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 2,
        size: Math.random() * (config.particleConfig.size.max - config.particleConfig.size.min) + config.particleConfig.size.min,
        color: config.particleConfig.colors[Math.floor(Math.random() * config.particleConfig.colors.length)],
        shape: config.particleConfig.shapes[Math.floor(Math.random() * config.particleConfig.shapes.length)],
        life: 0,
        maxLife: 120 + Math.random() * 60,
        opacity: 0.9,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      });
    }

    setParticles(newParticles);

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      setParticles(prevParticles => {
        const updatedParticles = prevParticles.map(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life++;
          particle.rotation += particle.rotationSpeed;
          
          // Apply physics and effects
          particle.vy += 0.02; // Gravity
          particle.vx *= 0.999; // Air resistance
          particle.vy *= 0.999;
          
          // Special effects based on rank
          if (config.animationConfig.specialEffect === 'legendary-aura') {
            particle.x += Math.sin(particle.life * 0.05) * 0.5;
            particle.size += Math.sin(particle.life * 0.1) * 0.01;
          } else if (config.animationConfig.specialEffect === 'royal-flames') {
            particle.vy -= 0.05; // Upward motion for flames
            particle.x += Math.sin(particle.life * 0.08) * 0.3;
          }
          
          particle.opacity = Math.max(0, 1 - (particle.life / particle.maxLife));
          
          return particle;
        }).filter(particle => particle.life < particle.maxLife);

        // Render particles with ultra-high quality
        updatedParticles.forEach(particle => {
          ctx.save();
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color;
          
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);
          
          // Draw different shapes
          ctx.beginPath();
          if (particle.shape === 'circle') {
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          } else if (particle.shape === 'star') {
            // Draw 5-pointed star
            for (let i = 0; i < 5; i++) {
              const angle = (i * Math.PI * 2) / 5;
              const x = Math.cos(angle) * particle.size;
              const y = Math.sin(angle) * particle.size;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
              
              const innerAngle = angle + Math.PI / 5;
              const innerX = Math.cos(innerAngle) * particle.size * 0.4;
              const innerY = Math.sin(innerAngle) * particle.size * 0.4;
              ctx.lineTo(innerX, innerY);
            }
            ctx.closePath();
          } else if (particle.shape === 'diamond') {
            ctx.moveTo(0, -particle.size);
            ctx.lineTo(particle.size, 0);
            ctx.lineTo(0, particle.size);
            ctx.lineTo(-particle.size, 0);
            ctx.closePath();
          } else if (particle.shape === 'triangle') {
            ctx.moveTo(0, -particle.size);
            ctx.lineTo(particle.size * 0.866, particle.size * 0.5);
            ctx.lineTo(-particle.size * 0.866, particle.size * 0.5);
            ctx.closePath();
          }
          
          ctx.fill();
          ctx.restore();
        });

        return updatedParticles;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Auto-complete popup
    const timeout = setTimeout(() => {
      if (onPopupComplete) onPopupComplete();
    }, config.animationConfig.duration);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(timeout);
    };
  }, [showPopup, config, onPopupComplete]);

  return (
    <div className={`relative ${className}`}>
      {/* Ultra-enhanced badge */}
      <motion.div
        className={`${sizeClasses[size]} relative rounded-2xl overflow-hidden`}
        style={{
          background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 50%, ${config.colors.accent} 100%)`,
          boxShadow: `0 0 30px ${config.colors.glow}, 0 0 60px ${config.colors.primary}40, inset 0 0 20px ${config.colors.accent}30`,
          border: `2px solid ${config.colors.glow}`
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: showPopup ? [1, 1.2, 1.1] : 1, 
          opacity: 1,
          rotateY: showPopup ? [0, 10, -5, 0] : 0
        }}
        transition={{ 
          duration: showPopup ? 1.5 : 0.5,
          type: "spring",
          stiffness: 200
        }}
        whileHover={{ scale: 1.05 }}
      >
        {/* Ultra glow background */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, ${config.colors.glow}20 0%, transparent 70%)`,
            animation: showPopup ? 'pulse 2s infinite' : 'none'
          }}
        />
        
        {/* Badge content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <Icon 
            className={`${iconSizes[size]} text-white drop-shadow-lg`}
            style={{ filter: `drop-shadow(0 0 10px ${config.colors.glow})` }}
          />
        </div>
        
        {/* Ultra shimmer effect */}
        <div 
          className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"
          style={{
            animation: showPopup ? 'shimmer 2s infinite' : 'none',
            animationDelay: '0.5s'
          }}
        />
      </motion.div>

      {/* Ultra-high quality particle canvas */}
      <AnimatePresence>
        {showPopup && (
          <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ width: '400px', height: '400px', left: '-100px', top: '-100px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Rank title */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: showPopup ? 1 : 0, y: showPopup ? 0 : 10 }}
        transition={{ delay: 0.5 }}
      >
        <div 
          className="text-sm font-bold px-3 py-1 rounded-lg backdrop-blur-md border"
          style={{
            color: config.colors.primary,
            backgroundColor: `${config.colors.primary}20`,
            borderColor: `${config.colors.primary}40`,
            textShadow: `0 0 10px ${config.colors.glow}`
          }}
        >
          {config.title}
        </div>
      </motion.div>
    </div>
  );
}

// Add shimmer keyframes to global CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { transform: translateX(-100%) skewX(-12deg); opacity: 0; }
    50% { opacity: 0.6; }
    100% { transform: translateX(100%) skewX(-12deg); opacity: 0; }
  }
`;
document.head.appendChild(style);
