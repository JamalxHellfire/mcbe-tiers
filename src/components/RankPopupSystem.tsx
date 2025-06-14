
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RankBadge, RankInfo } from './RankBadge';

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
    }> = [];

    const createParticle = (x: number, y: number) => {
      const isHighRank = rank.minPoints >= 250;
      const particleCount = isHighRank ? 3 : 1;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 0,
          maxLife: isHighRank ? 120 : 80,
          size: Math.random() * (isHighRank ? 4 : 2) + 1,
          opacity: 1,
          color: rank.particleColor
        });
      }
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create particles from center
      if (Math.random() < (rank.minPoints >= 400 ? 0.3 : rank.minPoints >= 250 ? 0.2 : 0.1)) {
        createParticle(canvas.width / 2, canvas.height / 2);
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
        ctx.fillStyle = p.color;
        
        if (rank.minPoints >= 400) {
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
        } else if (rank.minPoints >= 250) {
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
    if (rank.minPoints >= 400) {
      // Combat Grandmaster - Dramatic explosion
      return {
        initial: { scale: 0, rotate: -180, opacity: 0 },
        animate: { 
          scale: [0, 1.2, 1], 
          rotate: [0, 10, 0], 
          opacity: 1,
          transition: { 
            duration: 1.2, 
            times: [0, 0.6, 1],
            type: "spring",
            stiffness: 200
          }
        },
        exit: { scale: 0, opacity: 0, rotate: 180 }
      };
    } else if (rank.minPoints >= 250) {
      // Combat Master - Fiery entrance
      return {
        initial: { scale: 0, y: -100, opacity: 0 },
        animate: { 
          scale: [0, 1.1, 1], 
          y: [0, -10, 0], 
          opacity: 1,
          transition: { duration: 0.8, type: "spring" }
        },
        exit: { scale: 0, y: 100, opacity: 0 }
      };
    } else if (rank.minPoints >= 100) {
      // Combat Ace - Flying entrance
      return {
        initial: { scale: 0, x: -200, opacity: 0 },
        animate: { 
          scale: 1, 
          x: 0, 
          opacity: 1,
          transition: { duration: 0.6, type: "spring" }
        },
        exit: { scale: 0, x: 200, opacity: 0 }
      };
    } else {
      // Lower ranks - Simple entrance
      return {
        initial: { scale: 0.8, opacity: 0 },
        animate: { 
          scale: 1, 
          opacity: 1,
          transition: { duration: 0.4, type: "spring" }
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
            className="relative bg-slate-900/90 rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20 overflow-hidden"
            {...getPopupVariants()}
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: `0 25px 50px -12px ${rank.shadowColor}, 0 0 30px ${rank.glowColor}`
            }}
          >
            {/* Particle System */}
            <ParticleSystem rank={rank} isActive={isOpen} />
            
            {/* Background gradient */}
            <div 
              className="absolute inset-0 opacity-20 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${rank.gradient.replace('from-', '').replace('via-', '').replace('to-', '')})`
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
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 transition-colors"
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
